import { mutation } from "./_generated/server";

export const run = mutation({
    handler: async (ctx) => {
        // Fetch categories to get Body Oil ID
        const categories = await ctx.db.query("categories").collect();
        const oilCat = categories.find(c => c.name === "Body Oil");
        const oilCatId = oilCat ? oilCat._id : undefined;

        if (!oilCatId) return "Body Oil category not found";

        const products = [
            {
                name: "Body Oil", 
                brand: "Ballet",
                description: "Ballet Body Oil in category Body Oil.",
                price: 4500,
                stock: 40,
                categoryId: oilCatId,
                isActive: true,
                images: ["/products/Ballet---Body-Oil.jpg"]
            },
            {
                name: "Cocoa Radiant Body Oil",
                brand: "Vaseline",
                description: "Vaseline Cocoa Radiant Body Oil in category Body Oil.",
                price: 4500,
                stock: 40,
                categoryId: oilCatId,
                isActive: true,
                images: ["/products/Vaseline---Cocoa-Radiant-Body-Oil.jpg", "/products/Vaseline---Cocoa-Radiant-Body-Oil-1.jpg", "/products/Vaseline---Cocoa-Radiant-Body-Oil-2.jpg"]
            },
            {
                name: "Vitamin B3 Body Oil",
                brand: "Vaseline",
                description: "Vaseline Vitamin B3 Body Oil in category Body Oil.",
                price: 4500,
                stock: 40,
                categoryId: oilCatId,
                isActive: true,
                images: ["/products/Vaseline---Vitamin-B3-Body-Oil.jpg", "/products/Vaseline---Vitamin-B3-Body-Oil-1.jpg", "/products/Vaseline---Vitamin-B3-Body-Oil-2.jpg"]
            },
            {
                name: "Cocoa Butter Body Oil",
                brand: "Palmer's",
                description: "Palmer's Cocoa Butter Body Oil in category Body Oil.",
                price: 4500,
                stock: 40,
                categoryId: oilCatId,
                isActive: true,
                images: [] // didn't see palmer's in the list earlier, we'll leave it empty for now or the user can add it
            }
        ];

        let updatedOils = 0;
        let clearedPerfumes = 0;

        for (const p of products) {
            // Check if oil product needs updating
            const existing = await ctx.db.query("products").filter(q => q.eq(q.field("name"), p.name)).first();
            if (existing) {
                await ctx.db.patch(existing._id, { images: p.images });
                updatedOils++;
            } else {
                const fullProduct = {
                    ...p,
                    slug: p.name.toLowerCase().replace(/ /g, '-').replace(/'/g, ''),
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                await ctx.db.insert("products", fullProduct);
                updatedOils++;
            }
        }
        
        // Also clear lattafa-usa URLs from everything else
        const allProducts = await ctx.db.query("products").collect();
        for (const p of allProducts) {
             if (p.images && p.images.some(img => img.includes("lattafa-usa"))) {
                 await ctx.db.patch(p._id, { images: [] });
                 clearedPerfumes++;
             }
        }
        
        return "Updated 4 body oils and cleared broken 404 image URLs from " + clearedPerfumes + " lattafa products.";
    }
});
