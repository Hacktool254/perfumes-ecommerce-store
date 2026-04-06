import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { requireAdmin, requireUser } from "./users";
import { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Core Checkout Mutation.
 * Atomically creates an order, order items, deducts stock, and clears the cart.
 */
export const placeOrder = mutation({
    args: {
        customerEmail: v.string(),
        customerName: v.string(),
        customerPhone: v.optional(v.string()),
        shippingAddress: v.string(),
        couponCode: v.optional(v.string()),
        guestItems: v.optional(v.array(v.object({
            productId: v.id("products"),
            quantity: v.number(),
        }))),
    },
    handler: async (ctx, args) => {
        const authUserId = await getAuthUserId(ctx);
        let userId: Id<"users"> | undefined;
        let cartItemsData: { productId: Id<"products">, quantity: number, _id?: Id<"cartItems"> }[] = [];

        if (authUserId) {
            // Logged in user: Get their record and cart
            const authUser = await ctx.db.get(authUserId) as any;
            if (authUser && authUser.email) {
                const user = await ctx.db
                    .query("users")
                    .withIndex("email", (q) => q.eq("email", authUser.email as string))
                    .unique();

                if (user) {
                    userId = user._id;
                    const dbCartItems = await ctx.db
                        .query("cartItems")
                        .withIndex("by_user", (q) => q.eq("userId", user._id))
                        .collect();
                    cartItemsData = dbCartItems;
                }
            }
        } else {
            // Guest user: Use items from arguments
            if (!args.guestItems || args.guestItems.length === 0) {
                throw new Error("Guest cart is empty");
            }
            cartItemsData = args.guestItems;
        }

        if (cartItemsData.length === 0) {
            throw new Error("Cart is empty");
        }

        // 2. Fetch all products to check stock and get prices
        const productsToOrder = [];
        let subtotal = 0;

        for (const item of cartItemsData) {
            const product = await ctx.db.get(item.productId);
            if (!product || !product.isActive) {
                throw new Error(`Product ${product?.name || "Unknown"} is no longer available`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}. Requested: ${item.quantity}, Available: ${product.stock}`);
            }

            productsToOrder.push({
                product,
                quantity: item.quantity,
            });

            // Apply product discount if it exists
            const effectivePrice = product.discount
                ? product.price * (1 - product.discount / 100)
                : product.price;

            subtotal += effectivePrice * item.quantity;
        }

        // 3. Handle Coupon (if any)
        let discountAmount = 0;
        let finalCouponId: Id<"coupons"> | undefined;

        if (args.couponCode) {
            const coupon = await ctx.db
                .query("coupons")
                .withIndex("by_code", (q) => q.eq("code", args.couponCode!.toUpperCase()))
                .unique();

            if (coupon && coupon.isActive) {
                const isExpired = coupon.expiresAt && coupon.expiresAt < Date.now();
                const limitReached = coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit;
                const minMet = !coupon.minOrderAmount || subtotal >= coupon.minOrderAmount;

                if (!isExpired && !limitReached && minMet) {
                    if (coupon.discountType === "percentage") {
                        discountAmount = subtotal * (coupon.discountValue / 100);
                    } else {
                        discountAmount = Math.min(coupon.discountValue, subtotal);
                    }
                    finalCouponId = coupon._id;

                    await ctx.db.patch(coupon._id, {
                        usedCount: coupon.usedCount + 1,
                    });
                }
            }
        }

        const totalAmount = subtotal - discountAmount;

        // 4. Create Order record
        const orderId = await ctx.db.insert("orders", {
            userId,
            customerEmail: args.customerEmail,
            customerName: args.customerName,
            customerPhone: args.customerPhone,
            status: "pending",
            totalAmount: Math.max(0, totalAmount),
            shippingAddress: args.shippingAddress,
            couponId: finalCouponId,
            discountApplied: discountAmount,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // 5. Create Order Items & Deduct Stock
        for (const item of productsToOrder) {
            await ctx.db.insert("orderItems", {
                orderId,
                productId: item.product._id,
                quantity: item.quantity,
                unitPrice: item.product.price,
            });

            await ctx.db.patch(item.product._id, {
                stock: item.product.stock - item.quantity,
                updatedAt: Date.now(),
            });
        }

        // 6. Clear Cart (if logged in)
        if (userId) {
            for (const item of cartItemsData) {
                if (item._id) {
                    await ctx.db.delete(item._id as Id<"cartItems">);
                }
            }
        }

        return orderId;
    },
});

/**
 * Get a specific order with its items.
 */
export const get = query({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);
        const order = await ctx.db.get(args.orderId);

        if (!order || order.userId !== user._id) {
            return null;
        }

        const items = await ctx.db
            .query("orderItems")
            .withIndex("by_order", (q) => q.eq("orderId", order._id))
            .collect();

        const itemsWithProducts = await Promise.all(
            items.map(async (item) => {
                const product = await ctx.db.get(item.productId);
                return { ...item, product };
            })
        );

        return { ...order, items: itemsWithProducts };
    },
});

/**
 * List orders for the current user.
 */
export const list = query({
    args: {},
    handler: async (ctx) => {
        const user = await requireUser(ctx);
        return await ctx.db
            .query("orders")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();
    },
});

/**
 * Admin: List all orders with pagination and status filtering.
 */
export const adminList = query({
    args: {
        status: v.optional(v.union(v.literal("pending"), v.literal("paid"), v.literal("shipped"), v.literal("delivered"), v.literal("cancelled")))
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        if (args.status) {
            return await ctx.db
                .query("orders")
                .withIndex("by_status", (q) => q.eq("status", args.status!))
                .order("desc")
                .collect();
        }

        return await ctx.db.query("orders").order("desc").collect();
    },
});

/**
 * Admin: Update order status.
 */
export const updateStatus = mutation({
    args: {
        id: v.id("orders"),
        status: v.union(v.literal("pending"), v.literal("paid"), v.literal("shipped"), v.literal("delivered"), v.literal("cancelled"))
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.patch(args.id, {
            status: args.status,
            updatedAt: Date.now(),
        });

        // Phase 8: Send Shipping Notification Email
        if (args.status === "shipped") {
            await ctx.scheduler.runAfter(0, internal.emails.sendShippingNotification, {
                orderId: args.id,
            });
        }
    },
});

/**
 * Admin: Get dashboard statistics.
 */
export const getStats = query({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);

        const allOrders = await ctx.db.query("orders").collect();
        const allProducts = await ctx.db.query("products").filter(q => q.eq(q.field("isActive"), true)).collect();

        // 1. Revenue & Sales calculation
        let totalRevenue = 0;
        let salesCount = 0;
        const now = Date.now();
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

        let monthlyRevenue = 0;
        let monthlySales = 0;

        for (const order of allOrders) {
            if (order.status !== "cancelled" && order.status !== "pending") {
                totalRevenue += order.totalAmount;
                salesCount++;

                if (order.createdAt > thirtyDaysAgo) {
                    monthlyRevenue += order.totalAmount;
                    monthlySales++;
                }
            }
        }

        // 2. Conversion Rate (Placeholder until we have a real visitors table)
        // For now, we'll return a mock or semi-calculated value if we have user count
        const userCount = (await ctx.db.query("users").collect()).length;
        const conversionRate = userCount > 0 ? (salesCount / userCount) * 100 : 0;

        // 3. Low Stock Alerts
        const lowStockItems = allProducts.filter(p => p.stock <= 10);

        // 4. Top Products (By quantity sold)
        // This is expensive to calculate on every query, but fine for small/medium shop
        const orderItems = await ctx.db.query("orderItems").collect();
        const productSales: Record<string, number> = {};

        for (const item of orderItems) {
            productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
        }

        const topProducts = Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([id]) => {
                return allProducts.find(p => p._id === id);
            })
            .filter(Boolean);

        return {
            totalRevenue,
            totalSales: salesCount,
            monthlyRevenue,
            monthlySales,
            conversionRate: parseFloat(conversionRate.toFixed(2)),
            lowStockCount: lowStockItems.length,
            topProducts: topProducts.slice(0, 5),
            recentOrders: allOrders.slice(0, 5),
        };
    },
});

/**
 * Publicly track an order using its ID and the customer's email.
 */
export const publicTrack = query({
    args: {
        orderId: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const normalizedId = ctx.db.normalizeId("orders", args.orderId);
            if (!normalizedId) return null;

            const order = await ctx.db.get(normalizedId);

            if (!order || order.customerEmail.toLowerCase() !== args.email.toLowerCase()) {
                return null;
            }

            const items = await ctx.db
                .query("orderItems")
                .withIndex("by_order", (q) => q.eq("orderId", order._id))
                .collect();

            const itemsWithProducts = await Promise.all(
                items.map(async (item) => {
                    const product = await ctx.db.get(item.productId);
                    return { ...item, product };
                })
            );

            return { ...order, items: itemsWithProducts };
        } catch (e) {
            return null;
        }
    },
});
