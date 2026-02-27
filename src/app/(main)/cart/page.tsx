"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { CartItemRow } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";

// Mock Cart State
const initialCartItems = [
    {
        id: 1,
        name: "Golden Sands Edition",
        brand: "Desert Collection",
        price: 15000,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400&auto=format&fit=crop",
        quantity: 1,
        size: "100ml / 3.4 oz"
    },
    {
        id: 3,
        name: "Citrus Bloom",
        brand: "Summer Essentials",
        price: 12500,
        image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=400&auto=format&fit=crop",
        quantity: 2,
        size: "50ml / 1.7 oz"
    }
];

import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
    const { items, updateQuantity, removeItem, isLoading } = useCart();

    const handleUpdateQuantity = (id: string, newQuantity: number, cartItemId?: any) => {
        updateQuantity(id as any, newQuantity, cartItemId);
    };

    const handleRemove = (id: string, cartItemId?: any) => {
        removeItem(id as any, cartItemId);
    };

    const subtotal = items.reduce((sum: number, item: any) => {
        const price = item.product?.price || 0;
        return sum + (price * item.quantity);
    }, 0);

    const isEmpty = items.length === 0;

    if (isLoading) return <div className="pt-40 text-center">Loading cart...</div>;

    return (
        <div className="min-h-screen bg-background pt-24 pb-32">
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="mb-10">
                    <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                    </Link>
                    <h1 className="font-serif text-4xl md:text-5xl text-foreground">Shopping Cart</h1>
                </div>

                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-secondary/10 border border-border border-dashed rounded-lg text-center">
                        <ShoppingBag className="w-16 h-16 text-muted-foreground mb-6" />
                        <h2 className="font-serif text-2xl text-foreground mb-4">Your cart is empty</h2>
                        <p className="text-muted-foreground mb-8 max-w-sm">Discover our collection of signature fragrances and find your perfect scent.</p>
                        <Link
                            href="/shop"
                            className="bg-foreground text-background px-8 py-3 rounded-full font-medium hover:bg-foreground/90 transition-colors"
                        >
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

                        {/* Left: Cart Items List */}
                        <div className="flex-1">
                            <div className="border-t border-border">
                                {items.map(item => (
                                    <CartItemRow
                                        key={item.productId}
                                        id={item.productId}
                                        name={item.product?.name || "Product"}
                                        brand={item.product?.brand || ""}
                                        price={item.product?.price || 0}
                                        image={item.product?.images?.[0] || ""}
                                        quantity={item.quantity}
                                        onUpdateQuantity={(newQty) => handleUpdateQuantity(item.productId, newQty, item._id)}
                                        onRemove={() => handleRemove(item.productId, item._id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right: Order Summary sticky sidebar */}
                        <div className="w-full lg:w-[400px]">
                            <CartSummary subtotal={subtotal} />
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}
