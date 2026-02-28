"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useSearchParams } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";

export function ProductGrid() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("category") as Id<"categories"> | null;
    const gender = searchParams.get("gender") as "men" | "women" | "unisex" | null;
    const brand = searchParams.get("brand") || undefined;

    const { results, status, loadMore } = usePaginatedQuery(
        api.products.list,
        {
            categoryId: categoryId || undefined,
            gender: gender || undefined,
            brand: brand
        },
        { initialNumItems: 12 }
    );

    const [wishlist, setWishlist] = useState<string[]>([]);

    const toggleWishlist = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        setWishlist(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    if (status === "LoadingFirstPage") {
        return (
            <div className="flex flex-col items-center justify-center py-32 w-full">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground font-serif italic text-lg">Unveiling our collections...</p>
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 w-full text-center border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground font-serif text-xl mb-4">No products found in this selection.</p>
                <Link href="/shop" className="text-primary hover:underline font-medium">Clear all filters</Link>
            </div>
        );
    }

    return (
        <div className="space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 w-full">
                {results.map((product, idx) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                        className="group flex flex-col"
                    >
                        <div className="relative aspect-[3/4] bg-secondary/30 mb-4 overflow-hidden rounded-sm">
                            <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10">
                                <span className="sr-only">View {product.name}</span>
                            </Link>
                            <Image
                                src={product.images[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800"}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Wishlist Button */}
                            <button
                                onClick={(e) => toggleWishlist(product._id, e)}
                                className="absolute top-3 right-3 z-30 p-2 rounded-full bg-background/50 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                                aria-label="Toggle Wishlist"
                            >
                                <Heart
                                    className={`w-4 h-4 transition-colors ${wishlist.includes(product._id) ? "fill-red-500 text-red-500" : "text-foreground"}`}
                                />
                            </button>

                            {/* Add to Cart Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                <button
                                    onClick={(e) => e.preventDefault()}
                                    className="w-full bg-foreground text-background rounded-full py-3 px-4 flex items-center justify-center gap-2 font-medium hover:bg-gold-muted hover:text-white transition-colors shadow-lg"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>Add to Cart</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 px-1">
                            <div className="flex justify-between items-start mb-1">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">{product.brand}</p>
                                {product.gender && (
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider bg-secondary/50 px-2 py-0.5 rounded-full capitalize">
                                        {product.gender}
                                    </span>
                                )}
                            </div>

                            <h3 className="font-serif text-lg text-foreground mb-1 leading-tight mt-1">
                                <Link href={`/product/${product.slug}`} className="hover:text-gold transition-colors">
                                    {product.name}
                                </Link>
                            </h3>
                            <p className="font-medium text-foreground mt-auto text-sm">
                                KES {product.price.toLocaleString()}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {status === "CanLoadMore" && (
                <div className="flex justify-center pt-8">
                    <button
                        onClick={() => loadMore(12)}
                        className="px-12 py-4 border border-border rounded-full text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all"
                    >
                        Load More Creations
                    </button>
                </div>
            )}
        </div>
    );
}
