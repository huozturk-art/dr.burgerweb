"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import { motion } from "framer-motion";
import { Briefcase, Clock, MapPin } from "lucide-react";
import Link from "next/link";

import { useData } from "@/context/DataContext";

export default function CareerPage() {
    const { jobPostings } = useData();

    // Filter only active job postings
    const positions = jobPostings ? jobPostings.filter(job => job.isActive).map(job => ({
        title: job.title,
        location: job.location,
        type: job.type,
        description: job.description
    })) : [];

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <SectionTitle title="Kariyer" subtitle="Ekibimize Katılın" centered={true} />

                <div className="max-w-4xl mx-auto mt-12 space-y-6">
                    {positions.map((pos, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-primary/50 transition-colors group"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                    {pos.title}
                                </h3>
                                <Link
                                    href={`/career/apply?position=${encodeURIComponent(pos.title)}`}
                                    className="bg-white/10 hover:bg-primary text-white px-6 py-2 rounded-full text-sm font-bold transition-colors inline-block"
                                >
                                    Başvur
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} />
                                    {pos.location}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={16} />
                                    {pos.type}
                                </div>
                            </div>

                            <p className="text-gray-300">
                                {pos.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Genel Başvuru</h3>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Aradığınız pozisyonu listede bulamadınız mı? CV'nizi bize gönderin, uygun pozisyon açıldığında sizi arayalım.
                    </p>
                    <Link
                        href="/career/apply?position=Genel Başvuru"
                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-colors"
                    >
                        <Briefcase size={20} />
                        Genel Başvuru Formu
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    );
}
