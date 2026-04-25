import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Custom query to translate an admin's username into their registered email.
 * This is used by the Admin login portal before sending credentials to Convex Auth.
 */
export const getAdminEmailByUsername = query({
    args: { username: v.string() },
    handler: async (ctx, { username }) => {
        const adminProfile = await ctx.db
            .query("adminProfiles")
            .withIndex("by_username", (q: any) => q.eq("username", username))
            .first();

        if (!adminProfile) {
            return null;
        }

        return adminProfile.email;
    },
});

/**
 * Checks if the current authenticated user has an admin profile.
 * Used by the Admin layout to determine access.
 */
export const isAdmin = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return false;

        const adminProfile = await ctx.db
            .query("adminProfiles")
            .withIndex("by_user", (q: any) => q.eq("userId", userId))
            .first();

        return !!adminProfile;
    },
});

/**
 * Internal helper function to assert that a user is an administrator.
 * Use this in mutations and queries to protect admin-only endpoints.
 */
export async function checkAdmin(ctx: any) {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const adminProfile = await ctx.db
        .query("adminProfiles")
        .withIndex("by_user", (q: any) => q.eq("userId", userId))
        .first();

    if (!adminProfile) {
        throw new Error("Forbidden: Admin access only");
    }

    return {
        userId,
        adminProfile,
    };
}
