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
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { cn } from "@/lib/utils";

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const customers = useQuery(api.users.list, { searchTerm });

    if (customers === undefined) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
                    <p className="text-[10px] font-medium tracking-[0.35em] text-white/20 uppercase">
                        Loading customers...
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
        <div className="min-h-screen bg-[#0a0a0b] text-white pb-24 px-8 pt-10">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
                .font-display { font-family: 'DM Serif Display', serif; }
                .font-body { font-family: 'DM Sans', sans-serif; }
                .patron-row:hover .patron-chevron { opacity: 1; transform: translateX(0); }
                .patron-chevron { opacity: 0; transform: translateX(-4px); transition: all 0.2s ease; }
                .glow-line { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); }
            `}</style>

            <div className="max-w-6xl mx-auto font-body">

                {/* ── Header ── */}
                <div className="flex items-start justify-between mb-14">
                    <div>
                        <p className="text-[10px] font-medium tracking-[0.35em] text-white/30 uppercase mb-3">
                            Admin · Customers
                        </p>
                        <h1 className="font-display text-5xl text-white leading-none">
                            Customer{" "}
                            <span className="italic text-white/50">Directory</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search
                                size={13}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
                            />
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-11 w-64 rounded-xl bg-white/5 border border-white/6 pl-9 pr-4 text-[12px] font-medium text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/15 focus:bg-white/7 transition-all"
                            />
                        </div>
                        <button className="h-11 w-11 rounded-xl bg-white/90 text-black flex items-center justify-center hover:bg-white transition-all duration-200 shadow-lg">
                            <Plus size={16} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* ── KPI Strip ── */}
                <div className="grid grid-cols-4 gap-4 mb-10">
                    {[
                        {
                            label: "Total Customers",
                            value: totalCustomers.toLocaleString(),
                            icon: UsersIcon,
                            sub: "Registered accounts",
                        },
                        {
                            label: "VIP Members",
                            value: vipCount.toString(),
                            icon: Star,
                            sub:
                                totalCustomers > 0
                                    ? `${Math.round((vipCount / totalCustomers) * 100)}% of base`
                                    : "0%",
                        },
                        {
                            label: "Total Revenue",
                            value: `KES ${totalSpent.toLocaleString()}`,
                            icon: ShoppingBag,
                            sub: "Lifetime value",
                        },
                        {
                            label: "Avg. Orders",
                            value: avgOrders.toString(),
                            icon: TrendingUp,
                            sub: "Per customer",
                        },
                    ].map((kpi, i) => (
                        <div
                            key={i}
                            className="relative rounded-2xl border border-white/6 bg-white/[0.03] p-6 group hover:border-white/10 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-start justify-between mb-4">
                                <p className="text-[10px] font-medium tracking-[0.22em] text-white/30 uppercase leading-tight">{kpi.label}</p>
                                <kpi.icon size={13} strokeWidth={1.5} className="text-white/20 flex-shrink-0 mt-0.5" />
                            </div>
                            <p className="font-display text-2xl text-white leading-none mb-2">{kpi.value}</p>
                            <p className="text-[10px] text-white/20 font-medium">{kpi.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── Customer Table ── */}
                <div className="rounded-2xl border border-white/6 bg-white/[0.02] overflow-hidden">

                    {/* Table header bar */}
                    <div className="flex items-center justify-between px-8 py-5 border-b border-white/5">
                        <h2 className="font-display text-xl text-white">All Customers</h2>
                        <p className="text-[11px] text-white/20 font-medium">{customers.length} results</p>
                    </div>

                    {/* Column labels */}
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-6 px-8 py-3 border-b border-white/4">
                        {["Customer", "Orders", "Total Spent", ""].map((h, i) => (
                            <p key={i} className="text-[9px] font-semibold tracking-[0.25em] text-white/20 uppercase">{h}</p>
                        ))}
                    </div>

                    {/* Rows */}
                    {customers.length === 0 ? (
                        <div className="py-24 text-center">
                            <p className="text-[11px] font-medium tracking-[0.3em] text-white/15 uppercase">
                                No customers found
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/[0.03]">
                            {customers.map((customer) => (
                                <div
                                    key={customer._id}
                                    className="patron-row grid grid-cols-[1fr_auto_auto_auto] gap-6 items-center px-8 py-5 hover:bg-white/[0.025] transition-colors duration-200 cursor-pointer"
                                >
                                    {/* Customer info */}
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/6">
                                                <img
                                                    src={
                                                        customer.image ||
                                                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.email}`
                                                    }
                                                    alt={customer.name || "Customer"}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {customer.status === "VIP" && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center border-2 border-[#0a0a0b]">
                                                    <Star size={7} className="text-black fill-black" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-[13px] font-medium text-white/90 truncate">
                                                    {customer.name || "Anonymous"}
                                                </p>
                                                {customer.role === "admin" && (
                                                    <span className="px-2 py-0.5 rounded-md bg-white/6 border border-white/8 text-[9px] font-semibold tracking-wide text-white/35 uppercase">
                                                        Admin
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-white/25 mt-0.5 flex items-center gap-1.5 truncate">
                                                <Mail size={9} strokeWidth={1.5} />
                                                {customer.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Orders */}
                                    <div className="text-right min-w-[80px]">
                                        <p className="font-display text-lg text-white/80 leading-none">
                                            {customer.orderCount || 0}
                                        </p>
                                        <p className="text-[10px] text-white/20 mt-0.5">orders</p>
                                    </div>

                                    {/* Spent */}
                                    <div className="text-right min-w-[130px]">
                                        <p className="font-display text-lg text-white leading-none">
                                            KES {(customer.totalSpent || 0).toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-white/20 mt-0.5">lifetime</p>
                                    </div>

                                    {/* Chevron */}
                                    <div className="patron-chevron w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                                        <ChevronRight size={13} className="text-white/40" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between px-8 py-4 border-t border-white/5">
                        <p className="text-[11px] text-white/20 font-medium">
                            {customers.length} customers total
                        </p>
                        <button className="text-[11px] font-medium text-white/30 hover:text-white/55 transition-colors flex items-center gap-1.5">
                            Export list
                            <ChevronRight size={12} />
                        </button>
                    </div>
                </div>

                {/* ── Re-engagement Banner ── */}
                <div className="mt-6 rounded-2xl border border-white/6 bg-white/[0.02] px-8 py-7 flex items-center justify-between">
                    <div>
                        <p className="text-[13px] font-medium text-white/70 mb-1">
                            Re-engagement Campaign
                        </p>
                        <p className="text-[11px] text-white/25">
                            Send personalised fragrance recommendations to lapsed customers
                        </p>
                    </div>
                    <button className="flex items-center gap-2.5 h-10 px-5 rounded-xl bg-white/90 text-black text-[12px] font-semibold hover:bg-white transition-all duration-200">
                        <Zap size={13} strokeWidth={2} />
                        Deploy Campaign
                    </button>
                </div>

            </div>
        </div>
    );
}
