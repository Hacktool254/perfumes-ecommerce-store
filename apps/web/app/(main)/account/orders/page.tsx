"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { format } from "date-fns";
import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
    const orders = useQuery(api.orders.list) as any[];

    if (orders === undefined) return <div className="p-8 text-center text-muted-foreground text-sm">Loading orders...</div>;

    return (
        <div className="max-w-4xl pb-10">
            <header className="mb-10">
                <div className="flex items-center gap-2 text-[#DBC2A6] mb-3">
                    <Package size={14} className="opacity-50" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black">Archive Center</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                    Acquisition <span className="text-[#DBC2A6]">History</span>
                </h1>
                <p className="text-white/40 text-sm mt-3 font-medium max-w-sm leading-relaxed">
                    Track your procurement logs and historical asset acquisition data.
                </p>
            </header>

            {orders.length === 0 ? (
                <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-16 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#DBC2A6]/5 blur-3xl -mr-16 -mt-16 group-hover:bg-[#DBC2A6]/10 transition-colors duration-700" />
                    
                    <div className="w-20 h-20 bg-[#0A0D0B] rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl">
                        <Package className="text-white/10" size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tighter mb-3 uppercase">No Assets Logged</h2>
                    <p className="text-sm text-white/30 max-w-xs mx-auto mb-10 font-medium leading-relaxed">
                        Your acquisition registry is currently empty. Initiate a procurement sequence to see your history.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block group relative overflow-hidden px-10 py-5 rounded-[24px] bg-[#DBC2A6] text-[#0A0D0B] text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-[#DBC2A6]/20"
                    >
                        Initiate Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Link
                            key={order._id}
                            href={`/account/orders/${order._id}`}
                            className="block bg-[#1A1E1C] border border-white/5 rounded-[32px] p-6 md:p-8 hover:border-[#DBC2A6]/20 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#DBC2A6]/5 blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-[#0A0D0B] rounded-2xl flex items-center justify-center text-[#DBC2A6] border border-white/5 group-hover:scale-105 transition-transform duration-500">
                                        <Package size={24} strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20">Manifest ID</p>
                                            <p className="font-black text-white text-base tracking-tighter">#{order._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <p className="text-xs text-white/30 font-bold uppercase tracking-widest">{format(order.createdAt, "PPP")}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-10 border-t md:border-t-0 border-white/5 pt-6 md:pt-0">
                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20 mb-1">Total Value</p>
                                        <p className="font-black text-[#DBC2A6] text-lg tracking-tighter">KES {order.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:block text-right">
                                            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors duration-500 ${
                                                order.status === "delivered" 
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                                    : order.status === "cancelled" 
                                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20" 
                                                        : "bg-white/5 text-white/40 border-white/10 group-hover:border-white/20"
                                            }`}>
                                                <div className={`w-1 h-1 rounded-full ${
                                                    order.status === "delivered" ? "bg-emerald-400" : order.status === "cancelled" ? "bg-rose-400" : "bg-white/40"
                                                }`} />
                                                {order.status}
                                            </span>
                                        </div>
                                        <ChevronRight className="text-white/10 group-hover:text-[#DBC2A6] group-hover:translate-x-1 transition-all" size={20} strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
