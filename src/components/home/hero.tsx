"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Background Parallax Image */}
            <motion.div
                className="absolute inset-0 w-full h-full -z-10"
                style={{ y, opacity }}
            >
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Fast overlay to ensure text readability */}
                <Image
                    src="https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2070&auto=format&fit=crop"
                    alt="Luxury Perfume Collection"
                    fill
                    priority
                    className="object-cover"
                />
            </motion.div>

            {/* Content */}
            <div className="container mx-auto px-4 z-20 text-center text-white flex flex-col items-center">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-sm md:text-base tracking-widest uppercase mb-6"
                >
                    Discover Your Signature
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="font-serif text-5xl md:text-7xl lg:text-8xl mb-8 tracking-tight"
                >
                    The Essence of <br />
                    <span className="italic text-gold-muted">True Luxury</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                >
                    <Link
                        href="/shop"
                        className="group inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gold-muted hover:text-white transition-all duration-300"
                    >
                        Explore Collection
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
