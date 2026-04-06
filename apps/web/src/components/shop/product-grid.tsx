"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart, Eye, Loader2, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useSearchParams } from "next/navigation";
import { Id } from "@workspaceRoot/convex/_generated/dataModel";

const ITEMS_PER_PAGE = 12;

export function ProductGrid() {
    const searchParams = useSearchParams();
    const activeCategoriesRaw = searchParams?.get("category");
    const activeBrandsRaw = searchParams?.get("brand");
    const gender = searchParams?.get("gender") as "men" | "women" | "unisex" | null;
    const currentView = searchParams?.get("view") || "grid";
    const minPriceRaw = searchParams?.get("minPrice");
    const maxPriceRaw = searchParams?.get("maxPrice");
    const inStockRaw = searchParams?.get("inStock");

    const categoryIds = activeCategoriesRaw 
        ? (activeCategoriesRaw.split(",").filter(id => id.length >= 30) as Id<"categories">[]) 
        : [];
    
    const brands = activeBrandsRaw ? activeBrandsRaw.split(",").filter(Boolean) : [];

    const minPrice = minPriceRaw ? parseInt(minPriceRaw, 10) : undefined;
    const maxPrice = maxPriceRaw ? parseInt(maxPriceRaw, 10) : undefined;
    const inStock = inStockRaw ? inStockRaw === "true" : undefined;

    const [currentPage, setCurrentPage] = useState(1);

    const { results, status, loadMore } = usePaginatedQuery(
        api.products.list,
        {
            categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
            gender: gender || undefined,
            brands: brands.length > 0 ? brands : undefined,
            minPrice: minPrice,
            maxPrice: maxPrice,
            inStock: inStock
        },
        { initialNumItems: 200 } // Load all for pagination
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategoriesRaw, gender, activeBrandsRaw, minPriceRaw, maxPriceRaw, inStockRaw]);

    // Keep loading until we have all items
    useEffect(() => {
        if (status === "CanLoadMore") {
            loadMore(200);
        }
    }, [status, loadMore]);

    const totalItems = results.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

    // Get current page items
    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return results.slice(start, end);
    }, [results, currentPage]);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];
        
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push("...");
            }
            
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - 2) {
                pages.push("...");
            }
            
            pages.push(totalPages);
        }
        
        return pages;
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
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
        <div className="space-y-8">
            {/* Top Toolbar (Count & Sort) */}
            <div className="flex items-center justify-between text-[#2f2f2f] text-sm pt-2">
                <span>{totalItems} products</span>
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
                {currentItems.map((product, idx) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                        className={`group flex ${currentView === "list" ? "flex-row md:flex-col gap-6 md:gap-0 items-center md:items-start" : "flex-col"}`}
                    >
                        {/* Image Container */}
                        <Link 
                            href={`/product/${product.slug}`} 
                            className={`relative block ${currentView === "list" ? "w-1/3 md:w-full aspect-[3/4] md:aspect-[4/5]" : "w-full aspect-[4/5]"} bg-[#f7f7f7] mb-4 rounded-3xl overflow-hidden`}
                        >
                            <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out">
                                <Image
                                    src={product.images[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800"}
                                    alt={product.name}
                                    fill
                                    className={`object-cover transition-opacity duration-700 ease-in-out ${product.images[1] ? 'group-hover:opacity-0' : ''}`}
                                />
                                {product.images[1] && (
                                    <Image
                                        src={product.images[1]}
                                        alt={`${product.name} alternate view`}
                                        fill
                                        className="object-cover transition-opacity duration-700 ease-in-out opacity-0 group-hover:opacity-100"
                                    />
                                )}
                            </div>

                            {/* Badges */}
                            {product.stock !== undefined && product.stock <= 0 && (
                                <span className="absolute top-4 left-4 z-20 text-xs tracking-wide font-medium bg-[#999999] text-white px-2.5 py-0.5 rounded">
                                    Sold out
                                </span>
                            )}
                            {/* Quick Add Cart Button — Appears on hover */}
                            <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-30">
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    className="btn-lattafa-primary btn-add-to-cart btn-pill w-full py-2.5 shadow-xl flex items-center justify-center gap-2 text-[10px] sm:text-[11px] group/btn"
                                    aria-label="Add to cart"
                                >
                                    <span className="relative z-10 font-bold tracking-widest text-white">ADD TO CART</span>
                                    <ArrowRight className="w-3.5 h-3.5 btn-arrow relative z-10 text-white" />
                                </button>
                            </div>
                        </Link>

                        {/* Product Info — fully clickable */}
                        <Link href={`/product/${product.slug}`} className="flex flex-col flex-1 px-1 text-left">
                            <p className="text-[13px] text-gray-500 mb-0.5">
                                {product.brand || "Lattafa"}
                            </p>
                            <h3 className="font-medium text-[15px] text-gray-900 mb-1 leading-snug hover:text-primary transition-colors">
                                {product.name}
                            </h3>
                            <p className="font-bold text-gray-900 text-[15px] mt-1">
                                KES {product.price.toLocaleString()}
                            </p>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 pt-8 pb-4">
                    {/* Previous Button */}
                    {currentPage > 1 && (
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-[#2f2f2f] hover:text-black transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Previous</span>
                        </button>
                    )}

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, idx) => (
                        page === "..." ? (
                            <span key={`dots-${idx}`} className="px-2 py-2 text-sm text-gray-400">
                                ...
                            </span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page as number)}
                                className={`min-w-[40px] h-10 flex items-center justify-center text-sm font-medium rounded-full transition-all ${
                                    currentPage === page
                                        ? "bg-[#2f2f2f] text-white"
                                        : "text-[#2f2f2f] hover:bg-gray-100"
                                }`}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    {/* Next Button */}
                    {currentPage < totalPages && (
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="flex items-center gap-1 px-3 py-2 text-sm text-[#2f2f2f] hover:text-black transition-colors"
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
