"use client";

import { motion } from "framer-motion";
import { Info, Plus, Minus, Check } from "lucide-react";
import type { Ingredient } from "@/app/custom/page";

interface Props {
    ingredient: Ingredient;
    isSelected: boolean;
    quantity: number;
    onToggle: () => void;
    onQuantityChange: (delta: number) => void;
    onAllergenInfo: () => void;
}

const allergenEmojis: Record<string, string> = {
    gluten: "🌾",
    süt: "🥛",
    yumurta: "🥚",
    fıstık: "🥜",
    susam: "🌰",
    soya: "🫘",
};

export default function IngredientCard({
    ingredient,
    isSelected,
    quantity,
    onToggle,
    onQuantityChange,
    onAllergenInfo,
}: Props) {
    return (
        <motion.div
            layout
            whileTap={{ scale: 0.97 }}
            className={`relative rounded-2xl border-2 transition-all duration-200 overflow-hidden ${isSelected
                    ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
        >
            {/* Main tap area */}
            <button
                onClick={onToggle}
                className="w-full text-left p-3 pb-2"
            >
                {/* Image placeholder / emoji */}
                <div className="w-full aspect-square rounded-xl bg-black/30 flex items-center justify-center mb-2 relative overflow-hidden">
                    {ingredient.image_url ? (
                        <img
                            src={ingredient.image_url}
                            alt={ingredient.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-4xl opacity-60">🍔</span>
                    )}

                    {/* Selected checkmark */}
                    {isSelected && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-lg"
                        >
                            <Check size={16} className="text-white" strokeWidth={3} />
                        </motion.div>
                    )}

                    {/* Free badge */}
                    {ingredient.price === 0 && (
                        <div className="absolute bottom-2 left-2 bg-green-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            ÜCRETSİZ
                        </div>
                    )}
                </div>

                {/* Name */}
                <h3 className="text-sm font-bold text-white leading-tight mb-1 line-clamp-2">
                    {ingredient.name}
                </h3>

                {/* Price & Calories */}
                <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${ingredient.price > 0 ? "text-primary" : "text-green-500"}`}>
                        {ingredient.price > 0 ? `+₺${ingredient.price}` : "Dahil"}
                    </span>
                    <span className="text-[10px] text-gray-500">
                        {ingredient.calories} kcal
                    </span>
                </div>
            </button>

            {/* Bottom bar: allergens + quantity */}
            <div className="px-3 pb-3 flex items-center justify-between">
                {/* Allergen icons */}
                <div className="flex items-center gap-1">
                    {ingredient.allergens.length > 0 ? (
                        <button
                            onClick={onAllergenInfo}
                            className="flex items-center gap-0.5"
                        >
                            {ingredient.allergens.slice(0, 3).map((a) => (
                                <span key={a} className="text-xs" title={a}>
                                    {allergenEmojis[a] || "⚠️"}
                                </span>
                            ))}
                            <Info size={12} className="text-gray-500 ml-0.5" />
                        </button>
                    ) : (
                        <span className="text-[10px] text-gray-600">—</span>
                    )}
                </div>

                {/* Quantity controls */}
                {isSelected && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2"
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onQuantityChange(-1);
                            }}
                            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <Minus size={14} className="text-white" />
                        </button>
                        <span className="text-sm font-bold text-white min-w-[16px] text-center">
                            {quantity}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onQuantityChange(1);
                            }}
                            className="w-7 h-7 rounded-full bg-primary/80 hover:bg-primary flex items-center justify-center transition-colors"
                        >
                            <Plus size={14} className="text-white" />
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
