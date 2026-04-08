import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Returns the currently authenticated user.
 * Since @convex-dev/auth stores users directly in the `users` table,
 * the auth userId IS the user document ID.
 */
export const viewer = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) return null;
        return await ctx.db.get(userId);
    },
});

/**
 * Helper query to quickly check if the current user is an admin.
 */
export const isAdmin = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return false;

        const user = await ctx.db.get(userId);
        return user?.role === "admin";
    },
});

/**
 * Internal helper for mutations/queries to assert the user is an admin.
 * Throws an error if not authenticated or not an admin.
 */
export async function requireAdmin(ctx: any) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
        throw new Error("Forbidden: Admin access only");
    }

    return user;
}

/**
 * Internal helper to assert a user is authenticated.
 * Returns the user document.
 */
export async function requireUser(ctx: any) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("Unauthorized: User record not found");

    return user;
}

/**
 * Helper to get a user by their email address.
 */
export async function getUserByEmail(ctx: any, email: string) {
    return await ctx.db
        .query("users")
        .withIndex("email", (q: any) => q.eq("email", email.toLowerCase().trim()))
        .first();
}

/**
 * Mutation to promote a user to admin by email.
 * This should only be called from the Convex dashboard or an internal script.
 */
export const promoteToAdmin = internalMutation({
    args: { email: v.string() },
    handler: async (ctx, { email }) => {
        const user = await ctx.db
            .query("users")
            .withIndex("email", (q: any) => q.eq("email", email))
            .unique();

        if (!user) {
            throw new Error(`No user found with email: ${email}`);
        }

        await ctx.db.patch(user._id, {
            role: "admin",
            updatedAt: Date.now(),
        });

        return { success: true, userId: user._id, email };
    },
});

/**
 * Seed an admin account directly (for initial setup).
 * Run this from the Convex dashboard if you need to create a fresh admin.
 */
export const seedAdmin = internalMutation({
    args: {
        email: v.string(),
    },
    handler: async (ctx, { email }) => {
        // Check if user already exists
        const existing = await ctx.db
            .query("users")
            .withIndex("email", (q: any) => q.eq("email", email))
            .unique();

        if (existing) {
            // Just promote to admin
            await ctx.db.patch(existing._id, {
                role: "admin",
                updatedAt: Date.now(),
            });
            return { action: "promoted", userId: existing._id };
        }

        // Create a new admin user (they'll need to sign up via the auth flow to set a password)
        const userId = await ctx.db.insert("users", {
            email,
            role: "admin",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return { action: "created", userId };
    },
});

/**
 * Temporarily clear all admin roles to reset accounts.
 */
export const clearAllAdmins = internalMutation({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        let count = 0;
        for (const user of users) {
            if (user.role === "admin") {
                await ctx.db.patch(user._id, { role: "customer" });
                count++;
            }
        }
        return `Cleared ${count} admin accounts.`;
    }
});
