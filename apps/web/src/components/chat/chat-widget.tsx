"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import Image from "next/image";

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 w-16 h-16 z-[100] group"
                    >
                        {/* Circular Image Container */}
                        <div className="relative w-full h-full rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.18)] overflow-hidden border-2 border-white/30 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.25)] transition-shadow" style={{ backgroundColor: '#e8b4b8' }}>
                            <Image
                                src="/logo_transparent.png"
                                alt="Chat Logo"
                                fill
                                className="object-contain scale-[1.4] translate-y-1"
                            />
                        </div>
                        
                        {/* Online Status Dot */}
                        <div className="absolute bottom-0 right-0 w-[18px] h-[18px] bg-[#21c45d] rounded-full border-[3px] border-white z-10 shadow-sm" />
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ ease: "easeOut", duration: 0.2 }}
                        className="fixed bottom-6 right-6 w-[350px] sm:w-[380px] h-[550px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.16)] z-[100] flex flex-col overflow-hidden border border-gray-100"
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
                                        We are online
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:opacity-80 transition-opacity">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto bg-[#fafafa] p-4 flex flex-col gap-4">
                            <div className="flex items-center justify-center my-2">
                                <span className="bg-white px-3 py-1 rounded-full text-[11px] text-gray-400 font-medium uppercase tracking-wider border border-gray-100">
                                    Today
                                </span>
                            </div>

                            {/* AI Message */}
                            <div className="bg-[#f0f0f0] rounded-2xl rounded-tl-sm p-4 text-[15px] text-[#2f2f2f] w-[88%] leading-[1.6]">
                                Hello 👋 I&apos;m Ummie&apos;s AI assistant, here to help you find what you&apos;re looking for. How can I help you?
                            </div>

                            {/* Email Collection Box */}
                            <div className="bg-[#f0f0f0] rounded-2xl rounded-tl-sm p-4 w-[88%] flex flex-col gap-3">
                                <p className="text-[15px] text-[#2f2f2f] leading-[1.6]">
                                    Please enter your contact information so we can keep you updated with our replies
                                </p>
                                <input
                                    type="email"
                                    placeholder="johndoe@gmail.com"
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] outline-none focus:border-black transition-colors"
                                />
                                <p className="text-[13px] text-gray-500 leading-snug">
                                    By sending us a message, you agree to our <span className="text-[#3b82f6] hover:underline cursor-pointer">privacy policy</span>.
                                </p>
                                <button disabled className="bg-black/[0.05] text-black/30 font-medium py-3 rounded-xl mt-1 text-[15px] select-none">
                                    Start chat
                                </button>
                            </div>
                        </div>

                        {/* Footer (Empty space at bottom or "Powered by") */}
                        <div className="h-4 bg-[#fafafa]" />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
