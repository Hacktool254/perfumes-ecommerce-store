import { v } from "convex/values";
import { mutation } from "./_generated/server";

import seedData from "./seed_products.json";

export const seedFromJSON = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Get all existing categories to map them
        const allCategories = await ctx.db.query("categories").collect();
        const categoryMap = new Map(allCategories.map(c => [c.name.toLowerCase(), c._id]));

        // 2. Loop through products and insert them
        let insertedCount = 0;
        let skippedCount = 0;

        for (const p of (seedData.products as any)) {
            // Find category ID
            let categoryId = categoryMap.get(p.category.toLowerCase());

            // If category doesn't exist, create it
            if (!categoryId) {
                categoryId = await ctx.db.insert("categories", {
                    name: p.category,
                    slug: p.category.toLowerCase().replace(/\s+/g, "-"),
                });
                categoryMap.set(p.category.toLowerCase(), categoryId);
            }

            // Check if product already exists by name, brand, size, and gender
            const existing = await ctx.db
                .query("products")
                .filter((q) => q.and(
                    q.eq(q.field("name"), p.name),
                    q.eq(q.field("brand"), p.brand),
                    q.eq(q.field("size"), p.size),
                    q.eq(q.field("gender"), p.gender)
                ))
                .first();

            if (existing) {
                skippedCount++;
                continue;
            }

            // Generate a slug
            const slug = `${p.brand}-${p.name}-${(p as any).size || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "");

            const categoryImages: Record<string, string> = {
                "perfume": "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800",
                "body wash": "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800",
                "body oil": "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800",
            };

            const imageUrl = categoryImages[p.category.toLowerCase()] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800";
            const productImages = p.images && p.images.length > 0 ? p.images : [imageUrl];

            // Insert product
            await ctx.db.insert("products", {
                name: p.name,
                slug: slug,
                brand: p.brand,
                description: `Experience the luxury of ${p.brand}'s ${p.name}${(p as any).size ? ` (${(p as any).size})` : ""}. A curated choice for the discerning collector.`,
                price: Math.floor(Math.random() * (15000 - 3000 + 1)) + 3000,
                stock: Math.floor(Math.random() * 50) + 10,
                categoryId: categoryId,
                gender: (p.gender?.toLowerCase() || "unisex") as "men" | "women" | "unisex",
                images: productImages,
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            insertedCount++;
        }

        return { insertedCount, skippedCount };
    },
});
