"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { Check, Plus, Minus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const brands = [
    "Lattafa",
    "Rave",
    "Afnan",
    "Armaf",
    "Swiss Arabian",
    "Maison Alhambra",
    "Dove",
    "St Ives",
    "Hobby",
    "Ballet",
    "Vaseline",
    "Argan",
    "Palmer's"
];

const gendersList = [
    { label: "Men", value: "men" },
    { label: "Unisex", value: "unisex" },
    { label: "Women", value: "women" },
];

function FilterAccordion({ title, children, defaultOpen = true }: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-[#f0f0f0] pb-6 mb-6 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left group"
            >
                <h4 className="text-[17px] font-serif text-[#2f2f2f] group-hover:text-black transition-colors">
                    {title}
                </h4>
                {isOpen ? (
                    <Minus className="w-4 h-4 text-[#2f2f2f]" strokeWidth={1} />
                ) : (
                    <Plus className="w-4 h-4 text-[#2f2f2f]" strokeWidth={1} />
                )}
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

function FilterCheckbox({ label, active, onClick }: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <label
            className="flex items-center gap-3 cursor-pointer group"
            onClick={onClick}
        >
            <div className={`w-[16px] h-[16px] rounded-[3px] border flex items-center justify-center transition-all duration-200
                ${active
                    ? "bg-[#2f2f2f] border-[#2f2f2f] text-white"
                    : "border-gray-300 group-hover:border-black bg-white"
                }`}
            >
                {active && <Check className="w-3 h-3" strokeWidth={3} />}
            </div>
            <span className={`text-[14px] transition-colors flex-1 ${active ? "text-[#2f2f2f] font-medium" : "text-[#2f2f2f]"}`}>
                {label}
            </span>
        </label>
    );
}

export function ShopFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categories = useQuery(api.categories.list);

    const activeCategories = searchParams?.get("category")?.split(",").filter(Boolean) || [];
    const activeBrands = searchParams?.get("brand")?.split(",").filter(Boolean) || [];
    const activeGender = searchParams?.get("gender");
    const activeAvailability = searchParams?.get("inStock");

    const handleMultiSelect = (name: string, value: string) => {
        const currentValues = searchParams?.get(name)?.split(",").filter(Boolean) || [];
        const nextValues = currentValues.includes(value) 
            ? currentValues.filter(v => v !== value) 
            : [...currentValues, value];
        
        const params = new URLSearchParams(searchParams?.toString() || "");
        if (nextValues.length === 0) {
            params.delete(name);
        } else {
            params.set(name, nextValues.join(","));
        }
        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    const handleSingleSelect = (name: string, value: string | null) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        if (value === null || params.get(name) === value) {
            params.delete(name);
        } else {
            params.set(name, value);
        }
        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    // Price State
    const [minPrice, setMinPrice] = useState(searchParams?.get("minPrice") || "0");
    const [maxPrice, setMaxPrice] = useState(searchParams?.get("maxPrice") || "20000");

    const applyPrice = () => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        if (minPrice && minPrice !== "0") params.set("minPrice", minPrice); else params.delete("minPrice");
        if (maxPrice && maxPrice !== "20000") params.set("maxPrice", maxPrice); else params.delete("maxPrice");
        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    return (
        <aside className="w-full h-full pr-4">
            <div className="sticky top-28">
                
                {/* Categories */}
                <FilterAccordion title="Categories" defaultOpen={true}>
                    {categories === undefined ? (
                        <div className="flex items-center gap-2 py-2">
                             <div className="w-3 h-3 bg-primary/20 animate-pulse rounded-full" />
                             <div className="text-xs text-muted-foreground animate-pulse">Syncing collections...</div>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-xs text-muted-foreground italic py-2">No categories found.</div>
                    ) : categories.map((cat: any) => (
                        <FilterCheckbox
                            key={cat._id}
                            label={cat.name}
                            active={activeCategories.includes(cat._id)}
                            onClick={() => handleMultiSelect("category", cat._id)}
                        />
                    ))}
                </FilterAccordion>

                {/* Brand */}
                <FilterAccordion title="Brand" defaultOpen={true}>
                    {brands.map((b) => (
                        <FilterCheckbox
                            key={b}
                            label={b}
                            active={activeBrands.includes(b)}
                            onClick={() => handleMultiSelect("brand", b)}
                        />
                    ))}
                </FilterAccordion>

                <FilterAccordion title="Gender" defaultOpen={true}>
                    {gendersList.map((g) => (
                        <FilterCheckbox
                            key={g.value}
                            label={g.label}
                            active={activeGender === g.value}
                            onClick={() => handleSingleSelect("gender", g.value)}
                        />
                    ))}
                </FilterAccordion>

                <FilterAccordion title="Price" defaultOpen={true}>
                    <div className="flex flex-col gap-6 pt-2 pb-2">
                        {/* Visual Slider Track mock */}
                        <div className="relative h-1 bg-black w-full my-3 rounded-full">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full shadow-sm" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full shadow-sm" />
                        </div>
                        
                        {/* Inputs */}
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-medium text-sm">KES</span>
                                <input 
                                    type="number"
                                    min="0"
                                    max="20000"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    onBlur={applyPrice}
                                    onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
                                    className="w-full bg-[#f8f8f8] border border-gray-200 focus:border-black rounded-full py-3.5 pl-12 pr-3 outline-none text-right font-medium text-[#2f2f2f] text-sm transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                            <span className="text-gray-900 font-medium text-sm">To</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-medium text-sm">KES</span>
                                <input 
                                    type="number"
                                    min="0"
                                    max="20000"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    onBlur={applyPrice}
                                    onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
                                    className="w-full bg-[#f8f8f8] border border-gray-200 focus:border-black rounded-full py-3.5 pl-12 pr-3 outline-none text-right font-medium text-[#2f2f2f] text-sm transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                            </div>
                        </div>
                    </div>
                </FilterAccordion>

                <FilterAccordion title="Availability" defaultOpen={true}>
                    <FilterCheckbox 
                        label="In stock" 
                        active={activeAvailability === "true"} 
                        onClick={() => handleSingleSelect("inStock", "true")} 
                    />
                    <FilterCheckbox 
                        label="Out of stock" 
                        active={activeAvailability === "false"} 
                        onClick={() => handleSingleSelect("inStock", "false")} 
                    />
                </FilterAccordion>

            </div>
        </aside>
    );
}
