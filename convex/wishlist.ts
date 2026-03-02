import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./users";

/**
 * Get the current user's wishlist items.
 */
export const get = query({
    args: {},
    handler: async (ctx) => {
        const user = await requireUser(ctx);
        const wishlistItems = await ctx.db
            .query("wishlistItems")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        // Join with product data
        const itemsWithProducts = await Promise.all(
            wishlistItems.map(async (item) => {
                const product = await ctx.db.get(item.productId);
                return { ...item, product };
            })
        );

        return itemsWithProducts;
    },
});

/**
 * Toggle a product in the wishlist (add if missing, remove if present).
 */
export const toggle = mutation({
    args: { productId: v.id("products") },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);

        const existing = await ctx.db
            .query("wishlistItems")
            .withIndex("by_user_product", (q) =>
                q.eq("userId", user._id).eq("productId", args.productId)
            )
            .unique();

        if (existing) {
            await ctx.db.delete(existing._id);
            return { status: "removed" };
        } else {
            await ctx.db.insert("wishlistItems", {
                userId: user._id,
                productId: args.productId,
                updatedAt: Date.now(),
            });
            return { status: "added" };
        }
    },
});

/**
 * Remove a specific product from the wishlist.
 */
export const remove = mutation({
    args: { productId: v.id("products") },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);

        const existing = await ctx.db
            .query("wishlistItems")
            .withIndex("by_user_product", (q) =>
                q.eq("userId", user._id).eq("productId", args.productId)
            )
            .unique();

        if (existing) {
            await ctx.db.delete(existing._id);
        }
    },
});
