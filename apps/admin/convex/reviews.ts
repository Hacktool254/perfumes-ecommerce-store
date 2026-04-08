import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./users";

/**
 * Get all reviews for a specific product. Public query.
 */
export const getByProduct = query({
    args: { productId: v.id("products") },
    handler: async (ctx, args) => {
        const reviews = await ctx.db
            .query("reviews")
            .withIndex("by_product", (q) => q.eq("productId", args.productId))
            .collect();

        // Join with user data (to show reviewer profile if needed)
        const reviewsWithUsers = await Promise.all(
            reviews.map(async (review) => {
                const user = await ctx.db.get(review.userId);
                return {
                    ...review,
                    user: user
                        ? {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                        }
                        : null,
                };
            })
        );

        return reviewsWithUsers;
    },
});

/**
 * Create or update a review for a product.
 * Each user can leave only one review per product.
 */
export const add = mutation({
    args: {
        productId: v.id("products"),
        rating: v.number(), // 1–5
        comment: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);

        if (args.rating < 1 || args.rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        const existing = await ctx.db
            .query("reviews")
            .withIndex("by_user_product", (q) =>
                q.eq("userId", user._id).eq("productId", args.productId)
            )
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                rating: args.rating,
                comment: args.comment,
                updatedAt: Date.now(),
            });
            return { status: "updated" };
        } else {
            await ctx.db.insert("reviews", {
                userId: user._id,
                productId: args.productId,
                rating: args.rating,
                comment: args.comment,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            return { status: "added" };
        }
    },
});

/**
 * Remove a review.
 */
export const remove = mutation({
    args: { reviewId: v.id("reviews") },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);
        const review = await ctx.db.get(args.reviewId);

        if (!review || review.userId !== user._id) {
            throw new Error("Unauthorized");
        }

        await ctx.db.delete(args.reviewId);
    },
});
