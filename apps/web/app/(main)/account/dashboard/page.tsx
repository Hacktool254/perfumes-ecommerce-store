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
    Loader2,
    Shield,
    Gem,
    Zap,
    History,
    Search
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import Image from "next/image";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";
import { toast } from "sonner";

export default function AccountDashboardPage() {
    const { user } = useAuth();
    const stats = useQuery(api.userDashboard.getDashboardStats);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const updateUserImage = useMutation(api.users.updateImage);
    const [isUploading, setIsUploading] = useState(false);

    if (stats === undefined || !user) {
        return (
            <div className="flex flex-col gap-12 animate-pulse">
                <div className="h-64 bg-white/[0.02] rounded-[56px] w-full" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-44 bg-white/[0.02] rounded-[40px]" />
                    ))}
                </div>
            </div>
        );
    }

    const { orderCount, wishlistCount, addressCount, recentOrders, recentSearches } = stats;
    const displayName = user.firstName ? `${user.firstName} ${user.lastName || ""}` : (user.name || "Patron");
    const memberSince = user.createdAt ? format(user.createdAt, "MMMM yyyy") : "N/A";
    const accountAge = user.createdAt ? Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)) : 0;
    const tier = accountAge > 365 ? "Elite Partner" : accountAge > 90 ? "Preferred Client" : "Valued Member";

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        toast.promise(
            (async () => {
                const postUrl = await generateUploadUrl();
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });
                if (!result.ok) throw new Error("Upload failed");
                const { storageId } = await result.json();
                await updateUserImage({ storageId });
            })(),
            {
                loading: "Synthesizing identity image...",
                success: "Identity manifest updated successfully.",
                error: "Image synthesis failed. Security protocol engaged.",
                finally: () => setIsUploading(false)
            }
        );
    };

    return (
        <div className="space-y-12 md:space-y-16 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* ── Patron Identity Hero ── */}
            <header className="relative bg-[#0a0a0b] border border-[#B07D5B1A] rounded-[48px] md:rounded-[64px] p-8 md:p-16 overflow-hidden group shadow-2xl transition-all duration-700">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#B07D5B05] blur-[150px] -mr-40 -mt-40 rounded-full transition-all duration-1000 group-hover:bg-[#B07D5B0A]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#B07D5B03] blur-[120px] -ml-40 -mb-40 rounded-full" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 md:gap-14">
                    {/* Avatar Signature */}
                    <div className="relative group/avatar">
                        <div className="w-32 h-32 md:w-52 md:h-52 bg-[#0d0d0e] rounded-[40px] md:rounded-[52px] flex items-center justify-center text-4xl md:text-7xl text-[#B07D5B] font-display overflow-hidden border border-[#B07D5B1A] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                            {isUploading ? (
                                <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-10">
                                    <Loader2 className="animate-spin w-8 h-8 md:w-12 md:h-12 text-[#B07D5B]" />
                                </div>
                            ) : user.image ? (
                                <Image 
                                    src={user.image} 
                                    alt="Identity" 
                                    fill 
                                    className="object-cover group-hover/avatar:scale-110 transition-transform duration-[1.5s] ease-out" 
                                />
                            ) : (
                                (user.name?.[0] || user.firstName?.[0] || "P").toUpperCase()
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <label className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-10 h-10 md:w-14 md:h-14 bg-[#B07D5B] rounded-[16px] md:rounded-[22px] flex items-center justify-center text-[#0a0a0b] border-[4px] md:border-[6px] border-[#0a0a0b] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-[0_10px_20px_#B07D5B33] z-20 group-hover/avatar:rotate-6">
                            <Camera className="w-4.5 h-4.5 md:w-5.5 md:h-5.5" strokeWidth={2.5} />
                            <input type="file" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                    </div>

                    {/* Identity Data */}
                    <div className="flex-1 text-center lg:text-left space-y-4 md:space-y-6">
                        <div className="flex items-center justify-center lg:justify-start gap-3">
                            <div className="w-6 h-[1px] bg-[#B07D5B]/40 rounded-full" />
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[#B07D5B] opacity-80 leading-none">Patron Identity</p>
                        </div>
                        <h1 className="font-display text-4xl md:text-7xl text-white tracking-tighter leading-[0.9] group-hover:translate-x-1 transition-transform duration-700 italic">
                            {displayName}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 pt-2">
                            <div className="px-4 py-2 bg-[#B07D5B0A] border border-[#B07D5B1A] rounded-[14px] md:rounded-[18px] flex items-center gap-2 md:gap-3">
                                <Gem size={10} className="text-[#B07D5B]" />
                                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white/70">{tier}</span>
                            </div>
                            <div className="px-4 py-2 bg-white/[0.02] border border-white/5 rounded-[14px] md:rounded-[18px] flex items-center gap-2 md:gap-3">
                                <Clock size={10} className="text-[#B07D5B] opacity-40" />
                                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white/30 italic">Origin: {memberSince}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Excellence Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {[
                    { label: "Total Acquisitions", value: orderCount, icon: ShoppingBag, color: "#B07D5B", sub: "Lifetime Registry" },
                    { label: "Vaulted Items", value: wishlistCount, icon: Heart, color: "#e11d48", sub: "Desired Artifacts" },
                    { label: "Deployment Zones", value: addressCount, icon: MapPin, color: "#B07D5B", sub: "Secure Addresses" },
                ].map((stat, i) => (
                    <div key={i} className={cn(
                        "group relative bg-[#0a0a0b] border border-[#B07D5B1A] rounded-[40px] md:rounded-[48px] p-8 md:p-10 transition-all duration-700 hover:border-[#B07D5B33] overflow-hidden shadow-2xl",
                        i === 2 && "sm:col-span-2 lg:col-span-1"
                    )}>
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 transition-all duration-700 group-hover:opacity-10" style={{ backgroundColor: stat.color }} />
                        <div className="relative z-10 space-y-6 md:space-y-8">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-[18px] md:rounded-[22px] bg-white/[0.02] border border-white/5 flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:rotate-3 shadow-inner" style={{ color: stat.color }}>
                                <stat.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-white/20 mb-2 md:mb-3 leading-none">{stat.label}</p>
                                <div className="flex items-baseline gap-4">
                                    <h3 className="font-display text-4xl md:text-5xl text-white leading-none">{stat.value}</h3>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-white/10 group-hover:text-white/30 transition-colors italic">{stat.sub}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Transaction Manifest ── */}
            <section className="space-y-8 md:space-y-10">
                <div className="flex items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-4">
                        <div className="w-8 md:w-10 h-[1px] bg-[#B07D5B] rounded-full" />
                        <h2 className="font-display text-2xl md:text-3xl text-white tracking-tight italic">Recent Acquisitions</h2>
                    </div>
                    <Link href="/account/orders" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#B07D5B] hover:text-white transition-all flex items-center gap-3 group bg-white/[0.02] border border-white/5 px-6 md:px-8 py-3 md:py-4 rounded-[18px] md:rounded-[22px] shadow-xl">
                        Full Matrix
                        <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block bg-[#0a0a0b] border border-[#B07D5B1A] rounded-[56px] overflow-hidden shadow-2xl relative">
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B07D5B1A] to-transparent" />
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/[0.01]">
                                            <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Manifest ID</th>
                                            <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Temporal Stamp</th>
                                            <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Flow Status</th>
                                            <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 text-right">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 px-12">
                                        {recentOrders.map((order) => (
                                            <tr key={order._id} className="group hover:bg-white/[0.01] transition-all duration-500 cursor-pointer" onClick={() => window.location.href = `/account/orders/${order._id}`}>
                                                <td className="px-12 py-10 font-mono text-[11px] text-white/70">
                                                    <span className="text-[#B07D5B]/40">UTX—</span>{order._id.slice(-8).toUpperCase()}
                                                </td>
                                                <td className="px-12 py-10">
                                                    <div className="space-y-1.5">
                                                        <p className="text-[11px] font-black text-white/80 uppercase tracking-widest">{format(order.createdAt, "MMM d, yyyy")}</p>
                                                        <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.2em]">{format(order.createdAt, "HH:mm:ss")}</p>
                                                    </div>
                                                </td>
                                                <td className="px-12 py-10">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-3 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all duration-700",
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
                                                    <p className="font-display text-2xl text-white tracking-tight">KES {order.totalAmount.toLocaleString()}</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-6">
                            {recentOrders.map((order) => (
                                <Link 
                                    key={order._id} 
                                    href={`/account/orders/${order._id}`}
                                    className="block bg-[#0a0a0b] border border-[#B07D5B1A] rounded-[36px] p-6 space-y-6 relative overflow-hidden group active:scale-[0.98] transition-all duration-500 shadow-xl"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest"><span className="text-[#B07D5B]">UTX—</span>{order._id.slice(-8).toUpperCase()}</p>
                                            <p className="text-[9px] font-black text-[#B07D5B] uppercase tracking-[0.2em]">{format(order.createdAt, "MMM d, HH:mm")}</p>
                                        </div>
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border",
                                            order.status === "delivered" ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" :
                                            order.status === "cancelled" ? "bg-rose-500/5 text-rose-500 border-rose-500/10" :
                                            "bg-[#B07D5B08] text-[#B07D5B] border-[#B07D5B1A]"
                                        )}>
                                            {order.status}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-3 text-white/30 text-[9px] font-bold uppercase tracking-widest">
                                            <History size={10} />
                                            Log Verified
                                        </div>
                                        <p className="font-display text-2xl text-white tracking-tight">KES {order.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#B07D5B05] blur-[40px] -mr-8 -mt-8 rounded-full" />
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="bg-[#0a0a0b] border border-white/5 rounded-[64px] p-24 text-center shadow-2xl relative overflow-hidden group/empty">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#B07D5B03] to-transparent opacity-0 group-hover/empty:opacity-100 transition-opacity duration-1000" />
                        <div className="w-24 h-24 bg-white/[0.01] rounded-[36px] border border-white/5 flex items-center justify-center mx-auto mb-10 shadow-inner group-hover/empty:scale-110 group-hover/empty:rotate-3 transition-all duration-700">
                            <Package className="text-white/10" size={40} strokeWidth={1} />
                        </div>
                        <h3 className="font-display text-4xl text-white tracking-tight mb-4 uppercase italic opacity-40">Registry Null</h3>
                        <p className="text-white/20 text-sm max-w-xs mx-auto mb-12 leading-relaxed font-medium italic">No acquisition manifests synchronized with the core database.</p>
                        <Link href="/shop" className="inline-block bg-[#B07D5B] text-[#0a0a0b] px-14 py-6 rounded-[28px] font-black text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_#B07D5B33]">
                            Initiate Core Selection
                        </Link>
                    </div>
                )}
            </section>

            {/* ── Intelligence Layer ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-8">
                {/* Information Stream */}
                <div className="space-y-10 group/stream">
                    <div className="flex items-center gap-4 px-6">
                        <div className="w-1.5 h-6 bg-[#B07D5B] rounded-full" />
                        <h2 className="font-display text-3xl text-white tracking-tight">Recent Intelligence</h2>
                    </div>
                    <div className="bg-[#0a0a0b] border border-white/5 rounded-[56px] p-10 shadow-2xl min-h-[460px] relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-44 h-44 bg-[#B07D5B03] blur-[80px] rounded-full group-hover/stream:bg-[#B07D5B08] transition-all duration-1000" />
                        
                        {recentSearches && recentSearches.length > 0 ? (
                            <div className="space-y-4 relative z-10 flex-1">
                                {recentSearches.map((s: any) => (
                                    <Link 
                                        key={s._id} 
                                        href={`/shop?search=${encodeURIComponent(s.query)}`}
                                        className="flex items-center gap-6 p-6 rounded-[32px] bg-white/[0.01] border border-white/5 hover:bg-white/[0.03] hover:border-[#B07D5B33] transition-all group/intel"
                                    >
                                        <div className="w-14 h-14 rounded-[22px] bg-white/[0.02] border border-white/5 flex items-center justify-center text-[#B07D5B]/60 group-hover/intel:scale-110 group-hover/intel:text-[#B07D5B] transition-all">
                                            <Search size={22} strokeWidth={1.5} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-base font-black text-white tracking-widest uppercase">{s.query}</p>
                                            <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-black mt-2 italic flex items-center gap-2">
                                                <History size={10} className="text-[#B07D5B]/30" />
                                                Logged {format(s.createdAt, "MMM d, HH:mm")}
                                            </p>
                                        </div>
                                        <ArrowUpRight size={18} className="text-white/5 group-hover/intel:text-[#B07D5B] transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center opacity-20 italic">
                                <Search size={48} className="mb-8 text-[#B07D5B]/20" />
                                <p className="text-[11px] uppercase tracking-[0.4em] font-black">No recent intel manifest</p>
                            </div>
                        )}
                        <div className="pt-8 mt-auto border-t border-white/5 flex items-center justify-between opacity-30">
                            <p className="text-[9px] font-black tracking-[0.5em] uppercase">E2EE Data Stream</p>
                            <Shield size={14} />
                        </div>
                    </div>
                </div>

                {/* Secure Vault */}
                <div className="space-y-10 group/vault">
                    <div className="flex items-center gap-4 px-6">
                        <div className="w-1.5 h-6 bg-rose-500/40 rounded-full shadow-[0_0_10px_#e11d4833]" />
                        <h2 className="font-display text-3xl text-white tracking-tight">The Desired Vault</h2>
                    </div>
                    <div className="bg-[#0a0a0b] border border-white/5 rounded-[56px] p-12 shadow-2xl min-h-[460px] flex flex-col relative overflow-hidden group/vaultinner">
                        <div className="absolute top-0 right-0 w-44 h-44 bg-rose-500/[0.02] blur-[80px] rounded-full group-hover/vaultinner:bg-rose-500/[0.05] transition-all duration-1000" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-500/[0.01] blur-[60px] rounded-full" />

                        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                            <div className="w-24 h-24 bg-white/[0.01] border border-rose-500/10 rounded-[32px] flex items-center justify-center mb-12 shadow-inner group-hover/vaultinner:scale-110 group-hover/vaultinner:rotate-[-4deg] transition-all duration-[1s]">
                                <Heart size={36} className="text-rose-500/40 group-hover/vaultinner:text-rose-500 transition-colors duration-700" strokeWidth={1.5} />
                            </div>
                            <p className="text-lg text-white/30 leading-relaxed font-medium italic text-center max-w-sm mb-12">
                                You have curated <span className="text-white font-black not-italic font-display text-2xl">{wishlistCount} high-end artifacts</span> within your personal secure vault. 
                            </p>
                            <Link 
                                href="/account/wishlist"
                                className="bg-white/5 hover:bg-white/10 px-12 py-5 rounded-[22px] text-[10px] font-black uppercase tracking-[0.35em] text-white transition-all border border-white/10 hover:border-[#B07D5B33] active:scale-95 group/vaultbtn shadow-2xl flex items-center gap-4"
                            >
                                Access The Vault
                                <Zap size={14} className="text-[#B07D5B]/40 group-hover/vaultbtn:text-[#B07D5B] group-hover/vaultbtn:animate-pulse transition-all" />
                            </Link>
                        </div>
                        <div className="pt-8 mt-auto border-t border-white/5 flex items-center justify-center opacity-10">
                            <p className="text-[8px] font-black tracking-[0.6em] uppercase">Private Encryption Active</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
