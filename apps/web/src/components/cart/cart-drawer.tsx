"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useEffect } from "react";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, updateQuantity, removeItem, isLoading } = useCart();

    // Prevent scrolling when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const subtotal = items ? items.reduce((sum, item) => {
        const price = item.product?.price || 0;
        return sum + price * item.quantity;
    }, 0) : 0;

    const itemCount = items ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]"
                    />

                    {/* Drawer Content */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-[450px] bg-white z-[101] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="w-5 h-5 text-[#2f2f2f]" />
                                <h2 className="font-serif text-xl text-[#2f2f2f]">Your Cart ({itemCount})</h2>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                            >
                                <X className="w-5 h-5 text-gray-400 group-hover:text-[#2f2f2f]" />
                            </button>
                        </div>

                        {/* Items Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
                                    <div className="w-6 h-6 border-2 border-gray-200 border-t-[#AA8C77] rounded-full animate-spin" />
                                    <p className="text-sm font-medium">Refreshing cart...</p>
                                </div>
                            ) : !items || items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <ShoppingBag className="w-10 h-10 text-gray-200" />
                                    </div>
                                    <h3 className="font-serif text-2xl text-[#2f2f2f] mb-3">Your cart is empty</h3>
                                    <p className="text-gray-500 text-sm mb-8 max-w-[250px] mx-auto">
                                        Discover your next signature scent from our curated collections.
                                    </p>
                                    <Link
                                        href="/shop"
                                        onClick={onClose}
                                        className="bg-[#2f2f2f] text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-all"
                                    >
                                        Explore Collection
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {items.map((item, index) => (
                                        <div key={`${item.productId}-${index}`} className="flex gap-4 group">
                                            {/* Product Image */}
                                            <div className="relative w-24 h-32 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                                                {item.product?.images?.[0] ? (
                                                    <Image
                                                        src={item.product.images[0]}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="96px"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-widest text-[#AA8C77] font-bold mb-1">
                                                            {item.product?.brand || "Premium Selection"}
                                                        </p>
                                                        <Link 
                                                            href={`/product/${item.product?.slug || item.productId}`}
                                                            onClick={onClose}
                                                            className="font-serif text-base text-[#2f2f2f] hover:text-[#AA8C77] transition-colors line-clamp-1"
                                                        >
                                                            {item.product?.name || "Product"}
                                                        </Link>
                                                    </div>
                                                    <button 
                                                        onClick={() => removeItem(item.productId, item._id)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <p className="text-xs text-gray-400 mb-4 font-medium uppercase">
                                                    {item.product?.category || "Fragrance"}
                                                </p>

                                                <div className="flex justify-between items-center mt-auto">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-3 border border-gray-200 rounded-full h-9 px-1">
                                                        <button 
                                                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item._id)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="w-5 text-center text-sm font-semibold text-[#2f2f2f]">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item._id)}
                                                            className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <p className="font-semibold text-[#2f2f2f]">
                                                        KES {(item.product?.price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer (Sticky) */}
                        {items && items.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Subtotal</span>
                                        <span className="text-[#2f2f2f] font-bold">KES {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Shipping</span>
                                        <span className="text-[#AA8C77] font-bold uppercase text-[10px]">Calculated at checkout</span>
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 flex justify-between">
                                        <span className="font-serif text-lg text-[#2f2f2f]">Estimated Total</span>
                                        <span className="font-serif text-xl font-bold text-[#2f2f2f]">KES {subtotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <Link
                                        href="/checkout"
                                        onClick={onClose}
                                        className="w-full bg-[#2f2f2f] text-white py-4 rounded-full font-bold text-center flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98]"
                                    >
                                        PROCEED TO CHECKOUT
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        href="/cart"
                                        onClick={onClose}
                                        className="w-full text-center py-2 text-sm text-gray-500 font-medium hover:text-[#2f2f2f] transition-colors"
                                    >
                                        View Shopping Cart
                                    </Link>
                                </div>

                                <p className="text-[10px] text-center text-gray-400 mt-6 uppercase tracking-widest leading-relaxed">
                                    Tax included. Shipping calculated at checkout.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
