import { mutation } from "./_generated/server";

export const wipeAuthData = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "users",
      "authAccounts",
      "authSessions",
      "authVerificationCodes",
      "authRefreshTokens"
    ] as const;

    let totalDeleted = 0;

    for (const table of tables) {
      // @ts-ignore - Dynamic table access
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
        totalDeleted++;
      }
      console.log(`Cleared ${docs.length} rows from ${table}`);
    }

    return `Success: Deleted ${totalDeleted} auth records.`;
  },
});
