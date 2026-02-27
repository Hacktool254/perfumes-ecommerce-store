import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
    ...authTables,

    // ─── Users ───────────────────────────────────────────────────────────────────
    users: defineTable({
        email: v.string(),
        hashedPassword: v.string(),
        role: v.union(v.literal("customer"), v.literal("admin")),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        phone: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    }).index("by_email", ["email"]),

    // ─── Categories ──────────────────────────────────────────────────────────────
    categories: defineTable({
        name: v.string(),
        slug: v.string(),
        imageUrl: v.optional(v.string()),
    }).index("by_slug", ["slug"]),

    // ─── Products ────────────────────────────────────────────────────────────────
    products: defineTable({
        name: v.string(),
        slug: v.string(),
        description: v.string(),
        price: v.number(), // stored in KES (whole number, e.g. 4500)
        discount: v.optional(v.number()), // percentage e.g. 10 = 10%
        stock: v.number(),
        categoryId: v.id("categories"),
        images: v.array(v.string()), // array of URLs / Convex storage IDs
        brand: v.optional(v.string()),
        gender: v.optional(
            v.union(
                v.literal("men"),
                v.literal("women"),
                v.literal("unisex")
            )
        ),
        isActive: v.optional(v.boolean()), // soft delete flag
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_slug", ["slug"])
        .index("by_category", ["categoryId"])
        .index("by_brand", ["brand"])
        .index("by_gender", ["gender"])
        .searchIndex("search_by_name", {
            searchField: "name",
            filterFields: ["isActive", "categoryId", "gender", "brand"],
        }),

    // ─── Orders ──────────────────────────────────────────────────────────────────
    orders: defineTable({
        userId: v.optional(v.id("users")),
        customerEmail: v.string(),
        customerName: v.string(),
        customerPhone: v.optional(v.string()),
        status: v.union(
            v.literal("pending"),
            v.literal("paid"),
            v.literal("shipped"),
            v.literal("delivered"),
            v.literal("cancelled")
        ),
        totalAmount: v.number(), // KES
        shippingAddress: v.string(),
        couponId: v.optional(v.id("coupons")),
        discountApplied: v.optional(v.number()), // KES amount deducted
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_status", ["status"])
        .index("by_user_status", ["userId", "status"])
        .index("by_email", ["customerEmail"]),

    // ─── Order Items ─────────────────────────────────────────────────────────────
    orderItems: defineTable({
        orderId: v.id("orders"),
        productId: v.id("products"),
        quantity: v.number(),
        unitPrice: v.number(), // price at time of purchase
    })
        .index("by_order", ["orderId"])
        .index("by_product", ["productId"]),

    // ─── Payments ────────────────────────────────────────────────────────────────
    payments: defineTable({
        orderId: v.id("orders"),
        method: v.union(v.literal("mpesa"), v.literal("card"), v.literal("cash")),
        mpesaReceiptNumber: v.optional(v.string()), // Returned ONLY on success
        checkoutRequestId: v.optional(v.string()), // Sent by Safaricom in the callback
        phoneNumber: v.optional(v.string()), // M-Pesa number used
        status: v.union(
            v.literal("pending"),
            v.literal("success"),
            v.literal("failed"),
            v.literal("timeout")
        ),
        rawCallback: v.optional(v.string()), // JSON string of Safaricom callback
        createdAt: v.number(),
    })
        .index("by_order", ["orderId"])
        .index("by_receipt", ["mpesaReceiptNumber"])
        .index("by_checkout_request", ["checkoutRequestId"]),

    // ─── Cart Items ──────────────────────────────────────────────────────────────
    cartItems: defineTable({
        userId: v.id("users"),
        productId: v.id("products"),
        quantity: v.number(),
        updatedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_product", ["userId", "productId"]),

    // ─── Wishlist Items ──────────────────────────────────────────────────────────
    wishlistItems: defineTable({
        userId: v.id("users"),
        productId: v.id("products"),
    })
        .index("by_user", ["userId"])
        .index("by_user_product", ["userId", "productId"]),

    // ─── Reviews ─────────────────────────────────────────────────────────────────
    reviews: defineTable({
        userId: v.id("users"),
        productId: v.id("products"),
        rating: v.number(), // 1–5
        comment: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_product", ["productId"])
        .index("by_user", ["userId"])
        .index("by_user_product", ["userId", "productId"]),

    // ─── Coupons ─────────────────────────────────────────────────────────────────
    coupons: defineTable({
        code: v.string(),
        discountType: v.union(v.literal("percentage"), v.literal("fixed")),
        discountValue: v.number(),
        minOrderAmount: v.optional(v.number()),
        expiresAt: v.optional(v.number()),
        usageLimit: v.optional(v.number()),
        usedCount: v.number(),
        isActive: v.optional(v.boolean()),
    }).index("by_code", ["code"]),
});
