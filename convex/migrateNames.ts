import { mutation } from "./_generated/server";

export const run = mutation({
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        
        let removedCount = 0;
        let updatedCount = 0;

        for (const product of products) {
            // 1. Remove/Deactivate aggregate products
            if (product.name === "Dove - All Variants" || product.name === "Hobby - Shower Gel (All Variants)") {
                await ctx.db.patch(product._id, { isActive: false });
                removedCount++;
                continue;
            }

            // 2. Rename Dove products if they don't start with "Dove"
            if (product.brand === "Dove" && !product.name.startsWith("Dove")) {
                const newName = `Dove ${product.name}`;
                const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                await ctx.db.patch(product._id, { name: newName, slug: newSlug });
                updatedCount++;
                continue;
            }

            // 3. Rename Hobby products if they don't start with "Hobby"
            if (product.brand === "Hobby" && !product.name.startsWith("Hobby")) {
                const newName = `Hobby ${product.name}`;
                const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                await ctx.db.patch(product._id, { name: newName, slug: newSlug });
                updatedCount++;
                continue;
            }
            
            // Additionally, check if brand is Hobby or Dove and already has the name, but might need slug update if it was mismatched
            // The user said "named Dove Deep Moisture Body Wash and so fort instead of just Deep Moisture"
            // My updateImages script might have already added "Deep Moisture Body Wash" as the name but brand as "Dove".
        }

        return { removedCount, updatedCount };
    }
});
