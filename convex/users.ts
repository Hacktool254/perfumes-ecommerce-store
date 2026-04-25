import { getAuthUserId } from "@convex-dev/auth/server";
import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { checkAdmin, isAdmin } from "./supervisor";

export const requireAdmin = checkAdmin;
export { isAdmin };

/**
 * Returns the currently authenticated user's profile and auth record.
 */
export const viewer = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) return null;
        const user = await ctx.db.get(userId);
        if (!user) return null;

        // Fetch user profile (Spoke 1)
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        // Also check if admin for context
        const adminProfile = await ctx.db
            .query("adminProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        let imageUrl = user.image;
        if (user.image && !user.image.startsWith("http")) {
            const url = await ctx.storage.getUrl(user.image as any);
            if (url) imageUrl = url;
        }

        return {
            ...user,
            ...profile,
            image: imageUrl,
            role: adminProfile ? "admin" : "customer",
            isAdmin: !!adminProfile,
        };
    },
});

/**
 * Internal helper to assert a user is authenticated.
 * Returns the user document and their profile.
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

        const existingAdmin = await ctx.db
            .query("adminProfiles")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .first();

        if (!existingAdmin) {
            await ctx.db.insert("adminProfiles", {
                userId: user._id,
                email: email,
                username: email.split("@")[0], // default username
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }

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

        let userId = existing?._id;

        if (!existing) {
            // Create a new core user
            userId = await ctx.db.insert("users", {
                email,
            });
        }

        // Add admin profile if missing
        const existingAdmin = await ctx.db
            .query("adminProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId!))
            .first();

        if (!existingAdmin) {
            await ctx.db.insert("adminProfiles", {
                userId: userId!,
                email: email,
                username: email.split("@")[0], // default username
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }

        return { action: existing ? "promoted" : "created", userId: userId! };
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

    let profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first();

    if (!profile) {
        const profileId = await ctx.db.insert("userProfiles", {
            userId: user._id,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        profile = await ctx.db.get(profileId);
    }

    // Update core user for standard auth fields if needed
    await ctx.db.patch(user._id, {
      name: `${args.firstName} ${args.lastName}`.trim(),
      phone: args.phone,
    });

    // Update Spoke 1 profile
    await ctx.db.patch(profile!._id, {
      firstName: args.firstName,
      lastName: args.lastName,
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
    
    let profile = await ctx.db
        .query("userProfiles")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first();

    if (!profile) {
        throw new Error("User profile not found.");
    }

    // If the user already has a hashedPassword, verify the current one
    if (profile.hashedPassword) {
      const hashedCurrent = await hashPassword(args.currentPassword);
      if (profile.hashedPassword !== hashedCurrent) {
        throw new Error("Invalid current security key.");
      }
    }

    // Hash and store the new password
    const hashedNew = await hashPassword(args.newPassword);
    
    await ctx.db.patch(profile._id, {
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
        const admins = await ctx.db.query("adminProfiles").collect();
        let count = 0;
        for (const admin of admins) {
            await ctx.db.delete(admin._id);
            count++;
        }
        return `Deleted ${count} admin profiles.`;
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
        await checkAdmin(ctx);

        let users;
        if (args.searchTerm) {
            const normalizedSearch = args.searchTerm.toLowerCase().trim();
            users = await ctx.db
                .query("users")
                .collect();
            
            // Basic filtering
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
            const adminProfile = await ctx.db
                .query("adminProfiles")
                .withIndex("by_user", (q) => q.eq("userId", user._id))
                .first();

            return {
                ...user,
                image: imageUrl,
                totalSpent: metrics.spent,
                orderCount: metrics.count,
                status: metrics.spent > 50000 ? "VIP" : metrics.count > 0 ? "Active" : "New",
                role: adminProfile ? "admin" : "customer",
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
        await checkAdmin(ctx);
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

        const adminProfile = await ctx.db
            .query("adminProfiles")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .first();

        return {
            ...user,
            image: imageUrl,
            totalSpent,
            orderCount: orders.length,
            recentOrders: orders.slice(0, 10),
            role: adminProfile ? "admin" : "customer",
        };
    },
});
