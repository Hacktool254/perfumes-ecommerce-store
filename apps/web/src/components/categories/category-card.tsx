"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

interface CategoryCardProps {
    category: {
        _id: string;
        name: string;
        slug: string;
        imageUrl?: string;
    };
}

export function CategoryCard({ category }: CategoryCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 400, damping: 30 });
    const springY = useSpring(y, { stiffness: 400, damping: 30 });

    const rotateX = useTransform(springY, [-0.5, 0.5], ["6deg", "-6deg"]);
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-6deg", "6deg"]);

    function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / rect.width - 0.5;
        const yPct = mouseY / rect.height - 0.5;

        x.set(xPct);
        y.set(yPct);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const fallbackImage = "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop";

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
            }}
            className="relative w-full aspect-[4/5] overflow-hidden cursor-pointer group rounded-sm border border-border/50"
        >
            <Link href={`/shop?category=${category.slug}`} className="absolute inset-0 z-20">
                <span className="sr-only">View {category.name}</span>
            </Link>

            {/* Background Image */}
            <motion.div
                className="absolute inset-0 w-full h-full"
                style={{ translateZ: -30 }}
            >
                <img
                    src={category.imageUrl || fallbackImage}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500" />
            </motion.div>

            {/* Text Overlay */}
            <motion.div
                className="absolute inset-0 p-8 flex flex-col justify-end text-white"
                style={{ translateZ: 40 }}
            >
                <h3 className="font-serif text-2xl md:text-3xl mb-1 tracking-tight">{category.name}</h3>
                <div className="w-8 h-[1px] bg-white transform origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
            </motion.div>
        </motion.div>
    );
}
