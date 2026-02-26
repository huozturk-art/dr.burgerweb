"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, Plus, Minus, X, Info, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import type { CategoryWithIngredients, Ingredient } from "@/app/custom/page";
import IngredientCard from "./IngredientCard";
import BurgerPreview from "./BurgerPreview";
import OrderForm from "./OrderForm";

export interface SelectedIngredient {
    ingredient: Ingredient;
    quantity: number;
    categoryName: string;
}

interface BurgerInProgress {
    selections: Map<string, SelectedIngredient[]>; // category_id -> selections
}

interface Props {
    categories: CategoryWithIngredients[];
    tableNumber: number;
    branchId?: string;
}

export default function BurgerBuilder({ categories, tableNumber, branchId }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [burger, setBurger] = useState<BurgerInProgress>({
        selections: new Map(),
    });
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
    const [showAllergenInfo, setShowAllergenInfo] = useState<string | null>(null);
    const [showFavoriteModal, setShowFavoriteModal] = useState(false);
    const [favoritePhone, setFavoritePhone] = useState("");
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    const [favoriteError, setFavoriteError] = useState<string | null>(null);
    const [savedBurgers, setSavedBurgers] = useState<any[]>([]);
    const [selectionMode, setSelectionMode] = useState(false); // phone input vs list selection

    const totalSteps = categories.length;
    const currentCategory = categories[currentStep];

    // Calculate totals
    const calculateTotal = useCallback(() => {
        let total = 0;
        burger.selections.forEach((items) => {
            items.forEach((item) => {
                total += item.ingredient.price * item.quantity;
            });
        });
        return total;
    }, [burger.selections]);

    const getTotalCalories = useCallback(() => {
        let total = 0;
        burger.selections.forEach((items) => {
            items.forEach((item) => {
                total += item.ingredient.calories * item.quantity;
            });
        });
        return total;
    }, [burger.selections]);

    // Get all selected ingredients flat
    const getAllSelections = useCallback((): SelectedIngredient[] => {
        const all: SelectedIngredient[] = [];
        burger.selections.forEach((items) => {
            all.push(...items);
        });
        return all;
    }, [burger.selections]);

    // Select / deselect ingredient
    const toggleIngredient = (ingredient: Ingredient, categoryId: string) => {
        setBurger((prev) => {
            const newSelections = new Map(prev.selections);
            const categorySelections = newSelections.get(categoryId) || [];
            const existing = categorySelections.find(
                (s) => s.ingredient.id === ingredient.id
            );
            const category = categories.find((c) => c.id === categoryId);

            if (existing) {
                // Remove
                newSelections.set(
                    categoryId,
                    categorySelections.filter((s) => s.ingredient.id !== ingredient.id)
                );
            } else {
                // Check max_select
                if (category && categorySelections.length >= category.max_select) {
                    // Replace the last one if at max
                    const updated = [...categorySelections.slice(0, -1), {
                        ingredient,
                        quantity: 1,
                        categoryName: category.name,
                    }];
                    newSelections.set(categoryId, updated);
                } else {
                    newSelections.set(categoryId, [
                        ...categorySelections,
                        { ingredient, quantity: 1, categoryName: category?.name || "" },
                    ]);
                }
            }

            return { ...prev, selections: newSelections };
        });
    };

    // Update quantity
    const updateQuantity = (ingredientId: string, categoryId: string, delta: number) => {
        setBurger((prev) => {
            const newSelections = new Map(prev.selections);
            const categorySelections = newSelections.get(categoryId) || [];
            const updated = categorySelections
                .map((s) => {
                    if (s.ingredient.id === ingredientId) {
                        const newQty = s.quantity + delta;
                        return newQty > 0 ? { ...s, quantity: newQty } : null;
                    }
                    return s;
                })
                .filter(Boolean) as SelectedIngredient[];
            newSelections.set(categoryId, updated);
            return { ...prev, selections: newSelections };
        });
    };

    // Validate current step
    const isStepValid = () => {
        if (!currentCategory) return true;
        const selections = burger.selections.get(currentCategory.id) || [];
        if (currentCategory.is_required && selections.length < currentCategory.min_select) {
            return false;
        }
        return true;
    };

    // Can proceed to next?
    const canGoNext = () => isStepValid();

    // Navigate
    const goNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep((s) => s + 1);
        } else {
            setShowOrderForm(true);
        }
    };

    const goBack = () => {
        if (showOrderForm) {
            setShowOrderForm(false);
        } else if (currentStep > 0) {
            setCurrentStep((s) => s - 1);
        }
    };

    // Load favorite burger
    const searchFavorites = async () => {
        if (!favoritePhone || favoritePhone.length < 10) {
            setFavoriteError("Lütfen geçerli bir telefon numarası girin.");
            return;
        }

        setLoadingFavorite(true);
        setFavoriteError(null);

        try {
            const { data, error } = await supabase
                .from("saved_burgers")
                .select("*")
                .eq("phone", favoritePhone)
                .order("created_at", { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                setFavoriteError("Bu numaraya ait kayıtlı burger bulunamadı.");
                return;
            }

            if (data.length === 1) {
                applyBurgerTemplate(data[0]);
            } else {
                setSavedBurgers(data);
                setSelectionMode(true);
            }
        } catch (error) {
            console.error("Error searching favorites:", error);
            setFavoriteError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoadingFavorite(false);
        }
    };

    const applyBurgerTemplate = (savedBurger: any) => {
        if (savedBurger && savedBurger.ingredients_json) {
            const ingredientsJson = savedBurger.ingredients_json as any[];
            const newSelections = new Map<string, SelectedIngredient[]>();

            ingredientsJson.forEach((item: any) => {
                const category = categories.find(c => c.name === item.category);
                const ingredient = category?.ingredients.find(i => i.id === item.ingredient_id);

                if (category && ingredient) {
                    const current = newSelections.get(category.id) || [];
                    newSelections.set(category.id, [
                        ...current,
                        {
                            ingredient,
                            quantity: item.quantity,
                            categoryName: category.name
                        }
                    ]);
                }
            });

            setBurger({ selections: newSelections });
            setShowFavoriteModal(false);
            setSelectionMode(false);
            setShowOrderForm(true); // Jump to summary
            alert(`${savedBurger.burger_name || "Burgeriniz"} yüklendi! 🍔`);
        }
    };

    // Load favorite burger
    const loadFavorite = async () => {
        if (!favoritePhone || favoritePhone.length < 10) {
            setFavoriteError("Lütfen geçerli bir telefon numarası girin.");
            return;
        }

        setLoadingFavorite(true);
        setFavoriteError(null);

        try {
            const { data, error } = await supabase
                .from("saved_burgers")
                .select("*")
                .eq("phone", favoritePhone)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();

            if (error) {
                if (error.code === "PGRST116") {
                    setFavoriteError("Bu numaraya ait kayıtlı burger bulunamadı.");
                } else {
                    throw error;
                }
                return;
            }

            if (data && data.ingredients_json) {
                const ingredientsJson = data.ingredients_json as any[];
                const newSelections = new Map<string, SelectedIngredient[]>();

                // Reconstruct selections from JSON
                ingredientsJson.forEach((item: any) => {
                    const category = categories.find(c => c.name === item.category);
                    const ingredient = category?.ingredients.find(i => i.id === item.ingredient_id);

                    if (category && ingredient) {
                        const current = newSelections.get(category.id) || [];
                        newSelections.set(category.id, [
                            ...current,
                            {
                                ingredient,
                                quantity: item.quantity,
                                categoryName: category.name
                            }
                        ]);
                    }
                });

                setBurger({ selections: newSelections });
                setShowFavoriteModal(false);
                setShowOrderForm(true); // Jump to summary
                alert("Favori burgeriniz yüklendi! 🍔");
            }
        } catch (error) {
            console.error("Error loading favorite:", error);
            setFavoriteError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setLoadingFavorite(false);
        }
    };

    // Submit order
    const submitOrder = async (customerName: string, customerPhone: string, notes: string, saveAsFavorite: boolean, favoriteName: string) => {
        if (submitting) return;
        setSubmitting(true);

        try {
            // Generate order number
            const now = new Date();
            const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${(now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()).toString().slice(-4)}`;
            const randomNum = Math.floor(Math.random() * 900) + 100;
            const orderNumber = `CB-${dateStr}-${randomNum}`;

            const totalPrice = calculateTotal();

            // 1. Create order
            const { data: order, error: orderErr } = await supabase
                .from("custom_orders")
                .insert({
                    order_number: orderNumber,
                    branch_id: branchId || null,
                    table_number: tableNumber,
                    customer_name: customerName || null,
                    customer_phone: customerPhone || null,
                    notes: notes || null,
                    total_price: totalPrice,
                    status: "pending",
                })
                .select()
                .single();

            if (orderErr) {
                console.error("Order Insert Error:", orderErr);
                throw new Error("Sipariş ana kaydı oluşturulamadı.");
            }

            // 2. Create burger
            const { data: burgerData, error: burgerErr } = await supabase
                .from("order_burgers")
                .insert({
                    order_id: order.id,
                    burger_name: "Custom Burger",
                    total_price: totalPrice,
                })
                .select()
                .single();

            if (burgerErr) {
                console.error("Burger Insert Error:", burgerErr);
                throw new Error("Burger detayı oluşturulamadı.");
            }

            // 3. Create burger ingredients
            const allSelections = getAllSelections();
            if (allSelections.length > 0) {
                const ingredientRows = allSelections.map((s) => ({
                    order_burger_id: burgerData.id,
                    ingredient_id: s.ingredient.id,
                    ingredient_name: s.ingredient.name,
                    quantity: s.quantity,
                    unit_price: s.ingredient.price,
                }));

                const { error: ingErr } = await supabase
                    .from("burger_ingredients")
                    .insert(ingredientRows);

                if (ingErr) {
                    console.error("Ingredients Insert Error:", ingErr);
                    throw new Error("Malzeme detayları kaydedilemedi.");
                }
            }

            // 4. Save to favorites if requested
            if (saveAsFavorite && customerPhone && customerPhone.length >= 10) {
                const ingredientsJson = allSelections.map(s => ({
                    ingredient_id: s.ingredient.id,
                    name: s.ingredient.name,
                    category: s.categoryName,
                    quantity: s.quantity
                }));

                await supabase
                    .from("saved_burgers")
                    .insert({
                        phone: customerPhone,
                        ingredients_json: ingredientsJson,
                        total_price: totalPrice,
                        burger_name: favoriteName || `${customerName || "Misafir"}'in Burgeri`
                    });
            }

            // Success!
            console.log("Order submitted successfully:", orderNumber);
            setOrderSuccess(orderNumber);
        } catch (error: any) {
            console.error("Order error detail:", error);
            alert(error.message || "Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setSubmitting(false);
        }
    };

    // Order success screen
    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="text-7xl mb-4"
                    >
                        ✅
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Siparişiniz Alındı!
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Siparişiniz mutfağa iletildi. Lütfen masanızda bekleyin.
                    </p>
                    <div className="bg-black/30 rounded-2xl p-4 mb-6">
                        <p className="text-sm text-gray-500 mb-1">Sipariş Numarası</p>
                        <p className="text-2xl font-bold text-primary">{orderSuccess}</p>
                        <div className="flex justify-between mt-3 text-sm">
                            <span className="text-gray-500">Masa</span>
                            <span className="text-white font-bold">{tableNumber}</span>
                        </div>
                        <div className="flex justify-between mt-1 text-sm">
                            <span className="text-gray-500">Toplam</span>
                            <span className="text-primary font-bold">₺{calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setOrderSuccess(null);
                            setBurger({ selections: new Map() });
                            setCurrentStep(0);
                            setShowOrderForm(false);
                        }}
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-2xl text-lg transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                    >
                        Yeni Burger Yap 🍔
                    </button>
                </motion.div>
            </div>
        );
    }

    // Order form
    if (showOrderForm) {
        return (
            <OrderForm
                selections={getAllSelections()}
                totalPrice={calculateTotal()}
                totalCalories={getTotalCalories()}
                tableNumber={tableNumber}
                onBack={goBack}
                onSubmit={submitOrder}
                submitting={submitting}
            />
        );
    }

    // Main builder
    const currentSelections = burger.selections.get(currentCategory?.id || "") || [];

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-lg mx-auto px-4 py-3">
                    {/* Progress bar */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-500">Masa {tableNumber}</span>
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <span className="text-xs text-gray-500">
                            {currentStep + 1}/{totalSteps}
                        </span>
                    </div>

                    {/* Category header */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={goBack}
                            disabled={currentStep === 0}
                            className="p-2 rounded-xl text-gray-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="text-center flex-1">
                            <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                                <span>{currentCategory?.icon}</span>
                                <span>{currentCategory?.name} Seç</span>
                            </h2>
                        </div>
                        <div className="w-10" />
                    </div>

                    {/* Pro Favorite Banner */}
                    {currentStep === 0 && (
                        <motion.button
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            onClick={() => setShowFavoriteModal(true)}
                            className="mt-4 w-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-4 flex items-center justify-between group hover:border-primary/50 transition-all"
                        >
                            <div className="flex items-center gap-3 text-left">
                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                    🌟
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Tekrar mı geldin?</p>
                                    <p className="text-xs text-gray-400">Favori burgerini saniyeler içinde yükle.</p>
                                </div>
                            </div>
                            <div className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                                Hızlı Yükle
                            </div>
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Burger preview - floating */}
            <BurgerPreview
                selections={getAllSelections()}
                totalPrice={calculateTotal()}
            />

            {/* Ingredients grid */}
            <div className="flex-1 max-w-lg mx-auto w-full px-4 pb-32 pt-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-2 gap-3"
                    >
                        {currentCategory?.ingredients.map((ingredient) => {
                            const selected = currentSelections.find(
                                (s) => s.ingredient.id === ingredient.id
                            );
                            return (
                                <IngredientCard
                                    key={ingredient.id}
                                    ingredient={ingredient}
                                    isSelected={!!selected}
                                    quantity={selected?.quantity || 0}
                                    onToggle={() =>
                                        toggleIngredient(ingredient, currentCategory.id)
                                    }
                                    onQuantityChange={(delta) =>
                                        updateQuantity(ingredient.id, currentCategory.id, delta)
                                    }
                                    onAllergenInfo={() => setShowAllergenInfo(ingredient.id)}
                                />
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5 p-4 z-50">
                <div className="max-w-lg mx-auto flex items-center gap-3">
                    {/* Price */}
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Toplam</p>
                        <p className="text-xl font-bold text-primary">
                            ₺{calculateTotal().toFixed(2)}
                        </p>
                    </div>

                    {/* Next button */}
                    <button
                        onClick={goNext}
                        disabled={!canGoNext()}
                        className="flex-1 bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-2xl text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {currentStep === totalSteps - 1 ? (
                            <>
                                <ShoppingBag size={20} />
                                Sipariş Özeti
                            </>
                        ) : (
                            <>
                                Sonraki
                                <ChevronRight size={20} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Allergen info modal */}
            <AnimatePresence>
                {showAllergenInfo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 flex items-end justify-center p-4"
                        onClick={() => setShowAllergenInfo(null)}
                    >
                        <motion.div
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 max-w-lg w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {(() => {
                                const ing = categories
                                    .flatMap((c) => c.ingredients)
                                    .find((i) => i.id === showAllergenInfo);
                                if (!ing) return null;
                                return (
                                    <>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-bold text-white">
                                                {ing.name}
                                            </h3>
                                            <button
                                                onClick={() => setShowAllergenInfo(null)}
                                                className="p-1 text-gray-400"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Kalori</span>
                                                <span className="text-white font-medium">
                                                    {ing.calories} kcal
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Fiyat</span>
                                                <span className="text-primary font-medium">
                                                    {ing.price > 0 ? `+₺${ing.price}` : "Ücretsiz"}
                                                </span>
                                            </div>
                                            {ing.allergens.length > 0 && (
                                                <div>
                                                    <p className="text-sm text-gray-400 mb-2">
                                                        Alerjenler:
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {ing.allergens.map((a) => (
                                                            <span
                                                                key={a}
                                                                className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-medium"
                                                            >
                                                                {a}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Favorite loader modal */}
            <AnimatePresence>
                {showFavoriteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center"
                        >
                            <div className="text-5xl mb-4">🌟</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Favori Seçimi</h3>

                            {!selectionMode ? (
                                <>
                                    <p className="text-gray-400 mb-6 text-sm">
                                        Telefon numaranızı girerek kayıtlı burgerlerinizi bulabilirsiniz.
                                    </p>
                                    <div className="space-y-4 mb-6 text-left">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Telefon Numarası</label>
                                            <input
                                                type="tel"
                                                placeholder="05XX XXX XX XX"
                                                value={favoritePhone}
                                                onChange={(e) => setFavoritePhone(e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 rounded-2xl px-4 py-4 text-white text-lg focus:border-primary outline-none transition-colors"
                                            />
                                            {favoriteError && (
                                                <p className="text-red-500 text-xs mt-2">{favoriteError}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setShowFavoriteModal(false);
                                                setFavoriteError(null);
                                            }}
                                            className="flex-1 bg-white/5 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-colors"
                                        >
                                            Vazgeç
                                        </button>
                                        <button
                                            onClick={searchFavorites}
                                            disabled={loadingFavorite}
                                            className="flex-2 bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                                        >
                                            {loadingFavorite ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                "Burgerleri Bul 🔍"
                                            )}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-400 mb-6 text-sm">
                                        Yüklemek istediğiniz burgeri seçin:
                                    </p>
                                    <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {savedBurgers.map((saved) => (
                                            <button
                                                key={saved.id}
                                                onClick={() => applyBurgerTemplate(saved)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left hover:border-primary transition-colors flex justify-between items-center group"
                                            >
                                                <div>
                                                    <p className="text-white font-bold">{saved.burger_name || "İsimsiz Burger"}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(saved.created_at).toLocaleDateString("tr-TR")}
                                                    </p>
                                                </div>
                                                <ChevronRight size={18} className="text-gray-600 group-hover:text-primary transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setSelectionMode(false)}
                                        className="w-full text-gray-500 text-sm hover:text-white transition-colors"
                                    >
                                        ← Başka numara dene
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
