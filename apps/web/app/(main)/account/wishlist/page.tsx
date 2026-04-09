"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { Heart, ShoppingCart, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

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
            alert("Added to cart!");
        } catch (error) {
            console.error("Failed to add to cart:", error);
            alert("Failed to add to cart.");
        } finally {
            setProcessingId(null);
        }
    };

    if (wishlist === undefined) return <div className="p-8 text-center text-muted-foreground text-sm">Loading wishlist...</div>;

    return (
        <div className="max-w-6xl pb-10">
            <header className="mb-10">
                <div className="flex items-center gap-2 text-[#DBC2A6] mb-3">
                    <Heart size={14} className="opacity-50" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black">Curation Vault</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
                    My <span className="text-[#DBC2A6]">Wishlist</span>
                </h1>
                <p className="text-white/40 text-sm mt-3 font-medium max-w-sm leading-relaxed">
                    Securely curated selections for future procurement sequences.
                </p>
            </header>

            {wishlist.length === 0 ? (
                <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-20 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#DBC2A6]/5 blur-3xl -mr-16 -mt-16 group-hover:bg-[#DBC2A6]/10 transition-colors duration-700" />
                    
                    <div className="w-24 h-24 bg-[#0A0D0B] rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-white/5 shadow-2xl skew-x-3 group-hover:skew-x-0 transition-transform duration-700">
                        <Heart className="text-white/10" size={40} strokeWidth={1} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">Vault is Empty</h2>
                    <p className="text-sm text-white/30 max-w-sm mx-auto mb-12 font-medium leading-relaxed">
                        No assets have been bookmarked for your future collection. Browse the storefront to curate your desires.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block px-12 py-5 rounded-[24px] bg-[#DBC2A6] text-[#0A0D0B] text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.05] active:scale-[0.95] transition-all shadow-2xl shadow-[#DBC2A6]/20"
                    >
                        Explore Collection
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {wishlist.map((item) => (
                        <div
                            key={item._id}
                            className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-2 overflow-hidden hover:border-[#DBC2A6]/30 transition-all duration-700 group flex flex-col relative"
                        >
                            <div className="relative aspect-[4/5] bg-[#0A0D0B] rounded-[32px] overflow-hidden">
                                {item.product?.images?.[0] && (
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1E1C] via-transparent to-transparent opacity-60" />
                                
                                <button
                                    onClick={() => handleRemove(item.productId)}
                                    disabled={processingId === `remove-${item.productId}`}
                                    className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-xl rounded-2xl text-white/20 hover:text-rose-400 border border-white/5 transition-all shadow-2xl disabled:opacity-50 hover:scale-110 active:scale-90"
                                >
                                    {processingId === `remove-${item.productId}` ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                </button>
                            </div>

                            <div className="p-8 flex flex-col flex-1">
                                <Link href={`/product/${item.product?.slug}`}>
                                    <h3 className="text-[10px] uppercase tracking-[0.2em] font-black text-white/20 mb-2">{item.product?.brand || "Premium Selection"}</h3>
                                    <h2 className="font-black text-white text-xl tracking-tighter mb-6 group-hover:text-[#DBC2A6] transition-colors line-clamp-2">
                                        {item.product?.name}
                                    </h2>
                                </Link>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                                    <div className="text-left">
                                        <p className="text-[8px] uppercase tracking-widest font-black text-white/20 mb-1">Asset Value</p>
                                        <p className="font-black text-[#DBC2A6] text-lg tracking-tighter">KES {item.product?.price.toLocaleString() || 0}</p>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(item.productId)}
                                        disabled={processingId === `cart-${item.productId}`}
                                        className="w-14 h-14 bg-[#DBC2A6] text-[#0A0D0B] rounded-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl shadow-[#DBC2A6]/10 disabled:opacity-50"
                                    >
                                        {processingId === `cart-${item.productId}` ? <Loader2 size={24} className="animate-spin" /> : <ShoppingCart size={24} strokeWidth={2.5} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
