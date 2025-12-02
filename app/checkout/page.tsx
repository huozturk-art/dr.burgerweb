"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import { useCart } from "@/context/CartContext";
import { CheckCircle, MapPin, CreditCard, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CheckoutPage() {
    const { items, totalPrice } = useCart();
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("credit_card");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setIsSuccess(true);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen bg-black text-white flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center px-4">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center max-w-lg w-full"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-500/20 p-6 rounded-full text-green-500">
                                <CheckCircle size={64} />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Siparişiniz Alındı!</h2>
                        <p className="text-gray-400 mb-8">
                            Lezzet yolculuğunuz başladı. Siparişiniz hazırlanıyor ve en kısa sürede size ulaşacak.
                        </p>
                        <Link
                            href="/"
                            className="inline-block bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-colors"
                        >
                            Ana Sayfaya Dön
                        </Link>
                    </motion.div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <SectionTitle title="Ödeme" subtitle="Siparişi Tamamla" centered={true} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                            {/* Address Section */}
                            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-primary/20 p-3 rounded-full text-primary">
                                        <MapPin size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Teslimat Adresi</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Ad Soyad</label>
                                        <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Telefon</label>
                                        <input type="tel" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Adres</label>
                                        <textarea required rows={3} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Mahalle, Sokak, Bina No, Daire..." />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Sipariş Notu</label>
                                        <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Zili çalmayın, vb." />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-primary/20 p-3 rounded-full text-primary">
                                        <CreditCard size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Ödeme Yöntemi</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("credit_card")}
                                        className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${paymentMethod === "credit_card" ? "bg-primary/20 border-primary text-white" : "bg-black/50 border-white/10 text-gray-400 hover:border-white/30"}`}
                                    >
                                        <CreditCard size={24} />
                                        <span className="font-bold">Kapıda Kredi Kartı</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("cash")}
                                        className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${paymentMethod === "cash" ? "bg-primary/20 border-primary text-white" : "bg-black/50 border-white/10 text-gray-400 hover:border-white/30"}`}
                                    >
                                        <Banknote size={24} />
                                        <span className="font-bold">Kapıda Nakit</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl sticky top-32">
                            <h3 className="text-xl font-bold text-white mb-6">Sipariş Özeti</h3>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-start text-sm">
                                        <div className="text-gray-300">
                                            <span className="font-bold text-primary mr-2">{item.quantity}x</span>
                                            {item.name}
                                        </div>
                                        <span className="text-white font-medium">₺{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-2 mb-8">
                                <div className="flex justify-between text-gray-400">
                                    <span>Ara Toplam</span>
                                    <span>₺{totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-white">
                                    <span>Toplam</span>
                                    <span className="text-primary">₺{totalPrice}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary/25"
                            >
                                Siparişi Tamamla
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
