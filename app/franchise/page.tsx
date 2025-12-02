"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import { motion } from "framer-motion";
import { Building2, TrendingUp, Users, CheckCircle } from "lucide-react";

export default function FranchisePage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <SectionTitle title="Franchise" subtitle="Dr. Burger Ailesine Katılın" centered={true} />

                {/* Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center"
                    >
                        <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <TrendingUp size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Yüksek Karlılık</h3>
                        <p className="text-gray-400">
                            Kanıtlanmış iş modelimiz ve operasyonel verimliliğimiz ile yatırımınızın geri dönüşünü hızlandırın.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center"
                    >
                        <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <Building2 size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Anahtar Teslim</h3>
                        <p className="text-gray-400">
                            Lokasyon seçiminden mimari tasarıma, personel eğitiminden açılış organizasyonuna kadar her adımda yanınızdayız.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center"
                    >
                        <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                            <Users size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Sürekli Destek</h3>
                        <p className="text-gray-400">
                            Düzenli denetimler, pazarlama desteği ve ürün geliştirme çalışmaları ile başarınızın sürekliliğini sağlıyoruz.
                        </p>
                    </motion.div>
                </div>

                {/* Application Form */}
                <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl">
                    <h3 className="text-2xl font-bold text-white mb-8 text-center">Başvuru Formu</h3>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Ad Soyad</label>
                                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Telefon</label>
                                <input type="tel" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">E-posta</label>
                            <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Düşünülen Lokasyon (Şehir/Semt)</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Yatırım Bütçesi</label>
                            <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors">
                                <option>1.000.000 ₺ - 2.000.000 ₺</option>
                                <option>2.000.000 ₺ - 3.000.000 ₺</option>
                                <option>3.000.000 ₺ ve üzeri</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Eklemek İstedikleriniz</label>
                            <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
                        </div>

                        <button className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all duration-300">
                            Başvuruyu Gönder
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </main>
    );
}
