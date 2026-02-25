import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        email: v.string(),
        hashedPassword: v.string(),
        role: v.union(v.literal("customer"), v.literal("admin")),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_email", ["email"]),

    products: defineTable({
        name: v.string(),
        slug: v.string(),
        description: v.string(),
        price: v.number(),
        discount: v.optional(v.number()),
        stock: v.number(),
        categoryId: v.id("categories"),
        images: v.array(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_slug", ["slug"]),

    categories: defineTable({
        name: v.string(),
        slug: v.string(),
    }).index("by_slug", ["slug"]),

    orders: defineTable({
        userId: v.id("users"),
        status: v.union(
            v.literal("pending"),
            v.literal("paid"),
            v.literal("shipped"),
            v.literal("delivered"),
            v.literal("cancelled")
        ),
        totalAmount: v.number(),
        shippingAddress: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_status", ["status"]),

    orderItems: defineTable({
        orderId: v.id("orders"),
        productId: v.id("products"),
        quantity: v.number(),
        unitPrice: v.number(),
    }),

    payments: defineTable({
        orderId: v.id("orders"),
        method: v.string(),
        mpesaReceiptNumber: v.optional(v.string()),
        status: v.string(),
        rawCallback: v.optional(v.string()),
        createdAt: v.number(),
    }).index("by_transaction_id", ["mpesaReceiptNumber"]),

    cartItems: defineTable({
        userId: v.id("users"),
        productId: v.id("products"),
        quantity: v.number(),
    }),

    wishlistItems: defineTable({
        userId: v.id("users"),
        productId: v.id("products"),
    }),

    reviews: defineTable({
        userId: v.id("users"),
        productId: v.id("products"),
        rating: v.number(),
        comment: v.string(),
        createdAt: v.number(),
    }),

    coupons: defineTable({
        code: v.string(),
        discountType: v.union(v.literal("percentage"), v.literal("fixed")),
        discountValue: v.number(),
        expiresAt: v.optional(v.number()),
        usageLimit: v.optional(v.number()),
        usedCount: v.number(),
    }).index("by_code", ["code"]),
});
