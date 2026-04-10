import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./users";

/**
 * Get statistics and recent activity for the user dashboard.
 */
export const getDashboardStats = query({
    args: {},
    handler: async (ctx) => {
        const user = await requireUser(ctx);

        // 1. Fetch orders count
        const orders = await ctx.db
            .query("orders")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        // 2. Fetch wishlist count
        const wishlistItems = await ctx.db
            .query("wishlistItems")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        // 3. Fetch addresses count
        const addresses = await ctx.db
            .query("userAddresses")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .collect();

        // 4. Get recent orders (top 3)
        const recentOrders = await ctx.db
            .query("orders")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .take(3);

        // 5. Get recent searches
        const recentSearches = await ctx.db
            .query("userSearches")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .take(5);

        return {
            orderCount: orders.length,
            wishlistCount: wishlistItems.length,
            addressCount: addresses.length,
            recentOrders,
            recentSearches,
            user: {
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                image: user.image,
                createdAt: user.createdAt,
            }
        };
    },
});
