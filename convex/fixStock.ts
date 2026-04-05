import { mutation } from "./_generated/server";

export const run = mutation({
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        for (const p of products) {
            if (p.name.includes("Now Pink") || p.name.includes("Now Rave")) {
                await ctx.db.patch(p._id, { price: 4500, stock: 50 });
            }
        }
    }
});
