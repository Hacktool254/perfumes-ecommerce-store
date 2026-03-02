import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./users";

/**
 * Public query to validate a coupon code.
 * Returns the coupon details if valid, otherwise throws an error or returns null.
 */
export const validate = query({
    args: { code: v.string() },
    handler: async (ctx, args) => {
        const coupon = await ctx.db
            .query("coupons")
            .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
            .unique();

        if (!coupon || !coupon.isActive) {
            throw new Error("Invalid or inactive coupon code.");
        }

        if (coupon.expiresAt && coupon.expiresAt < Date.now()) {
            throw new Error("Coupon has expired.");
        }

        if (coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit) {
            throw new Error("Coupon usage limit reached.");
        }

        return coupon;
    },
});

/**
 * Admin: Create a new coupon.
 */
export const create = mutation({
    args: {
        code: v.string(),
        discountType: v.union(v.literal("percentage"), v.literal("fixed")),
        discountValue: v.number(),
        minOrderAmount: v.optional(v.number()),
        usageLimit: v.optional(v.number()),
        expiresAt: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const existing = await ctx.db
            .query("coupons")
            .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
            .unique();

        if (existing) {
            throw new Error("Coupon code already exists.");
        }

        return await ctx.db.insert("coupons", {
            ...args,
            code: args.code.toUpperCase(),
            usedCount: 0,
            isActive: true,
        });
    },
});

/**
 * Admin: Deactivate/Activate a coupon.
 */
export const toggleStatus = mutation({
    args: { id: v.id("coupons"), isActive: v.boolean() },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.patch(args.id, {
            isActive: args.isActive,
        });
    },
});

/**
 * Internal helper to increment coupon usage.
 */
export const incrementUsageInternal = mutation({
    args: { id: v.id("coupons") },
    handler: async (ctx, args) => {
        const coupon = await ctx.db.get(args.id);
        if (!coupon) return;
        await ctx.db.patch(args.id, {
            usedCount: coupon.usedCount + 1,
        });
    },
});

/**
 * Admin: List all coupons.
 */
export const adminList = query({
    args: {},
    handler: async (ctx) => {
        await requireAdmin(ctx);
        return await ctx.db.query("coupons").collect();
    },
});

/**
 * Admin: Delete a coupon.
 */
export const remove = mutation({
    args: { id: v.id("coupons") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.delete(args.id);
    },
});
