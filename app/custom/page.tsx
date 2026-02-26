"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import BurgerBuilder from "@/components/custom/BurgerBuilder";

interface IngredientCategory {
    id: string;
    name: string;
    name_en: string | null;
    icon: string;
    display_order: number;
    is_required: boolean;
    min_select: number;
    max_select: number;
}

export interface Ingredient {
    id: string;
    category_id: string;
    name: string;
    name_en: string | null;
    description: string | null;
    price: number;
    image_url: string | null;
    calories: number;
    allergens: string[];
    is_available: boolean;
    display_order: number;
}

export interface CategoryWithIngredients extends IngredientCategory {
    ingredients: Ingredient[];
}

function CustomBurgerContent() {
    const searchParams = useSearchParams();
    const branchParam = searchParams.get("branch");
    const tableParam = searchParams.get("table");

    const [categories, setCategories] = useState<CategoryWithIngredients[]>([]);
    const [loading, setLoading] = useState(true);
    const [tableNumber, setTableNumber] = useState<number | null>(
        tableParam ? parseInt(tableParam) : null
    );
    const [showTablePrompt, setShowTablePrompt] = useState(!tableParam);

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            const { data: cats } = await supabase
                .from("ingredient_categories")
                .select("*")
                .order("display_order");

            const { data: ings } = await supabase
                .from("ingredients")
                .select("*")
                .eq("is_available", true)
                .order("display_order");

            if (cats && ings) {
                const merged: CategoryWithIngredients[] = cats.map((cat) => ({
                    ...cat,
                    ingredients: ings.filter((ing) => ing.category_id === cat.id),
                }));
                setCategories(merged);
            }
        } catch (error) {
            console.error("Error fetching ingredients:", error);
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Menü yükleniyor...</p>
                </div>
            </div>
        );
    }

    // Table number prompt
    if (showTablePrompt) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center">
                    <div className="text-6xl mb-4">🍔</div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Custom Burger
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Kendi burgerini tasarla!
                        <br />
                        Lütfen masa numaranızı girin.
                    </p>
                    <div className="mb-6">
                        <input
                            type="number"
                            min="1"
                            max="20"
                            placeholder="Masa No"
                            value={tableNumber || ""}
                            onChange={(e) => setTableNumber(parseInt(e.target.value) || null)}
                            className="w-full text-center text-4xl font-bold bg-black/50 border-2 border-white/20 focus:border-primary rounded-2xl px-6 py-4 text-white outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                    <button
                        onClick={() => {
                            if (tableNumber && tableNumber >= 1 && tableNumber <= 20) {
                                setShowTablePrompt(false);
                            }
                        }}
                        disabled={!tableNumber || tableNumber < 1 || tableNumber > 20}
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-4 rounded-2xl text-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
                    >
                        Burger Tasarlamaya Başla! 🚀
                    </button>
                </div>
            </div>
        );
    }

    return (
        <BurgerBuilder
            categories={categories}
            tableNumber={tableNumber!}
            branchId={branchParam || undefined}
        />
    );
}

export default function CustomBurgerPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            }
        >
            <CustomBurgerContent />
        </Suspense>
    );
}
