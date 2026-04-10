import { v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery } from "./_generated/server";
import { api, internal } from "./_generated/api";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Ummie's Essence <onboarding@resend.dev>"; // Update with verified domain in prod

/**
 * Generic Resend API helper
 */
async function sendEmailViaResend({ to, subject, html }: { to: string, subject: string, html: string }) {
    if (!RESEND_API_KEY || RESEND_API_KEY === "your_resend_key_here") {
        console.log("Resend API Key not set. Mocking email send to:", to);
        return { id: "mock_id" };
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: FROM_EMAIL,
            to,
            subject,
            html,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("Resend Error:", error);
        throw new Error(`Failed to send email: ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Order Confirmation Email (Action)
 */
export const sendOrderConfirmation = internalAction({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const order = await ctx.runQuery(api.orders.get, { orderId: args.orderId });
        if (!order || !order.userId) return;

        const user = await ctx.runQuery(internal.emails.getUserEmail, { userId: order.userId });
        if (!user || !user.email) return;

        const itemsHtml = order.items.map((item: any) =>
            `<li>${item.product?.name} x ${item.quantity} - KES ${item.unitPrice * item.quantity}</li>`
        ).join("");

        const html = `
            <h1>Thank you for your order!</h1>
            <p>Order ID: ${args.orderId}</p>
            <p>Total: KES ${order.totalAmount}</p>
            <ul>${itemsHtml}</ul>
            <p>We'll notify you when it ships.</p>
        `;

        await sendEmailViaResend({
            to: user.email,
            subject: `Order Confirmation - ${args.orderId}`,
            html,
        });
    }
});

/**
 * Shipping Notification Email (Action)
 */
export const sendShippingNotification = internalAction({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const order = await ctx.runQuery(api.orders.get, { orderId: args.orderId });
        if (!order || !order.userId) return;

        const user = await ctx.runQuery(internal.emails.getUserEmail, { userId: order.userId });
        if (!user || !user.email) return;

        const html = `
            <h1>Your order is on its way!</h1>
            <p>Order ID: ${args.orderId}</p>
            <p>Status: Shipped</p>
            <p>Thank you for shopping with Ummie's Essence.</p>
        `;

        await sendEmailViaResend({
            to: user.email,
            subject: `Your order is on its way! - ${args.orderId}`,
            html,
        });
    }
});

/**
 * Internal Queries/Mutations for Email Logic
 */
export const getUserEmail = internalQuery({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    }
});

export const getAbandonedCartUsers = internalQuery({
    args: {},
    handler: async (ctx) => {
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000;

        // Simple logic: Find unique user IDs from cartItems updated between 24 and 48 hours ago
        const items = await ctx.db
            .query("cartItems")
            .filter(q => q.and(
                q.lt(q.field("updatedAt"), oneDayAgo),
                q.gt(q.field("updatedAt"), twoDaysAgo)
            ))
            .collect();

        const userIds = Array.from(new Set(items.map(i => i.userId)));
        return userIds;
    }
});

export const sendAbandonedCartEmail = internalAction({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.emails.getUserEmail, { userId: args.userId });
        if (!user || !user.email) return;

        const html = `
            <h1>Forgotten something?</h1>
            <p>Items are still waiting in your cart!</p>
            <p>Come back and complete your purchase at Ummie's Essence.</p>
        `;

        await sendEmailViaResend({
            to: user.email,
            subject: "Your cart is waiting for you!",
            html,
        });
    }
});

/**
 * Scheduled Cron Action
 */
export const runAbandonedCartRecovery = internalAction({
    args: {},
    handler: async (ctx) => {
        const userIds = await ctx.runQuery(internal.emails.getAbandonedCartUsers);
        for (const userId of userIds) {
            await ctx.runAction(internal.emails.sendAbandonedCartEmail, { userId });
        }
    }
});
