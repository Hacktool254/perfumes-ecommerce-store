import { query } from "./_generated/server";

export const list = query({
    handler: async (ctx) => {
        const cats = await ctx.db.query("categories").collect();
        return cats.map(c => ({ id: c._id, slug: c.slug, name: c.name }));
    }
});
