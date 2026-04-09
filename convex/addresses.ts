import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUser } from "./users";

/**
 * List all addresses for the current user.
 */
export const list = query({
    args: {},
    handler: async (ctx) => {
        const user = await requireUser(ctx);
        return await ctx.db
            .query("userAddresses")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
            .order("desc")
            .collect();
    },
});

/**
 * Add a new address.
 */
export const add = mutation({
    args: {
        fullName: v.string(),
        phone: v.string(),
        street: v.string(),
        apartment: v.optional(v.string()),
        city: v.string(),
        state: v.optional(v.string()),
        postalCode: v.optional(v.string()),
        country: v.string(),
        isDefault: v.boolean(),
    },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);

        // If this is the first address or marked as default, unset other defaults
        if (args.isDefault) {
            const existingAddresses = await ctx.db
                .query("userAddresses")
                .withIndex("by_user", (q) => q.eq("userId", user._id))
                .collect();
            
            for (const addr of existingAddresses) {
                if (addr.isDefault) {
                    await ctx.db.patch(addr._id, { isDefault: false });
                }
            }
        } else {
            // Check if there are NO addresses yet, if so, make this one the default anyway
            const count = (await ctx.db
                .query("userAddresses")
                .withIndex("by_user", (q) => q.eq("userId", user._id))
                .collect()).length;
            
            if (count === 0) {
                args.isDefault = true;
            }
        }

        const addressId = await ctx.db.insert("userAddresses", {
            userId: user._id,
            ...args,
            updatedAt: Date.now(),
        });

        return addressId;
    },
});

/**
 * Update an existing address.
 */
export const update = mutation({
    args: {
        id: v.id("userAddresses"),
        fullName: v.optional(v.string()),
        phone: v.optional(v.string()),
        street: v.optional(v.string()),
        apartment: v.optional(v.string()),
        city: v.optional(v.string()),
        state: v.optional(v.string()),
        postalCode: v.optional(v.string()),
        country: v.optional(v.string()),
        isDefault: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);
        const { id, ...fields } = args;

        const existing = await ctx.db.get(id);
        if (!existing || existing.userId !== user._id) {
            throw new Error("Address not found or unauthorized");
        }

        // Handle default swapping
        if (fields.isDefault) {
            const existingAddresses = await ctx.db
                .query("userAddresses")
                .withIndex("by_user", (q) => q.eq("userId", user._id))
                .collect();
            
            for (const addr of existingAddresses) {
                if (addr.isDefault && addr._id !== id) {
                    await ctx.db.patch(addr._id, { isDefault: false });
                }
            }
        }

        await ctx.db.patch(id, {
            ...fields,
            updatedAt: Date.now(),
        });

        return { success: true };
    },
});

/**
 * Remove an address.
 */
export const remove = mutation({
    args: { id: v.id("userAddresses") },
    handler: async (ctx, args) => {
        const user = await requireUser(ctx);
        const existing = await ctx.db.get(args.id);

        if (!existing || existing.userId !== user._id) {
            throw new Error("Address not found or unauthorized");
        }

        await ctx.db.delete(args.id);

        // If we deleted the default address, try to make the next one default
        if (existing.isDefault) {
            const remaining = await ctx.db
                .query("userAddresses")
                .withIndex("by_user", (q) => q.eq("userId", user._id))
                .first();
            
            if (remaining) {
                await ctx.db.patch(remaining._id, { isDefault: true });
            }
        }

        return { success: true };
    },
});
