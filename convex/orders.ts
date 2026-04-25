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

        if (!order) return null;

        // Allow access if it's the user's order OR if the user is an admin
        if (order.userId !== user._id && user.role !== "admin") {
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
        const authUserId = await getAuthUserId(ctx);
        if (!authUserId) return null;
        const authUser = await ctx.db.get(authUserId);
        if (!authUser) return null;

        const adminProfile = await ctx.db.query("adminProfiles").withIndex("by_user", q => q.eq("userId", authUserId)).first();
        if (!adminProfile) return null;

        const allOrders = await ctx.db.query("orders").collect();
        const allProducts = await ctx.db.query("products").collect();
        const allUsers = await ctx.db.query("users").collect();
        const allCategories = await ctx.db.query("categories").collect();
        const orderItems = await ctx.db.query("orderItems").collect();

        const now = Date.now();
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = now - (60 * 24 * 60 * 60 * 1000);

        // 1. Core Metrics & Deltas (Current vs Previous 30 days)
        let p0Revenue = 0, p0Sales = 0;
        let p1Revenue = 0, p1Sales = 0;

        for (const order of allOrders) {
            if (order.status !== "cancelled") {
                if (order.createdAt > thirtyDaysAgo) {
                    p0Revenue += order.totalAmount;
                    p0Sales++;
                } else if (order.createdAt > sixtyDaysAgo) {
                    p1Revenue += order.totalAmount;
                    p1Sales++;
                }
            }
        }

        const p0AOV = p0Sales > 0 ? p0Revenue / p0Sales : 0;
        const p1AOV = p1Sales > 0 ? p1Revenue / p1Sales : 0;

        const p0Conversion = allUsers.length > 0 ? (p0Sales / allUsers.length) * 100 : 0;
        const p1Conversion = allUsers.length > 0 ? (p1Sales / allUsers.length) * 100 : 0;

        const calculateDelta = (curr: number, prev: number) => {
            if (prev === 0) return curr > 0 ? 100 : 0;
            return parseFloat(((curr - prev) / prev * 100).toFixed(1));
        };

        // 2. Longitudinal Data (Last 6 Months)
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthName = date.toLocaleString('default', { month: 'short' });
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).getTime();

            let mRevenue = 0;
            let mOrders = 0;

            for (const order of allOrders) {
                if (order.status !== "cancelled" && order.createdAt >= monthStart && order.createdAt <= monthEnd) {
                    mRevenue += order.totalAmount;
                    mOrders++;
                }
            }
            months.push({ name: monthName, value: mRevenue, orders: mOrders });
        }

        // 3. Category Intelligence
        const categoryStats: Record<string, number> = {};
        let totalVal = 0;
        for (const item of orderItems) {
            const product = allProducts.find(p => p._id === item.productId);
            if (product && product.categoryId) {
                const category = allCategories.find(c => c._id === product.categoryId);
                const categoryName = category?.name || "Uncategorized";
                const val = item.unitPrice * item.quantity;
                categoryStats[categoryName] = (categoryStats[categoryName] || 0) + val;
                totalVal += val;
            }
        }
        const revenueByCategory = Object.entries(categoryStats).map(([name, value]) => ({
            name,
            value,
            percentage: totalVal > 0 ? Math.round((value / totalVal) * 100) : 0
        })).sort((a, b) => b.value - a.value);

        // 4. Status Snapshot
        const statusBreakdown = {
            delivered: allOrders.filter(o => o.status === "delivered").length,
            shipped: allOrders.filter(o => o.status === "shipped").length,
            processing: allOrders.filter(o => o.status === "paid" || o.status === "pending").length,
            pending: allOrders.filter(o => o.status === "pending").length,
            cancelled: allOrders.filter(o => o.status === "cancelled").length,
        };

        // 5. Top Products Enhanced
        const productRevenue: Record<string, number> = {};
        for (const item of orderItems) {
            productRevenue[item.productId] = (productRevenue[item.productId] || 0) + (item.unitPrice * item.quantity);
        }

        const topProducts = Object.entries(productRevenue)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([id, revenue]) => {
                const product = allProducts.find(p => p._id === id);
                return product ? {
                    ...product,
                    revenue,
                    share: totalVal > 0 ? Math.round((revenue / totalVal) * 100) : 0
                } : null;
            })
            .filter(Boolean);

        return {
            totalRevenue: allOrders.reduce((acc, o) => o.status !== "cancelled" ? acc + o.totalAmount : acc, 0),
            totalSales: allOrders.filter(o => o.status !== "cancelled").length,
            p0Revenue,
            p0Sales,
            p0AOV,
            p0Conversion,
            revenueDelta: calculateDelta(p0Revenue, p1Revenue),
            salesDelta: calculateDelta(p0Sales, p1Sales),
            aovDelta: calculateDelta(p0AOV, p1AOV),
            conversionDelta: calculateDelta(p0Conversion, p1Conversion),
            months,
            revenueByCategory,
            statusBreakdown,
            topProducts,
            lowStockCount: allProducts.filter(p => p.stock <= 10).length,
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
