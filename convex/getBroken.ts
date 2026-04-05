import { query } from "./_generated/server";

export const run = query({
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        const broken = products.filter(p => !p.images || p.images.length === 0 || p.images[0].includes("Now"));
        return broken.map(p => ({ id: p._id, name: p.name, images: p.images }));
    }
});
