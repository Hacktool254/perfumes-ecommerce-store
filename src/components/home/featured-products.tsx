"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag } from "lucide-react";

// Mock data, in a real app this would come from a database/Convex
const featuredProducts = [
    {
        id: 1,
        name: "Golden Sands",
        brand: "Desert Collection",
        price: 15000,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
        href: "/shop/golden-sands"
    },
    {
        id: 2,
        name: "Noir Elegance",
        brand: "Evening Wear",
        price: 24000,
        image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
        href: "/shop/noir-elegance"
    },
    {
        id: 3,
        name: "Citrus Bloom",
        brand: "Summer Essentials",
        price: 12500,
        image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=800&auto=format&fit=crop",
        href: "/shop/citrus-bloom"
    },
    {
        id: 4,
        name: "Amber Wood",
        brand: "Signature",
        price: 19800,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop",
        href: "/shop/amber-wood"
    }
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

export function FeaturedProductsGrid() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
            <div className="container mx-auto px-4">

                <div className="text-center mb-16">
                    <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
                        Curated For You
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Explore our hand-picked selection of premium fragrances that define luxury and elegance.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
                >
                    {featuredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            variants={itemVariants as any}
                            className="group flex flex-col"
                        >
                            <div className="relative aspect-[3/4] bg-secondary/30 mb-4 overflow-hidden rounded-sm">
                                <Link href={product.href} className="absolute inset-0 z-10">
                                    <span className="sr-only">View {product.name}</span>
                                </Link>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />

                                {/* Add to Cart Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                    <button className="w-full bg-white/90 backdrop-blur-sm text-black rounded-full py-3 px-4 flex items-center justify-center gap-2 font-medium hover:bg-gold-muted hover:text-white transition-colors">
                                        <ShoppingBag className="w-4 h-4" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col flex-1 px-1 text-center">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{product.brand}</p>
                                <h3 className="font-serif text-lg text-foreground mb-2">
                                    <Link href={product.href} className="hover:text-accent transition-colors">
                                        {product.name}
                                    </Link>
                                </h3>
                                <p className="font-medium text-foreground mt-auto">
                                    KES {product.price.toLocaleString()}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="mt-16 text-center">
                    <Link
                        href="/shop"
                        className="inline-block border border-border px-8 py-3 rounded-full hover:bg-foreground hover:text-background transition-colors duration-300"
                    >
                        View Entire Collection
                    </Link>
                </div>

            </div>
        </section>
    );
}
