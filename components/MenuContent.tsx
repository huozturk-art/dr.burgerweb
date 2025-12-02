"use client";

import { useState, useEffect } from "react";
import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";

const MenuContent = () => {
    const { products, categories } = useData();
    const [activeCategory, setActiveCategory] = useState("");

    // Use centralized categories
    const orderedCategories = categories;

    const availableCategories = Array.from(new Set(products.map((p) => p.category)));

    // Sort available categories based on the defined order
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
            // Offset for fixed navbar (96px) + sticky menu (approx 60px) + some breathing room
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
            <div className="pt-32 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <SectionTitle
                    title="Menümüz"
                    subtitle="Lezzet Dolu Seçenekler"
                    centered={true}
                />
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
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
        </div>
    );
};

export default MenuContent;
