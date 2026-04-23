import { v } from "convex/values";
import { action, internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "Ummie's Essence <onboarding@resend.dev>";
const STORE_NAME = "Ummie's Essence";
const BRAND_COLOR = "#8b1538";
const BRAND_BG = "#fdf6f7";

// ─── Resend API Helper ────────────────────────────────────────────────────────

async function sendEmailViaResend({ to, subject, html }: { to: string; subject: string; html: string }) {
    if (!RESEND_API_KEY || RESEND_API_KEY === "your_resend_key_here") {
        console.log("[Email Mock] To:", to, "Subject:", subject);
        return { id: "mock_id" };
    }

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error("Resend Error:", error);
        throw new Error(`Failed to send email: ${response.statusText}`);
    }

    return await response.json();
}

// ─── HTML Template Wrapper ────────────────────────────────────────────────────

function emailWrapper(title: string, body: string): string {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BRAND_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:40px 20px">
<div style="text-align:center;margin-bottom:32px">
<h2 style="margin:0;font-size:20px;color:${BRAND_COLOR};letter-spacing:0.04em">${STORE_NAME}</h2>
<p style="margin:4px 0 0;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:0.15em">Timeless Fragrances</p>
</div>
<div style="background:#fff;border-radius:16px;padding:32px;border:1px solid #f0e0e3;box-shadow:0 2px 12px rgba(139,21,56,0.06)">
<h1 style="margin:0 0 16px;font-size:22px;color:#2f2f2f">${title}</h1>
${body}
</div>
<div style="text-align:center;margin-top:32px;font-size:11px;color:#aaa">
<p style="margin:0">&copy; ${new Date().getFullYear()} ${STORE_NAME}. All rights reserved.</p>
<p style="margin:4px 0 0">Nairobi, Kenya</p>
</div>
</div></body></html>`;
}

function btnHtml(text: string, url: string): string {
    return `<div style="text-align:center;margin:28px 0"><a href="${url}" style="display:inline-block;background:${BRAND_COLOR};color:#fff;padding:14px 36px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px">${text}</a></div>`;
}

// ─── PASSWORD RESET ───────────────────────────────────────────────────────────

/** Create a reset token and send the email */
export const requestPasswordReset = action({
    args: { email: v.string(), appBaseUrl: v.string() },
    handler: async (ctx, args) => {
        const email = args.email.toLowerCase().trim();

        // Create token regardless of whether user exists (security: don't reveal if email exists)
        const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, "0")).join("");

        await ctx.runMutation(internal.emails.createResetToken, {
            email,
            token,
            expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
        });

        // Check if user actually exists before sending
        const user = await ctx.runQuery(internal.emails.getUserByEmail, { email });
        if (!user) {
            console.log("[PasswordReset] No user found for:", email);
            return { success: true }; // Don't reveal user existence
        }

        const resetUrl = `${args.appBaseUrl}/reset-password?token=${token}`;
        const name = user.name || "there";

        await sendEmailViaResend({
            to: email,
            subject: "Reset Your Password — Ummie's Essence",
            html: emailWrapper("Reset Your Password", `
                <p style="color:#666;line-height:1.7;margin:0 0 8px">Hi ${name},</p>
                <p style="color:#666;line-height:1.7;margin:0 0 8px">We received a request to reset your password. Click the button below to create a new one:</p>
                ${btnHtml("Reset Password", resetUrl)}
                <p style="color:#999;font-size:12px;margin:0">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
            `),
        });

        return { success: true };
    },
});

/** Verify token and reset password */
export const resetPassword = action({
    args: { token: v.string(), newPassword: v.string() },
    handler: async (ctx, args) => {
        const tokenDoc = await ctx.runQuery(internal.emails.getResetToken, { token: args.token });

        if (!tokenDoc) throw new Error("Invalid or expired reset link.");
        if (tokenDoc.used) throw new Error("This reset link has already been used.");
        if (tokenDoc.expiresAt < Date.now()) throw new Error("This reset link has expired. Please request a new one.");

        // Hash password
        const encoder = new TextEncoder();
        const data = encoder.encode(args.newPassword + "ummie-secret-salt");
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashedPassword = Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, "0")).join("");

        // Update password and mark token as used
        await ctx.runMutation(internal.emails.applyPasswordReset, {
            email: tokenDoc.email,
            hashedPassword,
            tokenId: tokenDoc._id,
        });

        // Send confirmation email
        await sendEmailViaResend({
            to: tokenDoc.email,
            subject: "Password Changed — Ummie's Essence",
            html: emailWrapper("Password Updated", `
                <p style="color:#666;line-height:1.7">Your password has been successfully changed. You can now sign in with your new credentials.</p>
                <p style="color:#999;font-size:12px;margin-top:16px">If you didn't make this change, please contact us immediately.</p>
            `),
        });

        return { success: true };
    },
});

// ─── Internal helpers for password reset ──────────────────────────────────────

export const createResetToken = internalMutation({
    args: { email: v.string(), token: v.string(), expiresAt: v.number() },
    handler: async (ctx, args) => {
        // Invalidate old tokens for this email
        const old = await ctx.db.query("passwordResetTokens")
            .withIndex("by_email", q => q.eq("email", args.email)).collect();
        for (const t of old) { await ctx.db.patch(t._id, { used: true }); }

        await ctx.db.insert("passwordResetTokens", {
            email: args.email, token: args.token,
            expiresAt: args.expiresAt, used: false, createdAt: Date.now(),
        });
    },
});

export const getResetToken = internalQuery({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.query("passwordResetTokens")
            .withIndex("by_token", q => q.eq("token", args.token)).first();
    },
});

export const applyPasswordReset = internalMutation({
    args: { email: v.string(), hashedPassword: v.string(), tokenId: v.id("passwordResetTokens") },
    handler: async (ctx, args) => {
        const user = await ctx.db.query("users")
            .withIndex("email", q => q.eq("email", args.email)).first();
        if (user) {
            await ctx.db.patch(user._id, { hashedPassword: args.hashedPassword, updatedAt: Date.now() });
        }
        await ctx.db.patch(args.tokenId, { used: true });
    },
});

export const getUserByEmail = internalQuery({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.query("users")
            .withIndex("email", q => q.eq("email", args.email)).first();
    },
});

// ─── WELCOME EMAIL ────────────────────────────────────────────────────────────

export const sendWelcomeEmail = internalAction({
    args: { email: v.string(), name: v.string() },
    handler: async (_ctx, args) => {
        await sendEmailViaResend({
            to: args.email,
            subject: `Welcome to ${STORE_NAME}! 🌸`,
            html: emailWrapper("Welcome to the Family!", `
                <p style="color:#666;line-height:1.7">Hi ${args.name},</p>
                <p style="color:#666;line-height:1.7">Thank you for joining ${STORE_NAME}! We're thrilled to have you.</p>
                <p style="color:#666;line-height:1.7">Explore our curated collection of premium fragrances from top houses like Lattafa, Maison Alhambra, and more.</p>
                ${btnHtml("Start Shopping", "https://ummiesessence.com/shop")}
                <p style="color:#999;font-size:12px">Need help? Just reply to this email or chat with Ummie on our website!</p>
            `),
        });
    },
});

// ─── ORDER CONFIRMATION ───────────────────────────────────────────────────────

export const sendOrderConfirmation = internalAction({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const order = await ctx.runQuery(api.orders.get, { orderId: args.orderId });
        if (!order || !order.userId) return;

        const user = await ctx.runQuery(internal.emails.getUserEmail, { userId: order.userId });
        if (!user?.email) return;

        const itemsHtml = order.items.map((item: any) => {
            const name = item.product?.name || "Product";
            const total = (item.unitPrice * item.quantity).toLocaleString();
            return `<tr><td style="padding:8px 0;border-bottom:1px solid #f5f5f5;color:#444">${name}</td>
                <td style="padding:8px 0;border-bottom:1px solid #f5f5f5;color:#666;text-align:center">×${item.quantity}</td>
                <td style="padding:8px 0;border-bottom:1px solid #f5f5f5;color:#2f2f2f;text-align:right;font-weight:600">KES ${total}</td></tr>`;
        }).join("");

        await sendEmailViaResend({
            to: user.email,
            subject: `Order Confirmed! 🎉 — ${STORE_NAME}`,
            html: emailWrapper("Order Confirmed!", `
                <p style="color:#666;line-height:1.7">Hi ${user.name || "there"},</p>
                <p style="color:#666;line-height:1.7">Your order has been placed successfully! Here's your summary:</p>
                <div style="background:${BRAND_BG};border-radius:12px;padding:16px;margin:16px 0">
                    <p style="margin:0 0 4px;font-size:12px;color:#999">Order ID</p>
                    <p style="margin:0;font-weight:700;color:#2f2f2f;font-size:13px;word-break:break-all">${args.orderId}</p>
                </div>
                <table style="width:100%;border-collapse:collapse;font-size:13px;margin:16px 0">
                    <thead><tr><th style="text-align:left;padding:8px 0;border-bottom:2px solid #eee;color:#999;font-size:11px;text-transform:uppercase">Item</th>
                    <th style="text-align:center;padding:8px 0;border-bottom:2px solid #eee;color:#999;font-size:11px">Qty</th>
                    <th style="text-align:right;padding:8px 0;border-bottom:2px solid #eee;color:#999;font-size:11px">Price</th></tr></thead>
                    <tbody>${itemsHtml}</tbody>
                    <tfoot><tr><td colspan="2" style="padding:12px 0;font-weight:700;color:#2f2f2f">Total</td>
                    <td style="padding:12px 0;text-align:right;font-weight:700;color:${BRAND_COLOR};font-size:16px">KES ${order.totalAmount.toLocaleString()}</td></tr></tfoot>
                </table>
                <p style="color:#666;line-height:1.7;font-size:13px">We'll notify you once your order ships. Payment via M-Pesa is processed instantly!</p>
            `),
        });
    },
});

// ─── SHIPPING NOTIFICATION ────────────────────────────────────────────────────

export const sendShippingNotification = internalAction({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const order = await ctx.runQuery(api.orders.get, { orderId: args.orderId });
        if (!order || !order.userId) return;

        const user = await ctx.runQuery(internal.emails.getUserEmail, { userId: order.userId });
        if (!user?.email) return;

        await sendEmailViaResend({
            to: user.email,
            subject: `Your order is on its way! 🚚 — ${STORE_NAME}`,
            html: emailWrapper("Your Order Has Shipped!", `
                <p style="color:#666;line-height:1.7">Hi ${user.name || "there"},</p>
                <p style="color:#666;line-height:1.7">Great news! Your order is on its way to you.</p>
                <div style="background:${BRAND_BG};border-radius:12px;padding:16px;margin:16px 0">
                    <p style="margin:0 0 4px;font-size:12px;color:#999">Order ID</p>
                    <p style="margin:0;font-weight:700;color:#2f2f2f;font-size:13px;word-break:break-all">${args.orderId}</p>
                    <p style="margin:12px 0 0;font-size:12px;color:#999">Estimated Delivery</p>
                    <p style="margin:0;font-weight:600;color:#2f2f2f">Nairobi: Same day · Rest of Kenya: 2-3 days</p>
                </div>
                ${btnHtml("Track Your Order", "https://ummiesessence.com/track-order")}
            `),
        });
    },
});

// ─── DELIVERY CONFIRMATION ────────────────────────────────────────────────────

export const sendDeliveryConfirmation = internalAction({
    args: { orderId: v.id("orders") },
    handler: async (ctx, args) => {
        const order = await ctx.runQuery(api.orders.get, { orderId: args.orderId });
        if (!order || !order.userId) return;

        const user = await ctx.runQuery(internal.emails.getUserEmail, { userId: order.userId });
        if (!user?.email) return;

        await sendEmailViaResend({
            to: user.email,
            subject: `Order Delivered! ✅ — ${STORE_NAME}`,
            html: emailWrapper("Order Delivered!", `
                <p style="color:#666;line-height:1.7">Hi ${user.name || "there"},</p>
                <p style="color:#666;line-height:1.7">Your order has been delivered! We hope you love your new fragrance. 🌸</p>
                <p style="color:#666;line-height:1.7">If you have a moment, we'd love to hear your thoughts — leave a review on our shop!</p>
                ${btnHtml("Leave a Review", "https://ummiesessence.com/account/orders")}
            `),
        });
    },
});

// ─── PAYMENT CONFIRMATION ─────────────────────────────────────────────────────

export const sendPaymentConfirmation = internalAction({
    args: { orderId: v.id("orders"), receiptNumber: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const order = await ctx.runQuery(api.orders.get, { orderId: args.orderId });
        if (!order || !order.userId) return;

        const user = await ctx.runQuery(internal.emails.getUserEmail, { userId: order.userId });
        if (!user?.email) return;

        const receiptLine = args.receiptNumber
            ? `<p style="margin:12px 0 0;font-size:12px;color:#999">M-Pesa Receipt</p><p style="margin:0;font-weight:700;color:#2f2f2f">${args.receiptNumber}</p>`
            : "";

        await sendEmailViaResend({
            to: user.email,
            subject: `Payment Received 💳 — ${STORE_NAME}`,
            html: emailWrapper("Payment Confirmed!", `
                <p style="color:#666;line-height:1.7">Hi ${user.name || "there"},</p>
                <p style="color:#666;line-height:1.7">We've received your payment of <strong>KES ${order.totalAmount.toLocaleString()}</strong>. Your order is now being processed!</p>
                <div style="background:${BRAND_BG};border-radius:12px;padding:16px;margin:16px 0">
                    <p style="margin:0 0 4px;font-size:12px;color:#999">Amount Paid</p>
                    <p style="margin:0;font-weight:700;color:${BRAND_COLOR};font-size:18px">KES ${order.totalAmount.toLocaleString()}</p>
                    ${receiptLine}
                </div>
            `),
        });
    },
});

// ─── ABANDONED CART ───────────────────────────────────────────────────────────

export const sendAbandonedCartEmail = internalAction({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.runQuery(internal.emails.getUserEmail, { userId: args.userId });
        if (!user?.email) return;

        await sendEmailViaResend({
            to: user.email,
            subject: `Your cart is waiting! 🛒 — ${STORE_NAME}`,
            html: emailWrapper("Forgotten Something?", `
                <p style="color:#666;line-height:1.7">Hi ${user.name || "there"},</p>
                <p style="color:#666;line-height:1.7">You left some amazing fragrances in your cart! They're still waiting for you.</p>
                <p style="color:#666;line-height:1.7">Complete your purchase before they sell out! 💨</p>
                ${btnHtml("Complete Your Order", "https://ummiesessence.com/cart")}
            `),
        });
    },
});

// ─── ADMIN: LOW STOCK ALERT ──────────────────────────────────────────────────

export const sendLowStockAlert = internalAction({
    args: { productName: v.string(), currentStock: v.number(), adminEmail: v.string() },
    handler: async (_ctx, args) => {
        await sendEmailViaResend({
            to: args.adminEmail,
            subject: `⚠️ Low Stock Alert: ${args.productName}`,
            html: emailWrapper("Low Stock Alert", `
                <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:12px;padding:16px;margin:0 0 16px">
                    <p style="margin:0;font-weight:700;color:#856404">⚠️ ${args.productName}</p>
                    <p style="margin:4px 0 0;color:#856404;font-size:13px">Only <strong>${args.currentStock}</strong> units remaining</p>
                </div>
                <p style="color:#666;line-height:1.7">Please restock this item soon to avoid losing sales.</p>
            `),
        });
    },
});

// ─── ADMIN: NEW ORDER ALERT ─────────────────────────────────────────────────

export const sendNewOrderAlert = internalAction({
    args: { orderId: v.id("orders"), adminEmail: v.string() },
    handler: async (ctx, args) => {
        const order = await ctx.runQuery(api.orders.get, { orderId: args.orderId });
        if (!order) return;

        await sendEmailViaResend({
            to: args.adminEmail,
            subject: `🔔 New Order: KES ${order.totalAmount.toLocaleString()}`,
            html: emailWrapper("New Order Received!", `
                <p style="color:#666;line-height:1.7">A new order has been placed:</p>
                <div style="background:${BRAND_BG};border-radius:12px;padding:16px;margin:16px 0">
                    <p style="margin:0 0 8px"><strong>Customer:</strong> ${order.customerName}</p>
                    <p style="margin:0 0 8px"><strong>Email:</strong> ${order.customerEmail}</p>
                    <p style="margin:0 0 8px"><strong>Items:</strong> ${order.items.length}</p>
                    <p style="margin:0;font-weight:700;color:${BRAND_COLOR};font-size:18px">Total: KES ${order.totalAmount.toLocaleString()}</p>
                </div>
                ${btnHtml("View in Dashboard", "https://admin.ummiesessence.com/orders")}
            `),
        });
    },
});

// ─── Internal Queries ─────────────────────────────────────────────────────────

export const getUserEmail = internalQuery({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => { return await ctx.db.get(args.userId); },
});

export const getAbandonedCartUsers = internalQuery({
    args: {},
    handler: async (ctx) => {
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000;
        const items = await ctx.db.query("cartItems")
            .filter(q => q.and(q.lt(q.field("updatedAt"), oneDayAgo), q.gt(q.field("updatedAt"), twoDaysAgo)))
            .collect();
        return Array.from(new Set(items.map(i => i.userId)));
    },
});

// ─── Cron runner ──────────────────────────────────────────────────────────────

export const runAbandonedCartRecovery = internalAction({
    args: {},
    handler: async (ctx) => {
        const userIds = await ctx.runQuery(internal.emails.getAbandonedCartUsers);
        for (const userId of userIds) {
            await ctx.runAction(internal.emails.sendAbandonedCartEmail, { userId });
        }
    },
});
