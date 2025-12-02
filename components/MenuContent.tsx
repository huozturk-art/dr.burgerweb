"use client";

import SectionTitle from "@/components/SectionTitle";
import ProductCard from "@/components/ProductCard";
import { useData } from "@/context/DataContext";

const MenuContent = () => {
    const { products } = useData();

    const classicBurgers = products.filter((p) => p.category === "Klasik Burgerler");
    const specialBurgers = products.filter((p) => p.category === "Özel Seriler");
    const chickenBurgers = products.filter((p) => p.category === "Tavuk Burgerler");
    const fireBurgers = products.filter((p) => p.category === "Fire (Acı) Serisi");
    const sides = products.filter((p) => p.category === "Yan Ürünler");

    if (!products || products.length === 0) {
        return (
            <div className="pt-32 pb-20 px-4 text-center">
                <div className="text-primary text-xl font-bold animate-pulse">Menü Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <SectionTitle
                title="Menümüz"
                subtitle="Lezzet Dolu Seçenekler"
                centered={true}
            />

            {/* Klasik Burgerler */}
            <div className="mb-16">
                <h3 className="text-2xl font-bold text-primary mb-8 border-b border-white/10 pb-4">
                    Klasik Kırmızı Et Burgerler (110gr)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {classicBurgers.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>

            {/* Özel Seriler */}
            <div className="mb-16">
                <h3 className="text-2xl font-bold text-primary mb-8 border-b border-white/10 pb-4">
                    Özel Seriler (Şefin Spesiyalleri)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {specialBurgers.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>

            {/* Tavuk Burgerler */}
            <div className="mb-16">
                <h3 className="text-2xl font-bold text-primary mb-8 border-b border-white/10 pb-4">
                    Tavuk Burgerler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {chickenBurgers.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>

            {/* Fire Serisi */}
            <div className="mb-16">
                <h3 className="text-2xl font-bold text-red-500 mb-8 border-b border-white/10 pb-4 flex items-center gap-2">
                    Fire (Acı) Serisi 🔥
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {fireBurgers.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>

            {/* Yan Ürünler */}
            <div>
                <h3 className="text-2xl font-bold text-primary mb-8 border-b border-white/10 pb-4">
                    Yan Lezzetler
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {sides.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MenuContent;
