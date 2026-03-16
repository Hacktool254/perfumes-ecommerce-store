"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest Arrivals" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
];

export function ShopHeader() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "");
    const [showSearch, setShowSearch] = useState(false);

    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === null || value === "") {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/shop?${createQueryString("search", searchValue)}`, { scroll: false });
    };

    useEffect(() => {
        setSearchValue(searchParams.get("search") || "");
    }, [searchParams]);

    // Close sort dropdown on outside click
    useEffect(() => {
        const close = () => setIsSortOpen(false);
        if (isSortOpen) {
            document.addEventListener("click", close);
            return () => document.removeEventListener("click", close);
        }
    }, [isSortOpen]);

    return (
        <div className="space-y-6">
            {/* Page Title */}
            <div>
                <h1 className="font-serif text-3xl md:text-5xl text-foreground">All Fragrances</h1>
                <p className="text-muted-foreground mt-2 text-sm max-w-lg">
                    Immerse yourself in our fragrance range, crafted for every personality.
                </p>
            </div>

            {/* Compact Controls Bar */}
            <div className="flex items-center justify-between py-4 border-y border-border">
                {/* Left: Search Toggle + Filter Toggle (mobile) */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">Search</span>
                    </button>

                    <span className="w-px h-4 bg-border hidden sm:block" />

                    {/* Mobile Filter Toggle */}
                    <button className="md:hidden flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>
                </div>

                {/* Right: Sort Dropdown */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <span>Sort by: <span className="text-foreground font-medium">{selectedSort.label}</span></span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {isSortOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 6 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                            >
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSelectedSort(option);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary/50 transition-colors
                                            ${selectedSort.value === option.value
                                                ? "text-foreground font-medium bg-secondary/30"
                                                : "text-muted-foreground"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Expandable Search Bar */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleSearch} className="relative max-w-md pb-4">
                            <input
                                type="text"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder="Search fragrances..."
                                autoFocus
                                className="w-full bg-secondary/30 border border-border rounded-full py-2.5 pl-12 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchValue("");
                                        router.push(`/shop?${createQueryString("search", null)}`, { scroll: false });
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2"
                                >
                                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                                </button>
                            )}
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
