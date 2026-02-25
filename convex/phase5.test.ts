import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

/**
 * Helper to seed a normal user in both the auth system users table
 * and our custom users table.
 */
async function setupUser(t: any, email = "user@test.com") {
    const { authUserId } = await t.run(async (ctx: any) => {
        const authId = await ctx.db.insert("users", {
            email,
            hashedPassword: "",
            role: "customer",
            firstName: "Test",
            lastName: "User",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return { authUserId: authId };
    });

    return t.withIdentity({ subject: authUserId });
}

describe("Cart", () => {
    test("guest cannot access cart", async () => {
        const t = convexTest(schema);
        await expect(t.query(api.cart.get, {})).rejects.toThrow();
    });

    test("user can add, remove and clear cart", async () => {
        const t = convexTest(schema);
        const user = await setupUser(t);

        const productId = await t.run(async (ctx) => {
            const catId = await ctx.db.insert("categories", { name: "Cat", slug: "cat" });
            return await ctx.db.insert("products", {
                name: "Perfume",
                slug: "perfume",
                description: "Desc",
                price: 1000,
                stock: 10,
                categoryId: catId,
                images: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        });

        // Add item
        await user.mutation(api.cart.add, { productId, quantity: 2 });
        let cart = await user.query(api.cart.get, {});
        expect(cart).toHaveLength(1);
        expect(cart[0].quantity).toBe(2);

        // Increment existing
        await user.mutation(api.cart.add, { productId, quantity: 1 });
        cart = await user.query(api.cart.get, {});
        expect(cart[0].quantity).toBe(3);

        // Update quantity
        await user.mutation(api.cart.updateQuantity, {
            cartItemId: cart[0]._id,
            quantity: 5,
        });
        cart = await user.query(api.cart.get, {});
        expect(cart[0].quantity).toBe(5);

        // Remove item
        await user.mutation(api.cart.remove, { cartItemId: cart[0]._id });
        cart = await user.query(api.cart.get, {});
        expect(cart).toHaveLength(0);

        // Clear cart
        await user.mutation(api.cart.add, { productId, quantity: 1 });
        await user.mutation(api.cart.clear, {});
        cart = await user.query(api.cart.get, {});
        expect(cart).toHaveLength(0);
    });
});

describe("Wishlist", () => {
    test("toggle wishlist items", async () => {
        const t = convexTest(schema);
        const user = await setupUser(t);

        const productId = await t.run(async (ctx) => {
            const catId = await ctx.db.insert("categories", { name: "Cat", slug: "cat" });
            return await ctx.db.insert("products", {
                name: "Product",
                slug: "slug",
                description: "D",
                price: 500,
                stock: 5,
                categoryId: catId,
                images: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        });

        // Toggle add
        let res = await user.mutation(api.wishlist.toggle, { productId });
        expect(res.status).toBe("added");
        let wishlist = await user.query(api.wishlist.get, {});
        expect(wishlist).toHaveLength(1);

        // Toggle remove
        res = await user.mutation(api.wishlist.toggle, { productId });
        expect(res.status).toBe("removed");
        wishlist = await user.query(api.wishlist.get, {});
        expect(wishlist).toHaveLength(0);
    });
});

describe("Reviews", () => {
    test("add and get reviews", async () => {
        const t = convexTest(schema);
        const user = await setupUser(t);

        const productId = await t.run(async (ctx) => {
            const catId = await ctx.db.insert("categories", { name: "Cat", slug: "cat" });
            return await ctx.db.insert("products", {
                name: "Product",
                slug: "slug",
                description: "D",
                price: 500,
                stock: 5,
                categoryId: catId,
                images: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        });

        // Add review
        await user.mutation(api.reviews.add, {
            productId,
            rating: 5,
            comment: "Amazing!",
        });

        const reviews = await t.query(api.reviews.getByProduct, { productId });
        expect(reviews).toHaveLength(1);
        expect(reviews[0].comment).toBe("Amazing!");
        expect(reviews[0].user.email).toBe("user@test.com");

        // Guest can query reviews
        const guestReviews = await t.query(api.reviews.getByProduct, { productId });
        expect(guestReviews).toHaveLength(1);

        // Update review
        await user.mutation(api.reviews.add, {
            productId,
            rating: 4,
            comment: "Good enough",
        });
        const updated = await t.query(api.reviews.getByProduct, { productId });
        expect(updated[0].rating).toBe(4);

        // Remove review
        await user.mutation(api.reviews.remove, { reviewId: reviews[0]._id });
        const final = await t.query(api.reviews.getByProduct, { productId });
        expect(final).toHaveLength(0);
    });
});
