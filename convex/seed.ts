import { mutation } from "./_generated/server";
import { v } from "convex/values";
import productsData from "./seed_products.json";

/**
 * Seeding script to populate categories and products.
 * This is an admin-only mutation.
 */
export const run = mutation({
    args: {},
    handler: async (ctx) => {
        console.log("Starting seed...");

        // 1. Get or Create Categories
        const categoryMap = new Map<string, any>();
        const uniqueCategories = [
            ...new Set(productsData.products.map((p) => p.category)),
        ];

        for (const catName of uniqueCategories) {
            let category = await ctx.db
                .query("categories")
                .withIndex("by_slug", (q) => q.eq("slug", slugify(catName)))
                .unique();

            if (!category) {
                const id = await ctx.db.insert("categories", {
                    name: catName,
                    slug: slugify(catName),
                });
                category = await ctx.db.get(id);
            }
            categoryMap.set(catName, category?._id);
        }

        console.log(`Ensured ${categoryMap.size} categories.`);

        // 2. Insert Products
        let insertedCount = 0;
        for (const p of productsData.products) {
            const categoryId = categoryMap.get(p.category);
            if (!categoryId) continue;

            const slug = slugify(`${p.brand} ${p.name} ${"size" in p ? p.size : ""}`);

            // Check if product exists
            const existing = await ctx.db
                .query("products")
                .withIndex("by_slug", (q) => q.eq("slug", slug))
                .unique();

            if (!existing) {
                await ctx.db.insert("products", {
                    name: p.name,
                    slug: slug,
                    brand: p.brand,
                    categoryId: categoryId,
                    description: `${p.brand} ${p.name} in category ${p.category}.`,
                    price: 0, // Placeholder price, to be updated
                    stock: 0, // Placeholder stock
                    images: [], // Placeholder for images
                    gender: "gender" in p ? (p.gender as "men" | "women" | "unisex") : undefined,
                    isActive: true,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                });
                insertedCount++;
            }
        }

        console.log(`Inserted ${insertedCount} new products.`);
        return { categories: categoryMap.size, products: insertedCount };
    },
});

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-") // Replace multiple - with single -
        .replace(/^-+/, "") // Trim - from start of text
        .replace(/-+$/, ""); // Trim - from end of text
}
