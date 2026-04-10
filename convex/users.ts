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
        const user = await ctx.db.get(userId);
        if (!user) return null;

        let imageUrl = user.image;
        if (user.image && !user.image.startsWith("http")) {
            const url = await ctx.storage.getUrl(user.image as any);
            if (url) imageUrl = url;
        }

        return {
            ...user,
            image: imageUrl,
        };
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

// Simple hash function for passwords (must match authMutations.ts)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "ummie-secret-salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Update the user's basic profile information.
 */
export const updateProfile = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    await ctx.db.patch(user._id, {
      firstName: args.firstName,
      lastName: args.lastName,
      phone: args.phone,
      name: `${args.firstName} ${args.lastName}`.trim(),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Update the user's security credentials (password).
 */
export const updateSecurity = mutation({
  args: {
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    // If the user already has a hashedPassword, verify the current one
    if (user.hashedPassword) {
      const hashedCurrent = await hashPassword(args.currentPassword);
      if (user.hashedPassword !== hashedCurrent) {
        throw new Error("Invalid current security key.");
      }
    }

    // Hash and store the new password
    const hashedNew = await hashPassword(args.newPassword);
    
    await ctx.db.patch(user._id, {
      hashedPassword: hashedNew,
      updatedAt: Date.now(),
    });

    return { success: true };
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
/**
 * Update the user's profile image storage ID.
 */
export const updateImage = mutation({
    args: { storageId: v.optional(v.id("_storage")) },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);
        
        await ctx.db.patch(user._id, {
            image: args.storageId,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

/**
 * Admin: List all users (patrons) with basic metrics.
 * Note: Calculates 'Total Spent' and 'Order Count' on-the-fly.
 */
export const list = query({
    args: {
        searchTerm: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        let users;
        if (args.searchTerm) {
            const normalizedSearch = args.searchTerm.toLowerCase().trim();
            users = await ctx.db
                .query("users")
                .collect();
            
            // Basic filtering as Convex doesn't have native multi-field text search on the free tier easily
            users = users.filter(u => 
                u.name?.toLowerCase().includes(normalizedSearch) || 
                u.email?.toLowerCase().includes(normalizedSearch)
            );
        } else {
            users = await ctx.db.query("users").order("desc").collect();
        }

        // Get all orders to calculate metrics (this is fine for small/medium scale)
        const allOrders = await ctx.db.query("orders").collect();
        const orderMetrics: Record<string, { spent: number; count: number }> = {};

        allOrders.forEach(order => {
            if (!order.userId || order.status === "cancelled") return;
            const uid = order.userId;
            if (!orderMetrics[uid]) orderMetrics[uid] = { spent: 0, count: 0 };
            orderMetrics[uid].spent += order.totalAmount;
            orderMetrics[uid].count += 1;
        });

        const usersWithMetrics = await Promise.all(users.map(async (user) => {
            let imageUrl = user.image;
            if (user.image && !user.image.startsWith("http")) {
                const url = await ctx.storage.getUrl(user.image as any);
                if (url) imageUrl = url;
            }

            const metrics = orderMetrics[user._id] || { spent: 0, count: 0 };

            return {
                ...user,
                image: imageUrl,
                totalSpent: metrics.spent,
                orderCount: metrics.count,
                status: metrics.spent > 50000 ? "VIP" : metrics.count > 0 ? "Active" : "New",
            };
        }));

        return usersWithMetrics;
    },
});

/**
 * Admin: Single Patron View.
 */
export const getPatron = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const user = await ctx.db.get(args.userId);
        if (!user) return null;

        const orders = await ctx.db
            .query("orders")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();

        const totalSpent = orders.reduce((acc, o) => acc + (o.status !== "cancelled" ? o.totalAmount : 0), 0);

        let imageUrl = user.image;
        if (user.image && !user.image.startsWith("http")) {
            const url = await ctx.storage.getUrl(user.image as any);
            if (url) imageUrl = url;
        }

        return {
            ...user,
            image: imageUrl,
            totalSpent,
            orderCount: orders.length,
            recentOrders: orders.slice(0, 10),
        };
    },
});
