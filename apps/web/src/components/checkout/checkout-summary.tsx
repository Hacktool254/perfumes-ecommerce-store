"use client";

import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { ChevronDown, Tag } from "lucide-react";

export function CheckoutSummary() {
    const { items, isLoading } = useCart();

    const subtotal = items.reduce((sum, item) => {
        const price = item.product?.price || 0;
        return sum + price * item.quantity;
    }, 0);

    const shipping = 0; // Complimentary for now
    const total = subtotal + shipping;

    if (isLoading) {
        return (
            <div className="bg-[#fcf8f6] p-8 rounded-xl border border-[#ebe0da] animate-pulse">
                <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-4">
                    <div className="h-20 bg-gray-200 rounded"></div>
                    <div className="h-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-[#fcf8f6] p-6 lg:p-10 rounded-2xl border border-[#ebe0da]">
                <h2 className="font-serif text-2xl text-[#1c2e36] mb-8">Order Summary</h2>

                {/* Items List */}
                <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item) => (
                        <div key={item.productId} className="flex gap-4 group">
                            <div className="relative w-16 h-20 bg-white rounded-lg border border-[#ebe0da] overflow-hidden shrink-0">
                                {item.product?.images?.[0] ? (
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        sizes="64px"
                                        className="object-contain p-1"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-50" />
                                )}
                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1c2e36] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                    {item.quantity}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                                <div className="flex justify-between items-start gap-2">
                                    <p className="text-sm font-medium text-[#1c2e36] line-clamp-2 leading-tight">
                                        {item.product?.name}
                                    </p>
                                    <p className="text-sm font-bold text-[#1c2e36] whitespace-nowrap">
                                        KES {(item.product?.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                                    {item.product?.brand || "Premium"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Discount Code */}
                <div className="flex gap-3 mb-8">
                    <div className="relative flex-1">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Discount code or gift card"
                            className="w-full pl-11 pr-4 py-3.5 rounded-lg border border-[#ebe0da] bg-white text-sm focus:outline-none focus:border-[#1c2e36] transition-all placeholder:text-gray-400"
                        />
                    </div>
                    <button className="px-6 py-3.5 bg-[#ebe0da] text-[#1c2e36] rounded-lg font-bold text-sm hover:bg-[#d6c8be] transition-colors">
                        Apply
                    </button>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-4 border-t border-[#ebe0da] pt-8">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">Subtotal</span>
                        <span className="text-[#1c2e36] font-bold">KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium whitespace-nowrap">Shipping & handling</span>
                        <span className="text-green-600 font-bold uppercase text-[11px] tracking-wider">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">Estimated taxes</span>
                        <span className="text-[#1c2e36] font-bold">KES 0</span>
                    </div>

                    <div className="pt-6 border-t border-[#1c2e36]/10 flex justify-between items-center">
                        <span className="font-serif text-xl text-[#1c2e36]">Total</span>
                        <div className="text-right">
                            <p className="font-serif text-2xl font-bold text-[#1c2e36]">KES {total.toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Including VAT</p>
                        </div>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-10 p-5 bg-white/50 rounded-xl border border-[#ebe0da]/50 flex items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Secure Payment</span>
                    </div>
                    <div className="w-px h-6 bg-[#ebe0da]" />
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                           <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.9 6c-.4-.4-1-.4-1.4 0l-10 10.1L6 11.5c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4L10 18.5c.2.2.4.3.7.3s.5-.1.7-.3L21.9 7.4c.4-.4.4-1.1 0-1.4z"/></svg>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Verified Store</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 grayscale opacity-40">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-5" alt="PayPal" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" className="h-5" alt="Mastercard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-5" alt="Visa" />
            </div>
        </div>
    );
}
