"use client";

export const metadata = {
    title: "Fragrance Collections & Categories",
    description: "Explore our curated collections of luxury perfumes and premium cosmetics. Filter by scent profile, gender, and product type.",
};

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { CategoryCard } from "@/components/categories/category-card";
import { motion } from "framer-motion";

export default function CategoriesPage() {
    const categories = useQuery(api.categories.list);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (categories === undefined) {
        return (
            <div className="min-h-screen pt-40 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="h-8 w-64 bg-secondary/50 animate-pulse rounded-md mb-8" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="aspect-[4/5] bg-secondary/30 animate-pulse rounded-sm" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-background pt-24 pb-32">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header */}
                <div className="mb-16">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-serif text-4xl md:text-6xl text-foreground mb-4"
                    >
                        Collections
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground max-w-xl text-lg"
                    >
                        Explore our curated selections of luxury fragrances and premium cosmetics, categorized to help you find your perfect essence.
                    </motion.p>
                </div>

                {/* Gender Collections */}
                <div className="mb-20">
                    <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 text-center md:text-left">Curated for You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Men's Collection */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm group cursor-pointer"
                        >
                            <a href="/shop?gender=men" className="absolute inset-0 z-10">
                                <span className="sr-only">Men's Collection</span>
                            </a>
                            <img
                                src="https://images.unsplash.com/photo-1595150913920-565492ac6917?q=80&w=1200&auto=format&fit=crop"
                                alt="Men's Collection"
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                                <span className="text-xs uppercase tracking-[0.3em] font-bold mb-2 opacity-80">Refined & Bold</span>
                                <h3 className="font-serif text-4xl md:text-6xl mb-4">Men&apos;s Collection</h3>
                                <div className="h-1 w-12 bg-white transition-all group-hover:w-24" />
                            </div>
                        </motion.div>

                        {/* Women's Collection */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm group cursor-pointer"
                        >
                            <a href="/shop?gender=women" className="absolute inset-0 z-10">
                                <span className="sr-only">Women's Collection</span>
                            </a>
                            <img
                                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop"
                                alt="Women's Collection"
                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                                <span className="text-xs uppercase tracking-[0.3em] font-bold mb-2 opacity-80">Elegant & Graceful</span>
                                <h3 className="font-serif text-4xl md:text-6xl mb-4">Women&apos;s Collection</h3>
                                <div className="h-1 w-12 bg-white transition-all group-hover:w-24" />
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="mb-12">
                    <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8 text-center md:text-left">By Product Type</h2>
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-40 border border-dashed border-border rounded-lg">
                        <p className="text-muted-foreground font-serif text-xl">Our collections are currently being curated.</p>
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {categories.filter(c => !["men", "women"].includes(c.slug)).map((category) => (
                            <motion.div key={category._id} variants={item}>
                                <CategoryCard category={category as any} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

            </div>
        </main>
    );
}
