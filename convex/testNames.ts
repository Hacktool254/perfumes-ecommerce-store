import { query } from "./_generated/server";

export const run = query({
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        return products.map(p => ({ id: p._id, name: p.name, isActive: p.isActive }));
    }
});
