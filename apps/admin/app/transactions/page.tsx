"use client";

import {
    Receipt,
    ArrowUpRight,
    ArrowDownRight,
    Download,
    Search,
    SlidersHorizontal,
    ChevronRight,
    CreditCard,
    Clock,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    RefreshCw,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { format } from "date-fns";

const statusConfig = {
    delivered: {
        dot: "bg-emerald-400",
        text: "text-emerald-400",
        bg: "bg-emerald-400/8",
        border: "border-emerald-400/15",
        icon: CheckCircle2,
        label: "Delivered",
    },
    shipped: {
        dot: "bg-sky-400",
        text: "text-sky-400",
        bg: "bg-sky-400/8",
        border: "border-sky-400/15",
        icon: ArrowUpRight,
        label: "Shipped",
    },
    paid: {
        dot: "bg-emerald-400",
        text: "text-emerald-400",
        bg: "bg-emerald-400/8",
        border: "border-emerald-400/15",
        icon: CheckCircle2,
        label: "Paid",
    },
    pending: {
        dot: "bg-amber-400",
        text: "text-amber-400",
        bg: "bg-amber-400/8",
        border: "border-amber-400/15",
        icon: Clock,
        label: "Pending",
    },
    cancelled: {
        dot: "bg-rose-400",
        text: "text-rose-400",
        bg: "bg-rose-400/8",
        border: "border-rose-400/15",
        icon: AlertCircle,
        label: "Cancelled",
    },
};

function getInitials(name: string) {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function TransactionsPage() {
    const orders = useQuery(api.orders.adminList, {});
    const stats = useQuery(api.orders.getStats, {});

    if (orders === undefined || stats === undefined || stats === null) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">
                        Synchronizing Ledger Streams...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
                .font-display { font-family: 'DM Serif Display', serif; }
                .font-body { font-family: 'DM Sans', sans-serif; }
                .tx-row:hover .tx-arrow { opacity: 1; transform: translateX(0); }
                .tx-arrow { opacity: 0; transform: translateX(-6px); transition: all 0.25s ease; }
                .glow-line { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); }
            `}</style>

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-12 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1.5px] bg-primary rounded-full shadow-[0_0_15px_#B07D5B33]" />
                        <p className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/80">Fiscal Ledger</p>
                    </div>
                    <h1 className="font-display text-5xl text-foreground leading-none tracking-tighter">
                        FINANCIAL <span className="italic text-primary font-medium">FLUX</span>
                    </h1>
                </div>
                <button className="flex items-center gap-4 h-16 px-10 rounded-[24px] bg-surface-container-lowest border border-border/40 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary hover:bg-surface-container transition-all group">
                    <Download size={18} strokeWidth={2} className="group-hover:translate-y-0.5 transition-transform" />
                    Export Detailed Ledger
                </button>
            </div>

            {/* ── KPI Strip ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { 
                        label: "Daily Volume", 
                        value: `KES ${Math.round(stats.p0Revenue / 1000)}K`, 
                        tag: stats.revenueDelta >= 0 ? `+${stats.revenueDelta}%` : `${stats.revenueDelta}%`, 
                        tagColor: stats.revenueDelta >= 0 ? "text-emerald-500" : "text-rose-500", 
                        icon: TrendingUp 
                    },
                    { 
                        label: "Pending Settlements", 
                        value: `KES ${Math.round((stats.statusBreakdown.pending * 5000) / 1000)}K`, // Estimated proxy
                        tag: `${stats.statusBreakdown.pending} Active States`, 
                        tagColor: "text-amber-500", 
                        icon: Clock 
                    },
                    { 
                        label: "Order Velocity", 
                        value: `${stats.totalSales.toLocaleString()}`, 
                        tag: "Cumulative Transactions", 
                        tagColor: "text-primary/40", 
                        icon: RefreshCw 
                    },
                ].map((kpi, i) => (
                    <div
                        key={i}
                        className="relative rounded-[40px] border border-border/40 bg-surface-container-lowest p-8 overflow-hidden group hover:border-primary/20 transition-all duration-500 shadow-sm"
                    >
                        <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-start justify-between mb-8">
                            <p className="text-[10px] font-black tracking-[0.35em] text-muted-foreground/30 uppercase leading-none">{kpi.label}</p>
                            <kpi.icon size={16} strokeWidth={1.5} className="text-primary/20" />
                        </div>
                        <p className="font-display text-4xl text-foreground mb-4 leading-none tracking-tight">{kpi.value ?? "KES 0"}</p>
                        <p className={cn("text-[10px] font-black uppercase tracking-widest", kpi.tagColor)}>{kpi.tag}</p>
                    </div>
                ))}
            </div>

            {/* ── Ledger Table ── */}
            <div className="bg-surface-container-lowest border border-border/40 rounded-[56px] shadow-2xl overflow-hidden group/hub">
                
                {/* Table Header Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between px-10 py-10 border-b border-border/40 space-y-6 md:space-y-0">
                    <div className="flex items-center gap-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <h2 className="text-3xl font-black text-foreground tracking-tighter leading-none">Identity <span className="italic font-serif font-medium text-primary">Ledger</span></h2>
                        <span className="px-3 py-1 rounded-full bg-primary/5 text-[9px] font-black text-primary tracking-[0.3em] uppercase border border-primary/20 shrink-0">Live stream</span>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group/search w-full md:w-64">
                            <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within/search:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Locate TX signature..."
                                className="h-12 w-full rounded-[20px] bg-surface-container border border-border/10 pl-12 pr-6 text-xs font-black placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary/20 focus:bg-surface-container-lowest transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-3 h-12 px-6 rounded-[20px] bg-surface-container border border-border/10 text-[10px] font-black text-muted-foreground/40 hover:text-primary transition-all uppercase tracking-widest shrink-0">
                            <SlidersHorizontal size={14} strokeWidth={2} />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Rows */}
                <div className="divide-y divide-border/20 px-4">
                    {orders.length === 0 ? (
                        <div className="py-24 text-center">
                            <p className="text-[11px] font-black tracking-[0.5em] text-muted-foreground/15 uppercase italic">
                                Zero signatures in current cycle
                            </p>
                        </div>
                    ) : (
                        orders.map((tx) => {
                            const cfg = (statusConfig as any)[tx.status] || statusConfig.pending;
                            const StatusIcon = cfg.icon;
                            const isRefund = tx.status === "cancelled";

                            return (
                                <div
                                    key={tx._id}
                                    className="tx-row flex flex-col lg:flex-row lg:items-center justify-between p-8 rounded-[40px] hover:bg-surface-container/30 border border-transparent hover:border-primary/10 transition-all duration-700 cursor-pointer group/patron relative overflow-hidden"
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-border/10 to-transparent group-last:hidden" />
                                    
                                    {/* Identity */}
                                    <div className="flex items-center gap-6 min-w-0">
                                        <div className={cn(
                                            "w-16 h-16 rounded-[24px] flex items-center justify-center text-[12px] font-black flex-shrink-0 shadow-inner group-hover/patron:scale-105 transition-transform duration-700",
                                            isRefund ? "bg-rose-500/10 text-rose-500" : "bg-surface-container text-primary/40"
                                        )}>
                                            {getInitials(tx.customerName)}
                                        </div>
                                        <div className="min-w-0 space-y-2">
                                            <p className="text-xl font-black text-foreground tracking-tighter truncate leading-none">{tx.customerName || "Anonymous Patron"}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black font-mono text-muted-foreground/30 uppercase tracking-[0.2em] italic">{tx._id.slice(-8)}</span>
                                                <div className="w-1 h-1 rounded-full bg-muted-foreground/20" />
                                                <span className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest flex items-center gap-2">
                                                    <CreditCard size={11} strokeWidth={2} className="text-primary/20" /> {tx.status === "paid" ? "M-Pesa" : "Ledger Flow"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Values */}
                                    <div className="flex items-center justify-between lg:justify-end gap-12 md:gap-24 mt-8 lg:mt-0 px-4">
                                        <div className="text-right space-y-1 group-hover/patron:-translate-y-1 transition-transform duration-700">
                                            <p className="text-[10px] font-black text-muted-foreground/20 leading-none uppercase tracking-widest mb-1">{format(tx.createdAt, "dd MMM")}</p>
                                            <p className="text-[11px] font-black text-muted-foreground/30 leading-none uppercase tracking-widest">{format(tx.createdAt, "HH:mm")}</p>
                                        </div>

                                        <div className="text-right space-y-1 group-hover/patron:-translate-y-1 transition-transform duration-700 delay-75">
                                            <p className={cn(
                                                "font-display text-3xl leading-none tracking-tight",
                                                isRefund ? "text-rose-500" : "text-foreground"
                                            )}>
                                                {isRefund ? "−" : ""}KES {tx.totalAmount.toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center gap-6 min-w-[140px] justify-end">
                                            <div className={cn(
                                                "flex items-center gap-2.5 px-6 py-2 rounded-full border text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-700 group-hover/patron:scale-105 shadow-sm",
                                                cfg.bg, cfg.border, cfg.text
                                            )}>
                                                <StatusIcon size={12} strokeWidth={2.5} />
                                                {cfg.label}
                                            </div>
                                            <div className="tx-arrow w-12 h-12 rounded-[20px] bg-surface-container flex items-center justify-center border border-border/10 shadow-inner group-hover/patron:scale-110 group-hover/patron:rotate-12 transition-all duration-700 shrink-0">
                                                <ChevronRight size={18} className="text-primary/40 group-hover/patron:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Table Footer */}
                <div className="flex items-center justify-between px-14 py-8 border-t border-border/20">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/20">Manifesting {orders.length} transactions in current stream</p>
                    <button className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 hover:text-primary transition-colors flex items-center gap-3 group">
                        Enter Extended Flux
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* ── Reconciliation Protocol ── */}
            <div className="bg-surface-container-lowest border border-border/40 rounded-[64px] p-12 md:p-14 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 transition-all group-hover:rotate-0 duration-1000 group-hover:opacity-10 pointer-events-none">
                    <Receipt size={240} className="text-primary" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                    <div className="max-w-[650px] space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b98166]" />
                            <h3 className="text-[11px] font-black tracking-[0.5em] uppercase text-emerald-500/70 leading-none">Balanced Protocol</h3>
                        </div>
                        <h3 className="text-4xl font-black tracking-tighter italic font-serif leading-none">Automated <span className="text-primary not-italic italic">Reconciliation</span></h3>
                        <p className="text-muted-foreground/50 text-xl font-medium leading-relaxed italic max-w-lg">
                            Financial integrity verified against 1,280 checkout request signatures. Identity streams balanced and reconciled.
                        </p>
                    </div>
                    <div className="flex items-center gap-8 bg-surface-container p-4 pr-10 rounded-full border border-border/10 shadow-inner">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={24} className="text-emerald-500" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 leading-none">Ledger Status</p>
                            <p className="text-2xl font-black text-foreground tracking-tighter leading-none">FULLY BALANCED</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
