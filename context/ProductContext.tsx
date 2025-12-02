"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

interface ProductContextType {
    products: Product[];
    addProduct: (product: Omit<Product, "id">) => void;
    updateProduct: (id: string, product: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    getProductsByCategory: (category: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Dr. Classic",
        description: "150g dana burger köftesi, cheddar peyniri, karamelize soğan, özel sos, marul, domates.",
        price: 240,
        image: "/images/products/DSC04682.JPG.png",
        category: "Burger",
    },
    {
        id: "2",
        name: "Dr. Special",
        description: "200g dana burger köftesi, füme et, çift cheddar, trüf mayonez, çıtır soğan.",
        price: 320,
        image: "/images/products/DSC04693.png",
        category: "Burger",
    },
    {
        id: "3",
        name: "Mushroom Swiss",
        description: "150g dana burger köftesi, sote mantar, swiss peyniri, sarımsaklı mayonez.",
        price: 280,
        image: "/images/products/DSC04700.png",
        category: "Burger",
    },
    {
        id: "4",
        name: "Spicy BBQ",
        description: "150g dana burger köftesi, jalapeno biberi, bbq sos, cheddar peyniri, çıtır soğan.",
        price: 260,
        image: "/images/products/DSC04703.png",
        category: "Burger",
    },
    {
        id: "5",
        name: "Truffle Burger",
        description: "Trüf mantarı soslu özel burger.",
        price: 340,
        image: "/images/products/DSC04706.png",
        category: "Burger",
    },
    {
        id: "6",
        name: "Double Cheese",
        description: "Çift katlı cheddar peyniri lezzeti.",
        price: 300,
        image: "/images/products/DSC04715.png",
        category: "Burger",
    },
    {
        id: "7",
        name: "Çıtır Patates",
        description: "Özel baharat çeşnisi ile hazırlanmış altın sarısı patates kızartması.",
        price: 90,
        image: "/images/products/DSC04754.png",
        category: "Yan Ürün",
    },
    {
        id: "8",
        name: "Soğan Halkası",
        description: "8 adet çıtır soğan halkası, özel dip sos ile.",
        price: 110,
        image: "/images/products/DSC04785.png",
        category: "Yan Ürün",
    },
    {
        id: "9",
        name: "Mozzarella Sticks",
        description: "Çıtır kaplamalı mozzarella peyniri.",
        price: 130,
        image: "/images/products/DSC04805.JPG.png",
        category: "Yan Ürün",
    },
];

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const savedProducts = localStorage.getItem("dr_burger_products");
        if (savedProducts) {
            try {
                setProducts(JSON.parse(savedProducts));
            } catch (error) {
                console.error("Failed to parse products from localStorage", error);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to localStorage whenever products change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("dr_burger_products", JSON.stringify(products));
        }
    }, [products, isInitialized]);

    const addProduct = (newProduct: Omit<Product, "id">) => {
        const product = {
            ...newProduct,
            id: Math.random().toString(36).substr(2, 9),
        };
        setProducts((prev) => [...prev, product]);
    };

    const updateProduct = (id: string, updatedFields: Partial<Product>) => {
        setProducts((prev) =>
            prev.map((product) => (product.id === id ? { ...product, ...updatedFields } : product))
        );
    };

    const deleteProduct = (id: string) => {
        setProducts((prev) => prev.filter((product) => product.id !== id));
    };

    const getProductsByCategory = (category: string) => {
        return products.filter((product) => product.category === category);
    };

    return (
        <ProductContext.Provider
            value={{ products, addProduct, updateProduct, deleteProduct, getProductsByCategory }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
};
