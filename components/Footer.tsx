"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { useData } from "@/context/DataContext";

const Footer = () => {
    const { siteContent } = useData();

    return (
        <footer className="bg-black border-t border-white/10 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-primary tracking-tighter">
                            DR. BURGER
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {siteContent?.footerDescription}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Instagram size={20} />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Facebook size={20} />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Twitter size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6">Hızlı Erişim</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/menu" className="text-gray-400 hover:text-primary transition-colors">
                                    Menü
                                </Link>
                            </li>

                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors">
                                    Hakkımızda
                                </Link>
                            </li>
                            <li>
                                <Link href="/franchise" className="text-gray-400 hover:text-primary transition-colors">
                                    Franchise Başvuru
                                </Link>
                            </li>
                            <li>
                                <Link href="/career" className="text-gray-400 hover:text-primary transition-colors">
                                    Kariyer
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">
                                    İletişim
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6">İletişim</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-gray-400 text-sm">
                                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                                <span className="whitespace-pre-line">
                                    {siteContent?.contactAddress}
                                </span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400 text-sm">
                                <Phone size={18} className="text-primary shrink-0" />
                                <span>{siteContent?.contactPhone}</span>
                            </li>
                            <li className="flex items-center space-x-3 text-gray-400 text-sm">
                                <Mail size={18} className="text-primary shrink-0" />
                                <span>{siteContent?.contactEmail}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Working Hours */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Çalışma Saatleri</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li className="flex justify-between">
                                <span className="whitespace-pre-line w-full">
                                    {siteContent?.workingHours}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Dr. Burger. Tüm hakları saklıdır.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        <Link href="/admin" className="hover:text-white transition-colors">Yönetici Girişi</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Kullanım Koşulları</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
