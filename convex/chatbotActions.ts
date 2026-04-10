import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

/**
 * Chatbot action that handles user messages.
 * - Uses n8n workflow for product queries
 * - Uses Google AI Studio (Gemini) for natural responses
 * - Can be extended to WhatsApp integration
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
    handler: async (ctx, args): Promise<{ response: string; sessionId: string; productData: any }> => {
        const { message } = args;

        // Generate session ID if not provided
        const sessionId = args.sessionId || `session_${Date.now()}`;

        // Check if message is a product query
        const isProductQuery = checkIfProductQuery(message);

        let productData = null;

        // If it's a product query, fetch relevant products from Convex DB
        if (isProductQuery) {
            try {
                // Search for products related to the user's message
                // We take up to 3 most relevant products to keep the prompt focused
                productData = await ctx.runQuery(api.chatbot.searchProducts, { 
                    query: message.length > 50 ? message.substring(0, 50) : message 
                });
                
                // If it's a very specific search that returned nothing, 
                // try to fetch the full catalog (minimal) as fallback
                if (!productData || productData.length === 0) {
                    const catalog = (await ctx.runQuery(api.chatbot.getProductsForChatbot)) as ChatbotProduct[];
                    // Filter in memory for common keywords
                    const keywords = message.toLowerCase().split(' ').filter(w => w.length > 3);
                    productData = catalog.filter((p: ChatbotProduct) => 
                        keywords.some(k => p.name.toLowerCase().includes(k))
                    ).slice(0, 3);
                }

                console.log(`Chatbot found ${productData?.length || 0} matching products for query: "${message}"`);
            } catch (error) {
                console.error("Product database search failed:", error);
                // Continue without product data
            }
        }


        // Get AI response from Google AI Studio
        let aiResponse: string;
        try {
            aiResponse = await getGoogleAIResponse(
                message,
                productData,
                args.history || []
            );
        } catch (error) {
            console.error("Google AI failed:", error);
            // Fallback response
            aiResponse = getFallbackResponse(message, productData);
        }

        // Log conversation for analytics (async, don't wait)
        ctx.runMutation(internal.chatbotActions.logConversation, {
            sessionId,
            userMessage: message,
            botResponse: aiResponse,
            hasProductQuery: isProductQuery,
            timestamp: Date.now(),
        }).catch(console.error);

        return {
            response: aiResponse,
            sessionId,
            productData,
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

/**
 * Check if message is asking about products
 */
function checkIfProductQuery(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    const productKeywords = [
        "price", "cost", "how much", "stock", "available", "in stock",
        "do you have", "sell", "perfume", "fragrance", "scent", "buy",
        "purchase", "order", "product", "item", "khamrah", "yara",
        "9pm", "oud", "musky", "floral", "men's", "women's", "unisex"
    ];

    return productKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Get response from Google AI Studio (Gemini API)
 */
async function getGoogleAIResponse(
    message: string,
    productData: any,
    history: { role: string; content: string }[]
): Promise<string> {
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey || apiKey === "your_google_ai_studio_key_here") {
        // Return fallback if no API key configured
        return getFallbackResponse(message, productData);
    }

    // Build conversation context
    const systemPrompt = buildSystemPrompt(productData);

    // Prepare messages for Gemini API
    const contents = [
        {
            role: "user",
            parts: [{ text: systemPrompt }]
        },
        {
            role: "model",
            parts: [{ text: "Understood. I'm ready to assist as Ummie's Essence customer service agent." }]
        }
    ];

    // Add conversation history
    for (const msg of history.slice(-6)) { // Keep last 6 messages for context
        contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
        });
    }

    // Add current message
    contents.push({
        role: "user",
        parts: [{ text: message }]
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
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
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

/**
 * Build system prompt with product context
 */
function buildSystemPrompt(productData: any): string {
    let prompt = `You are "Ummie", a professional and friendly customer service expert for Ummie's Essence, Kenya's leading destination for premium perfumes (Lattafa, Maison Alhambra, etc.) and cosmetics.

Your personality:
- Warm, sophisticated, and expert in fragrances
- Helpful and solution-oriented
- Uses emojis naturally (💎, ✨, 🌸, 🚚, 💳)
- Professional yet approachable

Store Details:
- Location: Nairobi, Kenya
- Best Sellers: Yara, Khamrah, Asad, Fakhar
- Payment: M-Pesa (STK Push) is preferred
- Delivery: Same-day in Nairobi, 1-2 days across Kenya
- Pricing: All prices are in KES (Kenyan Shillings)

Instructions:
1. **Product Knowledge**: Use the "Product Catalog Snippet" below to answer questions about specific perfumes. If a product is listed, quote its ACTUAL price and stock status.
2. **Prices**: Mention that prices include VAT and that we occasionally have sales.
3. **Stock**: If a product has low stock (less than 5), encourage the user to order quickly.
4. **Uncertainty**: If you don't have data for a specific perfume, say: "I don't have the exact price for that one right now, but let me check with our shop manager for you!"
5. **Call to Action**: Encourage users to "Add to Cart" or "Checkout" if they find what they like.

Product Catalog Snippet (Real-time data from our database):
${productData ? JSON.stringify(productData, null, 2) : "No specific products found for this query. Offer to help them find something from our general collections (Men's, Women's, Unisex)."}

Always prioritize accuracy when quoting prices and stock levels.`;

    return prompt;
}


/**
 * Fallback response when AI is unavailable
 */
function getFallbackResponse(message: string, productData: any): string {
    const lowerMessage = message.toLowerCase();

    // Product query responses
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much")) {
        if (productData && productData.price) {
            const price = productData.discount
                ? Math.round(productData.price * (1 - productData.discount / 100))
                : productData.price;
            const originalPrice = productData.price;
            const name = productData.name || "This product";

            if (productData.discount) {
                return `💎 ${name} is currently on sale!\n\nOriginal Price: KES ${originalPrice.toLocaleString()}\n**Discounted Price: KES ${price.toLocaleString()}**\n
That's a ${productData.discount}% discount! 🎉`;
            }
            return `💎 ${name} is priced at **KES ${price.toLocaleString()}**`;
        }
        return "I'd be happy to check pricing for you! Please tell me which specific perfume or product you're interested in (e.g., 'What's the price of Yara?' or 'How much is Khamrah?').";
    }

    if (lowerMessage.includes("stock") || lowerMessage.includes("available")) {
        if (productData && productData.stock !== undefined) {
            const name = productData.name || "This product";
            if (productData.stock > 10) {
                return `✅ Yes! ${name} is currently **in stock** with plenty of availability.`;
            } else if (productData.stock > 0) {
                return `⚡ ${name} is in stock but running low (${productData.stock} units remaining). I'd recommend placing your order soon!`;
            } else {
                return `😔 Sorry, ${name} is currently **out of stock**. Would you like me to notify you when it's back, or suggest similar fragrances?`;
            }
        }
        return "I can check stock availability for you! Which product would you like to know about?";
    }

    // General responses
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
        return "Hello there! 👋 Welcome to Ummie's Essence! I'm here to help you find the perfect fragrance. What are you looking for today?";
    }

    if (lowerMessage.includes("order") || lowerMessage.includes("buy")) {
        return "To place an order, you can:\n\n1️⃣ Browse our shop and checkout online with M-Pesa\n2️⃣ Message us on WhatsApp for assisted ordering\n\nWhat would you prefer?";
    }

    if (lowerMessage.includes("delivery") || lowerMessage.includes("shipping")) {
        return "🚚 We deliver throughout Kenya!\n\n• Nairobi: Same-day or next-day delivery\n• Other areas: 2-3 business days\n• Shipping costs calculated at checkout\n\nWould you like to know about delivery to a specific location?";
    }

    if (lowerMessage.includes("payment") || lowerMessage.includes("mpesa")) {
        return "💳 We accept:\n\n• **M-Pesa** (Primary method - STK Push)\n• Cash on delivery (select areas)\n• Bank transfer (on request)\n\nM-Pesa is our fastest and most convenient option!";
    }

    if (lowerMessage.includes("recommend") || lowerMessage.includes("suggest")) {
        return "I'd love to help you find the perfect scent! 🌸\n\nTell me:\n• What type of fragrances do you like? (oud, floral, musky, fresh)\n• Is this for daily wear or special occasions?\n• Do you prefer strong or subtle scents?\n\nOr browse our collections: Women's, Men's, or Unisex fragrances!";
    }

    if (lowerMessage.includes("whatsapp") || lowerMessage.includes("contact")) {
        return "📱 You can reach us on WhatsApp for quick responses:\n\n• Send us a message anytime\n• Get product photos and recommendations\n• Place orders directly via chat\n• Track your delivery\n\nClick the WhatsApp icon on our site to start chatting!";
    }

    // Default response
    return "Thank you for your message! I'm here to help with:\n\n🧴 Product information & pricing\n📦 Order placement & tracking\n🚚 Delivery questions\n💳 Payment options (M-Pesa)\n\nWhat can I assist you with today?";
}
