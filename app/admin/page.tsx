"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, LogOut, MapPin, FileText } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function AdminDashboard() {
    const router = useRouter();
    const { products, deleteProduct, branches, deleteBranch, applications, deleteApplication } = useData();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<"products" | "branches" | "content" | "applications">("products");

    useEffect(() => {
        const auth = localStorage.getItem("adminAuth");
        if (auth !== "true") {
            router.push("/admin/login");
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("adminAuth");
        router.push("/admin/login");
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold text-white">Yönetici Paneli</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                        Çıkış Yap
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-1">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`px-6 py-3 rounded-t-xl font-bold transition-colors ${activeTab === "products"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        Ürünler
                    </button>
                    <button
                        onClick={() => setActiveTab("branches")}
                        className={`px-6 py-3 rounded-t-xl font-bold transition-colors ${activeTab === "branches"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        Şubeler
                    </button>
                    <button
                        onClick={() => setActiveTab("content")}
                        className={`px-6 py-3 rounded-t-xl font-bold transition-colors ${activeTab === "content"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        İçerik Yönetimi
                    </button>
                    <button
                        onClick={() => setActiveTab("applications")}
                        className={`px-6 py-3 rounded-t-xl font-bold transition-colors ${activeTab === "applications"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        Başvurular
                    </button>
                </div>

                {/* Products Tab */}
                {activeTab === "products" && (
                    <div>
                        <div className="flex justify-end mb-8">
                            <Link
                                href="/admin/products/new"
                                className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Yeni Ürün Ekle
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group"
                                >
                                    <div className="relative h-48 w-full">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10">
                                            {product.category}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-white">{product.name}</h3>
                                            <span className="text-primary font-bold">₺{product.price}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                                            {product.description}
                                        </p>
                                        <div className="flex gap-4">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Edit size={16} />
                                                Düzenle
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
                                                        deleteProduct(product.id);
                                                    }
                                                }}
                                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Trash2 size={16} />
                                                Sil
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Branches Tab */}
                {activeTab === "branches" && (
                    <div>
                        <div className="flex justify-end mb-8">
                            <Link
                                href="/admin/branches/new"
                                className="bg-primary hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2"
                            >
                                <Plus size={20} />
                                Yeni Şube Ekle
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {branches.map((branch) => (
                                <div key={branch.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-white">{branch.name}</h3>
                                        <button
                                            onClick={() => {
                                                if (confirm("Bu şubeyi silmek istediğinize emin misiniz?")) {
                                                    deleteBranch(branch.id);
                                                }
                                            }}
                                            className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <div className="space-y-2 text-gray-400">
                                        <p className="flex items-start gap-2">
                                            <MapPin size={18} className="shrink-0 mt-1 text-primary" />
                                            {branch.address}
                                        </p>
                                        <p className="pl-7">{branch.phone}</p>
                                        <p className="pl-7">{branch.email}</p>
                                    </div>
                                </div>
                            ))}
                            {branches.length === 0 && (
                                <div className="col-span-full text-center py-12 text-gray-400">
                                    Henüz şube eklenmemiş.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                    <div className="flex justify-center py-12">
                        <Link
                            href="/admin/content"
                            className="bg-white/5 border border-white/10 hover:border-primary/50 p-8 rounded-2xl text-center group transition-all duration-300 max-w-md w-full"
                        >
                            <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary group-hover:scale-110 transition-transform">
                                <FileText size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Site İçeriğini Düzenle</h3>
                            <p className="text-gray-400">
                                Ana sayfa başlıkları, hakkımızda yazısı ve diğer genel içerikleri buradan yönetebilirsiniz.
                            </p>
                        </Link>
                    </div>
                )}

                {/* Applications Tab */}
                {activeTab === "applications" && (
                    <div className="space-y-6">
                        <ApplicationsList />
                    </div>
                )}
            </div>
        </div>
    );
}

function ApplicationsList() {
    const { applications, deleteApplication } = useData();

    if (!applications || applications.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400 bg-white/5 rounded-2xl border border-white/10">
                Henüz başvuru bulunmamaktadır.
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            {applications.map((app) => (
                <div key={app.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{app.name}</h3>
                            <p className="text-primary font-medium">{app.position}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                {new Date(app.date).toLocaleDateString("tr-TR")}
                            </span>
                            <button
                                onClick={() => {
                                    if (confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) {
                                        deleteApplication(app.id);
                                    }
                                }}
                                className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-gray-400">
                        <div>
                            <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">E-posta</span>
                            {app.email}
                        </div>
                        <div>
                            <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Telefon</span>
                            {app.phone}
                        </div>
                    </div>
                    <div>
                        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Ön Yazı</span>
                        <p className="text-gray-300 bg-black/30 p-4 rounded-xl text-sm leading-relaxed">
                            {app.message}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
