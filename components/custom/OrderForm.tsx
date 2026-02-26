"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ShoppingBag, Loader2, Star, CheckCircle2 } from "lucide-react";
import type { SelectedIngredient } from "./BurgerBuilder";

interface Props {
    selections: SelectedIngredient[];
    totalPrice: number;
    totalCalories: number;
    tableNumber: number;
    onBack: () => void;
    onSubmit: (name: string, phone: string, notes: string, saveAsFavorite: boolean, favoriteName: string) => void;
    submitting: boolean;
}

export default function OrderForm({
    selections,
    totalPrice,
    totalCalories,
    tableNumber,
    onBack,
    onSubmit,
    submitting,
}: Props) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [saveAsFavorite, setSaveAsFavorite] = useState(true);
    const [favoriteName, setFavoriteName] = useState("");
    const [acceptedKvkk, setAcceptedKvkk] = useState(false);

    // KVK only required when user provides personal info
    const hasPersonalInfo = name.trim().length > 0 || phone.trim().length > 0;
    const kvkkRequired = hasPersonalInfo && !acceptedKvkk;

    // Group selections by category
    const grouped = selections.reduce((acc, sel) => {
        if (!acc[sel.categoryName]) acc[sel.categoryName] = [];
        acc[sel.categoryName].push(sel);
        return acc;
    }, {} as Record<string, SelectedIngredient[]>);

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-xl text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-lg font-bold text-white">Sipariş Özeti</h2>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-6 pb-40 space-y-6">
                {/* Table info */}
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">
                        🪑
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Masa Numarası</p>
                        <p className="text-2xl font-bold text-primary">{tableNumber}</p>
                    </div>
                </div>

                {/* Burger summary */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/5">
                        <h3 className="font-bold text-white text-base">🍔 Custom Burger</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {Object.entries(grouped).map(([category, items]) => (
                            <div key={category} className="p-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                    {category}
                                </p>
                                {items.map((item) => (
                                    <div
                                        key={item.ingredient.id}
                                        className="flex justify-between items-center py-1"
                                    >
                                        <span className="text-white text-sm">
                                            {item.ingredient.name}
                                            {item.quantity > 1 && (
                                                <span className="text-gray-500 ml-1">
                                                    x{item.quantity}
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {item.ingredient.price * item.quantity > 0
                                                ? `₺${(item.ingredient.price * item.quantity).toFixed(2)}`
                                                : "Dahil"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="p-4 bg-white/5 border-t border-white/10">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Toplam Kalori</span>
                            <span className="text-white font-medium">
                                {totalCalories} kcal
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-white font-bold text-lg">Toplam</span>
                            <span className="text-primary font-bold text-xl">
                                ₺{totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Customer info */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                    <h3 className="font-bold text-white text-base">
                        Bilgileriniz <span className="text-gray-500 text-xs font-normal">(isteğe bağlı)</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Adınız"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                        />
                        <input
                            type="tel"
                            placeholder="Telefon"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    {/* Multi-favorite features */}
                    <AnimatePresence>
                        {phone.length >= 10 && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-4 overflow-hidden"
                            >
                                <button
                                    onClick={() => setSaveAsFavorite(!saveAsFavorite)}
                                    className="flex items-center gap-3 w-full text-left"
                                >
                                    <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${saveAsFavorite ? 'bg-primary text-white' : 'bg-white/5 border border-white/10 text-transparent'}`}>
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <span className="text-sm font-bold text-white">Bu burgeri favorilerime ekle 🌟</span>
                                </button>

                                {saveAsFavorite && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-1"
                                    >
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Burgerine İsim Ver</label>
                                        <input
                                            type="text"
                                            placeholder="Örn: Hafta Sonu Burgeri"
                                            value={favoriteName}
                                            onChange={(e) => setFavoriteName(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 outline-none focus:border-primary transition-colors text-sm"
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <textarea
                        placeholder="Özel notlarınız (az pişmiş, acısız vb.)"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary resize-none transition-colors"
                    />

                    {/* KVKK Compliance - only shown when personal info is entered */}
                    <AnimatePresence>
                        {hasPersonalInfo && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 border-t border-white/5">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center pt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={acceptedKvkk}
                                                onChange={(e) => setAcceptedKvkk(e.target.checked)}
                                                className="peer h-5 w-5 appearance-none rounded-md border border-white/20 bg-white/5 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                            />
                                            <CheckCircle2
                                                size={14}
                                                className="absolute left-1 opacity-0 peer-checked:opacity-100 text-white transition-opacity pointer-events-none"
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                                            <span className="text-white font-medium">KVKK Aydınlatma Metni'ni</span> okudum ve kişisel verilerimin bu kapsamda işlenmesini kabul ediyorum.
                                        </span>
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Submit button - fixed bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 p-4 z-50">
                <div className="max-w-lg mx-auto">
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            if (kvkkRequired) {
                                alert("Kişisel bilgi girdiniz. Devam etmek için lütfen KVKK Aydınlatma Metni'ni kabul etmelisiniz.");
                                return;
                            }
                            onSubmit(name, phone, notes, saveAsFavorite, favoriteName);
                        }}
                        disabled={submitting}
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-2xl text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-3"
                    >
                        {submitting ? (
                            <>
                                <Loader2 size={22} className="animate-spin" />
                                Sepete Ekleniyor...
                            </>
                        ) : (
                            <>
                                <ShoppingBag size={20} />
                                Sepete Ekle • ₺{totalPrice.toFixed(2)}
                            </>
                        )}
                    </motion.button>
                    <p className="text-center text-xs text-gray-600 mt-2">
                        Ödeme yemek sonrası kasada yapılacaktır.
                    </p>
                </div>
            </div>
        </div>
    );
}
