"use client";

import { useCallback, useState } from "react";
import { SlidersHorizontal, Menu as MenuIcon } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// Mock categories for the slider based on the reference design
const categories = [
    {
        id: "mens",
        title: "Men's Fragrances",
        count: "189 items",
        image: "/categories/mens-fragrance.jpg"
    },
    {
        id: "womens",
        title: "Women's Fragrances",
        count: "215 items",
        image: "/categories/womens-fragrance.jpg"
    },
    {
        id: "unisex",
        title: "Unisex Fragrances",
        count: "84 items",
        image: "/categories/unisex-fragrance.jpg"
    }
];

export function ShopHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const currentView = searchParams?.get("view") || "grid"; // default to grid

    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams?.toString() || "");
            if (value === null || value === "") {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const setView = (viewType: "list" | "grid") => {
        router.push(`${pathname}?${createQueryString("view", viewType)}`, { scroll: false });
    };

    return (
        <div className="space-y-6 lg:space-y-8 pb-4">
            {/* Breadcrumbs */}
            <div className="flex md:hidden items-center justify-center text-sm">
                <Link href="/" className="text-foreground font-medium hover:underline">
                    Home
                </Link>
                <span className="mx-3 text-muted-foreground">{">"}</span>
                <span className="text-foreground font-medium">All Fragrances</span>
            </div>

            {/* Categories Horizontal Slider */}
            <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory hide-scrollbar -mx-4 px-4 gap-4 pb-2">
                {categories.map((cat) => (
                    <div key={cat.id} className="snap-start shrink-0 w-[280px] md:w-[320px] flex flex-col group cursor-pointer">
                        <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden mb-3 bg-[#f5f5f5]">
                            <Image 
                                src={cat.image}
                                alt={cat.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="text-center">
                            <h3 className="font-serif text-lg text-foreground mb-1">{cat.title}</h3>
                            <p className="text-muted-foreground text-sm">{cat.count}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Control Bar (Filter & Layout Toggle) */}
            <div className="flex items-center justify-between pt-4">
                {/* Filter Button */}
                <button className="flex items-center gap-2 bg-[#f2f2f2] hover:bg-[#e5e5e5] transition-colors rounded-full px-5 py-2.5 text-sm font-semibold tracking-wider text-foreground">
                    <SlidersHorizontal className="w-4 h-4 stroke-[1.5]" />
                    FILTER
                </button>

                {/* Grid / List Toggles */}
                <div className="flex md:hidden items-center gap-2">
                    {/* List Toggle */}
                    <button 
                        onClick={() => setView("list")}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                            currentView === "list" 
                                ? "bg-black text-white border-black" 
                                : "bg-white text-black border-gray-200 hover:border-black"
                        }`}
                        aria-label="List View"
                    >
                        <MenuIcon className="w-5 h-5 stroke-[1.5]" />
                    </button>

                    {/* Grid Toggle (|| configuration) */}
                    <button 
                        onClick={() => setView("grid")}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                            currentView === "grid" 
                                ? "bg-black text-white border-black" 
                                : "bg-white text-black border-gray-200 hover:border-black"
                        }`}
                        aria-label="Grid View"
                    >
                        <div className="flex gap-[3px] items-center justify-center">
                            <div className="w-[1.5px] h-3.5 bg-current rounded-sm"></div>
                            <div className="w-[1.5px] h-3.5 bg-current rounded-sm"></div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
