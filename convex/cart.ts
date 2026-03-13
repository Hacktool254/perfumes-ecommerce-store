import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./users";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Get the current user's cart items.
 */
export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            return null;
        }

        const cartItems = await ctx.db
            .query("cartItems")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        // Join with product data
        const itemsWithProducts = await Promise.all(
            cartItems.map(async (item) => {
                const product = await ctx.db.get(item.productId);
                return { ...item, product };
            })
        );

        return itemsWithProducts;
    },
});

/**
 * Add an item to the cart or increment quantity if it exists.
 */
export const add = mutation({
    args: {
        productId: v.id("products"),
        quantity: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("You must be logged in to modify cart items on the server");
        }

        const existing = await ctx.db
            .query("cartItems")
            .withIndex("by_user_product", (q) =>
                q.eq("userId", userId).eq("productId", args.productId)
            )
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                quantity: existing.quantity + args.quantity,
                updatedAt: Date.now(),
            });
        } else {
            await ctx.db.insert("cartItems", {
                userId: userId,
                productId: args.productId,
                quantity: args.quantity,
                updatedAt: Date.now(),
            });
        }
    },
});

/**
 * Update the quantity of a cart item.
 */
export const updateQuantity = mutation({
    args: {
        cartItemId: v.id("cartItems"),
        quantity: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const item = await ctx.db.get(args.cartItemId);

        if (!item || item.userId !== userId) {
            throw new Error("Unauthorized");
        }

        if (args.quantity <= 0) {
            await ctx.db.delete(args.cartItemId);
        } else {
            await ctx.db.patch(args.cartItemId, {
                quantity: args.quantity,
                updatedAt: Date.now(),
            });
        }
    },
});

/**
 * Remove an item from the cart.
 */
export const remove = mutation({
    args: { cartItemId: v.id("cartItems") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const item = await ctx.db.get(args.cartItemId);

        if (!item || item.userId !== userId) {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(args.cartItemId);
    },
});

/**
 * Clear all items from the user's cart.
 */
export const clear = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const items = await ctx.db
            .query("cartItems")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        for (const item of items) {
            await ctx.db.delete(item._id);
        }
    },
});
