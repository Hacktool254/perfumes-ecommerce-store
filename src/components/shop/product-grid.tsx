"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

// Using the same mock data for now, expanded slightly
const shopProducts = [
    { id: 1, name: "Golden Sands", brand: "Desert Collection", price: 15000, category: "Eau de Parfum", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Noir Elegance", brand: "Evening Wear", price: 24000, category: "Eau de Parfum", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Citrus Bloom", brand: "Summer Essentials", price: 12500, category: "Eau de Toilette", image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Amber Wood", brand: "Signature", price: 19800, category: "Cologne", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop" },
    { id: 5, name: "Midnight Saffron", brand: "Ummie's Exclusives", price: 18500, category: "Eau de Parfum", image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop" },
    { id: 6, name: "Oud Rosewood", brand: "Maison Privée", price: 32000, category: "Eau de Parfum", image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop" },
    { id: 7, name: "Velvet Orchid", brand: "Floral Symphony", price: 14500, category: "Body Mist", image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=1000&auto=format&fit=crop" },
    { id: 8, name: "Leather & Vanilla", brand: "Ummie's Exclusives", price: 21000, category: "Cologne", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop" },
];

interface Product {
    id: number;
    name: string;
    brand: string;
    price: number;
    category: string;
    image: string;
}

interface ProductGridProps {
    products?: Product[];
}

export function ProductGrid({ products = shopProducts }: ProductGridProps) {
    const [wishlist, setWishlist] = useState<number[]>([]);

    const toggleWishlist = (id: number, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to the product page
        setWishlist(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 w-full">
            {products.map((product, idx) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="group flex flex-col"
                >
                    <div className="relative aspect-[3/4] bg-secondary/30 mb-4 overflow-hidden rounded-sm">
                        <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                            <span className="sr-only">View {product.name}</span>
                        </Link>
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />

                        {/* Wishlist Button (absolute top right) */}
                        <button
                            onClick={(e) => toggleWishlist(product.id, e)}
                            className="absolute top-3 right-3 z-30 p-2 rounded-full bg-background/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                            aria-label="Toggle Wishlist"
                        >
                            <Heart
                                className={`w-4 h-4 transition-colors ${wishlist.includes(product.id) ? "fill-red-500 text-red-500" : "text-foreground"}`}
                            />
                        </button>

                        {/* Add to Cart Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                            <button
                                onClick={(e) => e.preventDefault()}
                                className="w-full bg-foreground text-background rounded-full py-3 px-4 flex items-center justify-center gap-2 font-medium hover:bg-gold-muted hover:text-white transition-colors"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Quick Add</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col flex-1 px-1">
                        <div className="flex justify-between items-start mb-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">{product.brand}</p>
                            <span className="text-xs text-muted-foreground">{product.category}</span>
                        </div>

                        <h3 className="font-serif text-lg text-foreground mb-1">
                            <Link href={`/product/${product.id}`} className="hover:text-accent transition-colors">
                                {product.name}
                            </Link>
                        </h3>
                        <p className="font-medium text-foreground mt-auto">
                            KES {product.price.toLocaleString()}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
