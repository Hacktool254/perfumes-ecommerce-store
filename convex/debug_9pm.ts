import { query } from "./_generated/server";

export const check9PM = query({
    handler: async (ctx) => {
        const p = await ctx.db.query("products").filter(q => q.eq(q.field("name"), "9PM Black")).first();
        const cat = p ? await ctx.db.get(p.categoryId) : null;
        return { product: p, category: cat };
    }
});
