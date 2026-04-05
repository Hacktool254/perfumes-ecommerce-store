"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { ShoppingBag } from "lucide-react";

const curatedProducts = [
    {
        id: 1,
        name: "Asad",
        brand: "Lattafa",
        price: 3499,
        image: "/products/Lattafa-Assad.jpg",
        href: "/product/lattafa-asad"
    },
    {
        id: 2,
        name: "Yara",
        brand: "Lattafa",
        price: 3500,
        image: "/products/Lattafa-Yara.jpg",
        href: "/product/lattafa-yara-pink"
    },
    {
        id: 3,
        name: "Khamrah",
        brand: "Lattafa",
        price: 4900,
        image: "/products/Lattafa-Khamrah.jpg",
        href: "/product/lattafa-khamrah"
    },
    {
        id: 4,
        name: "Sakeena",
        brand: "Lattafa",
        price: 4200,
        image: "/products/Lattafa-Sakeena.jpg",
        href: "/product/lattafa-sakeena"
    },
    {
        id: 5,
        name: "Nebras",
        brand: "Lattafa",
        price: 3600,
        image: "/products/Lattafa-Nebras.jpg",
        href: "/product/lattafa-nebras"
    },
    {
        id: 6,
        name: "Angham",
        brand: "Lattafa",
        price: 4999,
        image: "/products/Lattafa-Angham.jpg",
        href: "/product/lattafa-angham"
    },
    {
        id: 7,
        name: "Teriaq",
        brand: "Lattafa",
        price: 4500,
        image: "/products/Lattafa-Teriaq.jpg",
        href: "/product/lattafa-teriaq"
    },
    {
        id: 8,
        name: "Mayar",
        brand: "Lattafa",
        price: 3800,
        image: "/products/Lattafa-Mayar.jpg",
        href: "/product/lattafa-mayar"
    },
    {
        id: 9,
        name: "Sublime",
        brand: "Lattafa",
        price: 5200,
        image: "/products/Lattafa-Sublime.jpg",
        href: "/product/lattafa-sublime"
    },
    {
        id: 10,
        name: "Scarlet",
        brand: "Lattafa",
        price: 4100,
        image: "/products/Lattafa-Scarlet.jpg",
        href: "/product/lattafa-scarlet"
    }
];

export function FeaturedProductsGrid() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    const itemCount = curatedProducts.length;

    const getZIndex = useCallback((index: number, activeIndex: number) => {
        return index === activeIndex
            ? itemCount
            : itemCount - Math.abs(index - activeIndex);
    }, [itemCount]);

    const activeIndex = Math.floor((progress / 100) * (itemCount - 1));

    // Scroll-linked progress logic via native CSS sticky scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;
            // The bounding rectangle of the 400vh container
            const rect = sectionRef.current.getBoundingClientRect();
            // The scrollable distance is the container height minus the viewport height
            const scrollableDistance = rect.height - window.innerHeight;
            
            // How far into the container have we scrolled? 
            // When rect.top is 0, we're at the very start of the container (progress 0)
            // When rect.top is -scrollableDistance, we're at the very end of the container (progress 100)
            const scrollDistance = -rect.top;
            
            let newProgress = (scrollDistance / scrollableDistance) * 100;
            // Clamp between 0 and 100
            newProgress = Math.max(0, Math.min(100, newProgress));
            
            setProgress(newProgress);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        // Initial setup
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Click to jump to item
    const handleItemClick = (index: number) => {
        if (!sectionRef.current) return;
        const targetProgress = (index / itemCount) * 100;
        // Calculate where to scroll to on the page to reach this progress
        const scrollableDistance = sectionRef.current.getBoundingClientRect().height - window.innerHeight;
        const targetScrollY = window.scrollY + sectionRef.current.getBoundingClientRect().top + (targetProgress / 100) * scrollableDistance;
        
        window.scrollTo({
            top: targetScrollY,
            behavior: "smooth"
        });
    };

    return (
        <div ref={sectionRef} className="relative w-full" style={{ height: "400vh" }}>
            <section className="curated-carousel-section">
            {/* Section Header */}
            <div className="curated-carousel-header">
                <h2 className="font-fredoka curated-carousel-title">
                    Curated For You
                </h2>
                <p className="curated-carousel-subtitle">
                    Explore our hand-picked selection of premium fragrances that define luxury and elegance.
                </p>
            </div>

            {/* 3D Carousel */}
            <div className="curated-3d-carousel">
                {curatedProducts.map((product, index) => {
                    const zIndex = getZIndex(index, activeIndex);
                    const activeFraction = (index - activeIndex) / itemCount;
                    const opacity = (zIndex / itemCount) * 3 - 2;

                    return (
                        <div
                            key={product.id}
                            className="curated-carousel-item"
                            style={{
                                "--zIndex": zIndex,
                                "--active": activeFraction,
                                "--opacity": Math.max(0, Math.min(1, opacity)),
                            } as React.CSSProperties}
                            onClick={() => handleItemClick(index)}
                        >
                            <div className="curated-carousel-box">
                                <div className="curated-carousel-img-wrap">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-contain"
                                        sizes="300px"
                                    />
                                </div>
                                <div className="curated-carousel-num">
                                    {String(index + 1).padStart(2, "0")}
                                </div>
                                <div className="curated-carousel-info">
                                    <span className="curated-carousel-brand">{product.brand}</span>
                                    <h3 className="curated-carousel-name font-fredoka">{product.name}</h3>
                                    <span className="curated-carousel-price">
                                        KES {product.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Progress indicator */}
            <div className="curated-carousel-progress-track">
                <div
                    className="curated-carousel-progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Scroll hint */}
            <div className="curated-carousel-scroll-hint" style={{ opacity: progress < 5 ? 1 : 0 }}>
                <div className="curated-scroll-mouse">
                    <div className="curated-scroll-wheel" />
                </div>
                <span>Scroll to explore</span>
            </div>

            {/* View All CTA */}
            <div className="curated-carousel-cta">
                <Link
                    href="/shop"
                    className="btn-lattafa-primary btn-lattafa-dark btn-pill font-fredoka shadow-md"
                >
                    View Entire Collection
                    <span className="btn-arrow">→</span>
                </Link>
            </div>
            </section>
        </div>
    );
}
