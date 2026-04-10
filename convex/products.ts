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
        categoryIds: v.optional(v.array(v.id("categories"))),
        brands: v.optional(v.array(v.string())),
        gender: v.optional(v.union(v.literal("men"), v.literal("women"), v.literal("unisex"))),
        minPrice: v.optional(v.number()),
        maxPrice: v.optional(v.number()),
        inStock: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        console.log("==> products:list CALLED with args:", JSON.stringify(args));

        // 1. Fetch special category IDs to handle augmented logic
        const specialSlugs = ["men", "women", "unisex", "perfume"];
        const specialCategories = await Promise.all(
            specialSlugs.map(slug => 
                ctx.db.query("categories")
                    .withIndex("by_slug", q => q.eq("slug", slug))
                    .first()
            )
        );

        const catMap = specialSlugs.reduce((acc, slug, i) => {
            if (specialCategories[i]) acc[slug] = specialCategories[i]!._id;
            return acc;
        }, {} as Record<string, any>);

        let q;

        try {
            const isSpecial = args.categoryIds?.some(id => 
                id === catMap["men"] || id === catMap["women"] || id === catMap["unisex"] || id === catMap["perfume"]
            );

            // Use index for one primary filter if available, but NOT if it's a special category needing augmentation
            if (args.categoryIds && args.categoryIds.length === 1 && !isSpecial) {
                console.log("==> Using by_category index");
                q = ctx.db.query("products").withIndex("by_category", (q) => q.eq("categoryId", args.categoryIds![0]));
            } else if (args.brands && args.brands.length === 1) {
                console.log("==> Using by_brand index");
                q = ctx.db.query("products").withIndex("by_brand", (q) => q.eq("brand", args.brands![0]));
            } else if (args.gender) {
                console.log("==> Using by_gender index");
                q = ctx.db.query("products").withIndex("by_gender", (q) => q.eq("gender", args.gender!));
            } else {
                console.log("==> Using generic query");
                q = ctx.db.query("products");
            }
        } catch (err) {
            console.error("==> Error during index selection:", err);
            throw err;
        }

        // Apply soft delete filter - include both isActive: true AND isActive: undefined
        q = q.filter((q) =>
            q.or(
                q.eq(q.field("isActive"), true),
                q.eq(q.field("isActive"), undefined)
            )
        );

        // 2. Augmented Category Filtering Logic
        if (args.categoryIds && args.categoryIds.length > 0) {
            const hasMen = args.categoryIds.includes(catMap["men"]);
            const hasWomen = args.categoryIds.includes(catMap["women"]);
            const hasUnisex = args.categoryIds.includes(catMap["unisex"]);
            const perfumeId = catMap["perfume"];

            q = q.filter((q) => {
                // Base condition: Matches any of the selected categories
                let expr = q.eq(q.field("categoryId"), args.categoryIds![0]);
                for (let i = 1; i < args.categoryIds!.length; i++) {
                    expr = q.or(expr, q.eq(q.field("categoryId"), args.categoryIds![i]));
                }

                // Augmented condition for Men's Fragrances
                if (hasMen && perfumeId) {
                    expr = q.or(expr, 
                        q.and(
                            q.eq(q.field("categoryId"), perfumeId),
                            q.eq(q.field("gender"), "men")
                        )
                    );
                }

                // Augmented condition for Women's Fragrances
                if (hasWomen && perfumeId) {
                    expr = q.or(expr, 
                        q.and(
                            q.eq(q.field("categoryId"), perfumeId),
                            q.eq(q.field("gender"), "women")
                        )
                    );
                }

                // Augmented condition for Unisex Fragrances
                if (hasUnisex && perfumeId) {
                    expr = q.or(expr, 
                        q.and(
                            q.eq(q.field("categoryId"), perfumeId),
                            q.eq(q.field("gender"), "unisex")
                        )
                    );
                }

                // Augmented condition for "Perfume" Master Category
                const hasPerfume = args.categoryIds!.includes(perfumeId);
                const menId = catMap["men"];
                const womenId = catMap["women"];
                const unisexId = catMap["unisex"];

                if (hasPerfume) {
                    // Include all gender-specific categories if "Perfume" is selected
                    if (menId) expr = q.or(expr, q.eq(q.field("categoryId"), menId));
                    if (womenId) expr = q.or(expr, q.eq(q.field("categoryId"), womenId));
                    if (unisexId) expr = q.or(expr, q.eq(q.field("categoryId"), unisexId));
                }

                return expr;
            });
        }

        if (args.brands && args.brands.length > 1) {
            q = q.filter((q) => {
                let expr = q.eq(q.field("brand"), args.brands![0]);
                for (let i = 1; i < args.brands!.length; i++) {
                    expr = q.or(expr, q.eq(q.field("brand"), args.brands![i]));
                }
                return expr;
            });
        }


        // Price filters
        if (args.minPrice !== undefined) {
            q = q.filter((q) => q.gte(q.field("price"), args.minPrice!));
        }
        if (args.maxPrice !== undefined) {
            q = q.filter((q) => q.lte(q.field("price"), args.maxPrice!));
        }

        // Availability filter
        if (args.inStock !== undefined) {
            if (args.inStock) {
                q = q.filter((q) => q.gt(q.field("stock"), 0));
            } else {
                q = q.filter((q) => q.lte(q.field("stock"), 0));
            }
        }

        // Gender filter (includes unisex results)
        if (args.gender) {
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
 * List recent products (non-paginated, for mega menus and homepage strips).
 */
export const listRecent = query({
    args: {
        limit: v.optional(v.number()),
        sortBy: v.optional(v.string()), // "newest" | "oldest"
        categorySlug: v.optional(v.string()), // filter by category slug e.g. "perfume"
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 4;

        // If a category filter is provided, look up the category and filter
        if (args.categorySlug) {
            const category = await ctx.db
                .query("categories")
                .withIndex("by_slug", (q) => q.eq("slug", args.categorySlug!))
                .first();

            if (category) {
                // Fetch perfume category for augmented logic
                const perfume = await ctx.db
                    .query("categories")
                    .withIndex("by_slug", (q) => q.eq("slug", "perfume"))
                    .first();

                const categorySlug = args.categorySlug;
                const isSpecial = ["men", "women", "unisex"].includes(categorySlug);

                const q = isSpecial && perfume
                    ? ctx.db.query("products").filter((q) => {
                        const genderMap: Record<string, string> = { "men": "men", "women": "women", "unisex": "unisex" };
                        const targetGender = genderMap[categorySlug];
                        return q.or(
                            q.eq(q.field("categoryId"), category._id),
                            q.and(
                                q.eq(q.field("categoryId"), perfume._id),
                                q.eq(q.field("gender"), targetGender)
                            )
                        );
                    })
                    : ctx.db.query("products").withIndex("by_category_createdAt", (q) => q.eq("categoryId", category._id));

                return await q
                    .filter((q) =>
                        q.or(
                            q.eq(q.field("isActive"), true),
                            q.eq(q.field("isActive"), undefined)
                        )
                    )
                    .order("desc")
                    .take(limit);
            }
        }

        // Global list ordered by createdAt
        return await ctx.db
            .query("products")
            .withIndex("by_createdAt")
            .filter((q) =>
                q.or(
                    q.eq(q.field("isActive"), true),
                    q.eq(q.field("isActive"), undefined)
                )
            )
            .order("desc")
            .take(limit);
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
            .first(); // Changed from .unique() to avoid throwing on duplicates
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
 * Permanently delete a product (hard delete).
 */
export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.delete(args.id);
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

// --- Migration removed (permanently executed via dedicated script) ---
