"use client";

import { 
    Receipt, 
    ArrowUpRight, 
    ArrowDownRight, 
    Download, 
    Search, 
    Filter, 
    ChevronRight, 
    ShoppingBag, 
    CreditCard, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
    { 
        id: "TX-9081", 
        customer: "Sarah Johnstone", 
        amount: "KES 14,500", 
        date: "2024-04-06 14:32", 
        method: "M-Pesa", 
        status: "Completed",
        type: "Purchase" 
    },
    { 
        id: "TX-9080", 
        customer: "Anonymous", 
        amount: "KES 22,800", 
        date: "2024-04-06 12:15", 
        method: "Card", 
        status: "Pending",
        type: "Purchase" 
    },
    { 
        id: "TX-9079", 
        customer: "Michael Chen", 
        amount: "KES 5,400", 
        date: "2024-04-06 10:45", 
        method: "M-Pesa", 
        status: "Completed",
        type: "Purchase" 
    },
    { 
        id: "TX-9078", 
        customer: "Elena Rodriguez", 
        amount: "KES 42,500", 
        date: "2024-04-05 18:20", 
        method: "Bank", 
        status: "Refunded",
        type: "Refund" 
    },
    { 
        id: "TX-9077", 
        customer: "David Kimani", 
        amount: "KES 12,800", 
        date: "2024-04-05 16:10", 
        method: "M-Pesa", 
        status: "Completed",
        type: "Purchase" 
    },
];

export default function TransactionsPage() {
    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Admin / Ledger</p>
                    </div>
                    <h1 className="text-[42px] font-bold text-foreground leading-[1.1] tracking-tight">
                        Financial <span className="text-primary italic font-serif">Flux</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 h-12 px-6 rounded-full bg-surface-container-lowest text-foreground font-bold text-sm shadow-sm hover:bg-surface-container transition-colors">
                        <Download size={18} />
                        <span>Export Ledger</span>
                    </button>
                </div>
            </div>

            {/* Cash Flow Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Daily Volume", value: "KES 124,500", trend: "+12.4%", positive: true },
                    { label: "Pending Settlements", value: "KES 42,800", trend: "7 Transactions", positive: true },
                    { label: "Refund Rate", value: "0.8%", trend: "-2%", positive: true }
                ].map((stat, i) => (
                    <div key={i} className="bg-surface-container-lowest rounded-[32px] p-8 shadow-sm group hover:shadow-md transition-all duration-500">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-foreground tracking-tighter">{stat.value}</p>
                            <div className={cn(
                                "flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full",
                                stat.positive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                            )}>
                                {stat.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Transactions Log */}
            <div className="bg-surface-container-lowest rounded-[40px] p-10 shadow-sm relative">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-8">
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">Real-time Ledger</h2>
                        <div className="relative group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search txid or customer..." 
                                className="h-10 w-64 bg-surface-container-low border-none rounded-full pl-11 pr-6 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 h-10 px-5 rounded-full border border-surface-container-highest/20 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:bg-surface-container transition-colors">
                            <Filter size={14} />
                            <span>Filter Status</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-5 rounded-[24px] hover:bg-surface-container-low transition-all duration-300 group">
                            <div className="flex items-center gap-6">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform duration-500",
                                    tx.type === 'Refund' ? "bg-rose-50" : "bg-emerald-50"
                                )}>
                                    {tx.type === 'Refund' ? <ArrowDownRight className="text-rose-600" /> : <ArrowUpRight className="text-emerald-600" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-foreground tracking-tight">{tx.customer}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary italic font-serif opacity-80">{tx.id}</p>
                                        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none flex items-center gap-1.5">
                                            <CreditCard size={10} /> {tx.method}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-end gap-1.5 mb-1.5">
                                        <Clock size={10} /> {tx.date}
                                    </p>
                                    <p className={cn(
                                        "font-extrabold text-xl tracking-tighter",
                                        tx.type === 'Refund' ? "text-rose-600" : "text-foreground"
                                    )}>
                                        {tx.type === 'Refund' ? "-" : ""}{tx.amount}
                                    </p>
                                </div>
                                <div className="w-32 flex justify-end">
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full flex items-center gap-2 transition-all duration-500",
                                        tx.status === 'Completed' ? "bg-emerald-50 text-emerald-600" : 
                                        tx.status === 'Pending' ? "bg-amber-50 text-amber-600" : 
                                        "bg-rose-50 text-rose-600"
                                    )}>
                                        {tx.status === 'Completed' ? <CheckCircle2 size={12} /> : tx.status === 'Pending' ? <Clock size={12} /> : <AlertCircle size={12} />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{tx.status}</span>
                                    </div>
                                </div>
                                <button className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface-container-highest/20 transition-colors group/btn">
                                    <ChevronRight size={20} className="text-muted-foreground group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <button className="h-12 px-10 rounded-full border border-surface-container-highest/30 text-xs font-bold text-muted-foreground uppercase tracking-widest hover:bg-surface-container transition-all">
                        View Full Ledger
                    </button>
                </div>
            </div>

            {/* Reconciliation Card */}
            <div className="bg-surface-container rounded-[40px] p-12 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-all group-hover:scale-110 group-hover:rotate-0 duration-500">
                    <Receipt size={120} />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div className="max-w-[450px]">
                        <h3 className="text-3xl font-bold tracking-[calc(-0.02em)] italic font-serif">Reconciliation</h3>
                        <p className="mt-4 text-muted-foreground text-sm leading-relaxed font-medium">
                            Your ledger was automatically reconciled against M-Pesa and Stripe endpoints. 
                            All 1,280 transactions this week are verified and balanced.
                        </p>
                        <div className="flex items-center gap-2 mt-8 text-xs font-bold text-emerald-600">
                            <CheckCircle2 size={16} />
                            <span className="uppercase tracking-[0.1em]">Status: Balanced</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
