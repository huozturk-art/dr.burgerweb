"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
    Search, Phone, User, Beef, ChevronRight,
    PlusCircle, ShoppingCart, Loader2, Info, CheckCircle, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SavedBurger {
    id: string;
    phone: string;
    burger_name: string;
    ingredients_json: any; // Array of items
    total_price: number;
    created_at: string;
}

export default function CustomerFavoritesPage() {
    const [searchPhone, setSearchPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SavedBurger[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [orderingBurger, setOrderingBurger] = useState<SavedBurger | null>(null);
    const [orderForm, setOrderForm] = useState({
        customerName: "",
        tableNumber: "TEL", // Default for call-in orders
        notes: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchPhone || searchPhone.length < 3) return;

        setLoading(true);
        setHasSearched(true);
        try {
            const { data, error } = await supabase
                .from("saved_burgers")
                .select("*")
                .ilike("phone", `%${searchPhone}%`)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setResults(data || []);
        } catch (error) {
            console.error("Search error:", error);
            alert("Arama sırasında bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrder = async () => {
        if (!orderingBurger) return;

        setSubmitting(true);
        try {
            const orderNumber = `CB-${new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 12)}-${Math.floor(Math.random() * 1000)}`;

            // 1. Create the main order
            const { data: order, error: orderError } = await supabase
                .from("custom_orders")
                .insert([{
                    order_number: orderNumber,
                    table_number: orderForm.tableNumber === "TEL" ? 0 : (orderForm.tableNumber === "PAKET" ? 99 : parseInt(orderForm.tableNumber)),
                    customer_name: orderForm.customerName || "Telefon Müşterisi",
                    customer_phone: orderingBurger.phone,
                    notes: `[TEL SİPARİŞİ] ${orderForm.notes}`,
                    total_price: orderingBurger.total_price || 0,
                    status: "confirmed",
                }])
                .select()
                .single();

            if (orderError) throw orderError;

            // 2. Create the burger entry
            const { data: burger, error: burgerError } = await supabase
                .from("order_burgers")
                .insert([{
                    order_id: order.id,
                    burger_name: orderingBurger.burger_name || "Özel Burger",
                    total_price: orderingBurger.total_price || 0,
                }])
                .select()
                .single();

            if (burgerError) throw burgerError;

            // 3. Create ingredients
            const ingredientItems = orderingBurger.ingredients_json.map((ing: any) => ({
                order_burger_id: burger.id,
                ingredient_id: ing.ingredient_id,
                ingredient_name: ing.name,
                quantity: ing.quantity || 1,
                unit_price: 0 // In saved_burgers we don't store historical prices, or we can look them up. Let's set 0 or skip price per ingredient for manual load.
            }));

            const { error: ingError } = await supabase
                .from("burger_ingredients")
                .insert(ingredientItems);

            if (ingError) throw ingError;

            setOrderSuccess(orderNumber);
            setOrderingBurger(null);
            setOrderForm({ customerName: "", tableNumber: "TEL", notes: "" });
        } catch (error) {
            console.error("Order error:", error);
            alert("Sipariş oluşturulurken hata oluştu.");
        } finally {
            setSubmitting(false);
        }
    };

    const deleteFavorite = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Bu favori tasarımı silmek istediğinize emin misiniz?")) return;

        try {
            const { error } = await supabase
                .from("saved_burgers")
                .delete()
                .eq("id", id);

            if (error) throw error;
            setResults(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            console.error("Delete error:", error);
            alert("Silme işlemi başarısız oldu.");
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <User className="text-primary" size={32} />
                    Müşteri Favorileri & Telefon Siparişi
                </h1>
                <p className="text-gray-400 mt-2">Telefonla arayan müşterinin numarasını sorgulayın ve hızlıca sipariş oluşturun.</p>
            </header>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-12">
                <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={24} />
                    <input
                        type="text"
                        placeholder="Müşteri telefon numarası girin (örn: 0555...)"
                        value={searchPhone}
                        onChange={(e) => setSearchPhone(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-4 py-6 text-2xl text-white focus:outline-none focus:border-primary transition-all placeholder:text-gray-600"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={loading || searchPhone.length < 3}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary hover:bg-orange-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                        Sorgula
                    </button>
                </div>
            </form>

            <AnimatePresence mode="wait">
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center py-20 gap-4"
                    >
                        <Loader2 className="text-primary animate-spin" size={48} />
                        <p className="text-gray-400">Favoriler getiriliyor...</p>
                    </motion.div>
                ) : hasSearched && results.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl"
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-white">Sonuç Bulunamadı</h3>
                        <p className="text-gray-500 mt-2">Bu numara ile kayıtlı bir favori burger bulunmuyor.</p>
                    </motion.div>
                ) : results.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {results.map((burger) => (
                            <div
                                key={burger.id}
                                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-primary/30 transition-all flex flex-col"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <Beef className="text-primary" size={20} />
                                                {burger.burger_name || "İsimsiz Burger"}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">Kayıt: {new Date(burger.created_at).toLocaleDateString("tr-TR")}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="text-right">
                                                <p className="text-primary font-black text-xl">₺{burger.total_price}</p>
                                            </div>
                                            <button
                                                onClick={(e) => deleteFavorite(burger.id, e)}
                                                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                                title="Sil"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1 mb-6">
                                        {burger.ingredients_json?.map((ing: any, idx: number) => (
                                            <div key={idx} className="text-sm text-gray-400 flex justify-between">
                                                <span>• {ing.name} {ing.quantity > 1 ? `x${ing.quantity}` : ""}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => setOrderingBurger(burger)}
                                    className="mt-auto w-full bg-white/10 hover:bg-primary text-white font-bold py-4 flex items-center justify-center gap-2 transition-all group"
                                >
                                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                                    Bu Burgerle Sipariş Oluştur
                                </button>
                            </div>
                        ))}
                    </motion.div>
                ) : null}
            </AnimatePresence>

            {/* Order Finalization Modal */}
            <AnimatePresence>
                {orderingBurger && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setOrderingBurger(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-lg p-8 relative shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                <PlusCircle className="text-primary" size={24} />
                                Manuel Sipariş Oluştur
                            </h2>
                            <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-white/5">
                                <strong className="text-white">{orderingBurger.burger_name}</strong> tasarımı için detayları girin.
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Müşteri Adı (Opsiyonel)</label>
                                    <input
                                        type="text"
                                        placeholder="Müşteri ismi..."
                                        value={orderForm.customerName}
                                        onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Masa No / Tip</label>
                                        <select
                                            value={orderForm.tableNumber}
                                            onChange={(e) => setOrderForm({ ...orderForm, tableNumber: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all"
                                        >
                                            <option value="TEL">📞 Telefon Siparisi</option>
                                            <option value="PAKET">🥡 Paket Servis</option>
                                            {[...Array(20)].map((_, i) => (
                                                <option key={i + 1} value={i + 1}>Masa {i + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-center">
                                            <span className="text-xs text-primary font-bold uppercase block">Toplam</span>
                                            <span className="text-white font-black">₺{orderingBurger.total_price}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Mutfak Notu</label>
                                    <textarea
                                        placeholder="Özel istekler, adres tarifi vb..."
                                        value={orderForm.notes}
                                        onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-all h-24 resize-none"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setOrderingBurger(null)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-2xl transition-all"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={handleCreateOrder}
                                        disabled={submitting}
                                        className="flex-[2] bg-primary hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                        Siparişi Gönder
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Success Notification */}
            <AnimatePresence>
                {orderSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 z-[200] bg-zinc-900 border border-green-500/30 rounded-2xl p-6 shadow-2xl flex items-center gap-4 max-w-md"
                    >
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500">
                            <CheckCircle size={28} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Sipariş Oluşturuldu!</h4>
                            <p className="text-sm text-gray-400 mt-1">Sipariş <strong>{orderSuccess}</strong> koduyla mutfak ekranına iletildi.</p>
                            <button
                                onClick={() => setOrderSuccess(null)}
                                className="mt-2 text-xs font-bold text-primary hover:underline uppercase tracking-widest"
                            >
                                Tamam
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
