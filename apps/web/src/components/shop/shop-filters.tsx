"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { Check, X, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const brands = [
    "Lattafa", "Armaf", "Afnan", "Rave", "Swiss Arabian",
    "Maison Alhambra", "Dove", "St Ives", "Hobby", "Ballet",
    "Vaseline", "Argan", "Palmer's", "Nivea", "American Dream", "Dear Body"
];

function FilterAccordion({ title, children, defaultOpen = true }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-border/50 pb-6 mb-6 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left group"
            >
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    {title}
                </h4>
                <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 space-y-3">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function FilterCheckbox({ label, count, active, onClick }: {
    label: string;
    count?: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <label
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onClick}
        >
            <div className={`w-[18px] h-[18px] rounded-[4px] border-2 flex items-center justify-center transition-all duration-200
                ${active
                    ? "bg-primary border-primary text-white"
                    : "border-border group-hover:border-muted-foreground"
                }`}
            >
                {active && <Check className="w-3 h-3" strokeWidth={3} />}
            </div>
            <span className={`text-sm transition-colors flex-1 ${active ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                {label}
            </span>
            {count !== undefined && (
                <span className="text-xs text-muted-foreground/60">({count})</span>
            )}
        </label>
    );
}

export function ShopFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categories = useQuery(api.categories.list);

    const activeCategory = searchParams.get("category");
    const activeGender = searchParams.get("gender");
    const activeBrand = searchParams.get("brand");

    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === null) {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (name: string, value: string | null) => {
        const current = searchParams.get(name);
        const nextValue = current === value ? null : value;
        router.push(`/shop?${createQueryString(name, nextValue)}`, { scroll: false });
    };

    const clearAll = () => {
        router.push("/shop");
    };

    const hasActiveFilters = activeCategory || activeGender || activeBrand;

    return (
        <aside className="w-full md:w-64 shrink-0 hidden md:block">
            <div className="sticky top-28">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                    <h3 className="font-serif text-xl text-foreground">Filter</h3>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAll}
                            className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                        >
                            <X className="w-3 h-3" />
                            Clear All
                        </button>
                    )}
                </div>

                {/* Gender / Collection */}
                <FilterAccordion title="Collection">
                    {["men", "women", "unisex"].map((g) => (
                        <FilterCheckbox
                            key={g}
                            label={g === "men" ? "Men's Fragrances" : g === "women" ? "Women's Fragrances" : "Unisex Fragrances"}
                            active={activeGender === g}
                            onClick={() => handleFilterChange("gender", g)}
                        />
                    ))}
                </FilterAccordion>

                {/* Category / Product Type */}
                <FilterAccordion title="Product Type">
                    {!categories ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="h-5 w-full bg-secondary/50 animate-pulse rounded" />
                        ))
                    ) : (
                        categories.map((cat: any) => (
                            <FilterCheckbox
                                key={cat._id}
                                label={cat.name}
                                active={activeCategory === cat._id}
                                onClick={() => handleFilterChange("category", cat._id)}
                            />
                        ))
                    )}
                </FilterAccordion>

                {/* Brand */}
                <FilterAccordion title="Brand" defaultOpen={false}>
                    {brands.map((brand) => (
                        <FilterCheckbox
                            key={brand}
                            label={brand}
                            active={activeBrand === brand}
                            onClick={() => handleFilterChange("brand", brand)}
                        />
                    ))}
                </FilterAccordion>
            </div>
        </aside>
    );
}
