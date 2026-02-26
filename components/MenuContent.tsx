"use client";

import { useState, useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import { useData } from "@/context/DataContext";
import { useCart } from "@/context/CartContext";
import { useTable } from "@/context/TableContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ChefHat, Sparkles, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const MenuContent = () => {
    const { products, categories: dataCategories } = useData();
    const { totalItems, totalPrice } = useCart();
    const { tableNumber } = useTable();
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("");

    // Use centralized categories
    const orderedCategories = dataCategories;
    const availableCategories = Array.from(new Set(products.map((p) => p.category)));
    const visibleCategories = orderedCategories.filter(c => availableCategories.includes(c));

    // Add any remaining categories that weren't in the ordered list
    availableCategories.forEach(c => {
        if (!visibleCategories.includes(c)) {
            visibleCategories.push(c);
        }
    });

    useEffect(() => {
        if (visibleCategories.length > 0) {
            setActiveCategory(visibleCategories[0]);
        }
    }, [visibleCategories.length]);

    const scrollToCategory = (category: string) => {
        setActiveCategory(category);
        const element = document.getElementById(category);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 180;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
    };

    if (!products || products.length === 0) {
        return (
            <div className="pt-32 pb-20 px-4 text-center">
                <div className="text-primary text-xl font-bold animate-pulse">Menü Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section for Menu */}
            <div className="pt-32 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <SectionTitle
                    title="Dijital Menümüz"
                    subtitle={tableNumber ? `Masa ${tableNumber}` : "Afiyet Olsun"}
                    centered={true}
                />
            </div>

            {/* Custom Burger Entry Point */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <motion.div
                    onClick={() => router.push(`/custom${tableNumber ? `?table=${tableNumber}` : ""}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative overflow-hidden bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 shadow-[0_0_30px_rgba(255,107,0,0.3)] group cursor-pointer"
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform">
                                👨‍🍳
                            </div>
                            <div className="text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles size={18} className="text-white" />
                                    <span className="text-white/80 text-xs font-bold uppercase tracking-wider">Premium Özellik</span>
                                </div>
                                <h2 className="text-3xl font-black text-white mb-1">Kendi Burgerini Tasarla</h2>
                                <p className="text-white/70">Tamamen sana özel, malzemelerini senin seçtiğin o efsane burgere hemen başla!</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/20 px-6 py-4 rounded-2xl group-hover:bg-white/30 transition-all">
                            <span className="text-white font-bold">Hemen Başla</span>
                            <ChevronRight size={24} className="text-white" />
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-30" />
                    <div className="absolute top-1/2 right-10 -translate-y-1/2 text-8xl opacity-10 grayscale group-hover:scale-125 transition-transform">🍔</div>
                </motion.div>
            </div>

            {/* Sticky Category Navigation */}
            <div className="sticky top-24 z-40 bg-black/95 backdrop-blur-md border-b border-white/10 py-4 mb-10 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide no-scrollbar">
                        {visibleCategories.map((category) => (
                            <button
                                key={category}
                                onClick={() => scrollToCategory(category)}
                                className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${activeCategory === category
                                    ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(255,107,0,0.4)]"
                                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                {visibleCategories.map((category) => {
                    const categoryProducts = products.filter((p) => p.category === category);

                    return (
                        <div key={category} id={category} className="mb-20 scroll-mt-48">
                            <motion.h3
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-3xl font-bold text-white mb-8 flex items-center gap-3"
                            >
                                <span className="w-2 h-8 bg-primary rounded-full inline-block"></span>
                                {category}
                                <span className="text-sm font-normal text-gray-500 ml-2">({categoryProducts.length})</span>
                            </motion.h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categoryProducts.map((product) => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Floating Cart Button */}
            <AnimatePresence>
                {totalItems > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
                    >
                        <Link href="/cart">
                            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-4 flex items-center justify-between shadow-[0_10px_40px_rgba(255,107,0,0.4)] border border-white/20 group cursor-pointer hover:scale-[1.02] transition-transform active:scale-[0.98]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center relative">
                                        <ShoppingCart size={24} className="text-white" />
                                        <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                                            {totalItems}
                                        </span>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white/80 text-xs font-bold uppercase tracking-widest">Siparişiniz</p>
                                        <p className="text-xl font-bold text-white">₺{totalPrice.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-white font-bold group-hover:translate-x-1 transition-transform">
                                    Sepeti Gör
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MenuContent;
