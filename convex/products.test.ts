import { convexTest } from "convex-test";
import { expect, test, describe } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

/**
 * Helper to seed an admin user in both the auth system users table
 * and our custom users table, then return a withIdentity handle.
 */
async function setupAdmin(t: any) {
    const { authUserId } = await t.run(async (ctx: any) => {
        // Insert into the auth system "users" table (from authTables)
        // This is the table getAuthUserId looks up
        const authId = await ctx.db.insert("users", {
            email: "admin@ummiesessence.co.ke",
            hashedPassword: "",
            role: "admin",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return { authUserId: authId };
    });

    // withIdentity's `subject` is what getAuthUserId returns
    return t.withIdentity({ subject: authUserId });
}

// ─── Product Tests ───────────────────────────────────────────────────────

describe("Products", () => {
    test("list returns empty when no products exist", async () => {
        const t = convexTest(schema);

        const result = await t.query(api.products.list, {
            paginationOpts: { numItems: 10, cursor: null },
        });

        expect(result.page).toEqual([]);
        expect(result.isDone).toBe(true);
    });

    test("getBySlug returns null for non-existent slug", async () => {
        const t = convexTest(schema);

        const product = await t.query(api.products.getBySlug, {
            slug: "non-existent-perfume",
        });

        expect(product).toBeNull();
    });

    test("create product fails without admin auth", async () => {
        const t = convexTest(schema);

        const categoryId = await t.run(async (ctx: any) => {
            return await ctx.db.insert("categories", {
                name: "Fragrances",
                slug: "fragrances",
            });
        });

        await expect(
            t.mutation(api.products.create, {
                name: "Oud Essence",
                slug: "oud-essence",
                description: "A luxury oud fragrance",
                price: 4500,
                stock: 50,
                categoryId,
                images: [],
            })
        ).rejects.toThrow();
    });

    test("admin can create and retrieve a product", async () => {
        const t = convexTest(schema);

        const categoryId = await t.run(async (ctx: any) => {
            return await ctx.db.insert("categories", {
                name: "Fragrances",
                slug: "fragrances",
            });
        });

        const asAdmin = await setupAdmin(t);

        const productId = await asAdmin.mutation(api.products.create, {
            name: "Oud Essence",
            slug: "oud-essence",
            description: "A luxury oud fragrance",
            price: 4500,
            stock: 50,
            categoryId,
            images: [],
            brand: "Ummie's",
            gender: "unisex",
        });

        expect(productId).toBeDefined();

        const product = await t.query(api.products.getBySlug, {
            slug: "oud-essence",
        });

        expect(product).not.toBeNull();
        expect(product!.name).toBe("Oud Essence");
        expect(product!.price).toBe(4500);
        expect(product!.brand).toBe("Ummie's");
    });

    test("admin can update a product", async () => {
        const t = convexTest(schema);

        const { categoryId, productId } = await t.run(async (ctx: any) => {
            const catId = await ctx.db.insert("categories", {
                name: "Body Care",
                slug: "body-care",
            });

            const pId = await ctx.db.insert("products", {
                name: "Old Name",
                slug: "old-slug",
                description: "Original description",
                price: 1000,
                stock: 10,
                categoryId: catId,
                images: [],
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            return { categoryId: catId, productId: pId };
        });

        const asAdmin = await setupAdmin(t);

        await asAdmin.mutation(api.products.update, {
            id: productId,
            name: "Updated Name",
            price: 2000,
        });

        const updated = await t.run(async (ctx: any) => {
            return await ctx.db.get(productId);
        });

        expect(updated!.name).toBe("Updated Name");
        expect(updated!.price).toBe(2000);
        expect(updated!.slug).toBe("old-slug");
    });

    test("admin can soft-delete a product", async () => {
        const t = convexTest(schema);

        const { productId } = await t.run(async (ctx: any) => {
            const catId = await ctx.db.insert("categories", {
                name: "Skincare",
                slug: "skincare",
            });

            const pId = await ctx.db.insert("products", {
                name: "Face Serum",
                slug: "face-serum",
                description: "Hydrating serum",
                price: 3000,
                stock: 25,
                categoryId: catId,
                images: [],
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            return { productId: pId };
        });

        const asAdmin = await setupAdmin(t);

        await asAdmin.mutation(api.products.softDelete, { id: productId });

        const deleted = await t.run(async (ctx: any) => {
            return await ctx.db.get(productId);
        });

        expect(deleted!.isActive).toBe(false);
    });

    test("soft-deleted products are excluded from list", async () => {
        const t = convexTest(schema);

        await t.run(async (ctx: any) => {
            const catId = await ctx.db.insert("categories", {
                name: "Fragrances",
                slug: "fragrances",
            });

            // Active product
            await ctx.db.insert("products", {
                name: "Active Perfume",
                slug: "active-perfume",
                description: "Available",
                price: 2000,
                stock: 10,
                categoryId: catId,
                images: [],
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            // Soft-deleted product
            await ctx.db.insert("products", {
                name: "Deleted Perfume",
                slug: "deleted-perfume",
                description: "Removed",
                price: 1000,
                stock: 0,
                categoryId: catId,
                images: [],
                isActive: false,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        });

        const result = await t.query(api.products.list, {
            paginationOpts: { numItems: 10, cursor: null },
        });

        expect(result.page).toHaveLength(1);
        expect(result.page[0].name).toBe("Active Perfume");
    });

    test("duplicate slug is rejected on create", async () => {
        const t = convexTest(schema);

        const categoryId = await t.run(async (ctx: any) => {
            const catId = await ctx.db.insert("categories", {
                name: "Fragrances",
                slug: "fragrances",
            });

            await ctx.db.insert("products", {
                name: "Existing Product",
                slug: "my-perfume",
                description: "Already exists",
                price: 1000,
                stock: 5,
                categoryId: catId,
                images: [],
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            return catId;
        });

        const asAdmin = await setupAdmin(t);

        await expect(
            asAdmin.mutation(api.products.create, {
                name: "Another Product",
                slug: "my-perfume",
                description: "Should fail",
                price: 2000,
                stock: 10,
                categoryId,
                images: [],
            })
        ).rejects.toThrow("slug already exists");
    });
});

// ─── Category Tests ──────────────────────────────────────────────────────

describe("Categories", () => {
    test("list returns all categories", async () => {
        const t = convexTest(schema);

        await t.run(async (ctx: any) => {
            await ctx.db.insert("categories", { name: "Fragrances", slug: "fragrances" });
            await ctx.db.insert("categories", { name: "Body Care", slug: "body-care" });
        });

        const categories = await t.query(api.categories.list, {});
        expect(categories).toHaveLength(2);
    });

    test("getBySlug returns the correct category", async () => {
        const t = convexTest(schema);

        await t.run(async (ctx: any) => {
            await ctx.db.insert("categories", { name: "Skincare", slug: "skincare" });
        });

        const category = await t.query(api.categories.getBySlug, { slug: "skincare" });

        expect(category).not.toBeNull();
        expect(category!.name).toBe("Skincare");
    });

    test("create category fails without admin", async () => {
        const t = convexTest(schema);

        await expect(
            t.mutation(api.categories.create, {
                name: "Test",
                slug: "test",
            })
        ).rejects.toThrow();
    });

    test("cannot delete category with linked products", async () => {
        const t = convexTest(schema);

        const categoryId = await t.run(async (ctx: any) => {
            const catId = await ctx.db.insert("categories", {
                name: "Fragrances",
                slug: "fragrances",
            });

            await ctx.db.insert("products", {
                name: "Linked Product",
                slug: "linked-product",
                description: "Has a category",
                price: 500,
                stock: 5,
                categoryId: catId,
                images: [],
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            return catId;
        });

        const asAdmin = await setupAdmin(t);

        await expect(
            asAdmin.mutation(api.categories.remove, { id: categoryId })
        ).rejects.toThrow("products linked");
    });
});
