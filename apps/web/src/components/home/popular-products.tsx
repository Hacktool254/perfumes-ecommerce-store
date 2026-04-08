"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Check } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

const newArrivalProducts = [
    { id: "h1", name: "Angham", brand: "Lattafa", image: "/products/Lattafa-Angham.jpg", imageHover: "/products/Lattafa-Angham-1.jpg", slug: "lattafa-angham", price: 4500 },
    { id: "h2", name: "Rimmah", brand: "Lattafa", image: "/products/Lattafa-Rimmah.jpg", imageHover: "/products/Lattafa-Rimmah-1.jpg", slug: "lattafa-rimmah", price: 4200 },
    { id: "h3", name: "Scarlet", brand: "Lattafa", image: "/products/Lattafa-Scarlet.jpg", imageHover: "/products/Lattafa-Scarlet-1.jpg", slug: "lattafa-scarlet", price: 3800 },
    { id: "h4", name: "Atheri", brand: "Lattafa", image: "/products/Lattafa-Atheri.jpg", imageHover: "/products/Lattafa-Atheri-1.jpg", slug: "lattafa-atheri", price: 4000 },
];

const bestSellerProducts = [
    { id: "b1", name: "Asad", brand: "Lattafa", image: "/products/Lattafa-Assad.jpg", imageHover: "/products/Lattafa-Assad-1.jpg", slug: "lattafa-asad", price: 5500 },
    { id: "b2", name: "Yara", brand: "Lattafa", image: "/products/Lattafa-Yara.jpg", imageHover: "/products/Lattafa-Yara-1.jpg", slug: "lattafa-yara", price: 4800 },
    { id: "b3", name: "Mayar", brand: "Lattafa", image: "/products/Lattafa-Mayar.jpg", imageHover: "/products/Lattafa-Mayar-1.jpg", slug: "lattafa-mayar", price: 3800 },
    { id: "b4", name: "Sublime", brand: "Lattafa", image: "/products/Lattafa-Sublime.jpg", imageHover: "/products/Lattafa-Sublime-1.jpg", slug: "lattafa-sublime", price: 5200 },
];

export function PopularProducts() {
    const [activeTab, setActiveTab] = useState<"new" | "best">("best");
    const { addItem } = useCart();
    const [addedId, setAddedId] = useState<string | null>(null);

    const currentProducts = activeTab === "best" ? bestSellerProducts : newArrivalProducts;

    const handleAddToCart = async (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await addItem(product.id, 1, { _id: product.id, name: product.name, price: product.price, images: [product.image], slug: product.slug });
            setAddedId(product.id);
            setTimeout(() => setAddedId(null), 1500);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    return (
        <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-4 max-w-[1440px]">
                
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-6 md:gap-10">
                        <button 
                            onClick={() => setActiveTab("best")}
                            className={`text-[22px] md:text-[24px] tracking-wide transition-colors ${
                                activeTab === "best" ? "text-black font-semibold" : "text-gray-400 font-normal hover:text-black"
                            }`}
                        >
                            Best Sellers
                        </button>
                        <button 
                            onClick={() => setActiveTab("new")}
                            className={`text-[22px] md:text-[24px] tracking-wide transition-colors ${
                                activeTab === "new" ? "text-black font-semibold" : "text-gray-400 font-normal hover:text-black"
                            }`}
                        >
                            New Arrivals
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
                        {currentProducts.map((product, idx) => (
                            <Link href={`/product/${product.slug}`} key={product.id} className="group block cursor-pointer flex flex-col">
                                {/* Image Container */}
                                <div className="relative aspect-[4/5] bg-[#f7f7f7] rounded-[16px] overflow-hidden mb-4 p-4 flex items-center justify-center isolate">
                                    {/* Primary Image */}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={`w-full h-full object-contain transition-opacity duration-500 ease-in-out ${product.imageHover ? 'group-hover:opacity-0' : ''}`}
                                    />
                                    {/* Secondary Hover Image */}
                                    {product.imageHover && (
                                        <img
                                            src={product.imageHover}
                                            alt={`${product.name} alternate view`}
                                            className="absolute inset-0 w-full h-full object-contain opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                                        />
                                    )}

                                    {/* Quick View Icon */}
                                    <div className="absolute top-4 right-4 z-20 bg-black text-white rounded-full p-2.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 w-10 h-10 flex items-center justify-center hover:scale-110">
                                        <Search className="w-4 h-4" />
                                    </div>

                                    {/* Add to Cart Button - visible on hover */}
                                    <div className="absolute inset-x-4 bottom-4 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <button 
                                            onClick={(e) => handleAddToCart(e, product)} 
                                            className={`btn-lattafa-primary btn-add-to-cart btn-pill w-full py-3 shadow-xl flex items-center justify-center gap-2 group/btn transition-all ${
                                                addedId === product.id ? 'bg-green-600 hover:bg-green-600' : ''
                                            }`}
                                        >
                                            {addedId === product.id ? (
                                                <>
                                                    <Check className="w-4 h-4 relative z-10 text-white" />
                                                    <span className="relative z-10 text-white font-bold">ADDED!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="relative z-10">ADD TO CART</span>
                                                    <ArrowRight className="w-4 h-4 btn-arrow relative z-10" />
                                                </>
                                            )}
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
                                        <span className="text-[14px] font-bold text-black">
                                            KES {product.price.toLocaleString()}
                                        </span>
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
