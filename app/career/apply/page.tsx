"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import { useData } from "@/context/DataContext";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";

function ApplyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const position = searchParams.get("position") || "Genel Başvuru";
    const { addApplication } = useData();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addApplication({
            ...formData,
            position,
        });
        alert("Başvurunuz başarıyla alındı! En kısa sürede sizinle iletişime geçeceğiz.");
        router.push("/career");
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/career"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft size={20} />
                    Kariyer Sayfasına Dön
                </Link>
                <h2 className="text-2xl font-bold text-white mb-2">Başvuru Formu</h2>
                <p className="text-primary font-semibold text-lg">{position}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-2xl">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Ad Soyad
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="Adınız Soyadınız"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            E-posta
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="ornek@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Telefon
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="05XX XXX XX XX"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Ön Yazı / Mesajınız
                    </label>
                    <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                        placeholder="Kendinizden kısaca bahsedin..."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <Send size={20} />
                    Başvuruyu Gönder
                </button>
            </form>
        </div>
    );
}

export default function ApplyPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Suspense fallback={<div className="text-center text-white">Yükleniyor...</div>}>
                    <ApplyForm />
                </Suspense>
            </div>
            <Footer />
        </main>
    );
}
