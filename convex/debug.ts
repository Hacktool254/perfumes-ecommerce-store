import { query } from "./_generated/server";

export const count = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        return products.length;
    },
});
