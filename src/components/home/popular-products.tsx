"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const popularProducts = [
    {
        id: 1,
        name: "Midnight Saffron",
        brand: "Ummie's Exclusives",
        price: 18500,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop",
        href: "/shop/midnight-saffron"
    },
    {
        id: 2,
        name: "Oud Rosewood",
        brand: "Maison Privée",
        price: 32000,
        image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop",
        href: "/shop/oud-rosewood"
    },
    {
        id: 3,
        name: "Velvet Orchid",
        brand: "Floral Symphony",
        price: 14500,
        image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=1000&auto=format&fit=crop",
        href: "/shop/velvet-orchid"
    },
    {
        id: 4,
        name: "Leather & Vanilla",
        brand: "Ummie's Exclusives",
        price: 21000,
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop",
        href: "/shop/leather-vanilla"
    }
];

export function PopularProducts() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 mb-10 md:mb-16 flex justify-between items-end">
                <div>
                    <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-tight mb-4">
                        Popular Right Now
                    </h2>
                    <p className="text-muted-foreground max-w-xl">
                        Our most loved fragrances, curated from our bestsellers.
                    </p>
                </div>
                <Link
                    href="/shop?sort=popular"
                    className="hidden md:block text-sm font-medium hover:text-accent transition-colors underline underline-offset-4"
                >
                    View All Popular
                </Link>
            </div>

            <div className="w-full overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
                <div className="flex gap-4 md:gap-8 px-4 md:px-safe max-w-7xl mx-auto w-max">
                    {popularProducts.map((product) => (
                        <div
                            key={product.id}
                            className="w-[280px] md:w-[350px] flex-shrink-0 snap-start group"
                        >
                            <Link href={product.href} className="block relative aspect-[4/5] overflow-hidden bg-secondary/50 rounded-sm mb-4">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
                            </Link>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.brand}</p>
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">
                                        <Link href={product.href}>{product.name}</Link>
                                    </h3>
                                    <p className="font-medium text-foreground">
                                        KES {product.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 mt-4 md:hidden">
                <Link
                    href="/shop?sort=popular"
                    className="text-sm font-medium hover:text-accent transition-colors underline underline-offset-4"
                >
                    View All Popular
                </Link>
            </div>
        </section>
    );
}
