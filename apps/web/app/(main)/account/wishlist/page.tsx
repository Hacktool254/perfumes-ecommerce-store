"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function WishlistPage() {
    const wishlist = useQuery(api.wishlist.get);

    if (wishlist === undefined) return <div className="p-8 text-center text-muted-foreground text-sm">Loading wishlist...</div>;

    return (
        <div className="max-w-6xl pb-10">
            <h1 className="text-[28px] font-bold text-foreground leading-tight mb-6">My Wishlist</h1>

            {wishlist.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="text-muted-foreground" size={32} />
                    </div>
                    <h2 className="text-lg font-semibold text-card-foreground mb-2">Your wishlist is empty</h2>
                    <p className="text-sm text-muted-foreground mb-6">Save your favorite fragrances to keep track of them.</p>
                    <Link
                        href="/shop"
                        className="inline-block px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Explore Shop
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                        <div
                            key={item._id}
                            className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors group flex flex-col"
                        >
                            <div className="relative aspect-square bg-muted/30 border-b border-border">
                                {item.product?.images?.[0] && (
                                    <Image
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover mix-blend-multiply p-4"
                                    />
                                )}
                                <button className="absolute top-3 right-3 p-1.5 bg-background rounded-md text-muted-foreground hover:text-destructive border border-border transition-colors shadow-sm">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <Link href={`/product/${item.product?.slug}`}>
                                    <h3 className="font-semibold text-card-foreground text-sm mb-1 group-hover:underline line-clamp-1">
                                        {item.product?.name}
                                    </h3>
                                </Link>
                                <p className="text-xs text-muted-foreground mb-4">{item.product?.brand}</p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                                    <p className="font-semibold text-card-foreground text-sm">KES {item.product?.price.toLocaleString()}</p>
                                    <button className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                                        <ShoppingCart size={16} />
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
