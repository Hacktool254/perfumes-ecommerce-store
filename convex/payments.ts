import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { requireUser } from "./users";

// Constants for Daraja API 
const DARAJA_ENVIRONMENT = process.env.NEXT_PUBLIC_CONVEX_URL?.includes("localhost")
    ? "sandbox"
    : "sandbox"; // Force sandbox for now until production is ready

const DARAJA_BASE_URL = DARAJA_ENVIRONMENT === "sandbox"
    ? "https://sandbox.safaricom.co.ke"
    : "https://api.safaricom.co.ke";

export const getOrderDetailsByEmail = internalQuery({
    args: { orderId: v.id("orders"), email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", args.email))
            .unique();

        if (!user) throw new Error("User not found");

        const order = await ctx.db.get(args.orderId);
        if (!order || order.userId !== user._id) {
            throw new Error("Order not found or unauthorized");
        }
        if (order.status !== "pending") {
            throw new Error(`Order cannot be paid. Status is ${order.status}`);
        }
        return {
            _id: order._id,
            totalAmount: order.totalAmount,
        };
    }
});

export const recordPaymentAttempt = internalMutation({
    args: {
        orderId: v.id("orders"),
        phoneNumber: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("payments", {
            orderId: args.orderId,
            method: "mpesa",
            phoneNumber: args.phoneNumber,
            status: "pending",
            createdAt: Date.now(),
        });
    }
});

export const updateCheckoutRequestId = internalMutation({
    args: {
        orderId: v.id("orders"),
        checkoutRequestId: v.string(),
    },
    handler: async (ctx, args) => {
        const paymentArray = await ctx.db
            .query("payments")
            .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
            .collect();

        // Only update the most recent one we just created
        const recentPayment = paymentArray.sort((a, b) => b.createdAt - a.createdAt)[0];
        if (recentPayment) {
            await ctx.db.patch(recentPayment._id, {
                checkoutRequestId: args.checkoutRequestId
            });
        }
    }
});

export const processSafaricomCallback = internalMutation({
    args: {
        rawBody: v.any()
    },
    handler: async (ctx, args) => {
        const payload = args.rawBody;
        if (!payload || !payload.Body || !payload.Body.stkCallback) {
            console.error("Invalid Safaricom payload:", payload);
            return { status: "ignored", reason: "Invalid payload" };
        }

        const stkCallback = payload.Body.stkCallback;
        const checkoutRequestId = stkCallback.CheckoutRequestID;
        const resultCode = stkCallback.ResultCode;

        // Find the payment
        const payment = await ctx.db
            .query("payments")
            .withIndex("by_checkout_request", (q) => q.eq("checkoutRequestId", checkoutRequestId))
            .unique();

        if (!payment) {
            console.error("Payment not found for checkoutRequestId:", checkoutRequestId);
            return { status: "ignored", reason: "Payment not found" };
        }

        // Idempotency: skip if already processed
        if (payment.status !== "pending") {
            return { status: "ignored", reason: "Payment already processed" };
        }

        // Determine success
        if (resultCode === 0) {
            // Success
            const mpesaReceiptNumber = stkCallback.CallbackMetadata?.Item?.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value;
            await ctx.db.patch(payment._id, {
                status: "success",
                mpesaReceiptNumber: mpesaReceiptNumber,
                rawCallback: JSON.stringify(payload)
            });

            // Update associated order
            await ctx.db.patch(payment.orderId, {
                status: "paid",
                updatedAt: Date.now()
            });

            // Phase 8: Send Order Confirmation Email
            await ctx.scheduler.runAfter(0, internal.emails.sendOrderConfirmation, {
                orderId: payment.orderId,
            });

            return { status: "success" };
        } else {
            // Failure
            await ctx.db.patch(payment._id, {
                status: "failed",
                rawCallback: JSON.stringify(payload)
            });

            return { status: "failed" };
        }
    }
});

/**
 * Generate an OAuth Token from Daraja
 */
async function generateDarajaToken() {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
        throw new Error("M-Pesa Consumer Key and Secret are not defined");
    }

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    const response = await fetch(`${DARAJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });

    if (!response.ok) {
        const text = await response.text();
        console.error("Daraja Token Error:", text);
        throw new Error(`Failed to generate Daraja token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token as string;
}

/**
 * Validates and formats the phone number to the required 254... format
 */
function formatPhoneNumber(phoneNumber: string): string {
    // Strip spaces, dashes, etc
    const cleaned = phoneNumber.replace(/[\s\-()]/g, "");

    if (cleaned.startsWith("07") || cleaned.startsWith("01")) {
        return `254${cleaned.substring(1)}`;
    } else if (cleaned.startsWith("+254")) {
        return cleaned.substring(1);
    } else if (cleaned.startsWith("254")) {
        return cleaned;
    }

    throw new Error("Invalid phone number format. Must start with 07, 01, 254, or +254");
}

export const initiateStkPush = action({
    args: {
        orderId: v.id("orders"),
        phoneNumber: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity || !identity.email) {
            throw new Error("Unauthorized");
        }

        const formattedPhone = formatPhoneNumber(args.phoneNumber);

        const orderDetails = await ctx.runQuery(internal.payments.getOrderDetailsByEmail, {
            orderId: args.orderId,
            email: identity.email,
        });

        const amount = Math.ceil(orderDetails.totalAmount);

        await ctx.runMutation(internal.payments.recordPaymentAttempt, {
            orderId: args.orderId,
            phoneNumber: formattedPhone,
        });

        const accessToken = await generateDarajaToken();

        const shortCode = process.env.MPESA_SHORTCODE;
        const passkey = process.env.MPESA_PASSKEY;
        const callbackUrl = process.env.MPESA_CALLBACK_URL;

        if (!shortCode || !passkey || !callbackUrl) {
            throw new Error("M-Pesa configuration is missing shortcode, passkey, or callback url");
        }

        const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");

        const payload = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: formattedPhone,
            PartyB: shortCode,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackUrl,
            AccountReference: `Order ${args.orderId}`,
            TransactionDesc: `Payment for Order ${args.orderId}`,
        };

        console.log("Sending M-Pesa STK Push:", JSON.stringify(payload, null, 2));

        const response = await fetch(`${DARAJA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const text = await response.text();
            console.error("STK Push Failed:", text);
            throw new Error(`M-Pesa STK Push Request Failed: ${response.statusText}`);
        }

        const responseData = await response.json();

        // Update the payment record with the checkout request ID
        if (responseData.CheckoutRequestID) {
            await ctx.runMutation(internal.payments.updateCheckoutRequestId, {
                orderId: args.orderId,
                checkoutRequestId: responseData.CheckoutRequestID
            });
        }

        return responseData;
    },
});
