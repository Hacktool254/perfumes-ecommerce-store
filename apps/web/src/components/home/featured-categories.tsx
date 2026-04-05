"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useRouter } from "next/navigation";

const baseCategories = [
    {
        id: 1,
        slug: "men",
        title: "Men's Fragrances",
        description: "Bold, sophisticated, and powerful scents designed for the modern gentleman.",
        image: "/categories/mens-fragrance.jpg",
        link: "/shop?gender=men",
        accent: "#8c7a6b",
    },
    {
        id: 2,
        slug: "women",
        title: "Women's Fragrances",
        description: "Elegant, floral, and captivating aromas that leave a lasting impression.",
        image: "/categories/womens-fragrance.jpg",
        link: "/shop?gender=women",
        accent: "#d4a5a5",
    },
    {
        id: 3,
        slug: "unisex",
        title: "Unisex Fragrances",
        description: "Versatile and perfectly balanced masterpieces that transcend boundaries.",
        image: "/categories/unisex-fragrance.jpg",
        link: "/shop?gender=unisex",
        accent: "#8090a0",
    },
    {
        id: 4,
        slug: "perfume",
        title: "Perfume",
        description: "Explore our curated selection of premium, long-lasting luxury perfumes.",
        image: "/categories/perfumes.jpg",
        link: "/shop",
        accent: "#c9a86c",
    },
    {
        id: 5,
        slug: "body-wash",
        title: "Body Wash",
        description: "Refresh and invigorate your daily routine with our fragrant body washes.",
        image: "/categories/bodywash.jpg",
        link: "/shop",
        accent: "#7ab8aa",
    },
    {
        id: 6,
        slug: "body-oils",
        title: "Body Oil",
        description: "Nourishing, rich, and deeply moisturizing oils for a radiant glow.",
        image: "/categories/body-oil.jpg",
        link: "/shop",
        accent: "#a08060",
    },
];

export function FeaturedCategories() {
    const router = useRouter();
    const dbCategories = useQuery(api.categories.list);
    const [offset, setOffset] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const itemsWithLinks = useMemo(() => {
        return baseCategories.map(cat => {
            if (["men", "women", "unisex"].includes(cat.slug)) return cat;
            
            const dbMatch = dbCategories?.find((dbCat: any) => {
                const testName = `${dbCat.slug} ${dbCat.name}`.toLowerCase();
                if (cat.slug === "perfume") return testName.includes("perfume");
                if (cat.slug === "body-wash") return testName.includes("wash");
                if (cat.slug === "body-oils") return testName.includes("oil");
                return false;
            });

            return {
                ...cat,
                link: dbMatch ? `/shop?category=${dbMatch._id}` : cat.link,
            };
        });
    }, [dbCategories]);

    const items = useMemo(() => {
        return [
            ...itemsWithLinks.slice(offset),
            ...itemsWithLinks.slice(0, offset)
        ];
    }, [itemsWithLinks, offset]);

    const goNext = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
        setOffset(prev => (prev + 1) % baseCategories.length);
    }, [isAnimating]);

    const goPrev = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
        setOffset(prev => (prev - 1 + baseCategories.length) % baseCategories.length);
    }, [isAnimating]);

    const active = items[1]; // The "hero" card is always at index 1

    return (
        <section className="relative w-full bg-background overflow-hidden" style={{ height: "75vh", minHeight: "450px" }}>

            {/* Ambient background glow */}
            <div
                className="absolute inset-0 transition-all duration-700 pointer-events-none"
                style={{
                    background: `radial-gradient(ellipse at 30% 60%, ${active.accent}22 0%, transparent 60%)`
                }}
            />

            {/* Section label */}
            <div className="absolute top-8 left-8 z-20 pointer-events-none">
                <p className="text-xs text-primary/40 tracking-[0.4em] uppercase font-medium">Collections</p>
            </div>

            {/* The Slider Track */}
            <div className="absolute inset-0 flex items-center">
                {items.map((item, index) => {
                    const isHero = index === 1;
                    const isPrev = index === 0;
                    const isThumbnail = index >= 2 && index <= 4;
                    const isHidden = index >= 5;

                    const thumbBase = "calc(50% + 10px)";
                    const thumbOffset = (index - 2) * 200;
                    const thumbLeft = `calc(${thumbBase} + ${thumbOffset}px)`;

                    return (
                        <div
                            key={item.id}
                            onClick={isThumbnail ? goNext : (isHero ? () => router.push(item.link) : undefined)}
                            className={`absolute top-0 bottom-0 ${isHero ? "cursor-pointer" : ""}`}
                            style={{
                                ...(isHero || isPrev ? {
                                    left: 0, right: 0, top: 0, bottom: 0,
                                    borderRadius: 0, width: "100%", height: "100%",
                                    opacity: isHero ? 1 : 0,
                                    zIndex: isHero ? 10 : 5,
                                    transition: "opacity 0.6s ease, transform 0.6s ease",
                                } : {}),
                                ...(isThumbnail ? {
                                    left: thumbLeft, top: "50%",
                                    transform: "translateY(-50%)",
                                    width: "170px", height: "230px",
                                    borderRadius: "16px",
                                    zIndex: 20, cursor: "pointer",
                                    opacity: 1 - (index - 2) * 0.2,
                                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                                    overflow: "hidden",
                                } : {}),
                                ...(isHidden ? {
                                    left: "calc(100% + 100px)", top: "50%",
                                    transform: "translateY(-50%)",
                                    width: "170px", height: "230px",
                                    borderRadius: "16px",
                                    opacity: 0, zIndex: 1,
                                    transition: "all 0.5s ease",
                                } : {}),
                            }}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ transition: "transform 0.7s ease" }}
                            />

                            {isHero && (
                                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent z-10 pointer-events-none" />
                            )}

                            {isThumbnail && (
                                <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors duration-300 z-10 flex items-end p-3">
                                    <p className="text-white text-xs font-medium leading-tight line-clamp-2">{item.title}</p>
                                </div>
                            )}

                            {isHero && (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 60, filter: "blur(16px)" }}
                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute left-12 md:left-20 bottom-16 md:bottom-24 z-20 max-w-sm pointer-events-none"
                                    >
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15, duration: 0.6 }}
                                            className="text-xs tracking-[0.4em] text-primary/60 uppercase mb-3"
                                        >
                                            {String(items.indexOf(item)).padStart(2, '0')} / {String(baseCategories.length).padStart(2, '0')}
                                        </motion.p>
                                        <motion.h2
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1, duration: 0.7 }}
                                            className="font-fredoka text-4xl md:text-6xl text-primary leading-none mb-4 uppercase"
                                        >
                                            {item.title}
                                        </motion.h2>
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.25, duration: 0.6 }}
                                            className="text-secondary/80 text-sm md:text-base mb-8 leading-relaxed"
                                        >
                                            {item.description}
                                        </motion.p>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4, duration: 0.6 }}
                                            className="pointer-events-auto"
                                        >
                                            <Link
                                                href={item.link}
                                                onClick={(e) => e.stopPropagation()}
                                                className="btn-lattafa-primary btn-lattafa-ghost btn-pill font-fredoka shadow-lg"
                                            >
                                                Explore Collection
                                                <ArrowRight className="w-4 h-4 btn-arrow" />
                                            </Link>
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Navigation Buttons */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
                <button
                    onClick={goPrev}
                    disabled={isAnimating}
                    className="btn-lattafa-icon backdrop-blur-md border border-primary/20 disabled:opacity-50"
                    aria-label="Previous category"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Dot indicators */}
                <div className="flex gap-2">
                    {baseCategories.map((_, i) => (
                        <div
                            key={i}
                            className="h-1 rounded-full transition-all duration-400 bg-white"
                            style={{
                                width: items[1].id === baseCategories[i].id ? "24px" : "6px",
                                opacity: items[1].id === baseCategories[i].id ? 1 : 0.3,
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={goNext}
                    disabled={isAnimating}
                    className="btn-lattafa-icon backdrop-blur-md border border-primary/20 disabled:opacity-50"
                    aria-label="Next category"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-950 to-transparent z-25 pointer-events-none" />
        </section>
    );
}
