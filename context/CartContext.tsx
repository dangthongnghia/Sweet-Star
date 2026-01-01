"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
    isCombo: boolean;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("cart");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(items));
    }, [items]);

    const addToCart = (product: any) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.productId === product._id);
            if (existing) {
                return prev.map((item) =>
                    item.productId === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [
                ...prev,
                {
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    imageUrl: product.imageUrl,
                    isCombo: product.isCombo,
                },
            ];
        });
    };

    const removeFromCart = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
    };

    const clearCart = () => setItems([]);

    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
