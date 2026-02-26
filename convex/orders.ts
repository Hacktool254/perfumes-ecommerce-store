import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin, requireUser } from "./users";
import { Id } from "./_generated/dataModel";

/**
 * Core Checkout Mutation.
 * Atomically creates an order, order items, deducts stock, and clears the cart.
 */
export const placeOrder = mutation({
    args: {
        shippingAddress: v.string(),
        couponCode: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);

        // 1. Get cart items
        const cartItems = await ctx.db
            .query("cartItems")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        if (cartItems.length === 0) {
            throw new Error("Cart is empty");
        }

        // 2. Fetch all products to check stock and get prices
        const productsToOrder = [];
        let subtotal = 0;

        for (const item of cartItems) {
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
                // Validation (duplicate of coupons:validate for atomicity)
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

                    // Increment usage
                    await ctx.db.patch(coupon._id, {
                        usedCount: coupon.usedCount + 1,
                    });
                }
            }
        }

        const totalAmount = subtotal - discountAmount;

        // 4. Create Order record
        const orderId = await ctx.db.insert("orders", {
            userId: user._id,
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
                unitPrice: item.product.price, // original price for history
            });

            await ctx.db.patch(item.product._id, {
                stock: item.product.stock - item.quantity,
                updatedAt: Date.now(),
            });
        }

        // 6. Clear Cart
        for (const item of cartItems) {
            await ctx.db.delete(item._id);
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
    },
});
