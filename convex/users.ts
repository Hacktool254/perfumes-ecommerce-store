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

/**
 * Internal helper for mutations/queries to assert the user is an admin.
 * Throws an error if not authenticated or not an admin.
 */
export async function requireAdmin(ctx: any) {
    const authUserId = await getAuthUserId(ctx);
    if (!authUserId) throw new Error("Unauthorized");

    const authUser = await ctx.db.get(authUserId);
    if (!authUser || !authUser.email) throw new Error("Unauthorized");

    const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q: any) => q.eq("email", authUser.email as string))
        .unique();

    if (user?.role !== "admin") {
        throw new Error("Forbidden: Admin access only");
    }

    return user;
}
