"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Eye, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useSearchParams } from "next/navigation";
import { Id } from "@workspaceRoot/convex/_generated/dataModel";

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
        e.stopPropagation();
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
        <div className="space-y-12">
            {/* Product Count */}
            <p className="text-sm text-muted-foreground">
                {results.length} product{results.length !== 1 ? "s" : ""}
            </p>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10 w-full">
                {results.map((product, idx) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                        className="group flex flex-col"
                    >
                        {/* Image Container — Lattafa-style gray bg with rounded corners */}
                        <div className="relative aspect-[3/4] bg-secondary/40 mb-4 overflow-hidden rounded-xl">
                            <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10">
                                <span className="sr-only">View {product.name}</span>
                            </Link>

                            <Image
                                src={product.images[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800"}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />

                            {/* Badges */}
                            {product.stock !== undefined && product.stock <= 0 && (
                                <span className="absolute top-3 left-3 z-20 text-[10px] uppercase tracking-wider font-bold bg-secondary/80 backdrop-blur-sm text-muted-foreground px-3 py-1 rounded-full">
                                    Sold out
                                </span>
                            )}

                            {/* Hover Overlay Controls */}
                            <div className="absolute inset-0 z-20 pointer-events-none">
                                {/* Wishlist — top right */}
                                <button
                                    onClick={(e) => toggleWishlist(product._id, e)}
                                    className="pointer-events-auto absolute top-3 right-3 p-2.5 rounded-full bg-background/70 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-sm"
                                    aria-label="Toggle Wishlist"
                                >
                                    <Heart
                                        className={`w-4 h-4 transition-colors ${wishlist.includes(product._id) ? "fill-red-500 text-red-500" : "text-foreground"}`}
                                    />
                                </button>

                                {/* Quick View — center */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <Link
                                        href={`/product/${product.slug}`}
                                        className="pointer-events-auto flex items-center gap-2 bg-background/80 backdrop-blur-md text-foreground px-5 py-2.5 rounded-full text-sm font-medium shadow-lg hover:bg-background transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Quick View
                                    </Link>
                                </div>

                                {/* Add to Cart — bottom */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                        className="pointer-events-auto w-full bg-foreground text-background rounded-full py-3 px-4 flex items-center justify-center gap-2 font-medium hover:bg-primary hover:text-white transition-colors shadow-lg text-sm"
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product Info — Lattafa-style hierarchy */}
                        <div className="flex flex-col flex-1 px-1">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mb-1">
                                {product.brand}
                            </p>
                            <h3 className="font-serif text-base text-foreground mb-1.5 leading-tight">
                                <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
                                    {product.name}
                                </Link>
                            </h3>
                            <p className="font-semibold text-foreground text-sm mt-auto">
                                KES {product.price.toLocaleString()}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Load More */}
            {status === "CanLoadMore" && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={() => loadMore(12)}
                        className="px-12 py-4 border border-border rounded-full text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-300"
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
}
