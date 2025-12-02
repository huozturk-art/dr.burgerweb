"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const images = [
    "/images/branches/WhatsApp Image 2025-12-01 at 23.30.56.jpg",
    "/images/branches/WhatsApp Image 2025-12-01 at 23.30.57.jpg",
    "/images/branches/WhatsApp Image 2025-12-01 at 23.30.58.jpg",
    "/images/branches/WhatsApp Image 2025-12-01 at 23.30.59.jpg",
    "/images/branches/WhatsApp Image 2025-12-01 at 23.31.00.jpg",
    "/images/branches/WhatsApp Image 2025-12-01 at 23.31.01.jpg",
    "/images/branches/WhatsApp Image 2025-12-01 at 23.31.02.jpg",
    "/images/branches/WhatsApp Image 2025-12-01 at 23.30.56 (1).jpg",
    "/images/branches/WhatsApp Image 2025-12-01 at 23.30.57 (1).jpg",
    "/images/branches/WhatsApp Image 2025-12-01 at 23.30.58 (1).jpg",
    "/images/branches/WhatsApp Image 2025-12-01 at 23.30.59 (1).jpg",
    "/images/branches/WhatsApp Image 2025-12-01 at 23.31.00 (1).jpg",
];

const GallerySection = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <section className="py-20 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        Mekanımız
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        whileInView={{ opacity: 1, width: "100px" }}
                        viewport={{ once: true }}
                        className="h-1 bg-primary mx-auto rounded-full"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 text-gray-400 max-w-2xl mx-auto"
                    >
                        Sizi sadece lezzetli burgerler yemeye değil, keyifli vakit geçirmeye davet ediyoruz.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((src, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl group"
                            onClick={() => setSelectedImage(src)}
                        >
                            <Image
                                src={src}
                                alt={`Dr. Burger Şube Görseli ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 text-white hover:text-primary transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={40} />
                        </button>
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedImage}
                                alt="Dr. Burger Şube Detay"
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default GallerySection;
