import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./users";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Generate a short-lived upload URL for the client to upload a file directly
 * to Convex storage. Common function for users and admins.
 */
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        // Must be logged in
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");
        
        return await ctx.storage.generateUploadUrl();
    },
});

/**
 * After upload, get the serving URL for a stored file by its storage ID.
 */
export const getUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

/**
 * Get serving URLs for multiple storage IDs at once.
 * Useful for rendering product image galleries.
 */
export const getUrls = query({
    args: { storageIds: v.array(v.id("_storage")) },
    handler: async (ctx, args) => {
        const urls = await Promise.all(
            args.storageIds.map(async (id) => {
                const url = await ctx.storage.getUrl(id);
                return { storageId: id, url };
            })
        );
        return urls;
    },
});

/**
 * Delete a file from storage. Admin only.
 */
export const deleteFile = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.storage.delete(args.storageId);
    },
});
