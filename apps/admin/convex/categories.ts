import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./users";

// ─── Queries ─────────────────────────────────────────────────────────────

/**
 * List all categories. Accessible by everyone.
 */
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("categories").collect();
    },
});

/**
 * Get a single category by slug.
 */
export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("categories")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();
    },
});

// ─── Admin Mutations ─────────────────────────────────────────────────────

/**
 * Create a new category.
 */
export const create = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const existing = await ctx.db
            .query("categories")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();

        if (existing) {
            throw new Error("A category with this slug already exists.");
        }

        return await ctx.db.insert("categories", args);
    },
});

/**
 * Update an existing category.
 */
export const update = mutation({
    args: {
        id: v.id("categories"),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const { id, ...updates } = args;

        if (updates.slug) {
            const existing = await ctx.db
                .query("categories")
                .withIndex("by_slug", (q) => q.eq("slug", updates.slug as string))
                .unique();

            if (existing && existing._id !== id) {
                throw new Error("Another category with this slug already exists.");
            }
        }

        await ctx.db.patch(id, updates);
    },
});

/**
 * Delete a category. Fails if there are products linked to it.
 */
export const remove = mutation({
    args: { id: v.id("categories") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        // Ensure no products are currently using this category
        const linkedProducts = await ctx.db
            .query("products")
            .withIndex("by_category", (q) => q.eq("categoryId", args.id))
            .first();

        if (linkedProducts) {
            throw new Error("Cannot delete category: There are products linked to it.");
        }

        await ctx.db.delete(args.id);
    },
});
