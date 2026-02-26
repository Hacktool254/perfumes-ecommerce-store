import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

/**
 * Helper to seed a normal user.
 */
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
        asUser: t.withIdentity({ subject: userId }),
        userId
    };
}

/**
 * Helper to seed an admin user.
 */
async function setupAdmin(t: any) {
    const { userId } = await t.run(async (ctx: any) => {
        const id = await ctx.db.insert("users", {
            email: "admin@ummies.co.ke",
            hashedPassword: "",
            role: "admin",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return { userId: id };
    });

    return t.withIdentity({ subject: userId });
}

describe("Orders & Stock Management", () => {
    test("placeOrder creates an order and deducts stock", async () => {
        const t = convexTest(schema);
        const { asUser, userId } = await setupUser(t);

        const { productId } = await t.run(async (ctx) => {
            const catId = await ctx.db.insert("categories", { name: "Perfume", slug: "perfume" });
            const pId = await ctx.db.insert("products", {
                name: "Oud Wood",
                slug: "oud-wood",
                description: "Woody scent",
                price: 5000,
                stock: 10,
                categoryId: catId,
                images: [],
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            // Add to user's cart
            await ctx.db.insert("cartItems", {
                userId,
                productId: pId,
                quantity: 2,
            });

            return { productId: pId };
        });

        // Place order
        const orderId = await asUser.mutation(api.orders.placeOrder, {
            shippingAddress: "123 Aroma Ave, Nairobi",
        });

        expect(orderId).toBeDefined();

        // Verify order details
        const order = await asUser.query(api.orders.get, { orderId });
        expect(order.totalAmount).toBe(10000); // 5000 * 2
        expect(order.status).toBe("pending");
        expect(order.items).toHaveLength(1);
        expect(order.items[0].quantity).toBe(2);

        // Verify stock deduction
        const product = await t.run(async (ctx) => await ctx.db.get(productId));
        expect(product.stock).toBe(8); // 10 - 2

        // Verify cart is cleared
        const cart = await t.run(async (ctx) => {
            return await ctx.db.query("cartItems").withIndex("by_user", q => q.eq("userId", userId)).collect();
        });
        expect(cart).toHaveLength(0);
    });

    test("placeOrder prevents negative stock", async () => {
        const t = convexTest(schema);
        const { asUser, userId } = await setupUser(t);

        await t.run(async (ctx) => {
            const catId = await ctx.db.insert("categories", { name: "Cat", slug: "cat" });
            const pId = await ctx.db.insert("products", {
                name: "Limited Edition",
                slug: "limited",
                description: "Only 1 left",
                price: 9000,
                stock: 1,
                categoryId: catId,
                images: [],
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            await ctx.db.insert("cartItems", {
                userId,
                productId: pId,
                quantity: 2, // Trying to buy more than available
            });
        });

        await expect(asUser.mutation(api.orders.placeOrder, {
            shippingAddress: "Address",
        })).rejects.toThrow("Insufficient stock");
    });
});

describe("Coupons", () => {
    test("admin can create and user can apply coupon", async () => {
        const t = convexTest(schema);
        const asAdmin = await setupAdmin(t);
        const { asUser, userId } = await setupUser(t, "user2@test.com");

        // 1. Admin creates a 10% percentage coupon
        await asAdmin.mutation(api.coupons.create, {
            code: "UMMIE10",
            discountType: "percentage",
            discountValue: 10,
            usageLimit: 5,
        });

        // 2. Setup order environment
        await t.run(async (ctx) => {
            const catId = await ctx.db.insert("categories", { name: "Cat", slug: "cat" });
            const pId = await ctx.db.insert("products", {
                name: "Perfume",
                slug: "perfume",
                description: "D",
                price: 1000,
                stock: 10,
                categoryId: catId,
                images: [],
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            await ctx.db.insert("cartItems", {
                userId,
                productId: pId,
                quantity: 1,
            });
        });

        // 3. User places order with coupon
        const orderId = await asUser.mutation(api.orders.placeOrder, {
            shippingAddress: "Street",
            couponCode: "ummie10", // should work with lowercase
        });

        const order = await asUser.query(api.orders.get, { orderId });
        expect(order.discountApplied).toBe(100); // 10% of 1000
        expect(order.totalAmount).toBe(900);

        // 4. Verify coupon usedCount incremented
        const coupon = await t.run(async (ctx) => {
            return await ctx.db.query("coupons").withIndex("by_code", q => q.eq("code", "UMMIE10")).unique();
        });
        expect(coupon.usedCount).toBe(1);
    });

    test("expired coupon is rejected", async () => {
        const t = convexTest(schema);
        const asAdmin = await setupAdmin(t);
        const { asUser, userId } = await setupUser(t, "user3@test.com");

        await asAdmin.mutation(api.coupons.create, {
            code: "EXPIRED",
            discountType: "fixed",
            discountValue: 500,
            expiresAt: Date.now() - 1000, // already expired
        });

        await t.run(async (ctx) => {
            const catId = await ctx.db.insert("categories", { name: "Cat", slug: "cat" });
            const pId = await ctx.db.insert("products", {
                name: "P", slug: "p", description: "D", price: 1000, stock: 5, categoryId: catId, images: [], isActive: true, createdAt: 0, updatedAt: 0
            });
            await ctx.db.insert("cartItems", { userId, productId: pId, quantity: 1 });
        });

        const orderId = await asUser.mutation(api.orders.placeOrder, {
            shippingAddress: "Street",
            couponCode: "EXPIRED",
        });

        const order = await asUser.query(api.orders.get, { orderId });
        expect(order.discountApplied).toBe(0); // Should not apply since it's expired
        expect(order.totalAmount).toBe(1000);
    });
});

describe("Admin Order Management", () => {
    test("admin can update order status", async () => {
        const t = convexTest(schema);
        const asAdmin = await setupAdmin(t);
        const { asUser, userId } = await setupUser(t);

        const orderId = await t.run(async (ctx) => {
            return await ctx.db.insert("orders", {
                userId,
                status: "pending",
                totalAmount: 500,
                shippingAddress: "Home",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        });

        await asAdmin.mutation(api.orders.updateStatus, {
            id: orderId,
            status: "paid",
        });

        const updated = await t.run(async ctx => await ctx.db.get(orderId));
        expect(updated!.status).toBe("paid");
    });
});
