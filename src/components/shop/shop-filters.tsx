"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Check, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

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

    return (
        <aside className="w-full md:w-64 pr-8 hidden md:block">
            <div className="sticky top-24 space-y-10">
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-serif text-xl text-foreground">Filters</h3>
                        {(activeCategory || activeGender || activeBrand) && (
                            <button
                                onClick={clearAll}
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                <X className="w-3 h-3" />
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Gender Filter */}
                    <div className="mb-10">
                        <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4">Collection</h4>
                        <div className="space-y-3">
                            {["men", "women", "unisex"].map((g) => (
                                <label
                                    key={g}
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={() => handleFilterChange("gender", g)}
                                >
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all
                                        ${activeGender === g ? "bg-primary border-primary text-white" : "border-border group-hover:border-muted-foreground"}
                                    `}>
                                        {activeGender === g && <Check className="w-2.5 h-2.5" />}
                                    </div>
                                    <span className={`text-sm transition-colors capitalize ${activeGender === g ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                        {g}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-10">
                        <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4">Categories</h4>
                        <div className="space-y-3">
                            {!categories ? (
                                [1, 2, 3, 4].map(i => <div key={i} className="h-4 w-full bg-secondary/50 animate-pulse rounded" />)
                            ) : (
                                categories.map((cat) => (
                                    <label
                                        key={cat._id}
                                        className="flex items-center gap-3 cursor-pointer group text-left"
                                        onClick={() => handleFilterChange("category", cat._id)}
                                    >
                                        <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all
                                            ${activeCategory === cat._id ? "bg-primary border-primary text-white" : "border-border group-hover:border-muted-foreground"}
                                        `}>
                                            {activeCategory === cat._id && <Check className="w-3 h-3" />}
                                        </div>
                                        <span className={`text-sm transition-colors ${activeCategory === cat._id ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                            {cat.name}
                                        </span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Placeholder for Brands (can be dynamic later) */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground mb-4">Brand</h4>
                        <p className="text-xs text-muted-foreground italic">Filter by brand coming soon...</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
