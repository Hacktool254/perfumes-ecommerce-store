"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export function Header() {
    const { items, isLoading } = useCart();

    const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Brand */}
                <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-primary">
                    Ummie's Essence
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6 items-center">
                    <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">Home</Link>
                    <Link href="/shop" className="text-sm font-medium hover:text-accent transition-colors">Shop</Link>
                    <Link href="/categories" className="text-sm font-medium hover:text-accent transition-colors">Categories</Link>
                    <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">About</Link>
                    <Link href="/contact" className="text-sm font-medium hover:text-accent transition-colors">Contact</Link>
                </nav>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    <Link href="/cart" className="p-2 hover:bg-accent/10 rounded-full transition-colors relative">
                        <ShoppingCart className="w-5 h-5 text-foreground" />
                        {!isLoading && cartItemCount > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center rounded-full transform translate-x-1/2 -translate-y-1/4">
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                            </span>
                        )}
                    </Link>
                    <Link href="/account" className="p-2 hover:bg-accent/10 rounded-full transition-colors hidden md:block">
                        <User className="w-5 h-5 text-foreground" />
                    </Link>
                    <button className="md:hidden p-2">
                        <Menu className="w-6 h-6 text-foreground" />
                    </button>
                </div>
            </div>
        </header>
    );
}
