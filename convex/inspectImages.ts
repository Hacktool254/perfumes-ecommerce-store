import { query } from "./_generated/server";

export const run = query({
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        return products.slice(0, 5).map(p => ({
            name: p.name,
            images: p.images
        }));
    }
});
