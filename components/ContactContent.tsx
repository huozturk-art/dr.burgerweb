"use client";

import { useState } from "react";
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
                                    <div key={branch.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                                        <h4 className="text-xl font-bold text-primary mb-2">{branch.name}</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-start space-x-3">
                                                <div className="bg-primary/20 p-1.5 rounded-full text-primary shrink-0">
                                                    <MapPin size={16} />
                                                </div>
                                                <p className="text-gray-400 text-sm">{branch.address}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-primary/20 p-1.5 rounded-full text-primary shrink-0">
                                                    <Phone size={16} />
                                                </div>
                                                <p className="text-gray-400 text-sm">{branch.phone}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-primary/20 p-1.5 rounded-full text-primary shrink-0">
                                                    <Mail size={16} />
                                                </div>
                                                <p className="text-gray-400 text-sm">{branch.email}</p>
                                            </div>
                                            {branch.map_url && (
                                                <div className="flex items-center space-x-3 pt-1">
                                                    <a
                                                        href={branch.map_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors w-full justify-center"
                                                    >
                                                        <MapPin size={14} />
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
                        className="bg-white/5 border border-white/10 p-8 rounded-3xl sticky top-32 h-fit"
                    >
                        <h3 className="text-2xl font-bold text-white mb-6">
                            Mesaj Gönder
                        </h3>
                        <ContactForm />
                    </motion.div>
                </div>
            </div>

            <Footer />
        </main>
    );
};

function ContactForm() {
    const { addMessage } = useData();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addMessage(formData);
            alert("Mesajınız başarıyla gönderildi!");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Ad Soyad</label>
                    <input
                        type="text"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                        placeholder="Adınız"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">E-posta</label>
                    <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="Mesajınızın konusu"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Mesajınız</label>
                <textarea
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Bize iletmek istediklerinizi yazın..."
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
                <Send size={18} />
                {isSubmitting ? "Gönderiliyor..." : "Gönder"}
            </button>
        </form>
    );
}

export default ContactContent;
