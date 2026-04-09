"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import {
    Plus,
    Calendar,
    Users,
    Trash2,
    Power,
    Tag,
    Search,
    Archive,
    Ticket,
    Zap,
    Sparkles,
    TrendingUp,
    Clock,
    Activity,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Id } from "@workspaceRoot/convex/_generated/dataModel";
import { AdminStatCard } from "@/components/admin/admin-stat-card";

export default function AdminCouponsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const coupons = useQuery(api.coupons.adminList);
    const toggleStatus = useMutation(api.coupons.toggleStatus);
    const removeCoupon = useMutation(api.coupons.remove);

    const handleToggle = async (id: Id<"coupons">, currentStatus: boolean) => {
        try {
            await toggleStatus({ id, isActive: !currentStatus });
        } catch (error) {
            console.error("Failed to toggle coupon status", error);
        }
    };

    const handleDelete = async (id: Id<"coupons">) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await removeCoupon({ id });
        } catch (error) {
            console.error("Failed to delete coupon", error);
        }
    };

    const filteredCoupons = coupons?.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = coupons?.filter(c => c.isActive).length || 0;
    const totalRedemptions = coupons?.reduce((acc, c) => acc + c.usedCount, 0) || 0;

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Editorial Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-12 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1.5px] bg-primary animate-glow rounded-full shadow-[0_0_15px_#B07D5B33]" />
                        <p className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/80">Marketing Intelligence</p>
                    </div>
                    <h1 className="text-6xl font-black text-foreground tracking-tighter leading-none">
                        PROMOTIONAL <span className="text-primary italic font-serif font-medium">VAULT</span>
                    </h1>
                </div>
                <div className="flex items-center gap-5">
                    <div className="relative group w-80">
                         <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                         <input
                            placeholder="Find Incentive Signature..."
                            className="h-16 w-full bg-surface-container-lowest border border-border/40 rounded-[24px] pl-14 pr-8 text-sm font-black focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:border-primary/20 placeholder:text-muted-foreground/20 leading-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-4 h-16 px-10 rounded-[24px] bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.03] active:scale-95 transition-all shadow-2xl shadow-primary/30 group relative overflow-hidden">
                        <Plus size={20} className="relative z-10 group-hover:rotate-180 transition-transform duration-700" />
                        <span className="relative z-10">Mint Coupon</span>
                    </button>
                </div>
            </div>

            {/* Metrics Surface */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminStatCard 
                    title="Active Incentives" 
                    value={activeCount}
                    icon={<Zap size={18} />}
                    trend={{ value: "Operational", positive: true }}
                />
                <AdminStatCard 
                    title="Total Redemptions" 
                    value={totalRedemptions.toLocaleString()}
                    icon={<TrendingUp size={18} />}
                    trend={{ value: "Global Flow", positive: true }}
                />
                <AdminStatCard 
                    title="Conversion Lift" 
                    value="12.4%"
                    icon={<Sparkles size={18} />}
                    trend={{ value: "+2.1% Yield", positive: true }}
                />
            </div>

            {/* The Vault Hierarchy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {!coupons ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-[320px] rounded-[48px] bg-surface-container-lowest animate-pulse border border-border/40 shadow-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
                        </div>
                    ))
                ) : filteredCoupons?.length === 0 ? (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center text-muted-foreground/20 border border-dashed border-border/40 rounded-[64px] bg-surface-container/20 space-y-6">
                        <Lock size={80} strokeWidth={1} className="opacity-10 animate-pulse" />
                        <div className="text-center">
                            <p className="font-serif italic text-3xl tracking-tight text-foreground/40 leading-none">The Vault is Sealed</p>
                            <p className="text-[10px] uppercase font-black tracking-[0.5em] mt-6 text-primary/40">No promotional signatures discovered in this spectrum</p>
                        </div>
                    </div>
                ) : (
                    filteredCoupons?.map((coupon) => (
                        <div key={coupon._id} className={cn(
                            "group relative bg-surface-container-lowest border border-border/40 rounded-[48px] p-10 flex flex-col gap-10 transition-all duration-700 hover:bg-surface-container/20 hover:border-primary/20 shadow-xl shadow-surface-container/5 overflow-hidden",
                            !coupon.isActive && "opacity-40 grayscale pointer-events-none"
                        )}>
                            {/* Cinematic Aura */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-1000" />
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />

                            <div className="flex items-start justify-between relative z-10 w-full">
                                <div className="space-y-6 flex-1 pr-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-surface-container border border-border/10 flex items-center justify-center text-primary shadow-inner">
                                            <Ticket size={20} strokeWidth={2.5} />
                                        </div>
                                        <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-[0.2em] leading-none">
                                            {coupon.discountType} Acquisition
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-4xl font-black text-foreground tracking-tihtest uppercase group-hover:text-primary transition-colors leading-none truncate">
                                            {coupon.code}
                                        </h3>
                                        <p className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] flex items-center gap-3">
                                            Yield: <span className="text-foreground italic font-serif lowercase tracking-normal text-lg">
                                                {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `KES ${coupon.discountValue.toLocaleString()}`}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => handleToggle(coupon._id, coupon.isActive ?? false)}
                                        className={cn(
                                            "w-12 h-12 rounded-[18px] flex items-center justify-center transition-all border shadow-sm group/power",
                                            coupon.isActive ? "bg-primary text-primary-foreground border-primary shadow-[#B07D5B33]" : "bg-surface-container border-border/40 text-muted-foreground"
                                        )}
                                    >
                                        <Power size={18} strokeWidth={3} className="group-hover/power:rotate-90 transition-transform" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(coupon._id)}
                                        className="w-12 h-12 rounded-[18px] bg-surface-container-low border border-border/40 flex items-center justify-center text-muted-foreground hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-500 shadow-sm"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Protocol Metrics */}
                            <div className="grid grid-cols-2 gap-8 relative z-10">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">
                                        <Users size={12} className="text-primary/40" /> Engagement Flow
                                    </div>
                                    <p className="text-xl font-black text-foreground tracking-tighter leading-none">
                                        {coupon.usedCount} <span className="text-muted-foreground/40 mx-1">/</span> {coupon.usageLimit || "∞"}
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.3em]">
                                        <Clock size={12} className="text-primary/40" /> Expiry Protocol
                                    </div>
                                    <p className="text-xl font-black text-foreground tracking-tighter leading-none">
                                        {coupon.expiresAt ? format(coupon.expiresAt, "MMM d, yy") : "Infinity"}
                                    </p>
                                </div>
                            </div>

                            {/* Deployment Spectrum */}
                            <div className="space-y-4 relative z-10 mt-auto">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em]">
                                    <span className="text-muted-foreground/40">Market Saturation</span>
                                    <span className={cn(
                                        "text-foreground",
                                        coupon.usageLimit && (coupon.usedCount / coupon.usageLimit > 0.9) && "text-rose-500"
                                    )}>
                                        {coupon.usageLimit ? `${Math.round((coupon.usedCount / coupon.usageLimit) * 100)}%` : 'Solidified'}
                                    </span>
                                </div>
                                <div className="h-4 w-full bg-surface-container rounded-full overflow-hidden border border-border/5 p-1 shadow-inner">
                                        <div 
                                            className={cn(
                                                "h-full bg-gradient-to-r from-primary/60 to-primary rounded-full transition-all duration-2000 ease-out shadow-[0_0_15px_#B07D5B33]",
                                                coupon.usageLimit && (coupon.usedCount / coupon.usageLimit > 0.9) && "from-rose-500/60 to-rose-500"
                                            )}
                                            style={{ width: coupon.usageLimit ? `${(coupon.usedCount / coupon.usageLimit) * 100}%` : '88.4%' }}
                                        />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
