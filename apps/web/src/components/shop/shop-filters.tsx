"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { Check, X, Plus, Minus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const brands = [
    { name: "Lattafa", count: 140 }, 
    { name: "Lattafa Pride", count: 55 }
];

const fragranceTypes = [
    { label: "Eau de Parfum (EDP)", count: 194 },
    { label: "Perfume Oil", count: 3 },
    { label: "Deodorant", count: 6 },
    { label: "Air Freshener", count: 9 },
    { label: "Eau de Toilette (EDT)", count: 1 },
    { label: "All Over Spray", count: 6 },
];

const gendersList = [
    { label: "Men", count: 29 },
    { label: "Unisex", count: 160 },
    { label: "Women", count: 45 },
];

const sizesList = [
    { label: "5ML", count: 1 },
    { label: "5ml", count: 1 },
    { label: "20ML", count: 1 },
    { label: "25ml", count: 2 },
    { label: "50ML", count: 1 },
    { label: "55ML", count: 1 },
    { label: "60ML", count: 4 },
    { label: "75ML", count: 13 },
    { label: "80ML", count: 3 },
    { label: "90ML", count: 4 },
    { label: "100ML", count: 162 },
    { label: "100ml", count: 2 },
    { label: "110ML", count: 1 },
    { label: "250ml", count: 12 },
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
            {count !== undefined && (
                <span className="text-[13px] text-gray-500">({count})</span>
            )}
        </label>
    );
}

export function ShopFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categories = useQuery(api.categories.list);

    const activeCategory = searchParams?.get("category");
    const activeGender = searchParams?.get("gender");
    const activeBrand = searchParams?.get("brand");

    const createQueryString = useCallback(
        (name: string, value: string | null) => {
            const params = new URLSearchParams(searchParams?.toString() || "");
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
        const current = searchParams?.get(name);
        const nextValue = current === value ? null : value;
        router.push(`/shop?${createQueryString(name, nextValue)}`, { scroll: false });
    };

    const clearAll = () => {
        router.push("/shop");
    };

    const hasActiveFilters = activeCategory || activeGender || activeBrand;

    return (
        <aside className="w-full h-full pr-4">
            <div className="sticky top-28">
                {/* Visual filter sections mimicking the screenshot */}
                <FilterAccordion title="Scent Profile" defaultOpen={false}>
                    <FilterCheckbox label="Fresh" active={false} onClick={() => {}} />
                    <FilterCheckbox label="Woody" active={false} onClick={() => {}} />
                    <FilterCheckbox label="Floral" active={false} onClick={() => {}} />
                </FilterAccordion>

                <FilterAccordion title="Type" defaultOpen={false}>
                    <FilterCheckbox label="Eau De Parfum" active={false} onClick={() => {}} />
                    <FilterCheckbox label="Extrait De Parfum" active={false} onClick={() => {}} />
                </FilterAccordion>

                {/* Brand */}
                <FilterAccordion title="Brand" defaultOpen={true}>
                    {brands.map((b) => (
                        <FilterCheckbox
                            key={b.name}
                            label={b.name}
                            count={b.count}
                            active={activeBrand === b.name}
                            onClick={() => handleFilterChange("brand", b.name)}
                        />
                    ))}
                </FilterAccordion>

                <FilterAccordion title="Fragrance Type" defaultOpen={true}>
                    {fragranceTypes.map((item) => (
                        <FilterCheckbox
                            key={item.label}
                            label={item.label}
                            count={item.count}
                            active={activeCategory === item.label}
                            onClick={() => handleFilterChange("category", item.label)}
                        />
                    ))}
                </FilterAccordion>

                <FilterAccordion title="Gender" defaultOpen={true}>
                    {gendersList.map((g) => (
                        <FilterCheckbox
                            key={g.label}
                            label={g.label}
                            count={g.count}
                            active={activeGender === g.label.toLowerCase()}
                            onClick={() => handleFilterChange("gender", g.label.toLowerCase())}
                        />
                    ))}
                </FilterAccordion>

                <FilterAccordion title="Price" defaultOpen={false}>
                    <FilterCheckbox label="Under $30" active={false} onClick={() => {}} />
                    <FilterCheckbox label="$30 - $50" active={false} onClick={() => {}} />
                    <FilterCheckbox label="Over $50" active={false} onClick={() => {}} />
                </FilterAccordion>

                <FilterAccordion title="Size" defaultOpen={true}>
                    {sizesList.map((s) => (
                        <FilterCheckbox
                            key={s.label}
                            label={s.label}
                            count={s.count}
                            active={false}
                            onClick={() => {}}
                        />
                    ))}
                    <button className="text-[14px] text-black font-medium underline underline-offset-4 mt-2 text-left hover:text-gray-700 w-fit">
                        + Show More
                    </button>
                </FilterAccordion>

                <FilterAccordion title="Availability" defaultOpen={true}>
                    <FilterCheckbox label="In stock" count={223} active={false} onClick={() => {}} />
                    <FilterCheckbox label="Out of stock" count={47} active={false} onClick={() => {}} />
                </FilterAccordion>
            </div>
        </aside>
    );
}
