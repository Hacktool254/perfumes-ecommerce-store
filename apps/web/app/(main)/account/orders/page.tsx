"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { format } from "date-fns";
import { Package, ChevronRight, Hash, Calendar, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";

export default function OrdersPage() {
    const orders = useQuery(api.orders.list) as any[];

    if (orders === undefined) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-8 bg-white/5 rounded-lg w-48 mx-4" />
                <div className="h-[600px] bg-white/5 rounded-[40px] w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Module Header */}
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-[#DBC2A6] rounded-full" />
                    <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                        Acquisition Registry
                    </h2>
                </div>
                <div className="px-4 py-2 bg-[#DBC2A6]/10 border border-[#DBC2A6]/20 rounded-xl flex items-center gap-2">
                    <ShieldCheck size={12} className="text-[#DBC2A6]" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#DBC2A6]">{orders.length} Verified Entries</span>
                </div>
            </div>

            {/* Main Content Box */}
            <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DBC2A6]/10 to-transparent" />
                
                {orders.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#DBC2A6]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="w-24 h-24 bg-[#0A0D0B] rounded-[32px] flex items-center justify-center mb-10 border border-white/5 shadow-3xl transform group-hover:scale-110 transition-transform duration-700">
                            <Package className="text-white/10" size={40} strokeWidth={1} />
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">Registry Empty</h3>
                        <p className="text-white/30 text-xs max-w-sm mx-auto mb-12 leading-relaxed font-bold tracking-tight">
                            Your procurement history is currently void. No transaction data has been synchronized with the core database.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block bg-[#DBC2A6] text-[#0A0D0B] px-12 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#DBC2A6]/20"
                        >
                            Initiate Procurement
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                                        <div className="flex items-center gap-2">
                                            <Hash size={12} className="opacity-50" />
                                            Manifest ID
                                        </div>
                                    </th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} className="opacity-50" />
                                            Sequence Date
                                        </div>
                                    </th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Status</th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <CreditCard size={12} className="opacity-50" />
                                            Value
                                        </div>
                                    </th>
                                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.map((order) => (
                                    <tr key={order._id} className="group hover:bg-white/[0.01] transition-colors">
                                        <td className="px-10 py-8">
                                            <Link href={`/account/orders/${order._id}`} className="flex flex-col gap-1">
                                                <div className="font-mono text-[11px] text-white group-hover:text-[#DBC2A6] transition-colors">
                                                    <span className="text-[#DBC2A6]/40">UTX-</span>{order._id.slice(-8).toUpperCase()}
                                                </div>
                                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{order._id}</span>
                                            </Link>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-black text-white tracking-widest uppercase">{format(order.createdAt, "MMMM d, yyyy")}</span>
                                                <span className="text-[9px] font-bold text-white/20 tracking-[0.2em]">{format(order.createdAt, "HH:mm:ss O")}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                                order.status === "delivered" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                order.status === "cancelled" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                                "bg-[#DBC2A6]/10 text-[#DBC2A6] border-[#DBC2A6]/20"
                                            )}>
                                                <div className={cn(
                                                    "w-1 h-1 rounded-full",
                                                    order.status === "delivered" ? "bg-emerald-500" : order.status === "cancelled" ? "bg-rose-500" : "bg-[#DBC2A6]"
                                                )} />
                                                {order.status}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <span className="text-sm font-black text-white tracking-tighter">KES {order.totalAmount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <Link href={`/account/orders/${order._id}`} className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/5 text-white/20 group-hover:bg-[#DBC2A6] group-hover:text-[#0A0D0B] group-hover:border-[#DBC2A6] transition-all">
                                                <ChevronRight size={18} strokeWidth={3} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
