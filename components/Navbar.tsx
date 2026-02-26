"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { totalItems } = useCart();
    const pathname = usePathname();

    const navLinks = [
        { name: "Ana Sayfa", href: "/" },
        { name: "Menü", href: "/menu" },
        // { name: "Kampanyalar", href: "/campaigns" },
        { name: "Franchise", href: "/franchise" },
        { name: "Kariyer", href: "/career" },
        { name: "Hakkımızda", href: "/about" },
        { name: "İletişim", href: "/contact" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 relative h-[84px] w-[212px]">
                        <Image
                            src="/images/logo.png"
                            alt="Dr. Burger Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </Link>

                    {/* Desktop Right Actions */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-300 hover:text-primary transition-colors duration-200 font-medium text-sm"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {pathname !== "/" && (
                            <Link href="/cart" className="relative p-2 text-gray-300 hover:text-primary transition-colors group">
                                <ShoppingBag size={24} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu & Cart Button */}
                    <div className="lg:hidden flex items-center gap-4">
                        {pathname !== "/" && (
                            <Link href="/cart" className="relative p-2 text-gray-300">
                                <ShoppingBag size={24} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white p-2"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-black border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-primary hover:bg-white/5 rounded-md"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
