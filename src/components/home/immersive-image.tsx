"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export function ImmersiveImageBlock() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
    const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);
    const yText = useTransform(scrollYProgress, [0.2, 0.5], [50, 0]);

    return (
        <section ref={containerRef} className="relative h-[80vh] md:h-screen w-full overflow-hidden flex items-center justify-center">
            {/* Image container with scale effect */}
            <motion.div
                className="absolute inset-0 w-full h-full -z-10"
                style={{ scale }}
            >
                <Image
                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop"
                    alt="Immersive model shot"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30" />
            </motion.div>

            {/* Overlay Text Animation */}
            <motion.div
                className="container mx-auto px-4 z-20 text-center text-white"
                style={{ opacity, y: yText }}
            >
                <h2 className="font-fredoka text-4xl md:text-6xl lg:text-8xl mb-6 tracking-tight uppercase">
                    Unveil the <br className="hidden md:block" /> Unseen
                </h2>
                <p className="max-w-xl mx-auto text-lg md:text-xl text-white/90 font-light">
                    A perfume is more than an accessory—it's an invisible garment that dresses the soul. Experience the art of scent.
                </p>
            </motion.div>
        </section>
    );
}
