"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Eye, Tag, Package } from "lucide-react";
import Image from "next/image";

export interface ChatProduct {
    _id: string;
    name: string;
    price: number;
    stock: number;
    slug?: string;
    brand?: string;
    discount?: number;
    images?: string[];
}

interface ProductCardProps {
    product: ChatProduct;
    onAddToCart: (product: ChatProduct) => void;
    onViewProduct: (product: ChatProduct) => void;
}

export function ProductCard({ product, onAddToCart, onViewProduct }: ProductCardProps) {
    const discountedPrice = product.discount
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    const hasImage = product.images && product.images.length > 0;
    const imageUrl = hasImage ? product.images![0] : null;
    const isInStock = product.stock > 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow w-[240px] flex-shrink-0"
        >
            {/* Product Image */}
            <div className="relative h-[120px] bg-gradient-to-br from-[#f8f0f1] to-[#faf5f5] flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="240px"
                        className="object-cover"
                    />
                ) : (
                    <div className="text-4xl">🧴</div>
                )}
                {product.discount && product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Tag className="w-2.5 h-2.5" />
                        -{product.discount}%
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-3">
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                    {product.brand || "Ummie's Essence"}
                </p>
                <h4 className="text-[13px] font-semibold text-[#2f2f2f] mt-0.5 leading-tight line-clamp-1">
                    {product.name}
                </h4>

                {/* Price */}
                <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="text-[15px] font-bold text-[#2f2f2f]">
                        KES {discountedPrice.toLocaleString()}
                    </span>
                    {product.discount && product.discount > 0 && (
                        <span className="text-[11px] text-gray-400 line-through">
                            KES {product.price.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-1 mt-1.5">
                    <Package className="w-3 h-3" />
                    {isLowStock ? (
                        <span className="text-[10px] font-medium text-amber-600">
                            Only {product.stock} left!
                        </span>
                    ) : isInStock ? (
                        <span className="text-[10px] font-medium text-emerald-600">
                            In Stock
                        </span>
                    ) : (
                        <span className="text-[10px] font-medium text-red-500">
                            Out of Stock
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1.5 mt-2.5">
                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={!isInStock}
                        className="flex-1 flex items-center justify-center gap-1 bg-[#2f2f2f] text-white text-[11px] font-medium py-2 rounded-lg hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <ShoppingCart className="w-3 h-3" />
                        Add to Cart
                    </button>
                    <button
                        onClick={() => onViewProduct(product)}
                        className="flex items-center justify-center gap-1 bg-[#f5f5f5] text-[#2f2f2f] text-[11px] font-medium px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Eye className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

interface ProductCarouselProps {
    products: ChatProduct[];
    onAddToCart: (product: ChatProduct) => void;
    onViewProduct: (product: ChatProduct) => void;
}

export function ProductCarousel({ products, onAddToCart, onViewProduct }: ProductCarouselProps) {
    if (!products || products.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onViewProduct={onViewProduct}
                />
            ))}
        </motion.div>
    );
}
