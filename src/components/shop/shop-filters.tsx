"use client";

import { useState } from "react";
import { Check } from "lucide-react";

// Mock Filter Categories
const filterCategories = [
    {
        id: "category",
        name: "Category",
        options: [
            { value: "eau-de-parfum", label: "Eau de Parfum" },
            { value: "eau-de-toilette", label: "Eau de Toilette" },
            { value: "cologne", label: "Cologne" },
            { value: "body-mist", label: "Body Mist" },
        ]
    },
    {
        id: "brand",
        name: "Brand",
        options: [
            { value: "desert-collection", label: "Desert Collection" },
            { value: "maison-privee", label: "Maison Privée" },
            { value: "floral-symphony", label: "Floral Symphony" },
            { value: "ummies-exclusive", label: "Ummie's Exclusive" },
        ]
    },
    {
        id: "notes",
        name: "Fragrance Notes",
        options: [
            { value: "woody", label: "Woody" },
            { value: "floral", label: "Floral" },
            { value: "citrus", label: "Citrus" },
            { value: "oriental", label: "Oriental" },
            { value: "fresh", label: "Fresh" },
        ]
    }
];

export function ShopFilters() {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const toggleFilter = (value: string) => {
        setSelectedFilters(prev =>
            prev.includes(value)
                ? prev.filter(f => f !== value)
                : [...prev, value]
        );
    };

    return (
        <aside className="w-full md:w-64 pr-8 hidden md:block">

            <div className="sticky top-24 space-y-8">
                <div>
                    <h3 className="font-serif text-lg text-foreground mb-4">Filters</h3>

                    {/* Price Range (Simplified for pure UI now) */}
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-foreground mb-3">Price Range</h4>
                        <div className="flex items-center gap-2">
                            <input type="number" placeholder="Min" className="w-full bg-secondary/30 border border-border rounded-md px-3 py-1.5 text-sm" />
                            <span className="text-muted-foreground">-</span>
                            <input type="number" placeholder="Max" className="w-full bg-secondary/30 border border-border rounded-md px-3 py-1.5 text-sm" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filterCategories.map((group) => (
                            <div key={group.id}>
                                <h4 className="text-sm font-medium text-foreground mb-3">{group.name}</h4>
                                <div className="space-y-2.5">
                                    {group.options.map((option) => (
                                        <label
                                            key={option.value}
                                            className="flex items-center gap-3 cursor-pointer group/label"
                                        >
                                            <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors
                        ${selectedFilters.includes(option.value)
                                                    ? "bg-foreground border-foreground text-background"
                                                    : "border-border group-hover/label:border-muted-foreground bg-transparent"
                                                }`}
                                            >
                                                {selectedFilters.includes(option.value) && <Check className="w-3 h-3" />}
                                            </div>
                                            <span className="text-sm text-muted-foreground group-hover/label:text-foreground transition-colors">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {selectedFilters.length > 0 && (
                    <button
                        onClick={() => setSelectedFilters([])}
                        className="w-full py-2 text-sm font-medium text-accent border border-accent rounded-full hover:bg-accent hover:text-white transition-colors"
                    >
                        Clear All Filters
                    </button>
                )}
            </div>

        </aside>
    );
}
