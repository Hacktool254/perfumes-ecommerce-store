"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";

interface CartItem {
    id: number;
    name: string;
    brand: string;
    price: number;
    image: string;
    quantity: number;
    size: string;
}

interface CartItemProps {
    item: CartItem;
    onUpdateQuantity: (id: number, newQuantity: number) => void;
    onRemove: (id: number) => void;
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 py-6 border-b border-border group">

            {/* Product Image */}
            <div className="relative w-24 h-32 md:w-32 md:h-40 bg-secondary/30 rounded-sm overflow-hidden flex-shrink-0">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Details Area */}
            <div className="flex-1 flex flex-col sm:flex-row justify-between w-full h-full">

                {/* Info Box */}
                <div className="flex flex-col mb-4 sm:mb-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{item.brand}</p>
                    <h3 className="font-serif text-lg text-foreground mb-1">
                        <Link href={`/product/${item.id}`} className="hover:text-accent transition-colors">
                            {item.name}
                        </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">Size: {item.size}</p>

                    {/* Mobile Remove (visible only on small) */}
                    <button
                        onClick={() => onRemove(item.id)}
                        className="text-xs text-muted-foreground underline underline-offset-4 hover:text-red-500 transition-colors sm:hidden w-fit"
                    >
                        Remove
                    </button>
                </div>

                {/* Pricing and Actions Area */}
                <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto">

                    <p className="font-medium text-foreground sm:mb-6">
                        KES {(item.price * item.quantity).toLocaleString()}
                    </p>

                    <div className="flex items-center gap-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 border border-border rounded-full p-1">
                            <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Desktop Remove */}
                        <button
                            onClick={() => onRemove(item.id)}
                            className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition-colors text-muted-foreground"
                            aria-label="Remove item"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
