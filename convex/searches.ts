import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./users";

/**
 * Log a user's search query.
 * We only keep the most recent queries to avoid bloating.
 */
export const log = mutation({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);
        const queryTerm = args.query.trim().toLowerCase();

        if (queryTerm.length < 2) return;

        // Check if this query already exists for the user to update timestamp instead of duplicating
        const existing = await ctx.db
            .query("userSearches")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .filter((q) => q.eq(q.field("query"), queryTerm))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { createdAt: Date.now() });
        } else {
            await ctx.db.insert("userSearches", {
                userId: user._id,
                query: queryTerm,
                createdAt: Date.now(),
            });

            // Limit to 10 searches per user
            const searches = await ctx.db
                .query("userSearches")
                .withIndex("by_user", (q) => q.eq("userId", user._id))
                .order("desc")
                .collect();

            if (searches.length > 10) {
                const toDelete = searches.slice(10);
                for (const s of toDelete) {
                    await ctx.db.delete(s._id);
                }
            }
        }
    },
});

/**
 * List recent searches for the authenticated user.
 */
export const list = query({
    args: {},
    handler: async (ctx) => {
        const user = await requireUser(ctx);
        if (!user) return [];

        return await ctx.db
            .query("userSearches")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .take(5);
    },
});
