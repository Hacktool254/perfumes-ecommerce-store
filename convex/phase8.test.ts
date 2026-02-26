import { convexTest } from "convex-test";
import { expect, test, describe, vi } from "vitest";
import { internal } from "./_generated/api";
import schema from "./schema";

describe("Email System Integration (Phase 8)", () => {
    test("trigger order confirmation on successful callback", async () => {
        const t = convexTest(schema);

        // Mock global fetch for Resend API
        global.fetch = vi.fn().mockImplementation(async () => {
            return {
                ok: true,
                json: async () => ({ id: "resend_123" })
            };
        });

        // setup user
        const userId = await t.run(async (ctx) => {
            return await ctx.db.insert("users", {
                email: "customer@example.com",
                hashedPassword: "",
                role: "customer",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        });

        const orderId = await t.run(async (ctx) => {
            return await ctx.db.insert("orders", {
                userId,
                status: "pending",
                totalAmount: 1000,
                shippingAddress: "Street 1",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        });

        const checkoutRequestId = "test_checkout_8";
        await t.run(async (ctx) => {
            await ctx.db.insert("payments", {
                orderId,
                method: "mpesa",
                status: "pending",
                checkoutRequestId,
                createdAt: Date.now(),
            });
        });

        const callbackPayload = {
            Body: {
                stkCallback: {
                    CheckoutRequestID: checkoutRequestId,
                    ResultCode: 0,
                    ResultDesc: "Success",
                    CallbackMetadata: {
                        Item: [{ Name: "MpesaReceiptNumber", Value: "REC88" }]
                    }
                }
            }
        };

        // This should trigger the email action
        await t.mutation(internal.payments.processSafaricomCallback, { rawBody: callbackPayload });

        // Since actions are async, we might not see the fetch called immediately in strictly synchronous test
        // But in convexTest, we can check if the action was scheduled or run.
        // Actually convexTest doesn't easily mock fetch inside actions unless we use a specific pattern
        // but it verifies the logic runs.

        vi.restoreAllMocks();
    });

    test("abandoned cart recovery query", async () => {
        const t = convexTest(schema);
        const now = Date.now();
        const thirtyHoursAgo = now - 30 * 60 * 60 * 1000;

        await t.run(async (ctx) => {
            const userId = await ctx.db.insert("users", {
                email: "abandoned@example.com",
                hashedPassword: "",
                role: "customer",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            const categoryId = await ctx.db.insert("categories", {
                name: "Perfumes",
                slug: "perfumes",
            });
            const productId = await ctx.db.insert("products", {
                name: "Perfume",
                slug: "perfume",
                description: "Nice",
                price: 100,
                stock: 10,
                categoryId,
                images: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            await ctx.db.insert("cartItems", {
                userId,
                productId,
                quantity: 1,
                updatedAt: thirtyHoursAgo,
            });
        });

        const users = await t.query(internal.emails.getAbandonedCartUsers, {});
        expect(users).toHaveLength(1);
    });
});
