"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { format } from "date-fns";
import { 
    Package, 
    ChevronRight, 
    Hash, 
    Calendar, 
    ShieldCheck, 
    CreditCard, 
    ArrowUpRight,
    Zap,
    Clock,
    Lock,
    Search,
    History
} from "lucide-react";
import Link from "next/link";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";

export default function OrdersPage() {
    const orders = useQuery(api.orders.list) as any[];

    if (orders === undefined) {
        return (
            <div className="space-y-12 animate-pulse">
                <div className="h-20 bg-white/[0.02] rounded-[40px] w-96" />
                <div className="h-[600px] bg-white/[0.02] rounded-[64px] w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8 md:space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* ── Page Signature ── */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:px-4">
                <div className="space-y-4 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center gap-4">
                        <div className="hidden lg:block w-1.5 h-8 bg-[#B07D5B] rounded-full shadow-[0_0_15px_#B07D5B66]" />
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight italic">Acquisition Records</h1>
                    </div>
                    <p className="text-white/30 text-base md:text-lg italic lg:pl-6 max-w-lg">Historical archive of your curated procurement manifests.</p>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="px-6 py-3 bg-[#B07D5B0A] border border-[#B07D5B33] rounded-[24px] flex items-center gap-3 shadow-xl">
                        <ShieldCheck size={14} className="text-[#B07D5B]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B07D5B]">{orders.length} Verified Entries</span>
                    </div>
                </div>
            </div>

            {/* ── Main Manifest Container ── */}
            <div className="bg-[#0a0a0b] border border-[#B07D5B1A] rounded-[48px] md:rounded-[64px] shadow-2xl relative overflow-hidden flex flex-col min-h-[500px] md:min-h-[600px] group transition-all duration-700">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B07D5B33] to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#B07D5B02] to-transparent pointer-events-none" />
                
                {orders.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 md:p-24 text-center relative z-10">
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-white/[0.01] rounded-[36px] md:rounded-[42px] border border-white/5 flex items-center justify-center mb-8 md:mb-10 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                            <Package className="text-white/10 w-8 h-8 md:w-11 md:h-11" strokeWidth={1} />
                        </div>
                        <h3 className="font-display text-3xl md:text-4xl text-white tracking-tight mb-4 uppercase italic opacity-40">Archive Null</h3>
                        <p className="text-white/20 text-xs md:text-sm max-w-sm mx-auto mb-10 md:mb-14 leading-relaxed font-medium italic">
                            Your procurement history is currently void. No transaction data has been synchronized with the core database.
                        </p>
                        <Link
                            href="/shop"
                            className="bg-[#B07D5B] text-[#0a0a0b] px-10 md:px-16 py-5 md:py-6 rounded-[24px] md:rounded-[28px] font-black text-[10px] md:text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(176,125,91,0.25)] flex items-center gap-4"
                        >
                            <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
                            Initiate Core Selection
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto relative z-10 custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02]">
                                    <tr className="border-b border-white/5">
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
                                            <div className="flex items-center gap-3">
                                                <Hash size={12} className="text-[#B07D5B]/40" />
                                                Manifest ID
                                            </div>
                                        </th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.5em] text-white/30">
                                            <div className="flex items-center gap-3">
                                                <Calendar size={12} className="text-[#B07D5B]/40" />
                                                Temporal Stamp
                                            </div>
                                        </th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.5em] text-white/30 text-center">Protocol Status</th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.5em] text-white/30 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <CreditCard size={12} className="text-[#B07D5B]/40" />
                                                Valuation
                                            </div>
                                        </th>
                                        <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.5em] text-white/30"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.map((order) => (
                                        <tr key={order._id} className="group/row hover:bg-white/[0.01] transition-all duration-500">
                                            <td className="px-12 py-10">
                                                <Link href={`/account/orders/${order._id}`} className="flex flex-col gap-1.5">
                                                    <div className="font-mono text-[11px] text-white group-hover/row:text-[#B07D5B] transition-colors flex items-center gap-2">
                                                        <span className="text-[#B07D5B]/40">UTX—</span>{order._id.slice(-8).toUpperCase()}
                                                        <ArrowUpRight size={10} className="opacity-0 group-hover/row:opacity-40 transition-opacity" />
                                                    </div>
                                                    <span className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em]">{order._id}</span>
                                                </Link>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="space-y-1.5">
                                                    <span className="text-xs font-black text-white tracking-widest uppercase">{format(order.createdAt, "MMMM d, yyyy")}</span>
                                                    <div className="flex items-center gap-2 text-[9px] font-bold text-white/10 tracking-[0.2em] uppercase">
                                                        <Clock size={10} />
                                                        {format(order.createdAt, "HH:mm:ss O")}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-center">
                                                <div className={cn(
                                                    "inline-flex items-center gap-3 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all duration-700",
                                                    order.status === "delivered" ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" :
                                                    order.status === "cancelled" ? "bg-rose-500/5 text-rose-500 border-rose-500/10" :
                                                    "bg-[#B07D5B08] text-[#B07D5B] border-[#B07D5B1A]"
                                                )}>
                                                    <div className={cn(
                                                        "w-1.5 h-1.5 rounded-full",
                                                        order.status === "delivered" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : order.status === "cancelled" ? "bg-rose-500 shadow-[0_0_8px_#e11d48]" : "bg-[#B07D5B] shadow-[0_0_8px_#B07D5B]"
                                                    )} />
                                                    {order.status}
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <span className="font-display text-2xl text-white tracking-tight">KES {order.totalAmount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <Link href={`/account/orders/${order._id}`} className="inline-flex items-center justify-center w-12 h-12 rounded-[18px] bg-white/[0.02] border border-white/5 text-white/20 group-hover/row:bg-[#B07D5B] group-hover/row:text-[#0a0a0b] group-hover/row:border-[#B07D5B] group-hover/row:scale-110 group-hover/row:rotate-6 transition-all duration-500 shadow-xl">
                                                    <ChevronRight size={20} strokeWidth={3} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile & Tablet Card View */}
                        <div className="lg:hidden divide-y divide-white/5 relative z-10">
                            {orders.map((order) => (
                                <Link 
                                    key={order._id} 
                                    href={`/account/orders/${order._id}`}
                                    className="flex flex-col p-8 space-y-6 hover:bg-white/[0.01] active:bg-white/[0.02] transition-all group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="font-mono text-[11px] text-[#B07D5B] flex items-center gap-2 tracking-widest leading-none">
                                                UTX—{order._id.slice(-8).toUpperCase()}
                                            </div>
                                            <p className="text-[10px] font-black text-white tracking-[0.2em] uppercase leading-none">
                                                {format(order.createdAt, "MMM d, yyyy")}
                                            </p>
                                        </div>
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border",
                                            order.status === "delivered" ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" :
                                            order.status === "cancelled" ? "bg-rose-500/5 text-rose-500 border-rose-500/10" :
                                            "bg-[#B07D5B08] text-[#B07D5B] border-[#B07D5B1A]"
                                        )}>
                                            <div className={cn(
                                                "w-1 h-1 rounded-full",
                                                order.status === "delivered" ? "bg-emerald-500" : order.status === "cancelled" ? "bg-rose-500" : "bg-[#B07D5B]"
                                            )} />
                                            {order.status}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end pt-2">
                                        <div className="flex items-center gap-3 text-white/10 text-[9px] font-bold uppercase tracking-[0.3em] font-sans">
                                            <History size={12} className="text-[#B07D5B]/30" />
                                            SECURE LOG
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-[#B07D5B] uppercase tracking-[0.3em] mb-1">Valuation</p>
                                            <p className="font-display text-2xl text-white tracking-tight leading-none">KES {order.totalAmount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </>
                )}

                {/* Secure Overlay Footer */}
                <div className="mt-auto border-t border-white/5 bg-white/[0.01] px-8 md:px-12 py-6 md:py-8 flex items-center justify-between text-white/10">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Lock size={12} />
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] hidden sm:inline">Historical Ledger Protection Active</span>
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] sm:hidden">Secured Ledger</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] italic uppercase">Sync {format(new Date(), "HH:mm")}</span>
                    </div>
                </div>
            </div>
            
            {/* Visual Artifact */}
            <div className="text-center pt-8">
                <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/[0.01] border border-white/5 rounded-full opacity-20">
                    <Search size={10} />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Querying Master Database... Verified.</span>
                </div>
            </div>
        </div>
    );
}
