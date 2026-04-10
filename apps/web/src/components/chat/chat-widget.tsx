"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Send, Loader2, MessageCircle } from "lucide-react";
import Image from "next/image";

interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    timestamp: Date;
}

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            text: "Hello! Welcome to Ummie's Essence 👋\n\nI'm your AI assistant powered by Google AI. I can help you with:\n\n• Product prices & availability (via n8n)\n• Placing orders\n• Delivery information\n• Product recommendations\n• WhatsApp ordering (coming soon)\n\nWhat would you like to know?",
            sender: "bot",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo] = useState({ email: "guest@website.com", name: "Website Visitor" });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    // Session ID for conversation tracking
    const [sessionId, setSessionId] = useState<string>(() => {
        // Generate or retrieve session ID from localStorage
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("chatbot_session_id");
            if (saved) return saved;
            const newId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
            localStorage.setItem("chatbot_session_id", newId);
            return newId;
        }
        return `session_${Date.now()}`;
    });

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Build conversation history for context
            const history = messages.slice(-10).map(m => ({
                role: m.sender === "user" ? "user" : "model" as "user" | "model",
                content: m.text,
            }));

            // Try the API route first (with n8n fallback built-in)
            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    sessionId,
                    userEmail: userInfo.email,
                    userName: userInfo.name,
                    history,
                }),
            });

            if (!response.ok) {
                // Fallback to direct n8n call if API route fails
                console.warn("API route failed, falling back to n8n direct");
                const n8nResponse = await fetch("http://localhost:5678/webhook/whatsapp-chatbot", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: input,
                        from: userInfo.email || "website-user",
                        name: userInfo.name,
                        sessionId,
                        timestamp: new Date().toISOString(),
                    }),
                });

                if (!n8nResponse.ok) {
                    throw new Error(`n8n error: ${n8nResponse.status}`);
                }

                const data = await n8nResponse.json();
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: data.response || data.message || "I'm not sure how to respond to that. Try asking about a product like 'What's the price of Yara?' or 'Is Khamrah in stock?'",
                    sender: "bot",
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, botMessage]);
                return;
            }

            const data = await response.json();
            console.log("Bot response:", data);

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response || "I'm not sure how to respond to that. Try asking about a product like 'What's the price of Yara?' or 'Is Khamrah in stock?'",
                sender: "bot",
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, botMessage]);

            // Update session ID if provided
            if (data.sessionId && data.sessionId !== sessionId) {
                setSessionId(data.sessionId);
                localStorage.setItem("chatbot_session_id", data.sessionId);
            }
        } catch (error) {
            console.error("Chat error:", error);
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm having trouble connecting. Please check:\n\n1. Make sure n8n is running: `docker ps`\n2. Start n8n if needed: `docker start n8n-local`\n3. Refresh this page\n\nIf n8n is running, your workflow might not be configured. Check http://localhost:5678",
                sender: "bot",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickActions = [
        { text: "Show me all perfumes", icon: "🧴" },
        { text: "What's on sale?", icon: "🏷️" },
        { text: "Track my order", icon: "📦" },
        { text: "Delivery info", icon: "🚚" },
    ];

    return (
        <>
            {/* Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 w-16 h-16 z-[100] group"
                    >
                        <div className="relative w-full h-full rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.18)] overflow-hidden border-2 border-white/30 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-shadow" style={{ backgroundColor: '#e8b4b8' }}>
                            <Image
                                src="/logo_transparent.png"
                                alt="Chat Logo"
                                fill
                                sizes="64px"
                                priority
                                className="object-contain scale-[1.4] translate-y-1"
                            />
                        </div>
                        <div className="absolute bottom-0 right-0 w-[18px] h-[18px] bg-[#21c45d] rounded-full border-[3px] border-white z-10 shadow-sm" />
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
                        className="fixed bottom-6 right-6 w-[380px] sm:w-[420px] h-[600px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.16)] z-[100] flex flex-col overflow-hidden border border-gray-100"
                    >
                        {/* Header */}
                        <div className="bg-[#2f2f2f] text-white px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button onClick={() => setIsOpen(false)} className="hover:opacity-80 transition-opacity">
                                    <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={2} />
                                </button>
                                <div>
                                    <h3 className="font-serif text-[17px] leading-tight">Ummie&apos;s Essence</h3>
                                    <div className="flex items-center gap-1.5 text-xs text-[#a0a0a0] mt-0.5 font-medium">
                                        <div className="w-2 h-2 bg-[#21c45d] rounded-full" />
                                        AI Assistant Online
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:opacity-80 transition-opacity">
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
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                            >
                                                {msg.sender === "bot" && (
                                                    <div className="w-8 h-8 rounded-full bg-[#e8b4b8]/20 flex items-center justify-center mr-2 flex-shrink-0">
                                                        <span className="text-xs">🧴</span>
                                                    </div>
                                                )}
                                                <div
                                                    className={`max-w-[80%] p-4 rounded-2xl text-[15px] leading-[1.6] whitespace-pre-wrap ${
                                                        msg.sender === "user"
                                                            ? "bg-[#2f2f2f] text-white rounded-br-md"
                                                            : "bg-[#f0f0f0] text-[#2f2f2f] rounded-bl-md"
                                                    }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            </motion.div>
                                        ))}

                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="w-8 h-8 rounded-full bg-[#e8b4b8]/20 flex items-center justify-center mr-2 flex-shrink-0">
                                                    <span className="text-xs">🧴</span>
                                                </div>
                                                <div className="bg-[#f0f0f0] rounded-2xl rounded-bl-md p-4">
                                                    <Loader2 className="w-5 h-5 animate-spin text-[#e8b4b8]" />
                                                </div>
                                            </div>
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="px-4 py-2 flex gap-2 overflow-x-auto">
                                        {quickActions.map((action, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setInput(action.text);
                                                    setTimeout(() => sendMessage(), 100);
                                                }}
                                                className="flex-shrink-0 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs text-gray-600 hover:border-[#e8b4b8] hover:text-[#e8b4b8] transition-colors"
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
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-[#f5f5f5] border-0 rounded-xl px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#e8b4b8]/50"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={isLoading || !input.trim()}
                                        className="w-12 h-12 bg-[#2f2f2f] text-white rounded-xl flex items-center justify-center hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-[11px] text-gray-400 mt-2 text-center">
                                    Try: &quot;Price Yara&quot; • &quot;Order 2 Khamrah&quot; • &quot;Is 9PM in stock?&quot;
                                </p>
                            </div>
                        </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
