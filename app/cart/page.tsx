"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import { useCart } from "@/context/CartContext";
import { useData } from "@/context/DataContext";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, ArrowRight } from "lucide-react";

export default function CartPage() {
    const { items, removeItem, addItem, totalPrice } = useCart();
    const { products } = useData();

    const getProductImage = (id: string) => {
        const product = products.find(p => p.id === id);
        return product ? product.image : "/images/menu_classic.png";
    };

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <SectionTitle title="Sepetim" subtitle="Lezzet Sepeti" centered={true} />

                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl mb-8">Sepetinizde henüz ürün bulunmuyor.</p>
                        <Link
                            href="/menu"
                            className="inline-block bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-colors"
                        >
                            Menüye Git
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-6"
                                >
                                    <div className="relative h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden bg-white/5">
                                        <Image
                                            src={getProductImage(item.id)}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                                        <p className="text-primary font-bold">₺{item.price}</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-black/50 rounded-lg border border-white/10">
                                            <button
                                                className="p-2 text-gray-400 hover:text-white disabled:opacity-50"
                                                disabled={true}
                                            >
                                                {/* Placeholder for decrement */}
                                            </button>
                                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                                            <button
                                                onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}
                                                className="p-2 text-gray-400 hover:text-white"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl sticky top-32">
                                <h3 className="text-xl font-bold text-white mb-6">Sipariş Özeti</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-400">
                                        <span>Ara Toplam</span>
                                        <span>₺{totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-400">
                                        <span>Teslimat Ücreti</span>
                                        <span>₺0</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold text-white">
                                        <span>Toplam</span>
                                        <span className="text-primary">₺{totalPrice}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Sepeti Onayla
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
