import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
    ...authTables,

    // ─── Users ───────────────────────────────────────────────────────────────────
    // We extend the auth library's users table with our custom fields.
    // IMPORTANT: We must keep the fields AND indexes from authTables.users
    // (name, image, email, emailVerificationTime, phone, phoneVerificationTime, isAnonymous)
    users: defineTable({
        // --- Fields required by @convex-dev/auth ---
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        email: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
        role: v.optional(v.string()),
        createdAt: v.optional(v.number()),
        updatedAt: v.optional(v.number()),
    })
        // Auth library's required indexes (must keep these exact names)
        .index("email", ["email"])
        .index("phone", ["phone"]),

    // ─── User Profiles (Spoke 1) ─────────────────────────────────────────────────
    userProfiles: defineTable({
        userId: v.id("users"),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        hashedPassword: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_user", ["userId"]),

    // ─── Admin Profiles (Spoke 2) ────────────────────────────────────────────────
    adminProfiles: defineTable({
        userId: v.id("users"),
        username: v.string(),
        email: v.string(),
        firstName: v.optional(v.string()),
        lastName: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_username", ["username"])
        .index("by_email", ["email"]),

    // ─── Addresses ──────────────────────────────────────────────────────────────
    userAddresses: defineTable({
        userId: v.id("users"),
        fullName: v.string(),
        phone: v.string(),
        street: v.string(),
        apartment: v.optional(v.string()),
        city: v.string(),
        state: v.optional(v.string()), // or County in Kenya
        postalCode: v.optional(v.string()),
        country: v.string(),
        isDefault: v.boolean(),
        updatedAt: v.number(),
    }).index("by_user", ["userId"]),

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
        longevity: v.optional(v.string()),
        sillage: v.optional(v.string()),
        size: v.optional(v.string()),
        notes: v.optional(v.string()),
        isActive: v.optional(v.boolean()), // soft delete flag
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_slug", ["slug"])
        .index("by_category", ["categoryId"])
        .index("by_brand", ["brand"])
        .index("by_gender", ["gender"])
        .index("by_createdAt", ["createdAt"])
        .index("by_category_createdAt", ["categoryId", "createdAt"])
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
        updatedAt: v.number(),
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
        updatedAt: v.number(),
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

    // Sessions table for custom auth
    sessions: defineTable({
        token: v.string(),
        userId: v.id("users"),
        expiresAt: v.number(),
        createdAt: v.number(),
    })
        .index("by_token", ["token"])
        .index("by_user", ["userId"]),

    // ─── User Preferences ──────────────────────────────────────────────────────
    userPreferences: defineTable({
        userId: v.id("users"),
        marketingCategories: v.array(v.string()), // ['women', 'men', 'kids', 'beauty', etc.]
        orderNotifications: v.boolean(),
        promotions: v.boolean(),
        adminOrderAlerts: v.optional(v.boolean()),
        adminDeliveryAlerts: v.optional(v.boolean()),
        adminStockAlerts: v.optional(v.boolean()),
        updatedAt: v.number(),
    }).index("by_user", ["userId"]),

    siteSettings: defineTable({
        resendApiKey: v.optional(v.string()),
        whatsappApiKey: v.optional(v.string()),
        chatbotApiKey: v.optional(v.string()),
        updatedAt: v.number(),
    }),

    // ─── User Searches ─────────────────────────────────────────────────────────
    userSearches: defineTable({
        userId: v.id("users"),
        query: v.string(),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_user_createdAt", ["userId", "createdAt"]),

    // ─── Chatbot Conversations ─────────────────────────────────────────────────
    chatbotConversations: defineTable({
        sessionId: v.string(),
        userMessage: v.string(),
        botResponse: v.string(),
        hasProductQuery: v.boolean(),
        timestamp: v.number(),
    })
        .index("by_session", ["sessionId"])
        .index("by_timestamp", ["timestamp"]),

    // ─── Password Reset Tokens ──────────────────────────────────────────────────
    passwordResetTokens: defineTable({
        email: v.string(),
        token: v.string(),
        expiresAt: v.number(),
        used: v.boolean(),
        createdAt: v.number(),
    })
        .index("by_token", ["token"])
        .index("by_email", ["email"]),
});
