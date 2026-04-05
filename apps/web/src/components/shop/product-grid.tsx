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
    const rawCategory = searchParams?.get("category");
    // Ensure we don't pass slugs (like "perfumes") into the categoryId ID validator
    const categoryId = rawCategory && rawCategory.length >= 30 ? rawCategory as Id<"categories"> : null;
    const gender = searchParams?.get("gender") as "men" | "women" | "unisex" | null;
    const brand = searchParams?.get("brand") || undefined;
    const currentView = searchParams?.get("view") || "grid";

    const { results, status, loadMore } = usePaginatedQuery(
        api.products.list,
        {
            categoryId: categoryId || undefined,
            gender: gender || undefined,
            brand: brand
        },
        { initialNumItems: 12 }
    );

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
        <div className="space-y-8">
            {/* Top Toolbar (Count & Sort) */}
            <div className="flex items-center justify-between text-[#2f2f2f] text-sm pt-2">
                <span>268 products</span>
                <div className="flex items-center gap-2">
                    <span>Sort by:</span>
                    <select className="bg-transparent font-medium focus:outline-none cursor-pointer">
                        <option>Featured</option>
                        <option>Best Selling</option>
                        <option>Price, low to high</option>
                        <option>Price, high to low</option>
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            <div className={`grid ${currentView === "list" ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"} gap-x-4 gap-y-12 w-full`}>
                {results.map((product, idx) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                        className={`group flex ${currentView === "list" ? "flex-row md:flex-col gap-6 md:gap-0 items-center md:items-start" : "flex-col"}`}
                    >
                        {/* Image Container — Lattafa-style gray bg with rounded corners */}
                        <div className={`relative ${currentView === "list" ? "w-1/3 md:w-full aspect-[3/4] md:aspect-[4/5]" : "w-full aspect-[4/5]"} bg-[#f7f7f7] mb-4 rounded-3xl`}>
                            <Link href={`/product/${product.slug}`} className="absolute inset-0 z-10 rounded-3xl overflow-hidden">
                                <span className="sr-only">View {product.name}</span>
                            </Link>

                            <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out rounded-3xl overflow-hidden">
                                <Image
                                    src={product.images[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800"}
                                    alt={product.name}
                                    fill
                                    className={`object-cover transition-opacity duration-700 ease-in-out z-10 ${product.images[1] ? 'group-hover:opacity-0' : ''}`}
                                />
                                {product.images[1] && (
                                    <Image
                                        src={product.images[1]}
                                        alt={`${product.name} alternate view`}
                                        fill
                                        className="object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100 z-0"
                                    />
                                )}
                            </div>

                            {/* Added Lattafa Shopping Bag button bottom right corner */}
                            <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                className="absolute bottom-3 right-3 z-30 w-11 h-11 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center hover:scale-105 transition-transform"
                                aria-label="Add to cart"
                            >
                                <ShoppingBag className="w-5 h-5 text-gray-700 stroke-[1.5]" />
                            </button>

                            {/* Badges */}
                            {product.stock !== undefined && product.stock <= 0 && (
                                <span className="absolute top-4 left-4 z-20 text-xs tracking-wide font-medium bg-[#999999] text-white px-2.5 py-0.5 rounded">
                                    Sold out
                                </span>
                            )}
                        </div>

                        {/* Product Info — Lattafa-style hierarchy */}
                        <div className={`flex flex-col flex-1 px-1 text-left`}>
                            <p className="text-[13px] text-gray-500 mb-0.5">
                                {product.brand || "Lattafa"}
                            </p>
                            <h3 className="font-medium text-[15px] text-gray-900 mb-1 leading-snug">
                                <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
                                    {product.name}
                                </Link>
                            </h3>
                            <p className="font-bold text-gray-900 text-[15px] mt-1">
                                KES {product.price.toLocaleString()}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Load More */}
            {status === "CanLoadMore" && (
                <div className="flex justify-center pt-8">
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
