"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

export function ProductImageGallery({ images, productName }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 w-full h-full">

            {/* Thumbnails (Vertical on desktop, Horizontal on mobile) */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto scrollbar-hide py-2 md:py-0 md:w-24 flex-shrink-0">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`relative aspect-[3/4] w-20 md:w-full flex-shrink-0 overflow-hidden bg-secondary/30 rounded-sm transition-all duration-300 ${currentIndex === idx ? "ring-2 ring-foreground ring-offset-2 ring-offset-background opacity-100" : "opacity-60 hover:opacity-100"
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`${productName} thumbnail ${idx + 1}`}
                            fill
                            sizes="96px"
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Feature Image */}
            <div className="relative aspect-[4/5] md:aspect-auto md:h-[70vh] flex-1 bg-secondary/20 rounded-sm overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`${productName} view ${currentIndex + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

        </div>
    );
}
