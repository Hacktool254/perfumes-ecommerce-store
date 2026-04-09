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
} from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
    {
        id: "TX-9081",
        customer: "Sarah Johnstone",
        amount: 14500,
        date: "2024-04-06",
        time: "14:32",
        method: "M-Pesa",
        status: "Completed",
        type: "Purchase",
    },
    {
        id: "TX-9080",
        customer: "Anonymous",
        amount: 22800,
        date: "2024-04-06",
        time: "12:15",
        method: "Card",
        status: "Pending",
        type: "Purchase",
    },
    {
        id: "TX-9079",
        customer: "Michael Chen",
        amount: 5400,
        date: "2024-04-06",
        time: "10:45",
        method: "M-Pesa",
        status: "Completed",
        type: "Purchase",
    },
    {
        id: "TX-9078",
        customer: "Elena Rodriguez",
        amount: 42500,
        date: "2024-04-05",
        time: "18:20",
        method: "Bank",
        status: "Refunded",
        type: "Refund",
    },
    {
        id: "TX-9077",
        customer: "David Kimani",
        amount: 12800,
        date: "2024-04-05",
        time: "16:10",
        method: "M-Pesa",
        status: "Completed",
        type: "Purchase",
    },
];

const statusConfig = {
    Completed: {
        dot: "bg-emerald-400",
        text: "text-emerald-400",
        bg: "bg-emerald-400/8",
        border: "border-emerald-400/20",
        icon: CheckCircle2,
        label: "Completed",
    },
    Pending: {
        dot: "bg-amber-400",
        text: "text-amber-400",
        bg: "bg-amber-400/8",
        border: "border-amber-400/20",
        icon: Clock,
        label: "Pending",
    },
    Refunded: {
        dot: "bg-rose-400",
        text: "text-rose-400",
        bg: "bg-rose-400/8",
        border: "border-rose-400/20",
        icon: AlertCircle,
        label: "Refunded",
    },
};

function getInitials(name: string) {
    return name === "Anonymous"
        ? "?"
        : name.split(" ").map((n) => n[0]).join("").slice(0, 2);
}

export default function TransactionsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white font-sans pb-24 px-8 pt-10">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
                .font-display { font-family: 'DM Serif Display', serif; }
                .font-body { font-family: 'DM Sans', sans-serif; }
                .tx-row:hover .tx-arrow { opacity: 1; transform: translateX(0); }
                .tx-arrow { opacity: 0; transform: translateX(-6px); transition: all 0.25s ease; }
                .glow-line { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); }
            `}</style>

            <div className="max-w-6xl mx-auto font-body">

                {/* ── Header ── */}
                <div className="flex items-start justify-between mb-14">
                    <div>
                        <p className="text-[10px] font-medium tracking-[0.35em] text-white/30 uppercase mb-3">
                            Admin · Ledger
                        </p>
                        <h1 className="font-display text-5xl text-white leading-none">
                            Financial{" "}
                            <span className="italic text-white/50">Flux</span>
                        </h1>
                    </div>
                    <button className="flex items-center gap-2.5 h-11 px-6 rounded-xl bg-white/5 border border-white/8 text-[13px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200">
                        <Download size={15} strokeWidth={1.5} />
                        Export Ledger
                    </button>
                </div>

                {/* ── KPI Strip ── */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { label: "Daily Volume", value: "KES 124,500", tag: "+12.4%", tagColor: "text-emerald-400", icon: TrendingUp },
                        { label: "Pending Settlements", value: "KES 42,800", tag: "7 transactions", tagColor: "text-amber-400", icon: Clock },
                        { label: "Refund Rate", value: "0.8%", tag: "−2% this week", tagColor: "text-white/30", icon: RefreshCw },
                    ].map((kpi, i) => (
                        <div
                            key={i}
                            className="relative rounded-2xl border border-white/6 bg-white/[0.03] p-7 overflow-hidden group hover:border-white/10 transition-all duration-300"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-start justify-between mb-5">
                                <p className="text-[10px] font-medium tracking-[0.25em] text-white/30 uppercase">{kpi.label}</p>
                                <kpi.icon size={14} strokeWidth={1.5} className="text-white/20" />
                            </div>
                            <p className="font-display text-3xl text-white mb-2 leading-none">{kpi.value}</p>
                            <p className={cn("text-[11px] font-medium mt-3", kpi.tagColor)}>{kpi.tag}</p>
                        </div>
                    ))}
                </div>

                {/* ── Ledger Table ── */}
                <div className="rounded-2xl border border-white/6 bg-white/[0.02] overflow-hidden">

                    {/* Table Header Bar */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <h2 className="font-display text-xl text-white">Real-time Ledger</h2>
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-medium text-white/30 tracking-wide">LIVE</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search TX or customer..."
                                    className="h-9 w-60 rounded-xl bg-white/5 border border-white/6 pl-9 pr-4 text-[12px] font-medium text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/15 focus:bg-white/7 transition-all"
                                />
                            </div>
                            <button className="flex items-center gap-2 h-9 px-4 rounded-xl bg-white/5 border border-white/6 text-[11px] font-medium text-white/40 hover:text-white/60 hover:bg-white/8 transition-all">
                                <SlidersHorizontal size={12} strokeWidth={1.5} />
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Column Labels */}
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-8 py-3 border-b border-white/4">
                        {["Customer", "Date & Time", "Amount", "Status"].map((h) => (
                            <p key={h} className="text-[9px] font-semibold tracking-[0.25em] text-white/20 uppercase">{h}</p>
                        ))}
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-white/[0.03]">
                        {transactions.map((tx) => {
                            const cfg = statusConfig[tx.status as keyof typeof statusConfig];
                            const StatusIcon = cfg.icon;
                            const isRefund = tx.type === "Refund";

                            return (
                                <div
                                    key={tx.id}
                                    className="tx-row grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-8 py-5 hover:bg-white/[0.025] transition-colors duration-200 cursor-pointer"
                                >
                                    {/* Customer */}
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-semibold flex-shrink-0",
                                            isRefund ? "bg-rose-500/10 text-rose-400" : "bg-white/6 text-white/60"
                                        )}>
                                            {getInitials(tx.customer)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[13px] font-medium text-white/90 truncate">{tx.customer}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-mono text-white/25">{tx.id}</span>
                                                <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
                                                <span className="text-[10px] text-white/25 flex items-center gap-1">
                                                    <CreditCard size={9} strokeWidth={1.5} /> {tx.method}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <div className="text-right min-w-[100px]">
                                        <p className="text-[12px] font-medium text-white/50">{tx.date}</p>
                                        <p className="text-[10px] text-white/25 mt-0.5">{tx.time}</p>
                                    </div>

                                    {/* Amount */}
                                    <div className="text-right min-w-[120px]">
                                        <p className={cn(
                                            "font-display text-xl leading-none",
                                            isRefund ? "text-rose-400" : "text-white"
                                        )}>
                                            {isRefund ? "−" : ""}KES {tx.amount.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Status + Arrow */}
                                    <div className="flex items-center gap-3 min-w-[140px] justify-end">
                                        <div className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-semibold tracking-wide",
                                            cfg.bg, cfg.border, cfg.text
                                        )}>
                                            <StatusIcon size={10} strokeWidth={2} />
                                            {cfg.label}
                                        </div>
                                        <div className="tx-arrow w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                                            <ChevronRight size={13} className="text-white/40" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Table Footer */}
                    <div className="flex items-center justify-between px-8 py-4 border-t border-white/5">
                        <p className="text-[11px] text-white/20 font-medium">Showing 5 of 1,280 transactions</p>
                        <button className="text-[11px] font-medium text-white/35 hover:text-white/60 transition-colors flex items-center gap-1.5">
                            View all transactions
                            <ChevronRight size={12} />
                        </button>
                    </div>
                </div>

                {/* ── Reconciliation Banner ── */}
                <div className="mt-6 rounded-2xl border border-white/6 bg-white/[0.02] px-8 py-7 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 size={16} className="text-emerald-400" strokeWidth={1.5} />
                        </div>
                        <div>
                            <p className="text-[13px] font-medium text-white/80">Ledger Reconciled</p>
                            <p className="text-[11px] text-white/25 mt-0.5">All 1,280 transactions verified against M-Pesa and Stripe endpoints</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-semibold tracking-[0.2em] text-emerald-400/70 uppercase">Balanced</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
