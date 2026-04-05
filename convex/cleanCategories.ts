import { mutation } from "./_generated/server";

export const run = mutation({
    handler: async (ctx) => {
        // 1. Delete unwanted categories and their products
        const unwantedNames = ["Body Lotion", "Body Cream", "Body Mist"];
        const categories = await ctx.db.query("categories").collect();
        
        let deletedProducts = 0;
        let deletedCategories = 0;

        for (const cat of categories) {
            if (unwantedNames.includes(cat.name)) {
                // Delete all products in this category
                const products = await ctx.db
                    .query("products")
                    .withIndex("by_category", (q) => q.eq("categoryId", cat._id))
                    .collect();
                
                for (const p of products) {
                    await ctx.db.delete(p._id);
                    deletedProducts++;
                }
                
                // Delete the category itself
                await ctx.db.delete(cat._id);
                deletedCategories++;
            }
        }

        // 2. Identify products that STILL need authentic photos
        // We consider an image "missing" if it has an Unsplash placeholder or contains our generic fallback bottle array
        const allRemainingProducts = await ctx.db.query("products").collect();
        const missingPhotoProducts = allRemainingProducts.filter(p => {
            if (!p.images || p.images.length === 0) return true;
            const img = p.images[0];
            return img.includes("unsplash.com") || 
                   img.includes("Khamrah_1.jpg") || // The generic placeholders we used for unmapped
                   img.includes("1_d2b0cb3e-10de-441c-8ff5-ab3dd6209fb6.png") ||
                   img.includes("IMG-1145.png");
        }).map(p => `${p.brand} - ${p.name}`); // Extract names

        return {
            deletedProducts,
            deletedCategories,
            missing: missingPhotoProducts
        };
    }
});
