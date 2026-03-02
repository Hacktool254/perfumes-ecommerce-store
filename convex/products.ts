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
        let q;

        // Use index for one primary filter if available
        if (args.categoryId) {
            q = ctx.db.query("products").withIndex("by_category", (q) => q.eq("categoryId", args.categoryId!));
        } else if (args.brand) {
            q = ctx.db.query("products").withIndex("by_brand", (q) => q.eq("brand", args.brand!));
        } else if (args.gender) {
            q = ctx.db.query("products").withIndex("by_gender", (q) => q.eq("gender", args.gender!));
        } else {
            q = ctx.db.query("products");
        }

        // Apply soft delete filter
        q = q.filter((q) => q.neq(q.field("isActive"), false));

        // Apply manual filters for the rest
        if (args.categoryId && args.brand) {
            q = q.filter((q) => q.eq(q.field("brand"), args.brand!));
        }

        if (args.gender) {
            // Re-apply gender filter if we didn't use the index, or to include unisex
            // Note: If we used by_gender index, it only returned EXACT matches. 
            // To include unisex, we should ideally not use the index OR use multiple queries.
            // For now, if gender index was used and it's NOT unisex, we can't easily add unisex back to that specific query result without another fetch.
            // Simplifying: If gender filter is applied, we'll scan (or filter result) to include unisex.
            q = q.filter((q) =>
                q.or(
                    q.eq(q.field("gender"), args.gender!),
                    q.eq(q.field("gender"), "unisex")
                )
            );
        }

        return await q.paginate(args.paginationOpts);
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
 * Get a single product by ID.
 */
export const getById = query({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
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

/**
 * Admin: Update product stock directly.
 */
export const updateStock = mutation({
    args: {
        id: v.id("products"),
        increment: v.number(), // positive to add, negative to subtract
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const product = await ctx.db.get(args.id);
        if (!product) throw new Error("Product not found");

        const newStock = Math.max(0, product.stock + args.increment);
        await ctx.db.patch(args.id, {
            stock: newStock,
            updatedAt: Date.now(),
        });

        return { success: true, newStock };
    },
});
