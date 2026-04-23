import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get all products for chatbot (minimal data for quick responses).
 */
export const getProductsForChatbot = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db
            .query("products")
            .filter((q) => q.eq(q.field("isActive"), true))
            .take(100); // Get up to 100 products

        return products.map((p) => ({
            _id: p._id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            stock: p.stock,
            brand: p.brand,
            gender: p.gender,
            discount: p.discount,
            images: p.images,
        }));
    },
});

/**
 * Search products by name for chatbot autocomplete.
 */
export const searchProducts = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const products = await ctx.db
            .query("products")
            .withSearchIndex("search_by_name", (q) => {
                return q.search("name", args.query).eq("isActive", true);
            })
            .take(5);

        return products.map((p) => ({
            _id: p._id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            stock: p.stock,
            brand: p.brand,
            discount: p.discount,
            images: p.images,
        }));
    },
});

/**
 * Get a single product by name (fuzzy match for chatbot).
 */
export const getProductByName = query({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        // First try exact match
        let product = await ctx.db
            .query("products")
            .filter((q) =>
                q.and(
                    q.eq(q.field("isActive"), true),
                    q.eq(q.field("name"), args.name)
                )
            )
            .first();

        if (product) return product;

        // Try case-insensitive contains
        const allProducts = await ctx.db
            .query("products")
            .filter((q) => q.eq(q.field("isActive"), true))
            .take(100);

        const searchLower = args.name.toLowerCase();
        return allProducts.find((p) =>
            p.name.toLowerCase().includes(searchLower)
        ) || null;
    },
});

/**
 * Create an order from chatbot conversation.
 */
export const createOrderFromChat = mutation({
    args: {
        customerName: v.string(),
        customerEmail: v.string(),
        customerPhone: v.optional(v.string()),
        items: v.array(v.object({
            productId: v.id("products"),
            quantity: v.number(),
        })),
        shippingAddress: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Calculate total and validate stock
        let totalAmount = 0;
        const orderItems = [];

        for (const item of args.items) {
            const product = await ctx.db.get(item.productId);
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }

            const unitPrice = product.discount
                ? product.price * (1 - product.discount / 100)
                : product.price;

            totalAmount += unitPrice * item.quantity;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: Math.round(unitPrice),
            });
        }

        // Create order
        const orderId = await ctx.db.insert("orders", {
            customerName: args.customerName,
            customerEmail: args.customerEmail,
            customerPhone: args.customerPhone,
            status: "pending",
            totalAmount: Math.round(totalAmount),
            shippingAddress: args.shippingAddress || "",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Create order items and update stock
        for (const item of orderItems) {
            await ctx.db.insert("orderItems", {
                orderId,
                ...item,
            });

            const product = await ctx.db.get(item.productId);
            if (product) {
                await ctx.db.patch(item.productId, {
                    stock: product.stock - item.quantity,
                    updatedAt: Date.now(),
                });
            }
        }

        return { orderId, totalAmount: Math.round(totalAmount) };
    },
});
