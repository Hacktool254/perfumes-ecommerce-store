"use client";

import { 
    Megaphone, 
    Sparkles, 
    Plus, 
    ChevronRight, 
    Users, 
    Zap, 
    Tag, 
    BarChart3,
    Calendar,
    Target,
    Loader2,
    TrendingUp,
    ArrowUpRight,
    Search,
    SlidersHorizontal,
    Percent,
    Banknote
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { format } from "date-fns";
import { useState } from "react";

export default function MarketingPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const coupons = useQuery(api.coupons.adminList, {});
    const stats = useQuery(api.orders.getStats, {});

    if (coupons === undefined || stats === undefined || stats === null) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">
                        Calibrating Growth Matrices...
                    </p>
                </div>
            </div>
        );
    }

    const activeCoupons = coupons.filter(c => c.isActive);
    const filteredCoupons = coupons.filter(c => 
        c.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
                .font-display { font-family: 'DM Serif Display', serif; }
                .font-body { font-family: 'DM Sans', sans-serif; }
                .promo-row:hover .promo-chevron { opacity: 1; transform: translateX(0); }
                .promo-chevron { opacity: 0; transform: translateX(-6px); transition: all 0.25s ease; }
                .glow-line { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); }
            `}</style>

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-12 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1.5px] bg-primary rounded-full shadow-[0_0_15px_#B07D5B33]" />
                        <p className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/80">Strategy Matrix</p>
                    </div>
                    <h1 className="font-display text-5xl text-foreground leading-none tracking-tighter">
                        STRATEGIC <span className="italic text-primary font-medium">REACH</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-4 h-16 px-10 rounded-[24px] bg-primary text-primary-foreground text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group">
                        <Plus size={18} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-500" />
                        Create Campaign
                    </button>
                    <button className="w-16 h-16 rounded-[24px] bg-surface-container-lowest border border-border/40 flex items-center justify-center hover:bg-surface-container transition-all group shadow-sm">
                        <Calendar size={20} className="text-muted-foreground/60 group-hover:text-primary transition-colors" />
                    </button>
                </div>
            </div>

            {/* ── KPI Strip ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { 
                        label: "Digital Reach", 
                        value: "245K", 
                        sub: "Active Impressions", 
                        icon: Users,
                        trend: "+12.4%",
                        trendColor: "text-emerald-500"
                    },
                    { 
                        label: "Conversion Rate", 
                        value: `${stats.p0Conversion.toFixed(1)}%`, 
                        sub: "Checkout Velocity", 
                        icon: Target,
                        trend: stats.conversionDelta >= 0 ? `+${stats.conversionDelta}%` : `${stats.conversionDelta}%`,
                        trendColor: stats.conversionDelta >= 0 ? "text-emerald-500" : "text-rose-500"
                    },
                    { 
                        label: "Active Promos", 
                        value: activeCoupons.length.toString(), 
                        sub: "Live Incentives", 
                        icon: Tag,
                        trend: "Strategic Yield",
                        trendColor: "text-primary/40"
                    },
                    { 
                        label: "Marketing ROAS", 
                        value: "14.2x", 
                        sub: "Campaign Efficiency", 
                        icon: BarChart3,
                        trend: "Peak Performance",
                        trendColor: "text-primary/40"
                    },
                ].map((kpi, i) => (
                    <div
                        key={i}
                        className="relative rounded-[40px] border border-border/40 bg-surface-container-lowest p-8 group hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-sm"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-start justify-between mb-8">
                            <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground/30 uppercase leading-none">{kpi.label}</p>
                            <kpi.icon size={16} strokeWidth={1.5} className="text-primary/20" />
                        </div>
                        <p className="font-display text-4xl text-foreground leading-none mb-3 group-hover:translate-x-1 transition-transform">{kpi.value}</p>
                        <div className="flex items-center gap-3">
                           <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">{kpi.sub}</p>
                           <div className="w-1 h-1 rounded-full bg-border" />
                           <p className={cn("text-[9px] font-black uppercase tracking-widest leading-none", kpi.trendColor)}>{kpi.trend}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Coupon Performance Ledger ── */}
            <div className="bg-surface-container-lowest border border-border/40 rounded-[56px] shadow-2xl relative overflow-hidden group/hub">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 group-hover/hub:bg-primary/10 transition-all duration-1000" />

                <div className="flex flex-col md:flex-row items-center justify-between px-10 py-12 border-b border-border/40 relative z-10 gap-8">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-foreground tracking-tighter leading-none">Promotion <span className="italic font-serif font-medium text-primary">Matrix</span></h2>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-[1px] bg-primary/40 rounded-full" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Live Strategic Streams</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group/search w-full md:w-64">
                            <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within/search:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Identify Code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-14 w-full rounded-[24px] bg-surface-container border border-border/10 pl-12 pr-6 text-xs font-black placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary/20 focus:bg-surface-container-lowest transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-3 h-14 px-8 rounded-[24px] bg-surface-container border border-border/10 text-[10px] font-black text-muted-foreground/40 hover:text-primary transition-all uppercase tracking-widest shrink-0">
                            <SlidersHorizontal size={14} strokeWidth={2} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-border/10 relative z-10 px-4 py-2">
                    {filteredCoupons.length === 0 ? (
                        <div className="py-24 text-center">
                            <p className="text-[11px] font-black tracking-[0.5em] text-muted-foreground/15 uppercase italic">
                                Zero incentives manifest in current spectrum
                            </p>
                        </div>
                    ) : (
                        filteredCoupons.map((coupon) => (
                            <div
                                key={coupon._id}
                                className="promo-row flex flex-col lg:flex-row lg:items-center justify-between p-8 rounded-[40px] hover:bg-surface-container/30 border border-transparent hover:border-primary/10 transition-all duration-700 cursor-pointer group/promo relative overflow-hidden"
                            >
                                <div className="flex items-center gap-8 min-w-0">
                                    <div className={cn(
                                        "w-20 h-20 rounded-[28px] flex items-center justify-center shadow-inner relative overflow-hidden group-hover/promo:scale-105 transition-transform duration-700",
                                        coupon.isActive ? "bg-primary/10 text-primary" : "bg-surface-container text-muted-foreground/20"
                                    )}>
                                        <Tag size={28} strokeWidth={1.5} className={cn(coupon.isActive ? "opacity-100" : "opacity-40")} />
                                        {coupon.isActive && <div className="absolute top-0 right-0 p-3 opacity-20"><Zap size={14} className="fill-primary" /></div>}
                                    </div>
                                    <div className="min-w-0 space-y-3">
                                        <div className="flex items-center gap-4">
                                            <p className="text-2xl font-black text-foreground tracking-tighter leading-none">{coupon.code}</p>
                                            {coupon.discountType === "percentage" ? (
                                                <span className="px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-[9px] font-black tracking-widest text-primary uppercase leading-none">
                                                    Velocity Offset
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-[9px] font-black tracking-widest text-emerald-500 uppercase leading-none">
                                                    Fixed Yield
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest flex items-center gap-2">
                                                <Percent size={12} className="text-primary/20" />
                                                {coupon.discountValue}{coupon.discountType === "percentage" ? "%" : " KES"} Reduction
                                            </p>
                                            <div className="w-1 h-1 rounded-full bg-border" />
                                            <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest flex items-center gap-2">
                                                <Banknote size={12} className="text-primary/20" />
                                                Min. KES {coupon.minOrderAmount?.toLocaleString() || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between lg:justify-end gap-12 md:gap-24 mt-8 lg:mt-0 px-6">
                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground/20 leading-none mb-2">Usage Rate</p>
                                        <p className="font-display text-3xl text-foreground leading-none">{coupon.usedCount}</p>
                                    </div>

                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground/20 leading-none mb-2">Expires</p>
                                        <p className="text-base font-black text-foreground/60 leading-none uppercase tracking-tighter italic">
                                            {coupon.expiresAt ? format(coupon.expiresAt, "dd MMM yyyy") : "Perpetual"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "h-12 px-6 rounded-full flex items-center gap-3 border text-[10px] font-black uppercase tracking-[0.2em] shadow-sm transition-all duration-700",
                                            coupon.isActive ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500" : "bg-muted-foreground/5 border-muted-foreground/10 text-muted-foreground/40"
                                        )}>
                                            <div className={cn("w-2 h-2 rounded-full", coupon.isActive ? "bg-emerald-500 shadow-[0_0_10px_#10b98166]" : "bg-muted-foreground/20")} />
                                            {coupon.isActive ? "Active Stream" : "Inactive"}
                                        </div>
                                        <div className="promo-chevron w-12 h-12 rounded-[20px] bg-surface-container flex items-center justify-center border border-border/10 shadow-inner group-hover/promo:scale-110 group-hover/promo:rotate-12 transition-all duration-700">
                                            <ChevronRight size={18} className="text-primary/40 group-hover/promo:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-12 border-t border-border/10 flex justify-between items-center relative z-10">
                    <p className="text-[11px] font-black tracking-[0.4em] text-muted-foreground/20 uppercase italic">
                        {activeCoupons.length} Active growth vectors in current cycle
                    </p>
                    <button className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/40 hover:text-primary transition-colors flex items-center gap-4 group">
                        Enter Campaign Archive
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* ── Content Asset Hub ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-foreground rounded-[64px] p-12 md:p-14 text-background relative overflow-hidden group/cta shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 transition-all group-hover/cta:rotate-0 duration-1000 group-hover/cta:opacity-10 pointer-events-none">
                        <Sparkles size={240} className="text-primary" />
                    </div>
                    <div className="relative z-10 space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[1px] bg-primary rounded-full shadow-[0_0_10px_#B07D5B33]" />
                            <h3 className="text-[11px] font-black tracking-[0.5em] uppercase text-primary/80 leading-none">Creative Hub</h3>
                        </div>
                        <h3 className="text-5xl font-black tracking-tighter leading-[0.9] italic font-serif max-w-sm">Brand <span className="text-primary not-italic italic">Asset Vault</span></h3>
                        <p className="text-background/40 text-xl font-medium leading-relaxed italic max-w-sm">
                            Synchronize curated fragrance campaign imagery with active olfactory strategy. Premium assets only.
                        </p>
                        <button className="h-18 px-12 rounded-[24px] bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40">
                            Enter Asset Library
                        </button>
                    </div>
                </div>

                <div className="bg-surface-container-lowest border border-border/40 rounded-[64px] p-12 md:p-14 flex flex-col justify-center gap-12 group shadow-2xl">
                    <div className="flex items-center gap-6 mb-2">
                        <div className="w-16 h-16 rounded-[28px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                            <TrendingUp size={28} className="text-emerald-500" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500/60 leading-none">Velocity Impact</h4>
                            <p className="text-4xl font-black text-foreground tracking-tighter leading-none">STRATEGIC LIFT</p>
                        </div>
                    </div>
                    <div className="space-y-10">
                        <p className="text-muted-foreground/50 text-2xl font-medium leading-relaxed italic">
                            Marketing incentives have manifested a <span className="text-foreground font-black">18.5% increase</span> in patron retention across the premium segment.
                        </p>
                        <div className="flex items-center gap-4 h-1px w-full bg-border/20 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[18.5%] shadow-[0_0_15px_#10b98166]" />
                        </div>
                        <button className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500/60 hover:text-emerald-500 transition-colors flex items-center gap-4 group">
                            Full Conversion Proof
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

