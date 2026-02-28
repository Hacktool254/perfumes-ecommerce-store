"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function WishlistPage() {
    const wishlist = useQuery(api.wishlist.get);

    if (wishlist === undefined) return <div className="p-8 text-center text-gray-500">Loading wishlist...</div>;

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8" style={{ color: "#8b1538" }}>My Wishlist</h1>

            {wishlist.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="text-gray-300" size={32} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-6">Save your favorite fragrances to keep track of them.</p>
                    <Link
                        href="/shop"
                        className="inline-block px-8 py-3 rounded-full bg-[#8b1538] text-white font-semibold hover:bg-[#6b102b] transition-all"
                    >
                        Explore Shop
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="relative aspect-square bg-gray-50">
                                {item.product?.images?.[0] && (
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="p-6">
                                <Link href={`/product/${item.product?.slug}`}>
                                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#8b1538] transition-colors line-clamp-1">
                                        {item.product?.name}
                                    </h3>
                                </Link>
                                <p className="text-sm text-gray-500 mb-4">{item.product?.brand}</p>

                                <div className="flex items-center justify-between mt-auto">
                                    <p className="font-bold text-[#8b1538]">KES {item.product?.price.toLocaleString()}</p>
                                    <button className="p-2 bg-[#8b1538] text-white rounded-full hover:bg-[#6b102b] transition-colors">
                                        <ShoppingCart size={18} />
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
