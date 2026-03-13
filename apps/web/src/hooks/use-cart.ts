"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useEffect, useState, useCallback } from "react";
import { Id } from "@workspaceRoot/convex/_generated/dataModel";

export type CartItem = {
    productId: Id<"products">;
    quantity: number;
    product?: any;
    _id?: any; // Convex ID if logged in
};

export function useCart() {
    const [isMounted, setIsMounted] = useState(false);

    // Skip convex query during Server-side Rendering (when !isMounted)
    const cartItems = useQuery(api.cart.get, isMounted ? {} : "skip");
    const addToCartMutation = useMutation(api.cart.add);
    const updateQuantityMutation = useMutation(api.cart.updateQuantity);
    const removeFromCartMutation = useMutation(api.cart.remove);
    const clearCartMutation = useMutation(api.cart.clear);

    const [guestItems, setGuestItems] = useState<CartItem[]>([]);

    // Initial load from localStorage for guests
    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem("ummies_cart");
        if (saved) {
            try {
                setGuestItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart items", e);
            }
        }
    }, []);

    // Sync guestItems to localStorage
    useEffect(() => {
        if (isMounted && !cartItems) {
            localStorage.setItem("ummies_cart", JSON.stringify(guestItems));
        }
    }, [guestItems, isMounted, cartItems]);

    const items: CartItem[] = (isMounted && cartItems) || guestItems;

    const addItem = useCallback(async (productId: Id<"products">, quantity: number = 1, product?: any) => {
        if (cartItems) {
            await addToCartMutation({ productId, quantity });
        } else {
            setGuestItems(prev => {
                const existing = prev.find(i => i.productId === productId);
                if (existing) {
                    return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
                }
                return [...prev, { productId, quantity, product }];
            });
        }
    }, [cartItems, addToCartMutation]);

    const updateQuantity = useCallback(async (productId: Id<"products">, quantity: number, cartItemId?: Id<"cartItems">) => {
        if (cartItems && cartItemId) {
            await updateQuantityMutation({ cartItemId, quantity });
        } else {
            setGuestItems(prev => {
                if (quantity <= 0) {
                    return prev.filter(i => i.productId !== productId);
                }
                return prev.map(i => i.productId === productId ? { ...i, quantity } : i);
            });
        }
    }, [cartItems, updateQuantityMutation]);

    const removeItem = useCallback(async (productId: Id<"products">, cartItemId?: Id<"cartItems">) => {
        if (cartItems && cartItemId) {
            await removeFromCartMutation({ cartItemId });
        } else {
            setGuestItems(prev => prev.filter(i => i.productId !== productId));
        }
    }, [cartItems, removeFromCartMutation]);

    const clearCart = useCallback(async () => {
        if (cartItems) {
            await clearCartMutation();
        } else {
            setGuestItems([]);
            localStorage.removeItem("ummies_cart");
        }
    }, [cartItems, clearCartMutation]);

    return {
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isLoading: !isMounted || (cartItems === undefined && isMounted)
    };
}
