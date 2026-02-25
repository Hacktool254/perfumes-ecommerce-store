import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./users";
import { paginationOptsValidator } from "convex/server";

// ─── Queries ─────────────────────────────────────────────────────────────

/**
 * List products with optional filters and pagination.
 */
export const list = query({
    args: {
        paginationOpts: paginationOptsValidator,
        categoryId: v.optional(v.id("categories")),
        brand: v.optional(v.string()),
        gender: v.optional(v.union(v.literal("men"), v.literal("women"), v.literal("unisex"))),
    },
    handler: async (ctx, args) => {
        // Determine the base query based on provided filters to satisfy TypeScript types
        let queryResult;

        if (args.categoryId) {
            queryResult = await ctx.db
                .query("products")
                .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId!))
                .filter((q) => q.neq(q.field("isActive"), false))
                .paginate(args.paginationOpts);
        } else if (args.brand) {
            queryResult = await ctx.db
                .query("products")
                .withIndex("by_brand", (q) => q.eq("brand", args.brand!))
                .filter((q) => q.neq(q.field("isActive"), false))
                .paginate(args.paginationOpts);
        } else if (args.gender) {
            queryResult = await ctx.db
                .query("products")
                .withIndex("by_gender", (q) => q.eq("gender", args.gender!))
                .filter((q) => q.neq(q.field("isActive"), false))
                .paginate(args.paginationOpts);
        } else {
            queryResult = await ctx.db
                .query("products")
                .filter((q) => q.neq(q.field("isActive"), false))
                .paginate(args.paginationOpts);
        }

        return queryResult;
    },
});

/**
 * Get a single product by slug.
 */
export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("products")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();
    },
});

/**
 * Search products by name (for autocomplete and shop search).
 * Supports optional filters.
 */
export const search = query({
    args: {
        query: v.string(),
        categoryId: v.optional(v.id("categories")),
        brand: v.optional(v.string()),
        gender: v.optional(v.union(v.literal("men"), v.literal("women"), v.literal("unisex"))),
    },
    handler: async (ctx, args) => {
        let q = ctx.db
            .query("products")
            .withSearchIndex("search_by_name", (q) => {
                let search = q.search("name", args.query).eq("isActive", true);

                if (args.categoryId) {
                    search = search.eq("categoryId", args.categoryId);
                }
                if (args.brand) {
                    search = search.eq("brand", args.brand);
                }
                if (args.gender) {
                    search = search.eq("gender", args.gender);
                }

                return search;
            });

        // Return the top 10 matches for autocomplete
        return await q.take(10);
    },
});

// ─── Admin Mutations ─────────────────────────────────────────────────────

export const create = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        description: v.string(),
        price: v.number(),
        discount: v.optional(v.number()),
        stock: v.number(),
        categoryId: v.id("categories"),
        images: v.array(v.string()),
        brand: v.optional(v.string()),
        gender: v.optional(v.union(v.literal("men"), v.literal("women"), v.literal("unisex"))),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        // Check slug uniqueness
        const existing = await ctx.db
            .query("products")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();

        if (existing) throw new Error("Product with this slug already exists.");

        return await ctx.db.insert("products", {
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isActive: args.isActive ?? true,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("products"),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        discount: v.optional(v.number()),
        stock: v.optional(v.number()),
        categoryId: v.optional(v.id("categories")),
        images: v.optional(v.array(v.string())),
        brand: v.optional(v.string()),
        gender: v.optional(v.union(v.literal("men"), v.literal("women"), v.literal("unisex"))),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const { id, ...updates } = args;

        if (updates.slug) {
            const existing = await ctx.db
                .query("products")
                .withIndex("by_slug", (q) => q.eq("slug", updates.slug as string))
                .unique();
            if (existing && existing._id !== id) {
                throw new Error("Another product with this slug already exists.");
            }
        }

        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        });
    },
});

/**
 * Soft delete a product (mark inactive).
 */
export const softDelete = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.patch(args.id, {
            isActive: false,
            updatedAt: Date.now(),
        });
    },
});
