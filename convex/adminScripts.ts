import { mutation } from "./_generated/server";

export const wipeAllAuthData = mutation(async (ctx) => {
    // delete all users
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
        await ctx.db.delete(user._id);
    }
    // delete all authAccounts
    const accounts = await ctx.db.query("authAccounts").collect();
    for (const account of accounts) {
        await ctx.db.delete(account._id);
    }
    // delete all authSessions
    const sessions = await ctx.db.query("authSessions").collect();
    for (const session of sessions) {
        await ctx.db.delete(session._id);
    }

    // Note: To be safe, we rely on wiping just the core auth tables and users.
    const vs = await ctx.db.query("authVerifications" as any).collect().catch(() => []);
    for (const v of vs) {
        await ctx.db.delete(v._id);
    }

    const rateLimits = await ctx.db.query("authRateLimits" as any).collect().catch(() => []);
    for (const r of rateLimits) {
        await ctx.db.delete(r._id);
    }

    return `Wiped ${users.length} users, ${accounts.length} accounts, and ${sessions.length} sessions.`;
});
