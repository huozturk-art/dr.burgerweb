"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { useData } from "@/context/DataContext";

const ContactContent = () => {
    const { branches } = useData();

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <SectionTitle title="İletişim" subtitle="Bize Ulaşın" centered={true} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h3 className="text-2xl font-bold text-white mb-8">
                            Şubelerimiz
                        </h3>

                        <div className="space-y-8">
                            {branches && branches.length > 0 ? (
                                branches.map((branch) => (
                                    <div key={branch.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                        <h4 className="text-xl font-bold text-primary mb-4">{branch.name}</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="bg-primary/20 p-2 rounded-full text-primary shrink-0">
                                                    <MapPin size={20} />
                                                </div>
                                                <p className="text-gray-400">{branch.address}</p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-primary/20 p-2 rounded-full text-primary shrink-0">
                                                    <Phone size={20} />
                                                </div>
                                                <p className="text-gray-400">{branch.phone}</p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-primary/20 p-2 rounded-full text-primary shrink-0">
                                                    <Mail size={20} />
                                                </div>
                                                <p className="text-gray-400">{branch.email}</p>
                                            </div>
                                            {branch.map_url && (
                                                <div className="flex items-center space-x-4 pt-2">
                                                    <a
                                                        href={branch.map_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full justify-center"
                                                    >
                                                        <MapPin size={16} />
                                                        Haritada Göster
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400">Henüz şube eklenmemiş.</div>
                            )}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white/5 border border-white/10 p-8 rounded-3xl"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">
                            Mesaj Gönder
                        </h3>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Ad Soyad</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        placeholder="Adınız"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">E-posta</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        placeholder="ornek@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Konu</label>
                                <input
                                    type="text"
                                    id="subject"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Mesajınızın konusu"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Mesajınız</label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                                    placeholder="Bize iletmek istediklerinizi yazın..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                Gönder
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
};

export default ContactContent;
