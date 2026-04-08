"use client";

import Link from "next/image";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutSummary } from "@/components/checkout/checkout-summary";
import { useCart } from "@/hooks/use-cart";
import { Loader2, ShoppingBag, ArrowLeft } from "lucide-react";
import Image from "next/image";
import LinkNext from "next/link";

export default function CheckoutPage() {
    const { items, isLoading } = useCart();

    const subtotal = items.reduce((sum: number, item: any) => {
        const price = item.product?.price || 0;
        return sum + (price * item.quantity);
    }, 0);

    const total = subtotal; // Complimentary shipping for now

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-[#1c2e36]" />
                <p className="font-serif text-lg text-gray-500 uppercase tracking-widest">Preparing Checkout...</p>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                    <ShoppingBag className="w-10 h-10 text-gray-200" />
                </div>
                <h1 className="font-serif text-4xl text-[#1c2e36] mb-4">Your cart is empty</h1>
                <p className="text-gray-500 mb-10 max-w-sm">Looks like you haven't added any fragrances to your collection yet.</p>
                <LinkNext href="/shop" className="bg-[#1c2e36] text-white px-10 py-4 rounded-full font-bold hover:bg-black transition-all">
                    RETURN TO SHOP
                </LinkNext>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Minimal Header */}
            <header className="border-b border-gray-100 py-6 px-4 md:px-8 xl:px-12">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <LinkNext href="/" className="relative w-32 h-10 md:w-40 md:h-12">
                        <Image
                            src="/logo_transparent.png"
                            alt="Ummie's Essence"
                            fill
                            sizes="160px"
                            className="object-contain"
                            priority
                        />
                    </LinkNext>
                    <LinkNext href="/cart" className="p-2 text-gray-400 hover:text-[#1c2e36] transition-colors relative group">
                        <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#AA8C77] text-white text-[9px] font-bold rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            {items.length}
                        </span>
                    </LinkNext>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 md:px-8 xl:px-12 py-10 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
                    
                    {/* Left: Form Column */}
                    <div className="flex-1 lg:max-w-[700px]">
                        {/* Mobile Toggle Summary (Optional but good for UX) */}
                        <div className="lg:hidden mb-10 border border-[#ebe0da] rounded-xl overflow-hidden">
                           <div className="p-4 bg-[#fcf8f6] flex justify-between items-center">
                                <LinkNext href="/cart" className="flex items-center gap-2 text-xs font-bold text-[#1c2e36] decoration-1 underline underline-offset-2">
                                    <ArrowLeft className="w-3 h-3" />
                                    EDIT CART
                                </LinkNext>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Due Today</p>
                                    <p className="text-xl font-serif font-bold text-[#1c2e36]">KES {total.toLocaleString()}</p>
                                </div>
                           </div>
                        </div>

                        <CheckoutForm items={items} subtotal={subtotal} total={total} />
                    </div>

                    {/* Right: Summary Column (Desktop Sticky) */}
                    <div className="hidden lg:block w-full lg:w-[440px] xl:w-[480px]">
                        <CheckoutSummary />
                    </div>

                </div>
            </main>

            {/* Simple Footer */}
            <footer className="border-t border-gray-100 py-10 px-4 md:px-8 text-center bg-gray-50/50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-4">
                    Ummie's Essence Premium Perfumery
                </p>
                <div className="flex justify-center gap-8 text-[11px] text-gray-500 font-medium lowercase tracking-wider">
                    <a href="#" className="hover:text-black transition-all">refund policy</a>
                    <a href="#" className="hover:text-black transition-all">shipping policy</a>
                    <a href="#" className="hover:text-black transition-all">privacy policy</a>
                    <a href="#" className="hover:text-black transition-all">terms of service</a>
                </div>
            </footer>
        </div>
    );
}
