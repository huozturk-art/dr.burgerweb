"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function ContentPage() {
    const router = useRouter();
    const { siteContent, updateSiteContent } = useData();
    const [formData, setFormData] = useState({
        heroTitle: "",
        heroSubtitle: "",
        aboutTitle: "",
        aboutText: "",
    });

    useEffect(() => {
        if (siteContent) {
            setFormData(siteContent);
        }
    }, [siteContent]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSiteContent(formData);
        alert("İçerik güncellendi!");
        router.push("/admin");
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft size={20} />
                        Geri Dön
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Site İçeriğini Düzenle</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Hero Section */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-6">
                        <h2 className="text-xl font-bold text-primary border-b border-white/10 pb-4">
                            Ana Sayfa (Hero Alanı)
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Ana Başlık
                            </label>
                            <textarea
                                rows={2}
                                value={formData.heroTitle}
                                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">Satır atlamak için Enter kullanın.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Alt Başlık
                            </label>
                            <textarea
                                rows={3}
                                value={formData.heroSubtitle}
                                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                            />
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl space-y-6">
                        <h2 className="text-xl font-bold text-primary border-b border-white/10 pb-4">
                            Hakkımızda Sayfası
                        </h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Başlık
                            </label>
                            <input
                                type="text"
                                value={formData.aboutTitle}
                                onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Hikaye Metni
                            </label>
                            <textarea
                                rows={8}
                                value={formData.aboutText}
                                onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                            />
                            <p className="text-xs text-gray-500 mt-2">Paragraflar arası boşluk bırakabilirsiniz.</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 sticky bottom-8 shadow-xl shadow-black/50"
                    >
                        <Save size={20} />
                        Tüm Değişiklikleri Kaydet
                    </button>
                </form>
            </div>
        </div>
    );
}
