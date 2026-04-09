"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { Bell, Shield, Sparkles, Check, X, Package, Truck, CreditCard, Clock, Settings2, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
    const orders = useQuery(api.orders.list);
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
            <div className="space-y-12 animate-pulse">
                <div className="h-8 bg-white/5 rounded-lg w-48 mx-4" />
                <div className="h-[400px] bg-white/5 rounded-[40px] w-full" />
                <div className="h-8 bg-white/5 rounded-lg w-48 mx-4" />
                <div className="h-[400px] bg-white/5 rounded-[40px] w-full" />
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
        <div className="space-y-16 pb-12">
            {/* Preference Center Module */}
            <section className="space-y-8">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#DBC2A6] rounded-full" />
                        <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                            Notification Protocol
                        </h2>
                    </div>
                    <div className="px-4 py-2 bg-[#DBC2A6]/10 border border-[#DBC2A6]/20 rounded-xl flex items-center gap-2">
                        <Settings2 size={12} className="text-[#DBC2A6]" />
                        <span className="text-[10px] uppercase tracking-widest font-black text-[#DBC2A6]">Preference Config</span>
                    </div>
                </div>

                <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col gap-12">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DBC2A6]/10 to-transparent" />
                    
                    {/* Primary Toggles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ToggleButton 
                            title="Transaction Manifests"
                            description="Real-time procurement logs, shipping coordinates, and delivery verification."
                            active={localPrefs.orderNotifications}
                            onClick={toggleOrderNotifs}
                            icon={<Shield size={20} />}
                        />
                        <ToggleButton 
                            title="Intelligence Briefings"
                            description="Early access to seasonal drops and exclusive member-only pricing data."
                            active={localPrefs.promotions}
                            onClick={togglePromotions}
                            icon={<Sparkles size={20} />}
                        />
                    </div>

                    {/* Interest Clusters */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 px-2">
                             <div className="w-1 h-3 bg-white/20 rounded-full" />
                             <h3 className="text-[10px] uppercase tracking-[0.25em] font-black text-white/40">Interest Clusters</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryOptions.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => toggleCategory(cat)}
                                    className={cn(
                                        "flex items-center justify-between p-6 rounded-[24px] border transition-all duration-500 text-left group relative overflow-hidden",
                                        localPrefs.marketingCategories.includes(cat)
                                            ? "bg-[#DBC2A6]/10 border-[#DBC2A6]/30 text-white shadow-xl shadow-[#DBC2A6]/5"
                                            : "bg-[#0A0D0B] border-white/5 text-white/40 hover:border-white/10"
                                    )}
                                >
                                    <span className={cn(
                                        "text-xs font-black uppercase tracking-widest",
                                        localPrefs.marketingCategories.includes(cat) ? "text-[#DBC2A6]" : "group-hover:text-white/60"
                                    )}>{cat}</span>
                                    <div className={cn(
                                        "w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500",
                                        localPrefs.marketingCategories.includes(cat)
                                            ? "bg-[#DBC2A6] border-[#DBC2A6] text-[#0A0D0B] scale-110 shadow-[0_0_12px_#DBC2A6]"
                                            : "border-white/10 group-hover:border-white/20 bg-black/40"
                                    )}>
                                        {localPrefs.marketingCategories.includes(cat) && <Check size={12} strokeWidth={4} />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* System Activity Hub */}
            <section className="space-y-8">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#DBC2A6] rounded-full" />
                        <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                            Real-Time Activity Feed
                        </h2>
                    </div>
                    <div className="px-4 py-2 bg-[#DBC2A6]/10 border border-[#DBC2A6]/20 rounded-xl flex items-center gap-2">
                        <Activity size={12} className="text-[#DBC2A6]" />
                        <span className="text-[10px] uppercase tracking-widest font-black text-[#DBC2A6]">Live Systems</span>
                    </div>
                </div>

                <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl relative min-h-[400px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#DBC2A6]/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
                    <div className="absolute top-0 left-16 md:left-24 w-px h-full bg-white/5 z-0" />
                    
                    <div className="relative z-10 p-10 md:p-16 space-y-12">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order._id} className="flex gap-10 md:gap-16 group">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-700 shadow-2xl z-20 group-hover:scale-110",
                                        order.status === "delivered" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 scale-105" :
                                        order.status === "shipped" ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                                        order.status === "paid" ? "bg-[#DBC2A6]/10 border-[#DBC2A6]/20 text-[#DBC2A6]" :
                                        "bg-[#0A0D0B] border-white/10 text-white/20"
                                    )}>
                                        {order.status === "delivered" ? <Package size={20} /> : 
                                         order.status === "shipped" ? <Truck size={20} /> : 
                                         order.status === "paid" ? <CreditCard size={20} /> : 
                                         <Clock size={20} />}
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                                            <h4 className="text-sm font-black text-white capitalize tracking-widest">
                                                Order Sequence {order.status}
                                            </h4>
                                            <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-black group-hover:text-white/40 transition-colors">
                                                {format(order.createdAt, "MMM d, HH:mm:ss")}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/30 leading-relaxed font-bold tracking-tight max-w-2xl bg-[#0A0D0B]/30 p-4 rounded-2xl border border-white/5 italic">
                                            {order.status === "pending" && `Manifest #UTX-${order._id.slice(-6).toUpperCase()} initiated. Awaiting validation sequence.`}
                                            {order.status === "paid" && `Payment verified for #UTX-${order._id.slice(-6).toUpperCase()}. Commencing artifact curation.`}
                                            {order.status === "shipped" && `Artifacts for #UTX-${order._id.slice(-6).toUpperCase()} in transit. Tracking protocols active.`}
                                            {order.status === "delivered" && `Sequence complete. #UTX-${order._id.slice(-6).toUpperCase()} successfully archived at destination.`}
                                            {order.status === "cancelled" && `Manifest #UTX-${order._id.slice(-6).toUpperCase()} decommissioned by system.`}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-24 text-center space-y-6 opacity-30 group">
                                <div className="w-20 h-20 bg-[#0A0D0B] rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-3xl transform group-hover:scale-110 transition-transform duration-700">
                                    <Bell className="text-white/10" size={32} strokeWidth={1} />
                                </div>
                                <p className="text-[10px] uppercase tracking-[0.3em] font-black">Link Established - No Incoming Data</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            
            {/* Disclaimer */}
            <footer className="pt-8 border-t border-white/5 flex items-center justify-center gap-6 text-white/20 italic text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                    <Shield size={14} className="text-[#DBC2A6]/40" />
                    <span>E2E Encrypted Routing</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                <span>Verified Data Integrity</span>
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
                "flex-1 flex items-center gap-8 p-8 md:p-10 rounded-[40px] border transition-all duration-700 text-left group relative overflow-hidden",
                active 
                    ? "bg-[#0A0D0B] border-[#DBC2A6]/30 shadow-3xl" 
                    : "bg-[#0A0D0B] border-white/5 opacity-40 hover:opacity-100 hover:border-white/10"
            )}
        >
            <div className={cn(
                "w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-700 border",
                active 
                    ? "bg-[#DBC2A6] text-[#0A0D0B] border-[#DBC2A6] scale-105 shadow-2xl" 
                    : "bg-white/5 text-white/20 border-white/5 group-hover:bg-white/10"
            )}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className={cn(
                    "text-base font-black tracking-tight mb-2 transition-colors uppercase",
                    active ? "text-[#DBC2A6]" : "text-white/40"
                )}>{title}</h3>
                <p className="text-xs text-white/20 font-bold leading-relaxed tracking-tight">{description}</p>
            </div>
            <div className={cn(
                "w-16 h-9 rounded-full relative transition-all duration-700 border flex items-center px-1.5 group-hover:scale-105",
                active 
                    ? "bg-[#DBC2A6] border-[#DBC2A6] shadow-[0_0_20px_rgba(219,194,166,0.3)]" 
                    : "bg-black/60 border-white/10"
            )}>
                <div className={cn(
                    "w-6 h-6 rounded-full transition-all duration-700 shadow-2xl",
                    active ? "translate-x-7 bg-white scale-110" : "translate-x-0 bg-white/10"
                )} />
            </div>
        </button>
    );
}
