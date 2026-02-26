"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface SelectedIngredient {
    ingredient: {
        id: string;
        name: string;
        price: number;
    };
    quantity: number;
    categoryName: string;
}

export interface CartItem {
    id: string; // Internal unique ID
    productId?: string; // product_id if standard
    name: string;
    price: number;
    quantity: number;
    isCustom: boolean;
    customSelections?: SelectedIngredient[];
    burgerName?: string;
    image?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    updateQuantity: (id: string, delta: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Initialize from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("dr_burger_cart");
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error("Cart parse error:", e);
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("dr_burger_cart", JSON.stringify(items));
    }, [items]);

    const addItem = (newItem: Omit<CartItem, "quantity">) => {
        setItems((prevItems) => {
            // For standard products, group by productId
            if (!newItem.isCustom) {
                const existingItem = prevItems.find((item) => item.productId === newItem.productId && !item.isCustom);
                if (existingItem) {
                    return prevItems.map((item) =>
                        item.id === existingItem.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
            }
            // For custom burgers or unique new standard ones, add as new
            return [...prevItems, { ...newItem, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems((prev) =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                    : item
            ).filter(item => item.quantity > 0)
        );
    };

    const removeItem = (id: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
