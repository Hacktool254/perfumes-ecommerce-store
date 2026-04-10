"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { 
    Bell, 
    Shield, 
    Sparkles, 
    Check, 
    X, 
    Package, 
    Truck, 
    CreditCard, 
    Clock, 
    Settings2, 
    Activity,
    Radar,
    Zap,
    Cpu,
    Fingerprint,
    Waves
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";
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
                <div className="h-16 bg-white/[0.02] rounded-[32px] w-96 mx-4" />
                <div className="h-[500px] bg-white/[0.02] rounded-[56px] w-full" />
                <div className="h-16 bg-white/[0.02] rounded-[32px] w-96 mx-4" />
                <div className="h-[500px] bg-white/[0.02] rounded-[56px] w-full" />
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
        <div className="space-y-12 md:space-y-16 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             {/* ── Intel Signature ── */}
             <div className="flex flex-col lg:flex-row items-center justify-between gap-8 border-b border-[#B07D5B1A] pb-10">
                <div className="space-y-4 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center gap-4">
                        <div className="hidden lg:block w-1.5 h-8 bg-[#B07D5B] rounded-full shadow-[0_0_15px_#B07D5B66]" />
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight italic">Intelligence Hub</h1>
                    </div>
                    <p className="text-white/30 text-base md:text-lg italic lg:pl-6 max-w-lg mx-auto lg:mx-0">Real-time telemetry and preference configuration for the Ummies ecosystem.</p>
                </div>
                
                <div className="px-6 py-3 md:px-8 md:py-4 bg-[#B07D5B1A] border border-[#B07D5B33] rounded-[24px] flex items-center gap-4">
                    <Radar size={14} className="text-[#B07D5B] animate-pulse" />
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-white italic leading-none">Live Network Monitoring</span>
                </div>
            </div>

            {/* ── Configuration Matrix ── */}
            <section className="space-y-8 md:space-y-10">
                <div className="flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                         <div className="w-2 h-2 rounded-full bg-[#B07D5B]" />
                         <h2 className="text-[9px] md:text-[10px] items-center gap-2 font-black tracking-[0.4em] md:tracking-[0.5em] text-white/20 uppercase italic">Preference Config Sequence</h2>
                    </div>
                    <Settings2 size={14} className="text-white/10" />
                </div>

                <div className="bg-[#0a0a0b] border border-[#B07D5B1A] rounded-[48px] md:rounded-[64px] p-8 md:p-16 shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B07D5B33] to-transparent opacity-30" />
                    
                    {/* Primary Control Toggles */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 mb-16 md:mb-20">
                        <ToggleButton 
                            title="Transaction Manifests"
                            description="Real-time procurement logs, shipping coordinates, and delivery verification sequences."
                            active={localPrefs.orderNotifications}
                            onClick={toggleOrderNotifs}
                            icon={<Shield size={24} />}
                        />
                        <ToggleButton 
                            title="Intelligence Briefings"
                            description="Early access to seasonal drops and exclusive member-only pricing metadata."
                            active={localPrefs.promotions}
                            onClick={togglePromotions}
                            icon={<Sparkles size={24} />}
                        />
                    </div>

                    {/* Interest Cluster Grid */}
                    <div className="space-y-10 md:space-y-12">
                        <div className="flex items-center gap-6 px-4">
                             <div className="h-[1px] flex-1 bg-white/5" />
                             <h3 className="text-[8px] md:text-[9px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-black text-white/10 italic">Core Interest Clusters</h3>
                             <div className="h-[1px] flex-1 bg-white/5" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {categoryOptions.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => toggleCategory(cat)}
                                    className={cn(
                                        "flex items-center justify-between p-6 md:p-8 rounded-[28px] md:rounded-[32px] border transition-all duration-700 text-left group relative overflow-hidden shadow-sm",
                                        localPrefs.marketingCategories.includes(cat)
                                            ? "bg-[#B07D5B]/10 border-[#B07D5B4D] text-white shadow-xl shadow-[#B07D5B05]"
                                            : "bg-white/[0.01] border-white/5 text-white/30 hover:border-white/20 hover:bg-white/[0.02]"
                                    )}
                                >
                                    <span className={cn(
                                        "text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700",
                                        localPrefs.marketingCategories.includes(cat) ? "text-[#B07D5B]" : "group-hover:text-white/60"
                                    )}>{cat}</span>
                                    <div className={cn(
                                        "w-7 h-7 md:w-8 md:h-8 rounded-full border flex items-center justify-center transition-all duration-700 shrink-0",
                                        localPrefs.marketingCategories.includes(cat)
                                            ? "bg-[#B07D5B] border-[#B07D5B] text-[#0a0a0b] scale-110 shadow-[0_0_15px_#B07D5B66]"
                                            : "border-white/10 group-hover:border-white/30 bg-black/40"
                                    )}>
                                        {localPrefs.marketingCategories.includes(cat) && <Check size={14} strokeWidth={4} />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* ── Manifest Feed ── */}
            <section className="space-y-8 md:space-y-10">
                <div className="flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                         <div className="w-2 h-2 rounded-full bg-[#B07D5B]" />
                         <h2 className="text-[9px] md:text-[10px] items-center gap-2 font-black tracking-[0.4em] md:tracking-[0.5em] text-white/20 uppercase italic">Real-Time Event Feed</h2>
                    </div>
                </div>

                <div className="bg-[#0a0a0b] border border-[#B07D5B1A] rounded-[48px] md:rounded-[64px] shadow-3xl relative min-h-[400px] md:min-h-[500px] overflow-hidden">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#B07D5B03] blur-[180px] -mr-80 -mt-80 rounded-full pointer-events-none" />
                    <div className="absolute top-0 left-12 md:left-28 w-[1px] h-full bg-[#B07D5B1A] z-0" />
                    
                    <div className="relative z-10 p-8 md:p-20 space-y-12 md:space-y-16">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order._id} className="flex gap-8 md:gap-20 group relative">
                                    {/* Timeline Node */}
                                    <div className={cn(
                                        "w-10 h-10 md:w-16 md:h-16 rounded-[14px] md:rounded-[24px] flex items-center justify-center shrink-0 border transition-all duration-1000 shadow-2xl z-20 group-hover:scale-110 group-hover:rotate-6",
                                        order.status === "delivered" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" :
                                        order.status === "shipped" ? "bg-blue-500/10 border-blue-500/30 text-blue-500" :
                                        order.status === "paid" ? "bg-[#B07D5B1A] border-[#B07D5B4D] text-[#B07D5B]" :
                                        "bg-white/[0.02] border-white/5 text-white/10"
                                    )}>
                                        {order.status === "delivered" ? <Package size={20} className="md:w-7 md:h-7" strokeWidth={1.5} /> : 
                                         order.status === "shipped" ? <Truck size={20} className="md:w-7 md:h-7" strokeWidth={1.5} /> : 
                                         order.status === "paid" ? <CreditCard size={20} className="md:w-7 md:h-7" strokeWidth={1.5} /> : 
                                         <Clock size={20} className="md:w-7 md:h-7" strokeWidth={1.5} />}
                                    </div>

                                    {/* Event Content */}
                                    <div className="flex-1 pt-1 md:pt-3 animate-in fade-in slide-in-from-left-4 duration-1000">
                                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4 md:mb-6">
                                            <div className="space-y-1">
                                                <h4 className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] leading-none italic">Status Mutation</h4>
                                                <p className="font-display text-2xl md:text-3xl lg:text-4xl text-white tracking-tight capitalize italic">Order {order.status}</p>
                                            </div>
                                            <span className="text-[8px] md:text-[10px] text-white/20 uppercase tracking-[0.3em] font-black group-hover:text-[#B07D5B]/40 transition-colors bg-white/[0.02] px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-white/5 w-fit">
                                                {format(order.createdAt, "MMM d, HH:mm")}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 w-1 bg-[#B07D5B]/20 rounded-full" />
                                            <p className="text-[11px] md:text-sm text-white/40 leading-relaxed font-bold tracking-tight max-w-2xl bg-white/[0.01] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/5 italic shadow-inner pl-10 md:pl-12 group-hover:bg-[#B07D5B05] transition-all duration-700">
                                                {order.status === "pending" && `Manifest #UTX-${order._id.slice(-6).toUpperCase()} initiated. Security protocols active. Awaiting validation sequence.`}
                                                {order.status === "paid" && `Payment verification successful for #UTX-${order._id.slice(-6).toUpperCase()}. Commencing high-fidelity artifact curation.`}
                                                {order.status === "shipped" && `Artifacts for #UTX-${order._id.slice(-6).toUpperCase()} in transit. Secure routing established. Tracking telemetry active.`}
                                                {order.status === "delivered" && `Sequence complete. #UTX-${order._id.slice(-6).toUpperCase()} successfully archived at destination logistics hub.`}
                                                {order.status === "cancelled" && `Manifest #UTX-${order._id.slice(-6).toUpperCase()} decommissioned by system bypass.`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-24 md:py-32 text-center space-y-8 md:space-y-10 group opacity-40">
                                <div className="w-24 h-24 md:w-28 md:h-28 bg-white/[0.01] rounded-[36px] md:rounded-[48px] flex items-center justify-center mx-auto mb-10 border border-white/5 shadow-inner transition-all duration-[2s] group-hover:scale-110 group-hover:rotate-12">
                                    <Waves className="text-[#B07D5B]/20 w-8 h-8 md:w-12 md:h-12" strokeWidth={1} />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-display text-2xl md:text-3xl text-white tracking-widest uppercase italic opacity-20">Network Silent</h3>
                                    <p className="text-[9px] uppercase tracking-[0.4em] md:tracking-[0.6em] font-black text-white/10 italic leading-none">Secure link established - no incoming telemetry</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            
            {/* System Footer */}
            <footer className="pt-12 md:pt-16 flex flex-col items-center justify-center gap-6 md:gap-8 grayscale opacity-10 hover:grayscale-0 hover:opacity-100 transition-all duration-[3s]">
                <div className="flex items-center gap-6 md:gap-8">
                    <Shield size={16} className="text-[#B07D5B]/60" />
                    <div className="h-4 w-[1px] bg-white/10" />
                    <Zap size={16} className="text-[#B07D5B]/60" />
                    <div className="h-4 w-[1px] bg-white/10" />
                    <Fingerprint size={16} className="text-[#B07D5B]/60" />
                </div>
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.6em] md:tracking-[0.8em] text-white italic leading-none">E2E Matrix Encrypted / System Verified</p>
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
                "flex-1 flex flex-col sm:flex-row items-center sm:items-start gap-8 md:gap-10 p-8 md:p-12 rounded-[32px] md:rounded-[48px] border transition-all duration-700 text-center sm:text-left group relative overflow-hidden",
                active 
                    ? "bg-white/[0.02] border-[#B07D5B4D] shadow-3xl" 
                    : "bg-white/[0.01] border-white/5 opacity-40 hover:opacity-100 hover:border-white/20"
            )}
        >
            <div className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-[24px] md:rounded-[32px] flex items-center justify-center transition-all duration-700 border shadow-2xl shrink-0 group-hover:rotate-6",
                active 
                    ? "bg-[#B07D5B] text-[#0a0a0b] border-[#B07D5B] shadow-[0_0_25px_#B07D5B4D]" 
                    : "bg-white/5 text-white/20 border-white/5 group-hover:bg-white/10 group-hover:text-white/40"
            )}>
                {icon}
            </div>
            <div className="flex-1 space-y-4 pt-1 md:pt-2">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h3 className={cn(
                        "text-lg md:text-xl font-display tracking-tight italic transition-colors",
                        active ? "text-white" : "text-white/40"
                    )}>{title}</h3>
                    
                    {/* Toggle Indicator */}
                    <div className={cn(
                        "w-12 h-6 md:w-14 md:h-7 rounded-full relative transition-all duration-700 border flex items-center px-1 group-hover:scale-110 shrink-0",
                        active 
                            ? "bg-[#B07D5B] border-[#B07D5B] shadow-[0_0_20px_#B07D5B33]" 
                            : "bg-black/60 border-white/10"
                    )}>
                        <div className={cn(
                            "w-4 h-4 md:w-5 md:h-5 rounded-full transition-all duration-700 shadow-xl",
                            active ? "translate-x-6 md:translate-x-7 bg-white scale-110" : "translate-x-0 bg-white/10"
                        )} />
                    </div>
                </div>
                <p className="text-[10px] md:text-[11px] text-white/20 font-bold leading-relaxed tracking-tight uppercase italic">{description}</p>
            </div>
        </button>
    );
}
