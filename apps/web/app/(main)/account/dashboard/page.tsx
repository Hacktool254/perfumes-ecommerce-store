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
    Sparkles,
    Camera,
    Loader2
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import Image from "next/image";
import { Badge } from "@workspaceRoot/packages/ui/src/badge";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";
import { Search, History } from "lucide-react";

export default function AccountDashboardPage() {
    const { user } = useAuth();
    const stats = useQuery(api.userDashboard.getDashboardStats);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const updateUserImage = useMutation(api.users.updateImage);
    const [isUploading, setIsUploading] = useState(false);

    if (stats === undefined) {
        return (
            <div className="flex flex-col gap-8 animate-pulse">
                <div className="h-40 bg-white/5 rounded-[40px] w-full" />
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
    const name = user.firstName || user.name || "Premium Member";
    const lastName = user.lastName || "";
    const displayName = `${name} ${lastName}`.trim();

    // Calculate membership longevity
    const memberSince = user.createdAt ? format(user.createdAt, "MMMM yyyy") : "N/A";
    const accountAge = user.createdAt ? Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)) : 0;
    const loyaltyTier = accountAge > 365 ? "Elite Partner" : accountAge > 90 ? "Preferred Client" : "Valued Member";

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            if (!result.ok) throw new Error("Upload failed");
            const { storageId } = await result.json();
            await updateUserImage({ storageId });
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-12 pb-12">
            {/* Identity Hub Hero */}
            <header className="relative bg-[#1A1E1C] border border-white/5 rounded-[40px] p-8 md:p-12 overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#DBC2A6]/5 blur-[120px] -mr-40 -mt-40 rounded-full transition-all duration-1000 group-hover:bg-[#DBC2A6]/10" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    {/* Avatar Section */}
                    <div className="relative">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-[#0A0D0B] rounded-[40px] flex items-center justify-center text-5xl text-[#DBC2A6] font-black overflow-hidden border border-white/10 shadow-3xl relative group/avatar">
                            {isUploading ? (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                                    <Loader2 className="animate-spin w-10 h-10 text-[#DBC2A6]" />
                                </div>
                            ) : user.image ? (
                                <Image 
                                    src={user.image} 
                                    alt="User Identity" 
                                    fill 
                                    className="object-cover group-hover/avatar:scale-110 transition-transform duration-1000" 
                                />
                            ) : (
                                (user.name?.[0] || user.firstName?.[0] || "U").toUpperCase()
                            )}
                        </div>
                        <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#DBC2A6] rounded-2xl flex items-center justify-center text-[#0A0D0B] border-4 border-[#1A1E1C] hover:scale-110 transition-all cursor-pointer shadow-xl z-20">
                            <Camera size={20} strokeWidth={3} />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                            />
                        </label>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-[#DBC2A6] mb-4">
                            <Sparkles size={14} className="animate-pulse" />
                            <span className="text-[10px] uppercase tracking-[0.4em] font-black opacity-60">Verified Identity</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
                            {displayName}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] uppercase tracking-widest font-black text-white/60">{loyaltyTier}</span>
                            </div>
                            <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
                                <Clock size={12} className="text-[#DBC2A6]" />
                                <span className="text-[10px] uppercase tracking-widest font-black text-white/40">Since {memberSince}</span>
                            </div>
                        </div>
                        <p className="text-white/30 text-sm mt-6 font-medium max-w-sm leading-relaxed mx-auto md:mx-0">
                            Synchronized with <span className="text-white">{orderCount} historical manifests</span> and <span className="text-white">{wishlistCount} curated artifacts</span>.
                        </p>
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
            <section className="space-y-8">
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-[#DBC2A6] rounded-full" />
                        <h2 className="text-xl font-black tracking-tight text-white uppercase">Recent Transactions</h2>
                    </div>
                    <Link href="/account/orders" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DBC2A6] hover:text-white transition-colors flex items-center gap-2 group bg-[#1A1E1C] px-6 py-3 rounded-2xl border border-white/5 shadow-xl">
                        Full Registry
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DBC2A6]/10 to-transparent" />
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Manifest ID</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Timestamp</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Status</th>
                                        <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 text-right">Settlement</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentOrders.map((order) => (
                                        <tr key={order._id} className="group hover:bg-white/[0.01] transition-colors">
                                            <td className="px-10 py-8 font-mono text-[11px] text-white/80">
                                                <span className="text-[#DBC2A6]/40">UTX-</span>{order._id.slice(-8).toUpperCase()}
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-black text-white tracking-widest uppercase">{format(order.createdAt, "MMM d, yyyy")}</span>
                                                    <span className="text-[9px] font-bold text-white/20 tracking-[0.2em]">{format(order.createdAt, "HH:mm:ss")}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-24 text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#DBC2A6]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="w-20 h-20 bg-[#0A0D0B] rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-white/5 shadow-3xl transform group-hover:scale-110 transition-transform duration-700">
                            <Package className="text-white/10" size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">System Empty</h3>
                        <p className="text-white/30 text-xs max-w-xs mx-auto mb-12 leading-relaxed font-bold tracking-tight">No order data synchronized. Initiate a transaction to begin real-time tracking.</p>
                        <Link
                            href="/shop"
                            className="inline-block bg-[#DBC2A6] text-[#0A0D0B] px-12 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#DBC2A6]/20"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </section>

            {/* Bottom Section: Recent Searches & Favorites */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Recent Searches */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-1.5 h-6 bg-blue-500/50 rounded-full" />
                        <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                             Recent Intel
                        </h2>
                    </div>

                    <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-10 shadow-2xl min-h-[400px] flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[64px] rounded-full group-hover:bg-blue-500/10 transition-colors" />
                        {recentSearches && recentSearches.length > 0 ? (
                            <div className="space-y-4">
                                {recentSearches.map((s: any) => (
                                    <Link 
                                        key={s._id} 
                                        href={`/shop?search=${encodeURIComponent(s.query)}`}
                                        className="flex items-center gap-5 p-5 rounded-[24px] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all group/item"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover/item:scale-110 transition-transform">
                                            <Search size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-white tracking-widest uppercase">{s.query}</p>
                                            <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-black mt-1">
                                                {format(s.createdAt, "MMM d, HH:mm")}
                                            </p>
                                        </div>
                                        <ArrowUpRight size={16} className="text-white/10 group-hover/item:text-blue-500 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-40">
                                <Search size={40} className="mb-6 text-white/10" />
                                <p className="text-[10px] uppercase tracking-[0.3em] font-black">No recent intel logged</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* System Favorites */}
                <section className="space-y-8">
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-1.5 h-6 bg-rose-500/50 rounded-full" />
                        <h2 className="text-xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                             Wishlist Intel
                        </h2>
                    </div>

                    <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-10 shadow-2xl min-h-[400px] flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[64px] rounded-full group-hover:bg-rose-500/10 transition-colors" />
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-rose-500/5 border border-rose-500/10 rounded-3xl flex items-center justify-center mb-10 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                                <Heart size={32} className="text-rose-500/40" />
                            </div>
                            <p className="text-xs text-white/30 leading-relaxed font-bold tracking-tight text-center max-w-xs mb-10">
                                You have <span className="text-rose-500">{wishlistCount} unique artifacts</span> saved in your vault. 
                                Monitor for inventory updates or price fluctuations.
                            </p>
                            <Link 
                                href="/account/wishlist"
                                className="bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] text-white transition-all border border-white/5"
                            >
                                Access Vault
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
