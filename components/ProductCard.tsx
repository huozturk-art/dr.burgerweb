"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Product } from "@/context/DataContext";

interface ProductCardProps extends Product { }

const ProductCard = ({ id, name, description, price, image, category }: ProductCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300"
        >
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden bg-black/20">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                    {category}
                </span>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                    {description}
                </p>
            </div>
        </motion.div>
    );
};

export default ProductCard;
