"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Send, Loader2, Check, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductCarousel, type ChatProduct } from "./product-card";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatAction {
    type: "add_to_cart" | "view_product" | "navigate";
    productName?: string;
    productId?: string;
    productSlug?: string;
    url?: string;
}

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
    /** Products to display as inline cards */
    products?: ChatProduct[];
    /** Action confirmation (e.g. "Added to cart") */
    actionConfirmation?: string;
}

interface ChatResponse {
    response: string;
    sessionId?: string;
    productData?: ChatProduct[] | ChatProduct | null;
    action?: ChatAction;
    suggestedProducts?: ChatProduct[];
}

// ─── Local cart helpers (guest users) ─────────────────────────────────────────

interface LocalCartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    slug?: string;
}

function getLocalCart(): LocalCartItem[] {
    if (typeof window === "undefined") return [];
    try {
        return JSON.parse(localStorage.getItem("ue_guest_cart") || "[]");
    } catch {
        return [];
    }
}

function addToLocalCart(product: ChatProduct): void {
    const cart = getLocalCart();
    const existing = cart.find((c) => c.productId === product._id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            productId: product._id,
            name: product.name,
            price: product.discount
                ? Math.round(product.price * (1 - product.discount / 100))
                : product.price,
            quantity: 1,
            image: product.images?.[0],
            slug: product.slug,
        });
    }
    localStorage.setItem("ue_guest_cart", JSON.stringify(cart));
    // Dispatch storage event so other components can react
    window.dispatchEvent(new Event("cart-updated"));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ChatWidget() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            text: "Hello! Welcome to Ummie's Essence 👋\n\nI'm Ummie, your fragrance assistant. I can help you with:\n\n✨ Product prices & availability\n🛒 Adding items to your cart\n🚚 Delivery information\n💎 Personalized recommendations\n\nWhat are you looking for today?",
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cartNotification, setCartNotification] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Session ID for conversation tracking
    const [sessionId, setSessionId] = useState<string>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("chatbot_session_id");
            if (saved) return saved;
            const newId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
            localStorage.setItem("chatbot_session_id", newId);
            return newId;
        }
        return `session_${Date.now()}`;
    });

    // ─── Cart Action Handler ──────────────────────────────────────────────────

    const handleAddToCart = useCallback((product: ChatProduct) => {
        addToLocalCart(product);
        setCartNotification(`🛒 ${product.name} added to cart!`);
        setTimeout(() => setCartNotification(null), 3000);

        // Add confirmation message to chat
        const confirmMsg: Message = {
            id: `cart_${Date.now()}`,
            text: `✅ **${product.name}** has been added to your cart!\n\nContinue shopping or checkout when you're ready.`,
            sender: "bot",
            timestamp: new Date(),
            actionConfirmation: "cart_added",
        };
        setMessages((prev) => [...prev, confirmMsg]);
    }, []);

    const handleViewProduct = useCallback(
        (product: ChatProduct) => {
            const slug = product.slug || product.name.toLowerCase().replace(/\s+/g, "-");
            router.push(`/shop/${slug}`);
            setIsOpen(false);
        },
        [router]
    );

    // ─── Send Message ─────────────────────────────────────────────────────────

    const sendMessage = useCallback(async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: trimmed,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Build conversation history for context
            const history = messages.slice(-10).map((m) => ({
                role: m.sender === "user" ? ("user" as const) : ("model" as const),
                content: m.text,
            }));

            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: trimmed,
                    sessionId,
                    userEmail: "guest@website.com",
                    userName: "Website Visitor",
                    history,
                }),
            });

            const data: ChatResponse = await response.json();

            // Normalize product data into array for product cards
            let products: ChatProduct[] = [];
            if (data.suggestedProducts && data.suggestedProducts.length > 0) {
                products = data.suggestedProducts;
            } else if (data.productData) {
                if (Array.isArray(data.productData)) {
                    products = data.productData.filter(
                        (p): p is ChatProduct => p !== null && typeof p === "object" && "_id" in p
                    );
                } else if (typeof data.productData === "object" && "_id" in data.productData) {
                    products = [data.productData as ChatProduct];
                }
            }

            // Handle bot-triggered cart actions
            if (data.action?.type === "add_to_cart" && products.length > 0) {
                const targetProduct = data.action.productName
                    ? products.find(
                          (p) =>
                              p.name.toLowerCase().includes(data.action!.productName!.toLowerCase())
                      ) || products[0]
                    : products[0];
                handleAddToCart(targetProduct);
            }

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text:
                    data.response ||
                    "I'm not sure how to respond to that. Try asking about a product like 'What's the price of Yara?' or 'Is Khamrah in stock?'",
                sender: "bot",
                timestamp: new Date(),
                products: products.length > 0 ? products : undefined,
            };

            setMessages((prev) => [...prev, botMessage]);

            // Update session ID if provided
            if (data.sessionId && data.sessionId !== sessionId) {
                setSessionId(data.sessionId);
                localStorage.setItem("chatbot_session_id", data.sessionId);
            }
        } catch (error) {
            console.error("Chat error:", error);
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm having a moment! 😅 Please try again in a few seconds. If the issue persists, you can reach us on WhatsApp for instant help! 💬",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, messages, sessionId, handleAddToCart]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // ─── Context-aware quick actions ──────────────────────────────────────────

    const lastBotMessage = [...messages].reverse().find((m) => m.sender === "bot");
    const hasProducts = lastBotMessage?.products && lastBotMessage.products.length > 0;

    const quickActions = hasProducts
        ? [
              { text: "Tell me more about this", icon: "✨" },
              { text: "Any similar options?", icon: "🔍" },
              { text: "What's your best seller?", icon: "🏆" },
          ]
        : [
              { text: "Show me perfumes", icon: "🧴" },
              { text: "What's on sale?", icon: "🏷️" },
              { text: "Delivery info", icon: "🚚" },
              { text: "Recommend something", icon: "💎" },
          ];

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <>
            {/* Cart Notification Toast */}
            <AnimatePresence>
                {cartNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-24 right-6 z-[110] bg-[#2f2f2f] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium"
                    >
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3" />
                        </div>
                        {cartNotification}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 w-16 h-16 z-[100] group"
                        aria-label="Open chat"
                    >
                        <div
                            className="relative w-full h-full rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.18)] overflow-hidden border-2 border-white/30 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-shadow"
                            style={{ backgroundColor: "#e8b4b8" }}
                        >
                            <Image
                                src="/logo_transparent.png"
                                alt="Chat with Ummie"
                                fill
                                sizes="64px"
                                priority
                                className="object-contain scale-[1.4] translate-y-1"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 w-[18px] h-[18px] bg-[#21c45d] rounded-full border-[3px] border-white z-10 shadow-sm" />

                        {/* Pulse animation */}
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="absolute inset-0 rounded-full border-2 border-[#e8b4b8]/30 pointer-events-none"
                        />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                        className="fixed bottom-6 right-6 w-[380px] sm:w-[420px] h-[620px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.16)] z-[100] flex flex-col overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="bg-[#2f2f2f] text-white px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="hover:opacity-80 transition-opacity"
                                    aria-label="Close chat"
                                >
                                    <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={2} />
                                </button>
                                <div>
                                    <h3 className="font-serif text-[17px] leading-tight">
                                        Ummie&apos;s Essence
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-xs text-[#a0a0a0] mt-0.5 font-medium">
                                        <div className="w-2 h-2 bg-[#21c45d] rounded-full" />
                                        AI Assistant Online
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="hover:opacity-80 transition-opacity"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto bg-[#fafafa] flex flex-col">
                            {/* Messages */}
                            <div className="flex-1 p-4 space-y-4">
                                <div className="flex items-center justify-center my-2">
                                    <span className="bg-white px-3 py-1 rounded-full text-[11px] text-gray-400 font-medium uppercase tracking-wider border border-gray-100">
                                        Today
                                    </span>
                                </div>

                                {messages.map((msg) => (
                                    <div key={msg.id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${
                                                msg.sender === "user"
                                                    ? "justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            {msg.sender === "bot" && (
                                                <div className="w-8 h-8 rounded-full bg-[#e8b4b8]/20 flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                                                    <span className="text-xs">🧴</span>
                                                </div>
                                            )}
                                            <div
                                                className={`max-w-[80%] p-4 rounded-2xl text-[14px] leading-[1.65] whitespace-pre-wrap ${
                                                    msg.sender === "user"
                                                        ? "bg-[#2f2f2f] text-white rounded-br-md"
                                                        : msg.actionConfirmation
                                                          ? "bg-emerald-50 text-[#2f2f2f] rounded-bl-md border border-emerald-100"
                                                          : "bg-[#f0f0f0] text-[#2f2f2f] rounded-bl-md"
                                                }`}
                                            >
                                                {msg.actionConfirmation && (
                                                    <div className="flex items-center gap-1.5 mb-1.5">
                                                        <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wide">
                                                            Cart Updated
                                                        </span>
                                                    </div>
                                                )}
                                                {msg.text}
                                            </div>
                                        </motion.div>

                                        {/* Product Cards Carousel */}
                                        {msg.products && msg.products.length > 0 && (
                                            <div className="mt-3 ml-10">
                                                <ProductCarousel
                                                    products={msg.products}
                                                    onAddToCart={handleAddToCart}
                                                    onViewProduct={handleViewProduct}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="w-8 h-8 rounded-full bg-[#e8b4b8]/20 flex items-center justify-center mr-2 flex-shrink-0">
                                            <span className="text-xs">🧴</span>
                                        </div>
                                        <div className="bg-[#f0f0f0] rounded-2xl rounded-bl-md p-4">
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin text-[#e8b4b8]" />
                                                <span className="text-xs text-gray-400">
                                                    Ummie is thinking...
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Actions */}
                            <div className="px-4 py-2 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                                {quickActions.map((action, idx) => (
                                    <button
                                        key={`${action.text}-${idx}`}
                                        onClick={() => {
                                            setInput(action.text);
                                            // Need a small delay so React updates input state first
                                            setTimeout(() => {
                                                const fakeEvent = { key: "Enter", shiftKey: false, preventDefault: () => {} };
                                                // Trigger send directly
                                                sendMessage();
                                            }, 50);
                                        }}
                                        className="flex-shrink-0 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-[11px] text-gray-600 hover:border-[#e8b4b8] hover:text-[#e8b4b8] transition-all hover:shadow-sm font-medium"
                                    >
                                        {action.icon} {action.text}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about a product..."
                                    className="flex-1 bg-[#f5f5f5] border-0 rounded-xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#e8b4b8]/50 transition-shadow"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={isLoading || !input.trim()}
                                    className="w-12 h-12 bg-[#2f2f2f] text-white rounded-xl flex items-center justify-center hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Send message"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 text-center">
                                Try: &quot;Price of Yara&quot; • &quot;Add Khamrah to cart&quot; •
                                &quot;Is 9PM in stock?&quot;
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
