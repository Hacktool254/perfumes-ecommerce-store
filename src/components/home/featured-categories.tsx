"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const categories = [
    {
        title: "Signature Perfumes",
        description: "Discover our most coveted luxury fragrances.",
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop",
        link: "/shop?category=perfumes"
    },
    {
        title: "Premium Cosmetics",
        description: "Elevate your beauty routine with essentials.",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2787&auto=format&fit=crop",
        link: "/shop?category=cosmetics"
    }
];

function CategoryCard({ category }: { category: typeof categories[0] }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springX = useSpring(x, { stiffness: 400, damping: 30 });
    const springY = useSpring(y, { stiffness: 400, damping: 30 });

    const rotateX = useTransform(springY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(springX, [-0.5, 0.5], ["-10deg", "10deg"]);

    function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Values from -0.5 to 0.5
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

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
            className="relative w-full aspect-[4/5] md:aspect-square overflow-hidden cursor-pointer group"
        >
            <Link href={category.link} className="absolute inset-0 z-20">
                <span className="sr-only">View {category.title}</span>
            </Link>

            {/* Background Image with Zoom */}
            <motion.div
                className="absolute inset-0 w-full h-full"
                style={{ translateZ: -50 }} // Push background back for depth
            >
                <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            </motion.div>

            {/* Text Content */}
            <motion.div
                className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white"
                style={{ translateZ: 50 }} // Pull text forward
            >
                <h3 className="font-serif text-3xl md:text-5xl mb-2">{category.title}</h3>
                <p className="text-sm md:text-base text-white/80 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    {category.description}
                </p>
            </motion.div>
        </motion.div>
    );
}

export function FeaturedCategories() {
    return (
        <section className="py-2 bg-background perspective-[1000px]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-7xl mx-auto">
                    {categories.map((category) => (
                        <CategoryCard key={category.title} category={category} />
                    ))}
                </div>
            </div>
        </section>
    );
}
