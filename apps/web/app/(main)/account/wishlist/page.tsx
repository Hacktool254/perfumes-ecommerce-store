"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { Heart, ShoppingCart, Trash2, Loader2, Sparkles, Hash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";

export default function WishlistPage() {
    const wishlist = useQuery(api.wishlist.get);
    const removeFromWishlist = useMutation(api.wishlist.remove);
    const addToCart = useMutation(api.cart.add);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const handleRemove = async (productId: any) => {
        setProcessingId(`remove-${productId}`);
        try {
            await removeFromWishlist({ productId });
        } catch (error) {
            console.error("Failed to remove from wishlist:", error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleAddToCart = async (productId: any) => {
        setProcessingId(`cart-${productId}`);
        try {
            await addToCart({ productId, quantity: 1 });
        } catch (error) {
            console.error("Failed to add to cart:", error);
        } finally {
            setProcessingId(null);
        }
    };

    if (wishlist === undefined) {
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
                        Curation Vault
                    </h2>
                </div>
                <div className="px-4 py-2 bg-[#DBC2A6]/10 border border-[#DBC2A6]/20 rounded-xl flex items-center gap-2">
                    <Sparkles size={12} className="text-[#DBC2A6]" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#DBC2A6]">{wishlist.length} Curated Items</span>
                </div>
            </div>

            {/* Main Content Box */}
            <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col min-h-[600px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DBC2A6]/10 to-transparent" />
                
                {wishlist.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#DBC2A6]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="w-24 h-24 bg-[#0A0D0B] rounded-[32px] flex items-center justify-center mb-10 border border-white/5 shadow-3xl transform group-hover:scale-110 transition-transform duration-700">
                            <Heart className="text-white/10" size={40} strokeWidth={1} />
                        </div>
                        <h3 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">Vault is Empty</h3>
                        <p className="text-white/30 text-xs max-w-sm mx-auto mb-12 leading-relaxed font-bold tracking-tight">
                            No assets have been bookmarked for your future collection. Browse the storefront to curate your desires.
                        </p>
                        <Link
                            href="/shop"
                            className="inline-block bg-[#DBC2A6] text-[#0A0D0B] px-12 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-[#DBC2A6]/20"
                        >
                            Explore Collection
                        </Link>
                    </div>
                ) : (
                    <div className="p-8 md:p-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {wishlist.map((item) => (
                                <div
                                    key={item._id}
                                    className="bg-[#0A0D0B] border border-white/5 rounded-[32px] p-2 overflow-hidden hover:border-[#DBC2A6]/30 transition-all duration-700 group flex flex-col relative shadow-xl"
                                >
                                    <div className="relative aspect-[4/5] bg-black rounded-[26px] overflow-hidden">
                                        {item.product?.images?.[0] && (
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D0B] via-transparent to-transparent opacity-60" />
                                        
                                        <button
                                            onClick={() => handleRemove(item.productId)}
                                            disabled={processingId === `remove-${item.productId}`}
                                            className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-xl rounded-xl text-white/20 hover:text-rose-400 border border-white/10 transition-all shadow-2xl disabled:opacity-50 hover:scale-110 active:scale-90"
                                        >
                                            {processingId === `remove-${item.productId}` ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                        </button>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <Link href={`/product/${item.product?.slug}`}>
                                            <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-[#DBC2A6]/40 mb-2 group-hover:text-[#DBC2A6] transition-colors">{item.product?.brand || "Premium Selection"}</h3>
                                            <h2 className="font-black text-white text-base tracking-tighter mb-6 line-clamp-2">
                                                {item.product?.name}
                                            </h2>
                                        </Link>

                                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                            <div className="text-left">
                                                <p className="text-[8px] uppercase tracking-widest font-black text-white/20 mb-1 leading-none">Price / Asset</p>
                                                <p className="font-black text-[#DBC2A6] text-base tracking-tighter">KES {item.product?.price.toLocaleString() || 0}</p>
                                            </div>
                                            <button
                                                onClick={() => handleAddToCart(item.productId)}
                                                disabled={processingId === `cart-${item.productId}`}
                                                className="w-12 h-12 bg-[#DBC2A6] text-[#0A0D0B] rounded-xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl shadow-[#DBC2A6]/10 disabled:opacity-50"
                                            >
                                                {processingId === `cart-${item.productId}` ? <Loader2 size={20} className="animate-spin" /> : <ShoppingCart size={20} strokeWidth={2.5} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
