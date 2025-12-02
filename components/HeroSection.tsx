"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useData } from "@/context/DataContext";

const HeroSection = () => {
    const { siteContent } = useData();

    return (
        <section className="relative h-screen w-full overflow-hidden bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero_burger.png"
                    alt="Premium Burger"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-semibold tracking-wider mb-6">
                        %100 DOĞAL & EV YAPIMI
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight whitespace-pre-line"
                >
                    {siteContent?.heroTitle || "Anne Eli Değmiş Gibi\nGerçek Burger Lezzeti"}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    {siteContent?.heroSubtitle || "Dondurulmuş ürün yok, katkı maddesi yok. Günlük taze ekmek, %100 dana eti ve şefimizin özel soslarıyla hazırlanan sağlıklı burger deneyimi."}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link
                        href="/menu"
                        className="bg-primary hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
                    >
                        Menüyü Keşfet
                        <ArrowRight size={20} />
                    </Link>
                    <Link
                        href="/contact"
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
                    >
                        Bize Ulaşın
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
