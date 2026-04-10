import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./users";

/**
 * Get the current user's preferences.
 * If they don't exist, create them with defaults.
 */
export const get = query({
    args: {},
    handler: async (ctx) => {
        const user = await requireUser(ctx);
        const prefs = await ctx.db
            .query("userPreferences")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .unique();

        if (!prefs) {
            // Return defaults if not found in DB yet
            return {
                marketingCategories: [],
                orderNotifications: true,
                promotions: true,
            };
        }

        return prefs;
    },
});

/**
 * Update the user's preferences.
 */
export const update = mutation({
    args: {
        marketingCategories: v.optional(v.array(v.string())),
        orderNotifications: v.optional(v.boolean()),
        promotions: v.optional(v.boolean()),
        adminOrderAlerts: v.optional(v.boolean()),
        adminDeliveryAlerts: v.optional(v.boolean()),
        adminStockAlerts: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);
        const existing = await ctx.db
            .query("userPreferences")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .unique();

        const patch = {
            userId: user._id,
            marketingCategories: args.marketingCategories ?? existing?.marketingCategories ?? [],
            orderNotifications: args.orderNotifications ?? existing?.orderNotifications ?? true,
            promotions: args.promotions ?? existing?.promotions ?? true,
            adminOrderAlerts: args.adminOrderAlerts ?? existing?.adminOrderAlerts ?? true,
            adminDeliveryAlerts: args.adminDeliveryAlerts ?? existing?.adminDeliveryAlerts ?? true,
            adminStockAlerts: args.adminStockAlerts ?? existing?.adminStockAlerts ?? true,
            updatedAt: Date.now(),
        };

        if (existing) {
            await ctx.db.patch(existing._id, patch);
        } else {
            await ctx.db.insert("userPreferences", patch);
        }

        return { success: true };
    },
});
