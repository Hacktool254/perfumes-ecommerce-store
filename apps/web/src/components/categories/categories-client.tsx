"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { motion } from "framer-motion";
import Link from "next/link";

const genderCollections = [
    {
        slug: "men",
        name: "Men's Fragrances",
        image: "/categories/mens-fragrance.jpg",
    },
    {
        slug: "women",
        name: "Women's Fragrances",
        image: "/categories/womens-fragrance.jpg",
    },
    {
        slug: "unisex",
        name: "Unisex Fragrances",
        image: "/categories/unisex-fragrance.jpg",
    },
];

export function CategoriesClient() {
    const categories = useQuery(api.categories.list);

    if (categories === undefined) {
        return (
            <div className="min-h-screen pt-40 px-4 flex flex-col items-center">
                <div className="container mx-auto max-w-7xl">
                    <div className="h-8 w-64 bg-secondary/50 animate-pulse rounded-md mb-8 mx-auto md:mx-0" />
                    <div className="flex gap-4 overflow-hidden mb-12">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="min-w-[200px] aspect-[4/5] bg-secondary/30 animate-pulse rounded-xl" />
                        ))}
                    </div>
                </div>
                <div className="text-muted-foreground animate-pulse text-sm mt-8 italic tracking-wide">Connecting to fragrance library...</div>
            </div>
        );
    }

    const getCategoryImage = (slug: string, name: string, dbUrl?: string) => {
        if (dbUrl) return dbUrl;
        
        const testName = `${slug} ${name}`.toLowerCase();
        
        if (testName.includes("perfume")) return "/categories/perfumes.jpg";
        if (testName.includes("wash")) return "/categories/bodywash.jpg";
        if (testName.includes("oil")) return "/categories/body-oil.jpg";
            
        return "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600&auto=format&fit=crop";
    };

    const allCollections = [
        ...genderCollections,
        ...categories
            .filter((c: any) => !["men", "women", "unisex"].includes(c.slug))
            .map((c: any) => ({
                slug: c.slug,
                name: c.name,
                image: getCategoryImage(c.slug, c.name, c.imageUrl),
                _id: c._id,
            })),
    ];

    return (
        <main className="min-h-screen bg-background pt-24 pb-32">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Page Header */}
                <div className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl md:text-5xl text-foreground mb-3"
                    >
                        Collections
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground max-w-lg text-sm"
                    >
                        Explore our curated selections of luxury fragrances and premium cosmetics.
                    </motion.p>
                </div>

                {/* Sub-Collections Horizontal Strip — Lattafa Style */}
                <div className="mb-16">
                    <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent -mx-4 px-4">
                        {allCollections.map((col, idx) => (
                            <motion.div
                                key={col.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.08 }}
                                className="min-w-[180px] md:min-w-[220px] flex-shrink-0"
                            >
                                <Link
                                    href={
                                        genderCollections.some(g => g.slug === col.slug)
                                            ? `/shop?gender=${col.slug}`
                                            : `/shop?category=${(col as any)._id || col.slug}`
                                    }
                                    className="group block"
                                >
                                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary/40 mb-3">
                                        <img
                                            src={col.image}
                                            alt={col.name}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                                    </div>
                                    <h3 className="font-serif text-sm text-foreground text-center group-hover:text-primary transition-colors">
                                        {col.name}
                                    </h3>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border mb-12" />

                {/* Featured Collections — Gender Banners */}
                <div className="mb-16">
                    <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">Curated for You</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {genderCollections.map((col, idx) => (
                            <motion.div
                                key={col.slug}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + idx * 0.1 }}
                            >
                                <Link
                                    href={`/shop?gender=${col.slug}`}
                                    className="group relative block aspect-[4/5] overflow-hidden rounded-xl"
                                >
                                    <img
                                        src={col.image}
                                        alt={col.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/50 transition-colors duration-500" />
                                    <div className="absolute inset-0 flex flex-col items-center justify-end text-white p-8 pb-10">
                                        <h3 className="font-serif text-2xl md:text-3xl mb-2 text-center">{col.name}</h3>
                                        <span className="text-xs uppercase tracking-[0.3em] opacity-80 group-hover:opacity-100 transition-opacity">
                                            Shop Now
                                        </span>
                                        <div className="h-0.5 w-8 bg-white mt-3 transition-all duration-500 group-hover:w-16" />
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Product Type Categories */}
                {categories.filter((c: any) => !["men", "women", "unisex"].includes(c.slug)).length > 0 && (
                    <div>
                        <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-8">By Product Type</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {categories
                                .filter((c: any) => !["men", "women", "unisex"].includes(c.slug))
                                .map((category: any, idx: number) => (
                                    <motion.div
                                        key={category._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + idx * 0.06 }}
                                    >
                                        <Link
                                            href={`/shop?category=${category._id}`}
                                            className="group block"
                                        >
                                            <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary/40 mb-3">
                                                <img
                                                    src={getCategoryImage(category.slug, category.name, category.imageUrl)}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/40 transition-colors duration-500" />
                                                <div className="absolute inset-0 flex items-end p-5">
                                                    <h3 className="font-serif text-lg text-white">{category.name}</h3>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
