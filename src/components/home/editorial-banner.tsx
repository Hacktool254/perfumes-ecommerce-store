"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function EditorialBanner() {
    const textVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: [0.21, 0.47, 0.32, 0.98]
            }
        })
    };

    return (
        <section className="py-24 md:py-32 bg-background border-b border-border overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-12">

                    <motion.h2
                        className="font-serif text-4xl md:text-5xl lg:text-7xl leading-tight text-foreground tracking-tight"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <motion.span custom={0} variants={textVariants as any} className="block">
                            Crafted for the bold,
                        </motion.span>
                        <motion.span custom={1} variants={textVariants as any} className="block text-muted-foreground italic">
                            designed for the elegant.
                        </motion.span>
                        <motion.span custom={2} variants={textVariants as any} className="block mt-4 flex items-center justify-center gap-4 flex-wrap">
                            Every drop tells a
                            <span className="relative inline-block w-24 h-12 md:w-32 md:h-16 mx-2 overflow-hidden rounded-full align-middle">
                                <Image
                                    src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop"
                                    alt="Perfume bottle closeup"
                                    fill
                                    className="object-cover"
                                />
                            </span>
                            unique story.
                        </motion.span>
                    </motion.h2>

                    <motion.div
                        className="max-w-2xl text-lg md:text-xl text-muted-foreground mt-8"
                        custom={3}
                        variants={textVariants as any}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        <p>
                            Our collection features the most sought-after fragrances and premium cosmetics, hand-picked for those who appreciate the finer things in life.
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
