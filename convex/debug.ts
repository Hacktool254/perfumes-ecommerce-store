import { query, mutation } from "./_generated/server";

export const count = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        return products.length;
    },
});

export const clearProducts = mutation({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        for (const product of products) {
            await ctx.db.delete(product._id);
        }
        return `Cleared ${products.length} products`;
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
            .query("adminProfiles")
            .collect();
        return admins.map(a => ({ email: a.email, username: a.username }));
    },
});

export const getRecentUsers = query({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").order("desc").take(5);
        return users.map(u => ({ email: u.email, name: u.name }));
    },
});
