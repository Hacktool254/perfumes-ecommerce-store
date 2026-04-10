import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./users";

/**
 * Retrieve global site-wide integration keys.
 * Access is restricted to authenticated administrative curators.
 */
export const get = query({
    args: {},
    handler: async (ctx) => {
        const settings = await ctx.db.query("siteSettings").first();
        
        if (!settings) {
            return {
                resendApiKey: "",
                whatsappApiKey: "",
                chatbotApiKey: "",
            };
        }
        
        return settings;
    },
});

/**
 * Update global site-wide integration keys.
 */
export const update = mutation({
    args: {
        resendApiKey: v.optional(v.string()),
        whatsappApiKey: v.optional(v.string()),
        chatbotApiKey: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        const existing = await ctx.db.query("siteSettings").first();

        const patch = {
            resendApiKey: args.resendApiKey ?? existing?.resendApiKey,
            whatsappApiKey: args.whatsappApiKey ?? existing?.whatsappApiKey,
            chatbotApiKey: args.chatbotApiKey ?? existing?.chatbotApiKey,
            updatedAt: Date.now(),
        };

        if (existing) {
            await ctx.db.patch(existing._id, patch);
        } else {
            await ctx.db.insert("siteSettings", patch);
        }

        return { success: true };
    },
});
