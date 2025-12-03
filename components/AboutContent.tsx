"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import { motion } from "framer-motion";
import { Award, Users, Clock, Flame } from "lucide-react";
import { useData } from "@/context/DataContext";

const AboutContent = () => {
    const { siteContent } = useData();

    const stats = [
        { icon: <Flame size={32} />, value: siteContent?.statBeef || "100%", label: siteContent?.statBeefLabel || "Dana Eti" },
        { icon: <Users size={32} />, value: siteContent?.statCustomers || "50k+", label: siteContent?.statCustomersLabel || "Mutlu Müşteri" },
        { icon: <Clock size={32} />, value: siteContent?.statExperience || "10+", label: siteContent?.statExperienceLabel || "Yıllık Deneyim" },
        { icon: <Award size={32} />, value: siteContent?.statAwards || "5", label: siteContent?.statAwardsLabel || "Gurme Ödülü" },
    ];

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <Image
                    src="/images/about_chef.png"
                    alt="About Dr. Burger"
                    fill
                    className="object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <SectionTitle title="Hikayemiz" subtitle="Tutkuyla Pişiriyoruz" centered={true} />
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h3 className="text-3xl font-bold text-primary mb-6">
                            {(siteContent && siteContent.aboutTitle) ? siteContent.aboutTitle : "Anne Eli Değmiş Gibi, %100 Doğal"}
                        </h3>
                        <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-line">
                            {(siteContent && siteContent.aboutText) ? siteContent.aboutText : `Dr. Burger'in hikayesi, çocukluğumuzda yediğimiz o katkısız, samimi ve lezzet dolu ev burgerlerine duyduğumuz özlemle başladı. Endüstriyel fast-food zincirlerinin aksine, biz "hızlı yemek" değil, "iyi yemek" sunmayı amaçladık.

Mutfağımızda dondurucuya yer yok. Etlerimiz, güvenilir yerel kasaplardan günlük olarak temin edilen %100 dana etidir. Asla katkı maddesi veya koruyucu kullanmayız. Ekmeklerimiz, tıpkı annemizin fırınından çıkmış gibi her sabah taze pişer. Soslarımız ise fabrikasyon değil, şeflerimizin elleriyle hazırladığı doğal karışımlardır.

Bizim için sağlık ve lezzet bir bütündür. Çocuklarınıza gönül rahatlığıyla yedirebileceğiniz, içiniz rahat, damaklarınız şenlikli bir sofra kuruyoruz. Dr. Burger, ailenizin burgercisi.`}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 gap-6"
                    >
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center hover:border-primary/50 transition-colors duration-300"
                            >
                                <div className="text-primary flex justify-center mb-4">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
};

export default AboutContent;
