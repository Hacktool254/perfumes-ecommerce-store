"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
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

    // Update search value if URL changes (e.g. clearing filters)
    useEffect(() => {
        setSearchValue(searchParams.get("search") || "");
    }, [searchParams]);

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 border-b border-border">

            {/* Search and Title */}
            <div className="flex-1 w-full md:w-auto">
                <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">Our Collection</h1>
                <form onSubmit={handleSearch} className="relative max-w-md">
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search fragrances..."
                        className="w-full bg-secondary/50 border border-border rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </form>
            </div>

            {/* Actions: Filter Toggle & Sort */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">

                {/* Mobile Filter Toggle Button (handled globally later if needed) */}
                <button className="md:hidden flex items-center gap-2 text-sm font-medium border border-border rounded-full px-4 py-2 hover:bg-secondary transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-2 text-sm font-medium border border-border rounded-full px-4 py-2 hover:bg-secondary transition-colors min-w-[160px] justify-between"
                    >
                        <span>Sort by: {selectedSort.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {isSortOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                            >
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            setSelectedSort(option);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors ${selectedSort.value === option.value ? "text-accent font-medium bg-secondary/30" : "text-muted-foreground"}`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
