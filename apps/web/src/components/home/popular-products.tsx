"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

// Mock data for the two tabs
const newArrivals: Array<{id: string, name: string, brand: string, price: number, originalPrice?: number, image: string, hoverImage: string, href: string}> = [
    {
        id: "na1",
        name: "Angham Second Song",
        brand: "Lattafa",
        price: 49.99,
        originalPrice: 59.99,
        image: "/products/Lattafa-Angham.jpg",
        hoverImage: "/products/Lattafa-Angham-1.jpg",
        href: "/product/lattafa-angham"
    },
    {
        id: "na2",
        name: "Mishlah",
        brand: "Lattafa",
        price: 49.99,
        image: "/products/Lattafa-Sakeena.jpg",
        hoverImage: "/products/Lattafa-Sakeena-1.jpg",
        href: "/product/lattafa-sakeena"
    },
    {
        id: "na3",
        name: "Asad Collection 4x25ml",
        brand: "Lattafa",
        price: 59.99,
        image: "/products/Lattafa-Assad.jpg",
        hoverImage: "/products/Lattafa-Assad-1.jpg",
        href: "/product/lattafa-asad"
    },
    {
        id: "na4",
        name: "Teriaq",
        brand: "Lattafa",
        price: 45.00,
        image: "/products/Lattafa-Teriaq.jpg",
        hoverImage: "/products/Lattafa-Teriaq-1.jpg",
        href: "/product/lattafa-teriaq"
    }
];

const bestSellers: Array<{id: string, name: string, brand: string, price: number, originalPrice?: number, image: string, hoverImage: string, href: string}> = [
    {
        id: "bs1",
        name: "Nebras",
        brand: "Lattafa",
        price: 36.00,
        image: "/products/Lattafa-Nebras.jpg",
        hoverImage: "/products/Lattafa-Nebras-1.jpg",
        href: "/product/lattafa-nebras"
    },
    {
        id: "bs2",
        name: "Yara",
        brand: "Lattafa",
        price: 35.00,
        image: "/products/Lattafa-Yara.jpg",
        hoverImage: "/products/Lattafa-Yara-1.jpg",
        href: "/product/lattafa-yara-pink"
    },
    {
        id: "bs3",
        name: "Khamrah",
        brand: "Lattafa",
        price: 49.00,
        image: "/products/Lattafa-Khamrah.jpg",
        hoverImage: "/products/Lattafa-Khamrah-1.jpg",
        href: "/product/lattafa-khamrah"
    },
    {
        id: "bs4",
        name: "Mayar",
        brand: "Lattafa",
        price: 38.00,
        image: "/products/Lattafa-Mayar.jpg",
        hoverImage: "/products/Lattafa-Mayar-1.jpg",
        href: "/product/lattafa-mayar"
    }
];

export function PopularProducts() {
    const [activeTab, setActiveTab] = useState<"new" | "best">("new");

    const currentProducts = activeTab === "new" ? newArrivals : bestSellers;

    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4 max-w-[1440px]">
                
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-6 md:gap-10">
                        <button 
                            onClick={() => setActiveTab("new")}
                            className={`text-[22px] md:text-[24px] tracking-wide transition-colors ${
                                activeTab === "new" ? "text-black font-semibold" : "text-gray-400 font-normal hover:text-black"
                            }`}
                        >
                            New Arrivals
                        </button>
                        <button 
                            onClick={() => setActiveTab("best")}
                            className={`text-[22px] md:text-[24px] tracking-wide transition-colors ${
                                activeTab === "best" ? "text-black font-semibold" : "text-gray-400 font-normal hover:text-black"
                            }`}
                        >
                            Best Sellers
                        </button>
                    </div>
                    <Link 
                        href="/shop" 
                        className="hidden md:inline-block text-[13px] tracking-[0.15em] font-semibold uppercase text-black border-b-[2px] border-black pb-1 mt-4 md:mt-0 hover:text-gray-600 hover:border-gray-600 transition-colors"
                    >
                        SHOP ALL
                    </Link>
                </div>

                {/* Product Grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
                    >
                        {currentProducts.map((product) => (
                            <Link href={product.href} key={product.id} className="group block cursor-pointer flex flex-col">
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] bg-[#f7f7f7] rounded-[16px] overflow-hidden mb-4 p-4 flex items-center justify-center isolate">
                                    {/* Primary Image */}
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                                    />
                                    {/* Secondary Hover Image */}
                                    <Image
                                        src={product.hoverImage}
                                        alt={`${product.name} alternative view`}
                                        fill
                                        className="object-contain absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                                    />

                                    {/* Quick View Icon */}
                                    <div className="absolute top-4 right-4 z-20 bg-black text-white rounded-full p-2.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 w-10 h-10 flex items-center justify-center hover:scale-110">
                                        <Search className="w-4 h-4" />
                                    </div>

                                    {/* Add to Cart Button placed precisely on hovering product bottom */}
                                    <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                        <button 
                                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
                                            className="bg-black text-white font-medium rounded-[30px] w-full py-3.5 tracking-wide text-sm flex items-center justify-center hover:bg-gray-800 transition-colors"
                                        >
                                            ADD TO CART
                                        </button>
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="flex flex-col flex-1 text-left px-1">
                                    <p className="text-[12px] text-gray-400 mb-1">{product.brand}</p>
                                    <h3 className="text-[14px] font-semibold text-[#1a1a1a] mb-1 group-hover:underline">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-auto">
                                        <span className={`text-[14px] font-bold ${product.originalPrice ? "text-[#d12020]" : "text-black"}`}>
                                            ${product.price.toFixed(2)} USD
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-[14px] text-gray-400 line-through">
                                                ${product.originalPrice.toFixed(2)} USD
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                </AnimatePresence>
                
                {/* Mobile Shop All link */}
                <div className="mt-8 text-center md:hidden">
                    <Link 
                        href="/shop" 
                        className="inline-block text-[13px] tracking-[0.15em] font-semibold uppercase text-black border-b-[2px] border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
                    >
                        SHOP ALL
                    </Link>
                </div>
            </div>
        </section>
    );
}
