"use client";

import { useCallback, useState } from "react";
import { SlidersHorizontal, Menu as MenuIcon, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShopFilters } from "./shop-filters";

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
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    const currentView = searchParams?.get("view") || "grid"; // default to grid
    const sortParam = searchParams?.get("sort") || "featured";

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

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.push(`${pathname}?${createQueryString("sort", e.target.value)}`, { scroll: false });
    };

    return (
        <>
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
                <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 bg-[#f2f2f2] hover:bg-[#e5e5e5] transition-colors rounded-full px-5 py-2.5 text-sm font-semibold tracking-wider text-foreground"
                >
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

        {/* Mobile Filter Drawer — Overlay */}
        {isFilterOpen && (
            <div 
                className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity"
                onClick={() => setIsFilterOpen(false)}
            />
        )}

        {/* Mobile Filter Drawer — Slide-up Sheet */}
        <div className={`fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col ${isFilterOpen ? 'translate-y-0' : 'translate-y-full'}`}
            style={{ maxHeight: '85vh' }}
        >
            {/* Drawer Header */}
            <div className="flex-none flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h3 className="text-xl font-serif text-[#2f2f2f]">Filter</h3>
                <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-[#2f2f2f]" />
                </button>
            </div>

            {/* Sort By */}
            <div className="flex-none px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
                    <select 
                        value={sortParam}
                        onChange={handleSortChange}
                        className="flex-1 bg-[#f5f5f5] rounded-full px-4 py-2.5 text-sm font-medium text-[#2f2f2f] appearance-none cursor-pointer border-0 focus:ring-0 focus:outline-none"
                    >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">Newest</option>
                    </select>
                </div>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4">
                <ShopFilters />
            </div>

            {/* Apply Button — Fixed at bottom */}
            <div className="flex-none px-6 py-4 border-t border-gray-100 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
                <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-3.5 bg-[#2f2f2f] hover:bg-[#1a1a1a] text-white text-sm font-bold tracking-[0.15em] uppercase rounded-full transition-all active:scale-[0.98]"
                >
                    APPLY
                </button>
            </div>
        </div>
        </>
    );
}
