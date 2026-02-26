import Link from "next/link";
import { ShoppingCart, User, Menu } from "lucide-react";

export function Header() {
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
                        <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
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
