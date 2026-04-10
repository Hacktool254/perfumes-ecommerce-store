"use client";

import {
    Users as UsersIcon,
    Mail,
    Phone,
    ShoppingBag,
    Calendar,
    Search,
    Plus,
    ChevronRight,
    Star,
    Loader2,
    TrendingUp,
    Zap,
    Download
} from "lucide-react";
import { useState } from "react";
import { useQuery, useConvex } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/lib/export-utils";
import { toast } from "sonner";
import { format } from "date-fns";

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const customers = useQuery(api.users.list, { searchTerm });
    const convex = useConvex();
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPatrons = async () => {
        setIsExporting(true);
        try {
            const data = await convex.query(api.export.patrons);
            exportToCSV(data, `patron_matrix_${format(new Date(), "yyyy-MM-dd")}.csv`);
            toast.success("Patron Matrix exported successfully");
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Failed to export patrons");
        } finally {
            setIsExporting(false);
        }
    };

    if (customers === undefined) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">
                        Aligning Patron Metadata...
                    </p>
                </div>
            </div>
        );
    }

    const totalCustomers = customers.length;
    const vipCount = customers.filter((c) => c.status === "VIP").length;
    const totalSpent = customers.reduce((a, c) => a + (c.totalSpent || 0), 0);
    const avgOrders =
        totalCustomers > 0
            ? Math.round(
                  (customers.reduce((a, c) => a + (c.orderCount || 0), 0) /
                      totalCustomers) *
                      10
              ) / 10
            : 0;

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
                .font-display { font-family: 'DM Serif Display', serif; }
                .font-body { font-family: 'DM Sans', sans-serif; }
                .patron-row:hover .patron-chevron { opacity: 1; transform: translateX(0); }
                .patron-chevron { opacity: 0; transform: translateX(-4px); transition: all 0.2s ease; }
                .glow-line { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); }
            `}</style>

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-12 gap-8">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-[1.5px] bg-primary rounded-full shadow-[0_0_15px_#B07D5B33]" />
                        <p className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/80">
                            Patron Intelligence
                        </p>
                    </div>
                    <h1 className="font-display text-6xl text-foreground leading-none tracking-tighter">
                        CUSTOMER <span className="italic text-primary font-medium">DIRECTORY</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search
                            size={16}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="Identify Patron..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-16 w-full md:w-80 bg-surface-container-lowest border border-border/40 rounded-[24px] pl-14 pr-8 text-sm font-black focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:border-primary/20 placeholder:text-muted-foreground/20"
                        />
                    </div>
                    <button className="w-16 h-16 rounded-[24px] bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 group">
                        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            {/* ── KPI Strip ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        label: "Total Patrons",
                        value: totalCustomers.toLocaleString(),
                        icon: UsersIcon,
                        sub: "Active identities",
                    },
                    {
                        label: "VIP Tier",
                        value: vipCount.toString(),
                        icon: Star,
                        sub: totalCustomers > 0 ? `${Math.round((vipCount / totalCustomers) * 100)}% segments` : "0%",
                    },
                    {
                        label: "Total Yield",
                        value: `KES ${Math.round(totalSpent / 1000)}K`,
                        icon: ShoppingBag,
                        sub: "Lifetime investment",
                    },
                    {
                        label: "Avg. Velocity",
                        value: avgOrders.toString(),
                        icon: TrendingUp,
                        sub: "Flows per patron",
                    },
                ].map((kpi, i) => (
                    <div
                        key={i}
                        className="relative rounded-[40px] border border-border/40 bg-surface-container-lowest p-8 group hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-sm"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-start justify-between mb-6">
                            <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground/40 uppercase leading-none">{kpi.label}</p>
                            <kpi.icon size={16} strokeWidth={1.5} className="text-primary/40 flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="font-display text-4xl text-foreground leading-none mb-3 group-hover:translate-x-1 transition-transform">{kpi.value}</p>
                        <p className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-widest">{kpi.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Customer Matrix ── */}
            <div className="bg-surface-container-lowest border border-border/40 rounded-[56px] p-10 md:p-14 shadow-2xl relative overflow-hidden group/hub h-fit">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 group-hover/hub:bg-primary/10 transition-all duration-1000" />

                <div className="flex items-center justify-between mb-14 relative z-10">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-foreground tracking-tighter leading-none">
                            Identity <span className="italic font-serif font-medium text-primary">Manifest</span>
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-[1px] bg-primary/40 rounded-full" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Verified Curated Stream</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 relative z-10">
                    {customers.length === 0 ? (
                        <div className="py-24 text-center">
                            <p className="text-[11px] font-black tracking-[0.5em] text-muted-foreground/15 uppercase italic">
                                Zero results in current spectrum
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {customers.map((customer) => (
                                <div
                                    key={customer._id}
                                    className="patron-row flex flex-col lg:flex-row lg:items-center justify-between p-7 rounded-[40px] hover:bg-surface-container/30 border border-transparent hover:border-primary/10 transition-all duration-700 cursor-pointer group/patron relative overflow-hidden"
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-border/10 to-transparent group-last:hidden" />
                                    
                                    <div className="flex items-center gap-6 min-w-0">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-16 h-16 rounded-[24px] overflow-hidden bg-surface-container border border-border/5 shadow-2xl group-hover/patron:scale-105 transition-transform duration-700">
                                                <img
                                                    src={
                                                        customer.image ||
                                                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.email}`
                                                    }
                                                    alt={customer.name || "Patron"}
                                                    className="w-full h-full object-cover group-hover/patron:scale-110 transition-transform duration-1000"
                                                />
                                            </div>
                                            {customer.status === "VIP" && (
                                                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-4 border-surface-container-lowest shadow-xl">
                                                    <Star size={10} className="text-white fill-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 space-y-2">
                                            <div className="flex items-center gap-3">
                                                <p className="text-xl font-black text-foreground tracking-tighter truncate leading-none">
                                                    {customer.name || "Anonymous Patron"}
                                                </p>
                                                {customer.role === "admin" && (
                                                    <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black tracking-widest text-primary uppercase leading-none">
                                                        Executive
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest flex items-center gap-2 truncate">
                                                <Mail size={11} strokeWidth={2} />
                                                {customer.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between lg:justify-end gap-12 md:gap-20 mt-6 lg:mt-0 px-4">
                                        <div className="text-right space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 leading-none mb-1">Orders</p>
                                            <p className="font-display text-2xl text-foreground/80 leading-none">
                                                {customer.orderCount || 0}
                                            </p>
                                        </div>

                                        <div className="text-right space-y-1">
                                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 leading-none mb-1">Spent</p>
                                            <p className="font-display text-2xl text-foreground leading-none">
                                                KES {(customer.totalSpent || 0).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="patron-chevron w-12 h-12 rounded-[20px] bg-surface-container flex items-center justify-center border border-border/10 shadow-inner group-hover/patron:scale-110 group-hover/patron:rotate-12 transition-all duration-700">
                                            <ChevronRight size={18} className="text-primary/40 group-hover/patron:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-14 flex justify-between items-center relative z-10 px-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 leading-none">
                        {customers.length} unique signatures manifest
                    </p>
                    <button 
                        disabled={isExporting}
                        onClick={handleExportPatrons}
                        className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/40 hover:text-primary transition-colors flex items-center gap-3 group disabled:opacity-50"
                    >
                        {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        {isExporting ? "Manifesting Matrix..." : "Export Identity Matrix"}
                        {!isExporting && <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>
            </div>

            {/* ── Re-engagement Protocol ── */}
            <div className="bg-foreground rounded-[64px] p-12 md:p-16 text-background overflow-hidden relative shadow-2xl group/marketing">
                <div className="absolute top-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="max-w-[650px] space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[1px] bg-primary rounded-full shadow-[0_0_10px_#B07D5B33]" />
                            <h3 className="text-[11px] font-black tracking-[0.6em] uppercase text-primary/80 leading-none">Retention Protocol</h3>
                        </div>
                        <h3 className="text-6xl font-black tracking-tighter leading-[0.9] italic font-serif">Aura of <span className="text-primary not-italic italic">Re-engagement</span></h3>
                        <p className="text-background/40 text-2xl font-medium leading-relaxed italic max-w-lg">
                            Manifest personalized fragrance prescriptions to top patrons via seasonal olfactory streams.
                        </p>
                    </div>
                    <button className="h-20 px-14 rounded-[28px] bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 group">
                        <span className="flex items-center gap-4">
                            Deploy Strategy
                            <Zap size={18} className="animate-pulse" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
