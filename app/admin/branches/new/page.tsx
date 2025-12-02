"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewBranchPage() {
    const router = useRouter();
    const { addBranch } = useData();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        phone: "",
        email: "",
        map_url: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addBranch(formData);
        router.push("/admin");
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft size={20} />
                        Geri Dön
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Yeni Şube Ekle</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-2xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Şube Adı
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="Örn: Kadıköy Merkez"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Adres
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                            placeholder="Tam adres..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Telefon
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="sube@drburger.com.tr"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Harita Linki (Google Maps)
                        </label>
                        <input
                            type="url"
                            value={formData.map_url}
                            onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            placeholder="https://maps.google.com/..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        Kaydet
                    </button>
                </form>
            </div >
        </div >
    );
}
