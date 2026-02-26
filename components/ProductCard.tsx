"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Check } from "lucide-react";
import { Product } from "@/context/DataContext";
import { useCart } from "@/context/CartContext";
import { useState } from "react";

interface ProductCardProps extends Product { }

const ProductCard = ({ id, name, description, price, image, category }: ProductCardProps) => {
    const { items, addItem, updateQuantity } = useCart();

    // Find if the item already exists in the cart and its quantity
    const existingItem = items.find(item => item.productId === id && !item.isCustom);
    const quantity = existingItem ? existingItem.quantity : 0;

    const [added, setAdded] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (quantity === 0) {
            addItem({
                id: `p-${id}`,
                productId: id,
                name,
                price,
                isCustom: false,
                image
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } else {
            // If already in cart, increment quantity
            if (existingItem) {
                updateQuantity(existingItem.id, 1);
            }
        }
    };

    const handleMinus = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (existingItem && quantity > 0) {
            updateQuantity(existingItem.id, -1);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col h-full relative"
        >
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden bg-black/20">
                <Image
                    src={image || "/images/burger-placeholder.png"}
                    alt={name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                    {category}
                </span>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                </div>
                <p className="text-gray-400 text-sm mb-6 flex-1">
                    {description}
                </p>

                <div className="flex items-center justify-between mt-auto h-12">
                    <span className="text-2xl font-bold text-primary">₺{price.toFixed(2)}</span>

                    <div className="relative h-full flex items-center justify-end w-[130px]">
                        <AnimatePresence mode="popLayout">
                            {quantity > 0 ? (
                                <motion.div
                                    key="quantity-controls"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="flex items-center justify-between bg-primary/20 border border-primary/40 rounded-xl h-full w-full px-2"
                                >
                                    <button
                                        onClick={handleMinus}
                                        className="p-2 text-primary hover:text-white hover:bg-primary/50 rounded-lg transition-colors"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-8 text-center font-black text-white">{quantity}</span>
                                    <button
                                        onClick={handleAdd}
                                        className="p-2 text-primary hover:text-white hover:bg-primary/50 rounded-lg transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.button
                                    key="add-button"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={handleAdd}
                                    className={`h-full px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 w-full ${added
                                        ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                                        : "bg-primary text-white hover:shadow-[0_0_15px_rgba(255,107,0,0.4)]"
                                        }`}
                                >
                                    {added ? <Check size={20} /> : <Plus size={20} />}
                                    <span className="font-bold text-sm w-[45px]">{added ? "Eklendi" : "Ekle"}</span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
