"use client";

import { useCart } from "@/context/CartContext";
import { useTable } from "@/context/TableContext";
import { useData } from "@/context/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, CreditCard, Utensils, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import SectionTitle from "@/components/SectionTitle";

export default function CartPage() {
    const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();
    const { tableNumber, branchId } = useTable();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [acceptedKvkk, setAcceptedKvkk] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // KVK only required when user gives personal info
    const hasPersonalInfo = customerName.trim().length > 0 || customerPhone.trim().length > 0;
    const kvkkRequired = hasPersonalInfo && !acceptedKvkk;

    const handleSubmitOrder = async () => {
        if (submitting || items.length === 0) return;
        setSubmitting(true);

        try {
            // 1. Generate order number
            const now = new Date();
            const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${(now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()).toString().slice(-4)}`;
            const randomNum = Math.floor(Math.random() * 900) + 100;
            const orderNumber = `DRB-${dateStr}-${randomNum}`;

            // 2. Create the main order
            const { data: order, error: orderErr } = await supabase
                .from("custom_orders")
                .insert({
                    order_number: orderNumber,
                    branch_id: branchId || null,
                    table_number: tableNumber || 0,
                    customer_name: customerName || null,
                    customer_phone: customerPhone || null,
                    total_price: totalPrice,
                    status: "pending",
                })
                .select()
                .single();

            if (orderErr) throw orderErr;

            // 3. Create order items (order_burgers acts as order_items)
            for (const item of items) {
                const { data: orderItem, error: itemErr } = await supabase
                    .from("order_burgers")
                    .insert({
                        order_id: order.id,
                        burger_name: item.isCustom ? item.burgerName : item.name,
                        product_id: item.isCustom ? null : item.productId,
                        is_custom: item.isCustom,
                        total_price: item.price * item.quantity,
                    })
                    .select()
                    .single();

                if (itemErr) throw itemErr;

                // 4. If custom, save ingredients
                if (item.isCustom && item.customSelections) {
                    const ingredientRows = item.customSelections.map((s) => ({
                        order_burger_id: orderItem.id,
                        ingredient_id: s.ingredient.id,
                        ingredient_name: s.ingredient.name,
                        quantity: s.quantity,
                        unit_price: s.ingredient.price,
                    }));

                    const { error: ingErr } = await supabase
                        .from("burger_ingredients")
                        .insert(ingredientRows);

                    if (ingErr) throw ingErr;
                }
            }

            setOrderSuccess(orderNumber);
            clearCart();
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Sipariş verilirken bir hata oluştu.");
        } finally {
            setSubmitting(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-black pt-32 pb-20 px-4">
                <div className="max-w-md mx-auto text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
                    >
                        <div className="text-7xl mb-6">🎯</div>
                        <h2 className="text-3xl font-bold text-white mb-2 text-balance">Siparişiniz Tamamlandı!</h2>
                        <p className="text-gray-400 mb-8 text-balance">Mutfak ekibimiz hemen hazırlamaya başladı. Afiyet olsun!</p>

                        <div className="bg-black/30 rounded-2xl p-6 mb-8 border border-white/5">
                            <p className="text-sm text-gray-500 mb-1">Sipariş No</p>
                            <p className="text-3xl font-black text-primary mb-4 tracking-wider">{orderSuccess}</p>
                            <div className="h-px bg-white/5 w-full mb-4" />
                            <div className="flex justify-between items-center text-gray-400">
                                <span className="text-sm">Masa No</span>
                                <span className="text-white font-bold text-xl">{mounted ? (tableNumber || "-") : ""}</span>
                            </div>
                        </div>

                        <Link href="/menu">
                            <button className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-5 rounded-2xl text-lg hover:shadow-[0_0_30px_rgba(255,107,0,0.3)] transition-all">
                                Menüye Dön
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-32 pb-40 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <Link href="/menu">
                        <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                    </Link>
                    <SectionTitle title="Sepetim" subtitle={`${totalItems} Ürün`} />
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <div className="text-6xl mb-6 grayscale opacity-50">🛒</div>
                        <h2 className="text-2xl font-bold text-white mb-4">Sepetiniz Boş</h2>
                        <p className="text-gray-400 mb-8 max-w-xs mx-auto">Sepetinizde ürün bulunmuyor. Harika lezzetlerimiz için menüye göz atın!</p>
                        <Link href="/menu">
                            <button className="bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-primary/90 transition-all">
                                Menüye Git
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Cart Items */}
                        <div className="space-y-4">
                            {items.map((item) => (
                                <motion.div
                                    layout
                                    key={item.id}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 group"
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Image */}
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black/40 rounded-xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.image || "/images/burger-placeholder.png"}
                                                alt={item.name}
                                                className="w-full h-full object-contain p-1.5"
                                            />
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="text-base font-bold text-white leading-tight break-words group-hover:text-primary transition-colors">
                                                        {item.isCustom ? item.burgerName : item.name}
                                                    </h3>
                                                    {item.isCustom && (
                                                        <p className="text-xs text-primary font-medium mt-0.5">Özel Tasarım 👌</p>
                                                    )}
                                                    <p className="text-gray-500 text-sm mt-1">₺{item.price.toFixed(2)}</p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-600 hover:text-red-500 p-1.5 transition-colors flex-shrink-0"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex justify-between items-center mt-3">
                                                <div className="flex items-center gap-2 bg-black/40 rounded-xl p-1 border border-white/5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="p-1.5 hover:text-primary text-gray-400 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-white font-bold w-5 text-center text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="p-1.5 hover:text-primary text-gray-400 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className="text-white font-black text-sm">₺{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Customer Information & KVKK */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden group/kvkk">
                            <div className="absolute top-0 right-0 p-4 opacity-5 bg-white/10 rounded-bl-3xl">
                                <User size={40} />
                            </div>
                            <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                <Utensils size={18} className="text-primary" />
                                Sipariş Bilgileri
                                <span className="text-gray-500 text-xs font-normal">(isteğe bağlı)</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Adınız (Örn: Ahmet)"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                />
                                <input
                                    type="tel"
                                    placeholder="Telefon (Örn: 0555...)"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                                />
                            </div>

                            {/* KVK only shown when personal info is entered */}
                            <AnimatePresence>
                                {hasPersonalInfo && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-2">
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <div className="relative flex items-center pt-0.5">
                                                    <input
                                                        type="checkbox"
                                                        checked={acceptedKvkk}
                                                        onChange={(e) => setAcceptedKvkk(e.target.checked)}
                                                        className="peer h-5 w-5 appearance-none rounded-md border border-white/20 bg-white/5 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                                    />
                                                    <div className="absolute left-1 opacity-0 peer-checked:opacity-100 text-white transition-opacity pointer-events-none">
                                                        <Plus size={14} />
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                                                    <span className="text-white font-medium underline">KVKK Aydınlatma Metni'ni</span> okudum ve kişisel verilerimin işlenmesini kabul ediyorum.
                                                </span>
                                            </label>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Card */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-400">
                                    <span>Ara Toplam</span>
                                    <span>₺{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Masa No</span>
                                    <span className="text-white font-bold">{mounted ? (tableNumber || "Seçilmedi") : ""}</span>
                                </div>
                                <div className="h-px bg-white/10" />
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-white">Toplam</span>
                                    <span className="text-3xl font-black text-primary underline decoration-primary/30 decoration-4 underline-offset-8">₺{totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {!tableNumber && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                                        ⚠️
                                    </div>
                                    <p className="text-red-500 text-sm font-medium">Lütfen sipariş için masa numaranızı seçin.</p>
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    if (kvkkRequired) {
                                        alert("Kişisel bilgi girdiniz. Devam etmek için lütfen KVKK metnini onaylayın.");
                                        return;
                                    }
                                    handleSubmitOrder();
                                }}
                                disabled={submitting || (mounted && !tableNumber)}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-5 rounded-2xl text-xl hover:shadow-[0_10px_40px_rgba(255,107,0,0.4)] transition-all disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-3 relative overflow-hidden group"
                            >
                                {submitting ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        <Utensils size={24} />
                                        <span>Siparişi Onayla</span>
                                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-gray-500 text-xs mt-4">Siparişiniz mutfağa iletilecektir.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
