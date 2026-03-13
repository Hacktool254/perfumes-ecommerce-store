"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

interface CartSummaryProps {
    subtotal: number;
}

export function CartSummary({ subtotal }: CartSummaryProps) {
    const [promoCode, setPromoCode] = useState("");
    const [discount, setDiscount] = useState(0);

    const shipping = subtotal > 10000 ? 0 : 500;
    const total = subtotal + shipping - discount;

    const handleApplyPromo = (e: React.FormEvent) => {
        e.preventDefault();
        if (promoCode.toUpperCase() === "WELCOME10") {
            setDiscount(subtotal * 0.1);
        } else {
            setDiscount(0);
            alert("Invalid promo code"); // Simple alert for mock
        }
    };

    return (
        <div className="bg-secondary/20 rounded-lg p-6 lg:p-8 border border-border sticky top-32">
            <h2 className="font-serif text-2xl text-foreground mb-6">Order Summary</h2>

            <div className="space-y-4 text-sm text-foreground mb-6">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">KES {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                        {shipping === 0 ? "Complimentary" : `KES ${shipping.toLocaleString()}`}
                    </span>
                </div>

                {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount</span>
                        <span className="font-medium">- KES {discount.toLocaleString()}</span>
                    </div>
                )}
            </div>

            <div className="border-t border-border pt-4 mb-8">
                <div className="flex justify-between items-end">
                    <span className="text-base font-medium text-foreground">Estimated Total</span>
                    <span className="text-2xl font-serif text-foreground">
                        KES {total.toLocaleString()}
                    </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">Taxes included if applicable</p>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="mb-8">
                <label htmlFor="promo" className="block text-xs font-medium text-muted-foreground mb-2 flex flex-row items-center gap-2">
                    <Tag className="w-3 h-3" />
                    Gift Card or Discount Code
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        id="promo"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="E.g. WELCOME10"
                        className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all uppercase"
                    />
                    <button
                        type="submit"
                        className="bg-secondary text-foreground hover:bg-border px-4 py-2 rounded-md text-sm font-medium transition-colors border border-border"
                    >
                        Apply
                    </button>
                </div>
            </form>

            {/* Checkout Action */}
            <Link
                href="/checkout"
                className="w-full bg-foreground text-background flex items-center justify-center gap-2 py-4 rounded-full font-medium hover:bg-foreground/90 hover:shadow-lg transition-all"
            >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Secure Checkout Badges Idea */}
            <div className="mt-6 flex justify-center items-center gap-2 text-xs text-muted-foreground">
                <span>Secure Checkout</span>
                <span>•</span>
                <span>M-Pesa Supported</span>
            </div>

        </div>
    );
}
