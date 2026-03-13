"use client";

import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { useCart } from "@/hooks/use-cart";

export default function CheckoutPage() {
    const { items, isLoading } = useCart();

    const subtotal = items.reduce((sum: number, item: any) => {
        const price = item.product?.price || 0;
        return sum + (price * item.quantity);
    }, 0);

    const shipping = subtotal > 10000 ? 0 : 500;
    const total = subtotal + shipping;

    if (isLoading) {
        return <div className="pt-40 text-center min-h-screen">Loading checkout...</div>;
    }

    if (items.length === 0) {
        return (
            <div className="pt-40 text-center min-h-screen">
                <h2 className="text-2xl mb-4">Your cart is empty</h2>
                <Link href="/shop" className="text-accent underline">Return to Shop</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24 pb-32">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-border pb-6">
                    <div>
                        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Cart
                        </Link>
                        <h1 className="font-serif text-3xl md:text-4xl text-foreground">Checkout</h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-4 py-2 rounded-full w-max">
                        <Lock className="w-4 h-4" />
                        256-bit Secure Connection
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                    {/* Left: Checkout Form */}
                    <div className="flex-1">
                        <CheckoutForm items={items} subtotal={subtotal} total={total} />
                    </div>

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-[380px]">
                        <div className="bg-secondary/20 rounded-lg p-6 lg:p-8 border border-border sticky top-32">
                            <h2 className="font-serif text-xl text-foreground mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-[40vh] overflow-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex justify-between items-start gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-20 bg-secondary/50 rounded-sm overflow-hidden flex-shrink-0 relative">
                                                {item.product?.images?.[0] && (
                                                    <img src={item.product.images[0]} alt={item.product.name} className="object-cover w-full h-full" />
                                                )}
                                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</div>
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium line-clamp-1">{item.product?.name || "Product"}</p>
                                                <p className="text-xs text-muted-foreground">{item.product?.brand || ""}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium whitespace-nowrap">KES {((item.product?.price || 0) * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 text-sm text-foreground mb-6 border-t border-border pt-6">
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
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-base font-medium text-foreground">Total</span>
                                    <span className="text-2xl font-serif text-foreground">KES {total.toLocaleString()}</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
