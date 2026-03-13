"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = [
    {
        id: 1,
        title: "Signature Perfumes",
        description: "Iconic scents crafted for those who dare to leave an impression.",
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1400&auto=format&fit=crop",
        link: "/shop?category=perfumes",
        accent: "#c9a86c",
    },
    {
        id: 2,
        title: "Premium Cosmetics",
        description: "Elevate your beauty ritual with luxuriously curated essentials.",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1400&auto=format&fit=crop",
        link: "/shop?category=cosmetics",
        accent: "#d4a5a5",
    },
    {
        id: 3,
        title: "Oud Collection",
        description: "Rare oud extracts and resinous musks from the Middle East.",
        image: "https://images.unsplash.com/photo-1610461888750-10bfc601b4a6?q=80&w=1400&auto=format&fit=crop",
        link: "/shop?category=oud",
        accent: "#a08060",
    },
    {
        id: 4,
        title: "Floral Essence",
        description: "Soft, romantic notes of rose, jasmine, and night-blooming flowers.",
        image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=1400&auto=format&fit=crop",
        link: "/shop?category=floral",
        accent: "#c4a0b8",
    },
    {
        id: 5,
        title: "Unisex Fragrances",
        description: "Bold and versatile. Scents that transcend boundaries.",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1400&auto=format&fit=crop",
        link: "/shop?category=unisex",
        accent: "#8090a0",
    },
    {
        id: 6,
        title: "Gift Sets",
        description: "Curated luxury gift experiences for every occasion.",
        image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1400&auto=format&fit=crop",
        link: "/shop?category=gifts",
        accent: "#b0a070",
    },
];

export function FeaturedCategories() {
    const [items, setItems] = useState(categories);
    const [isAnimating, setIsAnimating] = useState(false);

    const goNext = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
        setItems(prev => {
            const [first, ...rest] = prev;
            return [...rest, first];
        });
    }, [isAnimating]);

    const goPrev = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
        setItems(prev => {
            const last = prev[prev.length - 1];
            return [last, ...prev.slice(0, prev.length - 1)];
        });
    }, [isAnimating]);

    const active = items[1]; // The "hero" card is always at index 1

    return (
        <section className="relative w-full bg-background overflow-hidden" style={{ height: "90vh", minHeight: "550px" }}>

            {/* Ambient background glow */}
            <div
                className="absolute inset-0 transition-all duration-700"
                style={{
                    background: `radial-gradient(ellipse at 30% 60%, ${active.accent}22 0%, transparent 60%)`
                }}
            />

            {/* Section label */}
            <div className="absolute top-8 left-8 z-20">
                <p className="text-xs text-primary/40 tracking-[0.4em] uppercase font-medium">Collections</p>
            </div>

            {/* The Slider Track */}
            <div className="absolute inset-0 flex items-center">
                {items.map((item, index) => {
                    // positions:
                    // 0 = prev (hidden behind, left=0, full-size, faded)
                    // 1 = active  (left=0, full-size, bright)
                    // 2 = thumbnail 1
                    // 3 = thumbnail 2
                    // 4 = thumbnail 3
                    // 5+ = hidden

                    const isHero = index === 1;
                    const isPrev = index === 0;
                    const isThumbnail = index >= 2 && index <= 4;
                    const isHidden = index >= 5;

                    // Thumbnail positioning
                    const thumbBase = "calc(50% + 60px)";
                    const thumbOffset = (index - 2) * 200; // 200px apart
                    const thumbLeft = `calc(${thumbBase} + ${thumbOffset}px)`;

                    return (
                        <div
                            key={item.id}
                            onClick={isThumbnail ? goNext : undefined}
                            className="absolute top-0 bottom-0"
                            style={{
                                // Full-screen cards
                                ...(isHero || isPrev ? {
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    borderRadius: 0,
                                    width: "100%",
                                    height: "100%",
                                    opacity: isHero ? 1 : 0,
                                    zIndex: isHero ? 10 : 5,
                                    transition: "opacity 0.6s ease, transform 0.6s ease",
                                } : {}),

                                // Thumbnail cards
                                ...(isThumbnail ? {
                                    left: thumbLeft,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: "170px",
                                    height: "230px",
                                    borderRadius: "16px",
                                    zIndex: 20,
                                    cursor: "pointer",
                                    opacity: 1 - (index - 2) * 0.2,
                                    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                                    overflow: "hidden",
                                } : {}),

                                // Hidden cards
                                ...(isHidden ? {
                                    left: "calc(100% + 100px)",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    width: "170px",
                                    height: "230px",
                                    borderRadius: "16px",
                                    opacity: 0,
                                    zIndex: 1,
                                    transition: "all 0.5s ease",
                                } : {}),
                            }}
                        >
                            {/* Card image */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{
                                    transition: "transform 0.7s ease",
                                }}
                            />

                            {/* Gradient overlay — only on hero */}
                            {isHero && (
                                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent z-10" />
                            )}

                            {/* Thumbnail overlay */}
                            {isThumbnail && (
                                <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors duration-300 z-10 flex items-end p-3">
                                    <p className="text-white text-xs font-medium leading-tight line-clamp-2">{item.title}</p>
                                </div>
                            )}

                            {/* Hero Text Content */}
                            {isHero && (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 60, filter: "blur(16px)" }}
                                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute left-12 md:left-20 bottom-16 md:bottom-24 z-20 max-w-sm"
                                    >
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.15, duration: 0.6 }}
                                            className="text-xs tracking-[0.4em] text-primary/60 uppercase mb-3"
                                        >
                                            {String(items.indexOf(item)).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
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
                                        >
                                            <Link
                                                href={item.link}
                                                className="inline-flex items-center gap-3 bg-primary/80 hover:bg-primary backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-full text-sm font-fredoka font-medium transition-all duration-300 hover:gap-5 shadow-lg"
                                            >
                                                Explore Collection
                                                <ArrowRight className="w-4 h-4" />
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
                    className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 backdrop-blur-md border border-primary/20 flex items-center justify-center text-primary transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50"
                    aria-label="Previous category"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Dot indicators */}
                <div className="flex gap-2">
                    {categories.map((_, i) => (
                        <div
                            key={i}
                            className="h-1 rounded-full transition-all duration-400 bg-white"
                            style={{
                                width: items[1].id === categories[i].id ? "24px" : "6px",
                                opacity: items[1].id === categories[i].id ? 1 : 0.3,
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={goNext}
                    disabled={isAnimating}
                    className="w-12 h-12 rounded-full bg-primary/10 hover:bg-primary/20 backdrop-blur-md border border-primary/20 flex items-center justify-center text-primary transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50"
                    aria-label="Next category"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Right edge fade to hide thumbnails */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-950 to-transparent z-25 pointer-events-none" />

        </section>
    );
}
