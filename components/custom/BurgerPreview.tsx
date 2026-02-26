"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SelectedIngredient } from "./BurgerBuilder";

interface Props {
    selections: SelectedIngredient[];
    totalPrice: number;
}

// Color mapping for categories
const categoryColors: Record<string, string> = {
    Ekmek: "#F59E0B",
    Köfte: "#B45309",
    Peynir: "#FBBF24",
    Sos: "#EF4444",
    Sebze: "#22C55E",
    Ekstra: "#A855F7",
};

export default function BurgerPreview({ selections, totalPrice }: Props) {
    if (selections.length === 0) {
        return (
            <div className="max-w-lg mx-auto w-full px-4 py-4">
                <div className="bg-white/5 rounded-2xl p-4 text-center">
                    <p className="text-gray-500 text-sm">
                        Malzeme seçerek burgerini oluşturmaya başla! 🍔
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto w-full px-4 py-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 border border-white/5">
                <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
                    <AnimatePresence mode="popLayout">
                        {selections.map((sel, i) => (
                            <motion.div
                                key={sel.ingredient.id + "-" + i}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                layout
                                className="flex-shrink-0"
                            >
                                <div
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
                                    style={{
                                        backgroundColor: `${categoryColors[sel.categoryName] || "#ff6b00"}15`,
                                        borderColor: `${categoryColors[sel.categoryName] || "#ff6b00"}30`,
                                        color: categoryColors[sel.categoryName] || "#ff6b00",
                                    }}
                                >
                                    <span className="truncate max-w-[80px]">
                                        {sel.ingredient.name}
                                    </span>
                                    {sel.quantity > 1 && (
                                        <span className="bg-white/20 px-1.5 rounded-full text-[10px]">
                                            x{sel.quantity}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
