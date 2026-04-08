import { query } from "./_generated/server";

export const count = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        return products.length;
    },
});
export const listSlugs = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        return products.map(p => p.slug).sort();
    },
});
export const getAdminEmails = query({
    args: {},
    handler: async (ctx) => {
        const admins = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "admin"))
            .collect();
        return admins.map(u => ({ email: u.email, name: u.name }));
    },
});
