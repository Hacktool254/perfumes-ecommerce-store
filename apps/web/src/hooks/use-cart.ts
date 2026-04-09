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
    const [optimisticItems, setOptimisticItems] = useState<CartItem[] | null>(null);

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

    // Reset optimistic items when server data changes
    useEffect(() => {
        if (cartItems) {
            setOptimisticItems(null);
        }
    }, [cartItems]);

    // Return empty array during SSR to prevent hydration mismatch
    // Priority: optimisticItems > cartItems > guestItems
    const items: CartItem[] = !isMounted 
        ? [] 
        : (optimisticItems !== null ? optimisticItems : (cartItems as CartItem[]) || guestItems);

    const addItem = useCallback(async (productId: Id<"products">, quantity: number = 1, product?: any) => {
        // Immediate UI Update
        const newItem: CartItem = { productId, quantity, product };
        setOptimisticItems(prev => {
            const current = prev || (cartItems as CartItem[]) || guestItems;
            const existing = current.find(i => i.productId === productId);
            if (existing) {
                return current.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...current, newItem];
        });

        if (cartItems) {
            try {
                await addToCartMutation({ productId, quantity });
            } catch (error) {
                setOptimisticItems(null); // Rollback on error
                console.error("Add to cart failed", error);
            }
        } else {
            setGuestItems(prev => {
                const existing = prev.find(i => i.productId === productId);
                if (existing) {
                    return prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
                }
                return [...prev, newItem];
            });
            setOptimisticItems(null); // Clear optimistic once guest state is updated
        }
    }, [cartItems, guestItems, addToCartMutation]);

    const updateQuantity = useCallback(async (productId: Id<"products">, quantity: number, cartItemId?: Id<"cartItems">) => {
        setOptimisticItems(prev => {
            const current = prev || (cartItems as CartItem[]) || guestItems;
            if (quantity <= 0) {
                return current.filter(i => i.productId !== productId);
            }
            return current.map(i => i.productId === productId ? { ...i, quantity } : i);
        });

        if (cartItems && cartItemId) {
            try {
                await updateQuantityMutation({ cartItemId, quantity });
            } catch (error) {
                setOptimisticItems(null);
                console.error("Update quantity failed", error);
            }
        } else {
            setGuestItems(prev => {
                if (quantity <= 0) {
                    return prev.filter(i => i.productId !== productId);
                }
                return prev.map(i => i.productId === productId ? { ...i, quantity } : i);
            });
            setOptimisticItems(null);
        }
    }, [cartItems, guestItems, updateQuantityMutation]);

    const removeItem = useCallback(async (productId: Id<"products">, cartItemId?: Id<"cartItems">) => {
        setOptimisticItems(prev => {
            const current = prev || (cartItems as CartItem[]) || guestItems;
            return current.filter(i => i.productId !== productId);
        });

        if (cartItems && cartItemId) {
            try {
                await removeFromCartMutation({ cartItemId });
            } catch (error) {
                setOptimisticItems(null);
                console.error("Remove item failed", error);
            }
        } else {
            setGuestItems(prev => prev.filter(i => i.productId !== productId));
            setOptimisticItems(null);
        }
    }, [cartItems, guestItems, removeFromCartMutation]);

    const clearCart = useCallback(async () => {
        setOptimisticItems([]);
        if (cartItems) {
            try {
                await clearCartMutation();
            } catch (error) {
                setOptimisticItems(null);
                console.error("Clear cart failed", error);
            }
        } else {
            setGuestItems([]);
            localStorage.removeItem("ummies_cart");
            setOptimisticItems(null);
        }
    }, [cartItems, clearCartMutation]);

    return {
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isLoading: !isMounted || (cartItems === undefined && !optimisticItems)
    };
}
