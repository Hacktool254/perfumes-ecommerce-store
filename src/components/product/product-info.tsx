"use client";

import { useState } from "react";
import { ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

interface ProductInfoProps {
    product: {
        name: string;
        brand: string;
        price: number;
        description: string;
        inStock: boolean;
        stockCount?: number;
        notes: string[];
        size: string;
    };
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [quantity, setQuantity] = useState(1);
    const [isWishlist, setIsWishlist] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Micro-animation for Add to Cart
    const handleAddToCart = () => {
        setIsAdding(true);
        setTimeout(() => setIsAdding(false), 600);
        // Real implementation will call Convex mutation here
    };

    return (
        <div className="flex flex-col h-full font-sans">

            {/* Brand & Stock */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{product.brand}</p>
                <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.inStock ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"}`}>
                    {product.inStock ? `In Stock ${product.stockCount ? `(${product.stockCount})` : ''}` : "Out of Stock"}
                </div>
            </div>

            {/* Title & Price */}
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4 leading-tight">{product.name}</h1>
            <p className="text-2xl font-light text-foreground mb-8">KES {product.price.toLocaleString()}</p>

            {/* Description */}
            <div className="prose prose-sm dark:prose-invert mb-8 text-muted-foreground">
                <p>{product.description}</p>
            </div>

            {/* Fragrance Notes & Size */}
            <div className="grid grid-cols-2 gap-6 mb-10 py-6 border-y border-border">
                <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Key Notes</h4>
                    <p className="text-sm text-muted-foreground">{product.notes.join(", ")}</p>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Size</h4>
                    <p className="text-sm text-muted-foreground">{product.size}</p>
                </div>
            </div>

            {/* Add to Cart / Actions */}
            <div className="flex flex-col gap-4 mb-10">

                {/* Quantity (basic) */}
                <div className="flex items-center gap-4 border border-border rounded-full w-max p-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full transition-colors">-</button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-full transition-colors">+</button>
                </div>

                <div className="flex items-center gap-4 mt-2">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        disabled={!product.inStock || isAdding}
                        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-full font-medium transition-colors ${product.inStock
                                ? "bg-foreground text-background hover:bg-foreground/90 hover:shadow-lg"
                                : "bg-secondary text-muted-foreground cursor-not-allowed"
                            }`}
                    >
                        {isAdding ? "Adding..." : (
                            <>
                                <ShoppingBag className="w-5 h-5" />
                                <span>Add to Cart — KES {(product.price * quantity).toLocaleString()}</span>
                            </>
                        )}
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsWishlist(!isWishlist)}
                        className="w-14 h-14 flex items-center justify-center flex-shrink-0 border border-border rounded-full hover:bg-secondary transition-colors"
                        aria-label="Add to Wishlist"
                    >
                        <motion.div
                            animate={isWishlist ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.3 }}
                        >
                            <Heart className={`w-6 h-6 transition-colors ${isWishlist ? "fill-red-500 text-red-500" : "text-foreground"}`} />
                        </motion.div>
                    </motion.button>
                </div>
            </div>

            {/* Benefits */}
            <div className="mt-auto space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-foreground" />
                    <span>Complimentary shipping on orders over KES 10,000</span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-foreground" />
                    <span>100% Authentic Guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-foreground" />
                    <span>14-day return policy on unopened items</span>
                </div>
            </div>

        </div>
    );
}
