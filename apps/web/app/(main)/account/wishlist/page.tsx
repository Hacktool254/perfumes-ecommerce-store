"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { 
    Heart, 
    ShoppingBag, 
    Trash2, 
    Sparkles, 
    ArrowRight, 
    Lock, 
    Shield, 
    Zap,
    TrendingUp,
    Diamond
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";

import { toast } from "sonner";

export default function WishlistPage() {
    const wishlist = useQuery(api.wishlist.get);
    const removeFromWishlist = useMutation(api.wishlist.toggle);
    const addToCart = useMutation(api.cart.add);

    const handleAddToCart = async (productId: Id<"products">) => {
        toast.promise(addToCart({ productId, quantity: 1 }), {
            loading: "Procuring artifact for local storage...",
            success: "Artifact successfully secured in cart.",
            error: "Procurement protocol failed.",
        });
    };

    const handleRemove = async (productId: Id<"products">) => {
        toast.promise(removeFromWishlist({ productId }), {
            loading: "Purging artifact from vault...",
            success: "Vault manifest updated. Artifact removed.",
            error: "Security breach: Purge failed.",
        });
    };

    if (wishlist === undefined) {
        return (
            <div className="flex flex-col gap-12 animate-pulse">
                <div className="h-16 bg-white/[0.02] rounded-[32px] w-96" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-[3/4] bg-white/[0.02] rounded-[48px]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 md:space-y-16 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
             {/* ── Vault Signature ── */}
             <div className="flex flex-col lg:flex-row items-center justify-between gap-8 border-b border-[#B07D5B1A] pb-10">
                <div className="space-y-4 text-center lg:text-left">
                    <div className="flex flex-col lg:flex-row items-center gap-4">
                        <div className="hidden lg:block w-1.5 h-8 bg-[#B07D5B] rounded-full shadow-[0_0_15px_#B07D5B66]" />
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight italic">The Curation Vault</h1>
                    </div>
                    <p className="text-white/30 text-base md:text-lg italic lg:pl-6 max-w-lg">Private repository of high-value olfactory artifacts and limited releases.</p>
                </div>
                
                <div className="px-6 py-3 md:px-8 md:py-4 bg-[#B07D5B1A] border border-[#B07D5B33] rounded-[24px] flex items-center gap-4">
                    <Lock size={14} className="text-[#B07D5B]" />
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-black text-white italic leading-none">Encrypted Secure Access</span>
                </div>
            </div>

            {wishlist.length === 0 ? (
                <div className="bg-[#0a0a0b] border border-white/5 rounded-[48px] md:rounded-[64px] p-12 md:p-24 text-center shadow-2xl relative overflow-hidden group/empty animate-in fade-in duration-1000 min-h-[400px] flex flex-col justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#B07D5B03] to-transparent opacity-0 group-hover/empty:opacity-100 transition-opacity duration-1000" />
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white/[0.01] rounded-[36px] md:rounded-[48px] border border-white/5 flex items-center justify-center mx-auto mb-10 shadow-inner group-hover/empty:scale-110 group-hover/empty:rotate-3 transition-transform duration-700">
                        <Diamond className="text-white/10" size={48} strokeWidth={1} />
                    </div>
                    <h3 className="font-display text-3xl md:text-4xl text-white tracking-tight mb-4 uppercase italic opacity-40 leading-none">Vault Void</h3>
                    <p className="text-white/20 text-xs md:text-sm max-w-xs mx-auto mb-10 md:mb-14 leading-relaxed font-medium italic">Your curation repository is currently inactive. Secure items during market discovery to populate this archive.</p>
                    <Link
                        href="/shop"
                        className="bg-[#B07D5B] text-[#0a0a0b] px-12 md:px-16 py-5 md:py-6 rounded-[22px] md:rounded-[28px] font-black text-[10px] md:text-[11px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4 mx-auto w-full md:w-fit"
                    >
                        <TrendingUp size={16} strokeWidth={3} />
                        Market Discovery
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                    {wishlist.map((item) => (
                        <div key={item._id} className="bg-[#0a0a0b] border border-[#B07D5B1A] rounded-[40px] md:rounded-[48px] overflow-hidden group hover:border-[#B07D5B4D] transition-all duration-700 shadow-3xl hover:shadow-[#B07D5B0D] relative flex flex-col h-full">
                            {/* Product Header Indicator */}
                            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
                                <div className="bg-[#0a0a0b]/80 backdrop-blur-xl border border-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-white">
                                    <Sparkles size={10} className="text-[#B07D5B]" />
                                    Artifact {item.productId.slice(-4).toUpperCase()}
                                </div>
                            </div>

                            {/* Image Workspace */}
                            <Link href={`/product/${item.slug}`} className="relative aspect-[4/5] overflow-hidden group/img">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-all duration-[2s] ease-out group-hover/img:scale-110 group-hover/img:rotate-1"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-transparent opacity-60 transition-opacity duration-1000 group-hover/img:opacity-20" />
                                
                                {/* Quick Clear Overlay */}
                                <div className="absolute inset-0 bg-[#B07D5B1A] opacity-0 group-hover/img:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white scale-90 group-hover/img:scale-100 transition-transform duration-700">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>
                            </Link>

                            {/* Intelligence Data */}
                            <div className="p-6 md:p-8 space-y-6 md:space-y-8 flex-1 flex flex-col">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="font-display text-2xl md:text-3xl text-white leading-tight italic tracking-tight group-hover:text-[#B07D5B] transition-colors">{item.name}</h3>
                                        <div className="text-right">
                                            <p className="text-[9px] uppercase font-black tracking-[0.4em] text-white/20 mb-1 leading-none">Valuation</p>
                                            <p className="text-base md:text-lg font-display text-[#B07D5B] whitespace-nowrap">KES {item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black leading-relaxed italic line-clamp-2 pl-4 border-l border-[#B07D5B1A]">
                                        Premium olfactory synthesis archived at master level quality.
                                    </p>
                                </div>

                                {/* Control Interface */}
                                <div className="grid grid-cols-4 gap-3 md:gap-4 pb-2">
                                    <button
                                        onClick={() => handleAddToCart(item.productId)}
                                        className="col-span-3 bg-[#B07D5B] text-[#0a0a0b] py-4 rounded-[18px] md:rounded-[20px] font-black text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_#B07D5B33] flex items-center justify-center gap-2 md:gap-3"
                                    >
                                        <ShoppingBag size={14} strokeWidth={3} />
                                        Procure
                                    </button>
                                    <button
                                        onClick={() => handleRemove(item.productId)}
                                        className="bg-white/[0.02] border border-white/5 hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 py-4 rounded-[18px] md:rounded-[20px] flex items-center justify-center transition-all group/trash shadow-inner"
                                        title="Purge from Vault"
                                    >
                                        <Trash2 size={16} className="group-hover/trash:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </div>

                            {/* Status Footer */}
                            <div className="px-6 py-4 md:px-8 md:py-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                     <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10">MARKET ACTIVE</span>
                                </div>
                                <Zap size={10} className="text-[#B07D5B] opacity-20" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Visual Continuity */}
            <div className="text-center pt-16 md:pt-24 grayscale opacity-10 hover:grayscale-0 hover:opacity-100 transition-all duration-[4s]">
                 <div className="inline-flex flex-col md:flex-row items-center gap-4 md:gap-6 cursor-default">
                    <Shield className="text-[#B07D5B]" size={16} />
                    <p className="text-[9px] md:text-[10px] font-black tracking-[0.6em] md:tracking-[1em] uppercase text-white">Artifact Vault Integrity Verified</p>
                    <Unlock className="text-[#B07D5B]" size={16} />
                 </div>
            </div>
        </div>
    );
}

function Unlock({ className, size }: { className?: string, size?: number }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width={size || 24} 
            height={size || 24} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>
        </svg>
    );
}
