"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { Bell, Shield, Sparkles, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const categoryOptions = [
    "Women's Perfumes",
    "Men's Fragrances",
    "Unisex Collections",
    "Limited Editions",
    "Gift Sets",
    "Home Scents"
];

export default function NotificationsPage() {
    const prefs = useQuery(api.preferences.get);
    const updatePrefs = useMutation(api.preferences.update);
    const [localPrefs, setLocalPrefs] = useState<{
        marketingCategories: string[];
        orderNotifications: boolean;
        promotions: boolean;
    } | null>(null);

    // Sync local state when query returns
    useEffect(() => {
        if (prefs) {
            setLocalPrefs({
                marketingCategories: prefs.marketingCategories,
                orderNotifications: prefs.orderNotifications,
                promotions: prefs.promotions,
            });
        }
    }, [prefs]);

    if (!localPrefs) {
        return (
            <div className="flex flex-col gap-8 animate-pulse">
                <div className="h-12 bg-white/5 rounded-2xl w-1/4" />
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 bg-white/5 rounded-[32px]" />
                    ))}
                </div>
            </div>
        );
    }

    const toggleCategory = async (category: string) => {
        const newCategories = localPrefs.marketingCategories.includes(category)
            ? localPrefs.marketingCategories.filter(c => c !== category)
            : [...localPrefs.marketingCategories, category];
        
        setLocalPrefs({ ...localPrefs, marketingCategories: newCategories });
        await updatePrefs({ marketingCategories: newCategories });
    };

    const toggleOrderNotifs = async () => {
        const newValue = !localPrefs.orderNotifications;
        setLocalPrefs({ ...localPrefs, orderNotifications: newValue });
        await updatePrefs({ orderNotifications: newValue });
    };

    const togglePromotions = async () => {
        const newValue = !localPrefs.promotions;
        setLocalPrefs({ ...localPrefs, promotions: newValue });
        await updatePrefs({ promotions: newValue });
    };

    return (
        <div className="space-y-12 max-w-3xl">
            {/* Header */}
            <header>
                <div className="flex items-center gap-2 text-[#DBC2A6] mb-3">
                    <Bell size={16} />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black">Preference Center</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                    Control Center
                </h1>
                <p className="text-white/40 text-sm mt-3 font-medium max-w-sm leading-relaxed">
                    Manage how we communicate with you. Your privacy and attention are our highest priorities.
                </p>
            </header>

            {/* Notification Sections */}
            <div className="space-y-8">
                {/* Essential Communications */}
                <section>
                    <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20 mb-6 px-4">Transactions & Security</h2>
                    <div className="space-y-4">
                        <ToggleButton 
                            title="Order Status Updates"
                            description="Real-time notifications for shipping, delivery, and payments."
                            active={localPrefs.orderNotifications}
                            onClick={toggleOrderNotifs}
                            icon={<Shield size={20} />}
                        />
                    </div>
                </section>

                {/* Subscriptions */}
                <section>
                    <div className="flex items-center justify-between mb-6 px-4">
                        <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20">Product Intelligence</h2>
                        <div className="flex items-center gap-2">
                             <Sparkles size={12} className="text-[#DBC2A6]" />
                             <span className="text-[9px] uppercase tracking-widest font-bold text-[#DBC2A6]">Personalized</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <ToggleButton 
                            title="Global Promotions"
                            description="Early access to seasonal drops and exclusive member-only pricing."
                            active={localPrefs.promotions}
                            onClick={togglePromotions}
                            icon={<Sparkles size={20} />}
                        />
                    </div>
                </section>

                {/* Category Preferences (Matching Image 2) */}
                <section>
                    <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20 mb-6 px-4">Interest Clusters</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categoryOptions.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => toggleCategory(cat)}
                                className={cn(
                                    "flex items-center justify-between p-6 rounded-[32px] border transition-all duration-500 text-left group",
                                    localPrefs.marketingCategories.includes(cat)
                                        ? "bg-[#DBC2A6]/10 border-[#DBC2A6]/30 text-white"
                                        : "bg-[#1A1E1C] border-white/5 text-white/40 hover:border-white/10"
                                )}
                            >
                                <span className={cn(
                                    "text-sm font-bold tracking-tight",
                                    localPrefs.marketingCategories.includes(cat) ? "text-[#DBC2A6]" : "group-hover:text-white/60"
                                )}>{cat}</span>
                                <div className={cn(
                                    "w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500",
                                    localPrefs.marketingCategories.includes(cat)
                                        ? "bg-[#DBC2A6] border-[#DBC2A6] text-[#0A0D0B] scale-110 shadow-[0_0_12px_#DBC2A6]"
                                        : "border-white/10 group-hover:border-white/20"
                                )}>
                                    {localPrefs.marketingCategories.includes(cat) && <Check size={12} strokeWidth={4} />}
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
            
            {/* Disclaimer */}
            <footer className="pt-8 border-t border-white/5 flex items-center gap-4 text-white/20 italic text-xs font-medium">
                <Shield size={14} />
                <span>End-to-end encrypted notification routing. We do not sell your interest data.</span>
            </footer>
        </div>
    );
}

function ToggleButton({ 
    title, 
    description, 
    active, 
    onClick, 
    icon 
}: { 
    title: string; 
    description: string; 
    active: boolean; 
    onClick: () => void;
    icon: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-6 p-8 rounded-[40px] border transition-all duration-500 text-left group relative overflow-hidden",
                active 
                    ? "bg-[#1A1E1C] border-[#DBC2A6]/20 shadow-2xl" 
                    : "bg-[#1A1E1C] border-white/5 opacity-60 hover:opacity-100"
            )}
        >
            <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border",
                active 
                    ? "bg-[#DBC2A6]/10 text-[#DBC2A6] border-[#DBC2A6]/20" 
                    : "bg-white/5 text-white/20 border-white/5 group-hover:bg-white/10"
            )}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className={cn(
                    "text-base font-black tracking-tight mb-1 transition-colors",
                    active ? "text-white" : "text-white/40"
                )}>{title}</h3>
                <p className="text-xs text-white/30 font-medium leading-relaxed">{description}</p>
            </div>
            <div className={cn(
                "w-14 h-8 rounded-full relative transition-all duration-500 border flex items-center px-1",
                active 
                    ? "bg-[#DBC2A6] border-[#DBC2A6] shadow-[0_0_15px_#DBC2A6]" 
                    : "bg-black/40 border-white/10"
            )}>
                <div className={cn(
                    "w-6 h-6 rounded-full transition-transform duration-500 shadow-xl",
                    active ? "translate-x-6 bg-white" : "translate-x-0 bg-white/20"
                )} />
            </div>
        </button>
    );
}
