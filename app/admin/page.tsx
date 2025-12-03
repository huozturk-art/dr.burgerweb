"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, MapPin, FileText } from "lucide-react";
import { useData } from "@/context/DataContext";

export default function AdminDashboard() {
    const {
        products, deleteProduct,
        branches, deleteBranch,
        applications, deleteApplication,
        categories, addCategory, deleteCategory,
        jobPostings, addJobPosting, deleteJobPosting,
        messages, deleteMessage
    } = useData();
    const [activeTab, setActiveTab] = useState<"products" | "branches" | "content" | "applications" | "categories" | "jobs" | "messages">("products");
    const [newCategory, setNewCategory] = useState("");
    const [newJob, setNewJob] = useState({ title: "", location: "", type: "", description: "", isActive: true });

    const handleAddJob = (e: React.FormEvent) => {
        e.preventDefault();
        addJobPosting(newJob);
        setNewJob({ title: "", location: "", type: "", description: "", isActive: true });
        alert("İş ilanı eklendi.");
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory.trim()) {
            addCategory(newCategory.trim());
            setNewCategory("");
        }
    };

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-3xl font-bold text-white">Yönetici Paneli</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10 pb-1 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`px-6 py-3 rounded-t-xl font-bold transition-colors whitespace-nowrap ${activeTab === "products"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        Ürünler
                    </button>
                    <button
                        onClick={() => setActiveTab("categories")}
                        className={`px-6 py-3 rounded-t-xl font-bold transition-colors whitespace-nowrap ${activeTab === "categories"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        Kategoriler
                    </button>
                    <button
                        onClick={() => setActiveTab("branches")}
                        className={`px-6 py-3 rounded-t-xl font-bold transition-colors whitespace-nowrap ${activeTab === "branches"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        Şubeler
                    </button>
                    <button
                        onClick={() => setActiveTab("content")}
                        className={`px-6 py-3 rounded-t-xl font-bold transition-colors whitespace-nowrap ${activeTab === "content"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        İçerik Yönetimi
                    </button>
                    <button
                        onClick={() => setActiveTab("jobs")}
                        className={`px-6 py-3 rounded-t-xl font-bold transition-colors whitespace-nowrap ${activeTab === "jobs"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        İş İlanları
                    </button>
                    <button
                        onClick={() => setActiveTab("messages")}
                        className={`px-6 py-3 rounded-t-xl font-bold transition-colors whitespace-nowrap ${activeTab === "messages"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        Mesajlar
                    </button>
                    <button
                        onClick={() => setActiveTab("applications")}
                        className={`px-6 py-3 rounded-t-xl font-bold transition-colors whitespace-nowrap ${activeTab === "applications"
                            ? "bg-primary text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        Başvurular
                    </button>
                </div>

                {/* Products Tab */}
                {activeTab === "products" && (
                    // ... (Products content remains same)
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
                                            className="object-contain p-4"
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

                {/* Categories Tab */}
                {activeTab === "categories" && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                            <h3 className="text-xl font-bold text-white mb-6">Yeni Kategori Ekle</h3>
                            <form onSubmit={handleAddCategory} className="flex gap-4">
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Kategori Adı (örn: Tatlılar)"
                                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!newCategory.trim()}
                                    className="bg-primary hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2"
                                >
                                    <Plus size={20} />
                                    Ekle
                                </button>
                            </form>
                        </div>

                        <div className="space-y-4">
                            {categories.map((category) => (
                                <div
                                    key={category}
                                    className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center group hover:border-white/20 transition-colors"
                                >
                                    <span className="text-lg font-medium text-white">{category}</span>
                                    <button
                                        onClick={() => {
                                            if (confirm(`"${category}" kategorisini silmek istediğinize emin misiniz? Bu kategoriye ait ürünler silinmez ancak kategorisiz kalabilirler.`)) {
                                                deleteCategory(category);
                                            }
                                        }}
                                        className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={20} />
                                    </button>
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
                                        {branch.map_url && (
                                            <a
                                                href={branch.map_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="pl-7 text-primary hover:underline text-sm block mt-1"
                                            >
                                                Haritada Göster
                                            </a>
                                        )}
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



                {/* Jobs Tab */}
                {activeTab === "jobs" && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                            <h3 className="text-xl font-bold text-white mb-6">Yeni İş İlanı Ekle</h3>
                            <form onSubmit={handleAddJob} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Pozisyon Adı (örn: Mutfak Şefi)"
                                        required
                                        value={newJob.title}
                                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Konum (örn: Kadıköy)"
                                        required
                                        value={newJob.location}
                                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Çalışma Tipi (örn: Tam Zamanlı)"
                                        required
                                        value={newJob.type}
                                        onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                    />
                                    <select
                                        value={newJob.isActive ? "active" : "inactive"}
                                        onChange={(e) => setNewJob({ ...newJob, isActive: e.target.value === "active" })}
                                        className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="active">Aktif</option>
                                        <option value="inactive">Pasif</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="İş Tanımı"
                                    required
                                    rows={3}
                                    value={newJob.description}
                                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary resize-none"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all duration-300"
                                >
                                    İlanı Yayınla
                                </button>
                            </form>
                        </div>

                        <div className="space-y-4">
                            {jobPostings.map((job) => (
                                <div key={job.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{job.title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${job.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                                                {job.isActive ? "Aktif" : "Pasif"}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-1">{job.location} • {job.type}</p>
                                        <p className="text-gray-500 text-sm">{job.description}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (confirm("Bu ilanı silmek istediğinize emin misiniz?")) deleteJobPosting(job.id);
                                        }}
                                        className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages Tab */}
                {activeTab === "messages" && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {messages.length === 0 ? (
                            <div className="text-center py-12 text-gray-400 bg-white/5 rounded-2xl border border-white/10">
                                Henüz mesaj bulunmamaktadır.
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{msg.subject}</h3>
                                            <p className="text-primary font-medium">{msg.name}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500">
                                                {new Date(msg.date).toLocaleDateString("tr-TR")}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    if (confirm("Bu mesajı silmek istediğinize emin misiniz?")) deleteMessage(msg.id);
                                                }}
                                                className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <span className="text-sm text-gray-500 block mb-1">E-posta</span>
                                        <a href={`mailto:${msg.email}`} className="text-white hover:text-primary transition-colors">
                                            {msg.email}
                                        </a>
                                    </div>
                                    <div className="bg-black/30 p-4 rounded-xl text-gray-300 text-sm leading-relaxed">
                                        {msg.message}
                                    </div>
                                </div>
                            ))
                        )}
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
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-white">{app.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${app.type === 'franchise'
                                    ? "bg-purple-500/20 text-purple-500"
                                    : "bg-blue-500/20 text-blue-500"
                                    }`}>
                                    {app.type === 'franchise' ? "Franchise" : "İş Başvurusu"}
                                </span>
                            </div>
                            <p className="text-primary font-medium">{app.position || "Franchise Adayı"}</p>
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
                        {app.type === 'franchise' && (
                            <>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Lokasyon</span>
                                    {app.location}
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Bütçe</span>
                                    {app.budget}
                                </div>
                            </>
                        )}
                    </div>
                    <div>
                        <span className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
                            {app.type === 'franchise' ? "Eklemek İstedikleri" : "Ön Yazı"}
                        </span>
                        <p className="text-gray-300 bg-black/30 p-4 rounded-xl text-sm leading-relaxed">
                            {app.message}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
