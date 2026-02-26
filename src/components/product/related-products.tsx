"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const relatedProducts = [
    { id: 10, name: "Velvet Jasmine", brand: "Floral Symphony", price: 16000, image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=800&auto=format&fit=crop" },
    { id: 11, name: "Spiced Oud", brand: "Maison Privée", price: 28000, image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop" },
    { id: 12, name: "Crystal Waters", brand: "Summer Essentials", price: 14500, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop" },
    { id: 13, name: "Desert Rose", brand: "Desert Collection", price: 17500, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop" },
];

export function RelatedProducts() {
    return (
        <section className="mt-32 border-t border-border pt-20">
            <div className="flex justify-between items-end mb-10">
                <h3 className="font-serif text-3xl md:text-4xl text-foreground">
                    You May Also Like
                </h3>
                <Link href="/shop" className="text-sm font-medium hover:text-accent underline underline-offset-4 hidden md:block">
                    View All Fragrances
                </Link>
            </div>

            <div className="w-full overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
                <div className="flex gap-6 w-max">
                    {relatedProducts.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="w-[260px] md:w-[320px] flex-shrink-0 snap-start group flex flex-col"
                        >
                            <div className="relative aspect-[3/4] bg-secondary/30 mb-4 overflow-hidden rounded-sm">
                                <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
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
                                    <button className="w-full bg-foreground text-background rounded-full py-3 px-4 flex items-center justify-center gap-2 font-medium hover:bg-gold-muted hover:text-white transition-colors">
                                        <ShoppingBag className="w-4 h-4" />
                                        <span>Quick Add</span>
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col flex-1 px-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{product.brand}</p>
                                <div className="flex justify-between items-start gap-4">
                                    <h4 className="font-serif text-lg text-foreground mb-1 group-hover:text-accent transition-colors">
                                        <Link href={`/product/${product.id}`}>
                                            {product.name}
                                        </Link>
                                    </h4>
                                    <p className="font-medium text-foreground whitespace-nowrap">
                                        KES {product.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-8 text-center md:hidden">
                <Link href="/shop" className="text-sm font-medium hover:text-accent underline underline-offset-4">
                    View All Fragrances
                </Link>
            </div>
        </section>
    );
}
