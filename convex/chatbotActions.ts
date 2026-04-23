import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

/**
 * Chatbot action that handles user messages.
 * - Uses Google AI Studio (Gemini) for natural responses
 * - Returns structured JSON with product data + optional actions
 * - Can be extended to WhatsApp / n8n integration
 */
interface ChatbotProduct {
    _id: string;
    name: string;
    price: number;
    description?: string;
    brand?: string;
    category?: string;
    stock?: number;
    discount?: number;
    image?: string;
    slug?: string;
    images?: string[];
}

interface ChatAction {
    type: "add_to_cart" | "view_product" | "navigate";
    productName?: string;
    productId?: string;
    productSlug?: string;
}

interface StructuredResponse {
    response: string;
    sessionId: string;
    productData: any;
    action?: ChatAction;
    suggestedProducts?: ChatbotProduct[];
}

export const sendMessage = action({
    args: {
        message: v.string(),
        sessionId: v.optional(v.string()),
        userEmail: v.optional(v.string()),
        userName: v.optional(v.string()),
        history: v.optional(v.array(v.object({
            role: v.string(),
            content: v.string(),
        }))),
    },
    handler: async (ctx, args): Promise<StructuredResponse> => {
        const { message } = args;

        // Generate session ID if not provided
        const sessionId = args.sessionId || `session_${Date.now()}`;

        // Detect intent from message
        const intent = detectIntent(message);

        let productData = null;
        let suggestedProducts: ChatbotProduct[] = [];

        // If it's a product-related intent, fetch relevant products
        if (intent.isProductQuery) {
            try {
                productData = await ctx.runQuery(api.chatbot.searchProducts, {
                    query: message.length > 50 ? message.substring(0, 50) : message,
                });

                // Fallback: search full catalog in memory
                if (!productData || productData.length === 0) {
                    const catalog = (await ctx.runQuery(api.chatbot.getProductsForChatbot)) as ChatbotProduct[];
                    const keywords = message.toLowerCase().split(" ").filter(w => w.length > 3);
                    productData = catalog.filter((p: ChatbotProduct) =>
                        keywords.some(k => p.name.toLowerCase().includes(k))
                    ).slice(0, 5);
                }

                // Map to suggestedProducts format for frontend
                if (productData && Array.isArray(productData) && productData.length > 0) {
                    suggestedProducts = productData.map((p: ChatbotProduct) => ({
                        _id: p._id,
                        name: p.name,
                        price: p.price,
                        stock: p.stock || 0,
                        brand: p.brand,
                        discount: p.discount,
                        slug: p.slug,
                    }));
                }

                console.log(`Chatbot found ${suggestedProducts.length} products for intent "${intent.type}": "${message}"`);
            } catch (error) {
                console.error("Product database search failed:", error);
            }
        }

        // Get AI response from Google AI Studio
        let aiResponse: string;
        try {
            aiResponse = await getGoogleAIResponse(
                message,
                productData,
                args.history || [],
                intent
            );
        } catch (error) {
            console.error("Google AI failed:", error);
            aiResponse = getFallbackResponse(message, productData, intent);
        }

        // Parse any action from the AI response
        const parsedAction = parseActionFromResponse(aiResponse, intent, suggestedProducts);

        // Clean the AI response (strip JSON blocks that were meant for the system)
        const cleanResponse = cleanAIResponse(aiResponse);

        // Log conversation for analytics
        ctx.runMutation(internal.chatbotActions.logConversation, {
            sessionId,
            userMessage: message,
            botResponse: cleanResponse,
            hasProductQuery: intent.isProductQuery,
            intent: intent.type,
            timestamp: Date.now(),
        }).catch(console.error);

        return {
            response: cleanResponse,
            sessionId,
            productData,
            action: parsedAction || undefined,
            suggestedProducts: suggestedProducts.length > 0 ? suggestedProducts : undefined,
        };
    },
});

/**
 * Log conversation to database
 */
export const logConversation = internalMutation({
    args: {
        sessionId: v.string(),
        userMessage: v.string(),
        botResponse: v.string(),
        hasProductQuery: v.boolean(),
        intent: v.optional(v.string()),
        timestamp: v.number(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("chatbotConversations", {
            sessionId: args.sessionId,
            userMessage: args.userMessage,
            botResponse: args.botResponse,
            hasProductQuery: args.hasProductQuery,
            timestamp: args.timestamp,
        });
    },
});

// ─── Intent Detection ─────────────────────────────────────────────────────────

interface Intent {
    type: "product_search" | "price_check" | "availability_check" | "add_to_cart" | "recommendation" | "delivery" | "payment" | "greeting" | "general_question";
    isProductQuery: boolean;
    extractedProductName?: string;
}

function detectIntent(message: string): Intent {
    const lower = message.toLowerCase().trim();

    // Add to cart intent
    if (/\b(add|put|place|throw)\b.*\b(cart|basket|bag)\b/i.test(lower) || /\b(buy|order|purchase|get me|i want|i need)\b/i.test(lower)) {
        const productName = extractProductName(lower);
        return {
            type: "add_to_cart",
            isProductQuery: true,
            extractedProductName: productName,
        };
    }

    // Price check
    if (/\b(price|cost|how much|bei|charge|worth)\b/i.test(lower)) {
        return { type: "price_check", isProductQuery: true, extractedProductName: extractProductName(lower) };
    }

    // Availability check
    if (/\b(stock|available|in stock|do you have|got any|have you got)\b/i.test(lower)) {
        return { type: "availability_check", isProductQuery: true, extractedProductName: extractProductName(lower) };
    }

    // Product search (general)
    const productKeywords = [
        "perfume", "fragrance", "scent", "cologne", "oud", "musky",
        "floral", "vanilla", "fresh", "men's", "women's", "unisex",
        "show", "find", "search", "looking for", "list",
        // Known product names
        "khamrah", "yara", "9pm", "asad", "fakhar", "lattafa",
        "alhambra", "maison", "amber", "baccarat", "rouge",
    ];
    if (productKeywords.some(k => lower.includes(k))) {
        return { type: "product_search", isProductQuery: true, extractedProductName: extractProductName(lower) };
    }

    // Recommendation
    if (/\b(recommend|suggest|best|popular|top|favourite|favorite|best seller)\b/i.test(lower)) {
        return { type: "recommendation", isProductQuery: true };
    }

    // Delivery
    if (/\b(deliver|shipping|ship|dispatch|arrival|when|tracking)\b/i.test(lower)) {
        return { type: "delivery", isProductQuery: false };
    }

    // Payment
    if (/\b(pay|payment|mpesa|m-pesa|cash|card|bank)\b/i.test(lower)) {
        return { type: "payment", isProductQuery: false };
    }

    // Greeting
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|sup|yo|habari|sasa|niaje)\b/i.test(lower)) {
        return { type: "greeting", isProductQuery: false };
    }

    return { type: "general_question", isProductQuery: false };
}

/**
 * Try to extract a product name from the user's message
 */
function extractProductName(message: string): string | undefined {
    // Remove common intent words to isolate the product name
    const cleaned = message
        .replace(/\b(add|put|buy|order|get|purchase|show|find|price|cost|how much|is|the|of|to|cart|basket|bag|me|i want|i need|do you have|in stock|available)\b/gi, "")
        .replace(/[?!.,]/g, "")
        .trim();

    if (cleaned.length > 1) {
        return cleaned;
    }
    return undefined;
}

// ─── Action Parsing ───────────────────────────────────────────────────────────

function parseActionFromResponse(
    aiResponse: string,
    intent: Intent,
    products: ChatbotProduct[]
): ChatAction | null {
    // Try to extract JSON action block from AI response
    const jsonMatch = aiResponse.match(/```json\s*({[\s\S]*?})\s*```/);
    if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[1]);
            if (parsed.action) {
                return {
                    type: parsed.action,
                    productName: parsed.productName,
                    productId: parsed.productId,
                };
            }
        } catch {
            // Ignore parse errors
        }
    }

    // If intent is add_to_cart and we found products, create action
    if (intent.type === "add_to_cart" && products.length > 0) {
        const targetProduct = intent.extractedProductName
            ? products.find(p =>
                  p.name.toLowerCase().includes(intent.extractedProductName!.toLowerCase())
              ) || products[0]
            : products[0];

        return {
            type: "add_to_cart",
            productName: targetProduct.name,
            productId: targetProduct._id,
            productSlug: targetProduct.slug,
        };
    }

    return null;
}

/**
 * Strip JSON code blocks from the AI response (they're for the system, not the user)
 */
function cleanAIResponse(response: string): string {
    return response
        .replace(/```json\s*{[\s\S]*?}\s*```/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

// ─── Google AI Integration ────────────────────────────────────────────────────

async function getGoogleAIResponse(
    message: string,
    productData: any,
    history: { role: string; content: string }[],
    intent: Intent
): Promise<string> {
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey || apiKey === "your_google_ai_studio_key_here") {
        return getFallbackResponse(message, productData, intent);
    }

    const systemPrompt = buildSystemPrompt(productData, intent);

    const contents = [
        {
            role: "user",
            parts: [{ text: systemPrompt }],
        },
        {
            role: "model",
            parts: [{ text: "Understood. I'm ready to assist as Ummie, the fragrance expert." }],
        },
    ];

    // Add conversation history (last 6 messages)
    for (const msg of history.slice(-6)) {
        contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        });
    }

    // Add current message
    contents.push({
        role: "user",
        parts: [{ text: message }],
    });

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 500,
                },
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                ],
            }),
        }
    );

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Google AI API error: ${error}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text;
    }

    throw new Error("Invalid response from Google AI");
}

// ─── System Prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(productData: any, intent: Intent): string {
    return `You are "Ummie", a professional and friendly customer service expert for Ummie's Essence, Kenya's leading destination for premium perfumes (Lattafa, Maison Alhambra, etc.) and cosmetics.

Your personality:
- Warm, sophisticated, and expert in fragrances
- Helpful and solution-oriented
- Uses emojis naturally but not excessively (💎, ✨, 🌸, 🚚, 💳)
- Professional yet approachable
- Responds concisely (2-4 sentences for simple queries, up to 6 for complex ones)

Store Details:
- Location: Nairobi, Kenya
- Best Sellers: Yara, Khamrah, Asad, Fakhar
- Payment: M-Pesa (STK Push) is preferred
- Delivery: Same-day in Nairobi, 1-2 days across Kenya
- Pricing: All prices are in KES (Kenyan Shillings)

Current User Intent: ${intent.type}

Instructions:
1. **Product Knowledge**: Use the product data below to answer accurately. If a product is listed, quote its ACTUAL price and stock status.
2. **Prices**: All prices include VAT. Mention current discounts when applicable.
3. **Stock**: If stock is below 5, create urgency ("Only X left — grab it before it's gone!").
4. **Cart Actions**: When a user wants to add a product to cart, confirm cheerfully and include a JSON block at the END of your response: \`\`\`json\n{"action":"add_to_cart","productName":"<name>","productId":"<id>"}\n\`\`\`
5. **Product Links**: When discussing a specific product, suggest they can "view it in our shop" at /shop/<product-slug>.
6. **Uncertainty**: If you don't have data for a specific product, say: "Let me check with our team on that! In the meantime, browse our shop for our full collection 🛍️"
7. **No fabrication**: Never invent prices or stock numbers. Only use what's in the product data below.

Product Catalog Data (real-time from our database):
${productData ? JSON.stringify(productData, null, 2) : "No specific products found for this query. Offer to help find something from our Men's, Women's, or Unisex collections."}`;
}

// ─── Fallback Responses ───────────────────────────────────────────────────────

function getFallbackResponse(message: string, productData: any, intent: Intent): string {
    // If we have product data, use it
    if (productData && Array.isArray(productData) && productData.length > 0) {
        const product = productData[0];

        switch (intent.type) {
            case "price_check": {
                const price = product.discount
                    ? Math.round(product.price * (1 - product.discount / 100))
                    : product.price;
                if (product.discount) {
                    return `💎 ${product.name} is currently on sale!\n\nOriginal: KES ${product.price.toLocaleString()}\n✨ Sale Price: KES ${price.toLocaleString()} (${product.discount}% off!)\n\nWould you like to add it to your cart?`;
                }
                return `💎 ${product.name} is priced at KES ${price.toLocaleString()}\n\nWould you like to add it to your cart?`;
            }

            case "availability_check": {
                if (product.stock > 10) {
                    return `✅ Yes! ${product.name} is in stock and ready to ship!\n\nPrice: KES ${product.price.toLocaleString()}\n\nWant to add it to your cart?`;
                } else if (product.stock > 0) {
                    return `⚡ ${product.name} is in stock but running low — only ${product.stock} left!\n\nI'd recommend grabbing it before it's gone!`;
                }
                return `😔 Sorry, ${product.name} is currently out of stock. Would you like me to suggest similar fragrances?`;
            }

            case "add_to_cart": {
                if (product.stock > 0) {
                    return `🛒 Adding ${product.name} to your cart!\n\nPrice: KES ${product.price.toLocaleString()}\nStatus: ✅ In Stock\n\nYou can checkout anytime with M-Pesa! 💳`;
                }
                return `😔 Sorry, ${product.name} is currently out of stock and can't be added to cart. Would you like to see similar options?`;
            }

            case "product_search": {
                const productList = productData.slice(0, 3).map((p: ChatbotProduct) => {
                    const price = p.discount
                        ? Math.round(p.price * (1 - p.discount / 100))
                        : p.price;
                    return `• ${p.name} — KES ${price.toLocaleString()} ${p.stock && p.stock > 0 ? "✅" : "❌"}`;
                }).join("\n");
                return `Here's what I found:\n\n${productList}\n\nWant details on any of these? Or I can add one to your cart! 🛒`;
            }

            default:
                break;
        }
    }

    // General fallback responses
    switch (intent.type) {
        case "greeting":
            return "Hello there! 👋 Welcome to Ummie's Essence! I'm here to help you find the perfect fragrance. What are you looking for today?";

        case "delivery":
            return "🚚 We deliver throughout Kenya!\n\n• Nairobi: Same-day or next-day delivery\n• Other areas: 2-3 business days\n• Shipping costs calculated at checkout\n\nWould you like to know about a specific location?";

        case "payment":
            return "💳 We accept:\n\n• M-Pesa (Primary — STK Push, fast & secure)\n• Cash on delivery (select Nairobi areas)\n• Bank transfer (on request)\n\nM-Pesa is our fastest option!";

        case "recommendation":
            return "I'd love to help you find the perfect scent! 🌸\n\nTell me:\n• What type of fragrances do you like? (oud, floral, musky, fresh)\n• Daily wear or special occasions?\n• Strong or subtle?\n\nOr check our best sellers: Yara, Khamrah, Asad! 💎";

        case "price_check":
        case "availability_check":
        case "product_search":
            return "I'd be happy to help! Could you tell me the specific product you're looking for? For example: 'What's the price of Yara?' or 'Is Khamrah in stock?'";

        default:
            return "Thank you for your message! I'm here to help with:\n\n🧴 Product info & pricing\n🛒 Adding items to your cart\n🚚 Delivery questions\n💳 Payment options (M-Pesa)\n\nWhat can I help you with? ✨";
    }
}
