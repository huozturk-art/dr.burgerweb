"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";

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
                    <FranchiseForm />
                </div>
            </div>

            <Footer />
        </main>
    );
}

function FranchiseForm() {
    const { addApplication } = useData();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        location: "",
        budget: "1.000.000 ₺ - 2.000.000 ₺",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addApplication({
                ...formData,
                position: "Franchise Adayı",
                type: 'franchise'
            });
            alert("Başvurunuz başarıyla alındı! Franchise ekibimiz en kısa sürede sizinle iletişime geçecektir.");
            setFormData({
                name: "",
                phone: "",
                email: "",
                location: "",
                budget: "1.000.000 ₺ - 2.000.000 ₺",
                message: ""
            });
        } catch (error) {
            console.error("Error sending application:", error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Ad Soyad</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Telefon</label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">E-posta</label>
                <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Düşünülen Lokasyon (Şehir/Semt)</label>
                <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Yatırım Bütçesi</label>
                <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                >
                    <option>1.000.000 ₺ - 2.000.000 ₺</option>
                    <option>2.000.000 ₺ - 3.000.000 ₺</option>
                    <option>3.000.000 ₺ ve üzeri</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Eklemek İstedikleriniz</label>
                <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300"
            >
                {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Gönder"}
            </button>
        </form>
    );
}
