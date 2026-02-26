import { convexTest } from "convex-test";
import { expect, test, describe, vi } from "vitest";
import { api, internal } from "./_generated/api";
import schema from "./schema";

// Helper to seed a normal user
async function setupUser(t: any, email = "customer@ummies.co.ke") {
    const { userId } = await t.run(async (ctx: any) => {
        const id = await ctx.db.insert("users", {
            email,
            hashedPassword: "",
            role: "customer",
            firstName: "Jane",
            lastName: "Doe",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return { userId: id };
    });

    return {
        asUser: t.withIdentity({ subject: userId, email }), // include email in identity
        userId
    };
}

describe("Daraja API Integration (Phase 7.1)", () => {
    test("fetch Daraja STK Push successfully", async () => {
        const t = convexTest(schema);
        const { asUser, userId } = await setupUser(t);

        // create an order
        const orderId = await t.run(async (ctx: any) => {
            return await ctx.db.insert("orders", {
                userId,
                status: "pending",
                totalAmount: 500,
                shippingAddress: "Home",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        });

        // Set env vars
        process.env.MPESA_CONSUMER_KEY = "dummy_key";
        process.env.MPESA_CONSUMER_SECRET = "dummy_secret";
        process.env.MPESA_SHORTCODE = "174379";
        process.env.MPESA_PASSKEY = "dummy_passkey";
        process.env.MPESA_CALLBACK_URL = "https://example.com/callback";

        // Mock global fetch for Daraja API
        global.fetch = vi.fn().mockImplementation(async (url: string, options: any) => {
            if (url.includes("/oauth/v1/generate")) {
                return {
                    ok: true,
                    json: async () => ({ access_token: "mocked_access_token" })
                };
            }
            if (url.includes("/mpesa/stkpush/v1/processrequest")) {
                return {
                    ok: true,
                    json: async () => ({
                        MerchantRequestID: "123",
                        CheckoutRequestID: "456",
                        ResponseCode: "0",
                        ResponseDescription: "Success",
                        CustomerMessage: "Success"
                    })
                };
            }
            return { ok: false, statusText: "Not Found" };
        });

        // Call STK push action
        const result = await asUser.action(api.payments.initiateStkPush, {
            orderId,
            phoneNumber: "0712345678"
        });

        expect(result.ResponseCode).toBe("0");

        // Verify that a pending payment record was created
        const payments = await t.run(async (ctx: any) => {
            return await ctx.db.query("payments").withIndex("by_order", (q: any) => q.eq("orderId", orderId)).collect();
        });

        expect(payments).toHaveLength(1);
        expect(payments[0].status).toBe("pending");
        expect(payments[0].method).toBe("mpesa");
        expect(payments[0].phoneNumber).toBe("254712345678");

        // Clean up mock
        vi.restoreAllMocks();
    });

    test("handle M-Pesa successful callback", async () => {
        const t = convexTest(schema);
        const { userId } = await setupUser(t);

        const orderId = await t.run(async (ctx: any) => {
            return await ctx.db.insert("orders", {
                userId,
                status: "pending",
                totalAmount: 500,
                shippingAddress: "Home",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        });

        const checkoutRequestId = "test_checkout_req_id";
        await t.run(async (ctx: any) => {
            await ctx.db.insert("payments", {
                orderId,
                method: "mpesa",
                phoneNumber: "254712345678",
                status: "pending",
                checkoutRequestId,
                createdAt: Date.now(),
            });
        });

        // Mock payload for success
        const payload = {
            Body: {
                stkCallback: {
                    CheckoutRequestID: checkoutRequestId,
                    ResultCode: 0,
                    ResultDesc: "Success",
                    CallbackMetadata: {
                        Item: [
                            { Name: "MpesaReceiptNumber", Value: "RECEIPT_123" },
                            { Name: "Amount", Value: 500 }
                        ]
                    }
                }
            }
        };

        // Call internal mutation
        await t.mutation(internal.payments.processSafaricomCallback, { rawBody: payload });

        // Verify payment status
        const payment = await t.run(async (ctx: any) => {
            return await ctx.db
                .query("payments")
                .withIndex("by_checkout_request", (q: any) => q.eq("checkoutRequestId", checkoutRequestId))
                .unique();
        });
        expect(payment.status).toBe("success");
        expect(payment.mpesaReceiptNumber).toBe("RECEIPT_123");

        // Verify order status
        const order = await t.run(async (ctx: any) => {
            return await ctx.db.get(orderId);
        });
        expect(order.status).toBe("paid");
    });

    test("handle M-Pesa failed callback", async () => {
        const t = convexTest(schema);
        const { userId } = await setupUser(t);

        const orderId = await t.run(async (ctx: any) => {
            return await ctx.db.insert("orders", {
                userId,
                status: "pending",
                totalAmount: 500,
                shippingAddress: "Home",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        });

        const checkoutRequestId = "test_checkout_req_id_fail";
        await t.run(async (ctx: any) => {
            await ctx.db.insert("payments", {
                orderId,
                method: "mpesa",
                phoneNumber: "254712345678",
                status: "pending",
                checkoutRequestId,
                createdAt: Date.now(),
            });
        });

        // Mock payload for failure (ResultCode 1032 = Cancelled by User)
        const payload = {
            Body: {
                stkCallback: {
                    CheckoutRequestID: checkoutRequestId,
                    ResultCode: 1032,
                    ResultDesc: "Request cancelled by user"
                }
            }
        };

        // Call internal mutation
        await t.mutation(internal.payments.processSafaricomCallback, { rawBody: payload });

        // Verify payment status
        const payment = await t.run(async (ctx: any) => {
            return await ctx.db
                .query("payments")
                .withIndex("by_checkout_request", (q: any) => q.eq("checkoutRequestId", checkoutRequestId))
                .unique();
        });
        expect(payment.status).toBe("failed");

        // Verify order status remains pending
        const order = await t.run(async (ctx: any) => {
            return await ctx.db.get(orderId);
        });
        expect(order.status).toBe("pending");
    });
});
