"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Trash2, Edit, Save, X, ToggleLeft, ToggleRight } from "lucide-react";

interface IngredientCategory {
    id: string;
    name: string;
    icon: string;
    display_order: number;
    is_required: boolean;
    min_select: number;
    max_select: number;
}

interface Ingredient {
    id: string;
    category_id: string;
    name: string;
    price: number;
    calories: number;
    allergens: string[];
    is_available: boolean;
    display_order: number;
    image_url: string | null;
}

export default function CustomIngredientsPage() {
    const [categories, setCategories] = useState<IngredientCategory[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newIngredient, setNewIngredient] = useState({
        name: "",
        price: 0,
        calories: 0,
        allergens: [] as string[],
        category_id: "",
    });

    const fetchData = async () => {
        try {
            const { data: cats } = await supabase
                .from("ingredient_categories")
                .select("*")
                .order("display_order");
            const { data: ings } = await supabase
                .from("ingredients")
                .select("*")
                .order("display_order");

            if (cats) {
                setCategories(cats);
                if (!selectedCategory && cats.length > 0) {
                    setSelectedCategory(cats[0].id);
                }
            }
            if (ings) setIngredients(ings);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Toggle availability
    const toggleAvailability = async (id: string, currentState: boolean) => {
        const { error } = await supabase
            .from("ingredients")
            .update({ is_available: !currentState })
            .eq("id", id);
        if (!error) fetchData();
    };

    // Update price
    const updatePrice = async (id: string, newPrice: number) => {
        const { error } = await supabase
            .from("ingredients")
            .update({ price: newPrice })
            .eq("id", id);
        if (!error) {
            fetchData();
            setEditingId(null);
        }
    };

    // Add ingredient
    const addIngredient = async () => {
        if (!newIngredient.name || !newIngredient.category_id) return;
        const { error } = await supabase.from("ingredients").insert([
            {
                ...newIngredient,
                display_order: ingredients.length + 1,
                is_available: true,
            },
        ]);
        if (!error) {
            fetchData();
            setShowAddForm(false);
            setNewIngredient({ name: "", price: 0, calories: 0, allergens: [], category_id: "" });
        }
    };

    // Delete ingredient
    const deleteIngredient = async (id: string) => {
        if (!confirm("Bu malzemeyi silmek istediğinize emin misiniz?")) return;
        const { error } = await supabase.from("ingredients").delete().eq("id", id);
        if (!error) fetchData();
    };

    const filteredIngredients = selectedCategory
        ? ingredients.filter((i) => i.category_id === selectedCategory)
        : ingredients;

    const allergenOptions = ["gluten", "süt", "yumurta", "fıstık", "susam", "soya"];

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            🧂 Malzeme Yönetimi
                        </h1>
                        <p className="text-gray-400 mt-1">
                            {ingredients.length} malzeme, {categories.length} kategori
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setShowAddForm(true);
                            setNewIngredient({
                                ...newIngredient,
                                category_id: selectedCategory || "",
                            });
                        }}
                        className="bg-primary hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Malzeme Ekle
                    </button>
                </div>

                {/* Category tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {categories.map((cat) => {
                        const count = ingredients.filter(
                            (i) => i.category_id === cat.id
                        ).length;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id
                                        ? "bg-primary text-white"
                                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                                <span className="text-xs opacity-60">({count})</span>
                            </button>
                        );
                    })}
                </div>

                {/* Add form */}
                {showAddForm && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">Yeni Malzeme</h3>
                            <button onClick={() => setShowAddForm(false)} className="text-gray-400">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Malzeme Adı"
                                value={newIngredient.name}
                                onChange={(e) =>
                                    setNewIngredient({ ...newIngredient, name: e.target.value })
                                }
                                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                            />
                            <select
                                value={newIngredient.category_id}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...newIngredient,
                                        category_id: e.target.value,
                                    })
                                }
                                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                            >
                                <option value="">Kategori Seç</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.icon} {c.name}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Fiyat (₺)"
                                value={newIngredient.price || ""}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...newIngredient,
                                        price: parseFloat(e.target.value) || 0,
                                    })
                                }
                                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                            />
                            <input
                                type="number"
                                placeholder="Kalori (kcal)"
                                value={newIngredient.calories || ""}
                                onChange={(e) =>
                                    setNewIngredient({
                                        ...newIngredient,
                                        calories: parseInt(e.target.value) || 0,
                                    })
                                }
                                className="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-400 mb-2">Alerjenler:</p>
                            <div className="flex flex-wrap gap-2">
                                {allergenOptions.map((a) => (
                                    <button
                                        key={a}
                                        onClick={() => {
                                            const current = newIngredient.allergens;
                                            setNewIngredient({
                                                ...newIngredient,
                                                allergens: current.includes(a)
                                                    ? current.filter((x) => x !== a)
                                                    : [...current, a],
                                            });
                                        }}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${newIngredient.allergens.includes(a)
                                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                                : "bg-white/5 text-gray-500 border border-white/10"
                                            }`}
                                    >
                                        {a}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={addIngredient}
                            disabled={!newIngredient.name || !newIngredient.category_id}
                            className="mt-4 w-full bg-primary hover:bg-orange-600 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Malzemeyi Ekle
                        </button>
                    </div>
                )}

                {/* Ingredients table */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase">
                                        Malzeme
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs text-gray-500 uppercase">
                                        Fiyat
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs text-gray-500 uppercase">
                                        Kalori
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs text-gray-500 uppercase">
                                        Alerjenler
                                    </th>
                                    <th className="text-center px-4 py-3 text-xs text-gray-500 uppercase">
                                        Durum
                                    </th>
                                    <th className="text-right px-4 py-3 text-xs text-gray-500 uppercase">
                                        İşlem
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredIngredients.map((ing) => (
                                    <tr key={ing.id} className={`hover:bg-white/5 transition-colors ${!ing.is_available ? "opacity-50" : ""
                                        }`}>
                                        <td className="px-4 py-3">
                                            <span className="text-white font-medium">{ing.name}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {editingId === ing.id ? (
                                                <div className="flex items-center justify-center gap-1">
                                                    <input
                                                        type="number"
                                                        defaultValue={ing.price}
                                                        className="w-20 bg-black/50 border border-primary rounded px-2 py-1 text-white text-center text-sm"
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                updatePrice(
                                                                    ing.id,
                                                                    parseFloat(
                                                                        (e.target as HTMLInputElement).value
                                                                    )
                                                                );
                                                            }
                                                            if (e.key === "Escape") setEditingId(null);
                                                        }}
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => setEditingId(null)}
                                                        className="text-gray-500"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setEditingId(ing.id)}
                                                    className="text-primary font-bold hover:underline"
                                                >
                                                    {ing.price > 0 ? `₺${ing.price}` : "Dahil"}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center text-gray-400 text-sm">
                                            {ing.calories} kcal
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center gap-1">
                                                {ing.allergens.length > 0
                                                    ? ing.allergens.map((a) => (
                                                        <span
                                                            key={a}
                                                            className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded text-[10px]"
                                                        >
                                                            {a}
                                                        </span>
                                                    ))
                                                    : <span className="text-gray-600 text-xs">—</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() =>
                                                    toggleAvailability(ing.id, ing.is_available)
                                                }
                                                className={`transition-colors ${ing.is_available
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                                    }`}
                                            >
                                                {ing.is_available ? (
                                                    <ToggleRight size={24} />
                                                ) : (
                                                    <ToggleLeft size={24} />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => deleteIngredient(ing.id)}
                                                className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
