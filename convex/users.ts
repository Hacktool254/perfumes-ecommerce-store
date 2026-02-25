import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

/**
 * Returns the currently authenticated user from our custom `users` table.
 * Uses the email from the auth session to perform a lookup.
 */
export const viewer = query({
    args: {},
    handler: async (ctx) => {
        const authUserId = await getAuthUserId(ctx);
        if (authUserId === null) {
            return null;
        }

        // Get the auth system user to retrieve their email
        const authUser = await ctx.db.get(authUserId);
        if (!authUser || !authUser.email) {
            return null;
        }

        // Look up our custom user record by email
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", authUser.email as string))
            .unique();

        return user;
    },
});

/**
 * Helper query to quickly check if the current user is an admin.
 */
export const isAdmin = query({
    args: {},
    handler: async (ctx) => {
        const authUserId = await getAuthUserId(ctx);
        if (!authUserId) return false;

        const authUser = await ctx.db.get(authUserId);
        if (!authUser || !authUser.email) return false;

        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", authUser.email as string))
            .unique();

        return user?.role === "admin";
    },
});
