"use client";

import Link from "next/link";
import { 
    ShoppingBag, 
    Heart, 
    MapPin, 
    ArrowUpRight, 
    Package, 
    TrendingUp,
    Clock,
    Sparkles
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { Badge } from "@workspaceRoot/packages/ui/src/badge";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";
import { Search, History } from "lucide-react";

export default function AccountDashboardPage() {
    const { user } = useAuth();
    const stats = useQuery(api.userDashboard.getDashboardStats);

    if (stats === undefined) {
        return (
            <div className="flex flex-col gap-8 animate-pulse">
                <div className="h-20 bg-white/5 rounded-3xl w-1/3" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-white/5 rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!stats || !user) return null;
    
    const { orderCount, wishlistCount, addressCount, recentOrders, recentSearches } = stats;
    const displayName = user.firstName || user.name || "Premium Member";

    // Calculate membership longevity
    const memberSince = user.createdAt ? format(user.createdAt, "MMMM yyyy") : "N/A";
    const accountAge = user.createdAt ? Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)) : 0;
    const loyaltyTier = accountAge > 365 ? "Elite Partner" : accountAge > 90 ? "Preferred Client" : "Valued Member";

    return (
        <div className="space-y-12 pb-12">
            {/* Header / Welcome */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[#DBC2A6] mb-3">
                        <Sparkles size={16} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black">Welcome Back</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        Hello, {displayName}
                    </h1>
                    <p className="text-white/40 text-sm mt-3 font-medium max-w-md leading-relaxed">
                        Your account is in high standing. You have <span className="text-[#DBC2A6]">{orderCount} active orders</span> and <span className="text-[#DBC2A6]">{wishlistCount} items</span> in your wishlist.
                    </p>
                </div>
                <div className="hidden lg:block shrink-0">
                    <div className="px-6 py-4 bg-[#1A1E1C] border border-white/5 rounded-[24px] shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#DBC2A6] shadow-[0_0_8px_#DBC2A6]" />
                            <span className="text-[10px] uppercase tracking-widest font-black text-white/60">{loyaltyTier} since {memberSince}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Orders Card */}
                <div className="group relative bg-[#1A1E1C] border border-white/5 rounded-[32px] p-8 transition-all duration-500 hover:border-[#DBC2A6]/30 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[64px] rounded-full translate-x-1/2 -translate-y-1/2 transition-all duration-500 group-hover:bg-emerald-500/10" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                            <ShoppingBag size={22} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Total Orders</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-white tracking-tighter">{orderCount}</h3>
                                <div className="flex items-center gap-0.5 text-emerald-500 text-[10px] font-bold">
                                    <TrendingUp size={10} />
                                    <span>Lifetime</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wishlist Card */}
                <div className="group relative bg-[#1A1E1C] border border-white/5 rounded-[32px] p-8 transition-all duration-500 hover:border-rose-500/30 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[64px] rounded-full translate-x-1/2 -translate-y-1/2 transition-all duration-500 group-hover:bg-rose-500/10" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6 border border-rose-500/20 group-hover:scale-110 transition-transform duration-500">
                            <Heart size={22} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Wishlist</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter">{wishlistCount}</h3>
                        </div>
                    </div>
                </div>

                {/* Addresses Card */}
                <div className="group relative bg-[#1A1E1C] border border-white/5 rounded-[32px] p-8 transition-all duration-500 hover:border-[#DBC2A6]/30 overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#DBC2A6]/5 blur-[64px] rounded-full translate-x-1/2 -translate-y-1/2 transition-all duration-500 group-hover:bg-[#DBC2A6]/10" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-[#DBC2A6]/10 flex items-center justify-center text-[#DBC2A6] mb-6 border border-[#DBC2A6]/20 group-hover:scale-110 transition-transform duration-500">
                            <MapPin size={22} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Saved Places</p>
                            <h3 className="text-4xl font-black text-white tracking-tighter">{addressCount}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#DBC2A6] rounded-full" />
                        <h2 className="text-xl font-black tracking-tight text-white uppercase">Recent Transactions</h2>
                    </div>
                    <Link href="/account/orders" className="text-xs font-black uppercase tracking-widest text-[#DBC2A6] hover:text-white transition-colors flex items-center gap-2 group">
                        Transaction History
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">ID / Hash</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Timestamp</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Gateway Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Settlement</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentOrders.map((order) => (
                                        <tr key={order._id} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="px-8 py-6 font-mono text-xs text-white/80">
                                                <span className="text-[#DBC2A6]/60">UTX-</span>{order._id.slice(-8).toUpperCase()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-white">{format(order.createdAt, "MMM d, yyyy")}</span>
                                                    <span className="text-[10px] text-white/30">{format(order.createdAt, "HH:mm:ss")}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge
                                                    className={cn(
                                                        "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-lg",
                                                        order.status === "delivered" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                        order.status === "cancelled" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                                        "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                                    )}
                                                >
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-sm font-black text-white">KES {order.totalAmount.toLocaleString()}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-20 text-center shadow-2xl">
                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5">
                            <Package className="text-white/20" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight mb-3">System Empty</h3>
                        <p className="text-white/40 text-sm max-w-xs mx-auto mb-10 leading-relaxed font-medium">No order data synchronized. Initiate a transaction to begin tracking.</p>
                        <Link
                            href="/shop"
                            className="bg-[#DBC2A6] text-[#0A0D0B] px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[#DBC2A6]/10"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </section>

            {/* Bottom Section: Recent Searches & Favorites */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Recent Searches */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-blue-500/50 rounded-full" />
                        <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                             <History size={18} className="text-blue-500" />
                             Recent Intel
                        </h2>
                    </div>

                    <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-8 shadow-2xl min-h-[300px]">
                        {recentSearches && recentSearches.length > 0 ? (
                            <div className="space-y-4">
                                {recentSearches.map((s: any) => (
                                    <Link 
                                        key={s._id} 
                                        href={`/shop?search=${encodeURIComponent(s.query)}`}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                            <Search size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white capitalize">{s.query}</p>
                                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">
                                                {format(s.createdAt, "MMM d, HH:mm")}
                                            </p>
                                        </div>
                                        <ArrowUpRight size={16} className="text-white/20 group-hover:text-blue-500 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-10 opacity-40">
                                <Search size={40} className="mb-4 text-white/20" />
                                <p className="text-xs uppercase tracking-[0.2em] font-medium">No recent searches logged</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* System Favorites */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-rose-500/50 rounded-full" />
                        <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                             <TrendingUp size={18} className="text-rose-500" />
                             Wishlist Intel
                        </h2>
                    </div>

                    <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-8 shadow-2xl min-h-[300px]">
                        <div className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-6 text-center space-y-4">
                            <Heart size={32} className="mx-auto text-rose-500/40" />
                            <p className="text-xs text-white/60 leading-relaxed font-medium">
                                You have <span className="text-rose-500 font-bold">{wishlistCount} unique artifacts</span> saved in your vault. 
                                <br /> Monitor for inventory updates or price fluctuations.
                            </p>
                            <Link 
                                href="/account/wishlist"
                                className="inline-block text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors"
                            >
                                Access Wishlist Vault
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
