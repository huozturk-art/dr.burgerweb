"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CampaignsPage() {
    const campaigns = [
        {
            title: "Öğrenci Menüsü",
            description: "Öğrenci kimliğini göster, Dr. Classic Menü'de %20 indirimi kap!",
            image: "/images/products/DSC04682.JPG.png",
            validity: "Hafta içi 12:00 - 17:00"
        },
        {
            title: "3 Al 2 Öde",
            description: "Salı günlerine özel, seçili burgerlerde 3 al 2 öde fırsatı.",
            image: "/images/products/DSC04693.png",
            validity: "Her Salı"
        },
        {
            title: "Gel-Al İndirimi",
            description: "Siparişini şubeden teslim al, anında %10 indirim kazan.",
            image: "/images/products/DSC04754.png",
            validity: "Her Gün"
        }
    ];

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <SectionTitle title="Kampanyalar" subtitle="Fırsatları Kaçırma" centered={true} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {campaigns.map((camp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-primary/50 transition-all duration-300"
                        >
                            <div className="relative h-48 w-full">
                                <Image
                                    src={camp.image}
                                    alt={camp.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        {camp.validity}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                    {camp.title}
                                </h3>
                                <p className="text-gray-400">
                                    {camp.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
