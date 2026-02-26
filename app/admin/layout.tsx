"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { LogOut, LayoutDashboard, UtensilsCrossed, ChefHat, QrCode, Users, BarChart3 } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const navLinks = [
        { href: "/admin", label: "Genel Yönetim", icon: <LayoutDashboard size={18} /> },
        { href: "/admin/custom-orders", label: "🍔 Siparişler", icon: <UtensilsCrossed size={18} /> },
        { href: "/admin/customer-favorites", label: "👥 Müşteriler", icon: <Users size={18} /> },
        { href: "/admin/reports", label: "📊 Raporlar", icon: <BarChart3 size={18} /> },
        { href: "/admin/custom-ingredients", label: "🧂 Malzemeler", icon: <ChefHat size={18} /> },
        { href: "/admin/qr-generator", label: "📱 QR Kodları", icon: <QrCode size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Top Bar */}
            <div className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
                    <div className="font-bold text-xl">Dr. Burger Admin</div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm font-semibold"
                    >
                        <LogOut size={18} />
                        Çıkış Yap
                    </button>
                </div>
                {/* Navigation */}
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto pb-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-2 px-4 py-2 rounded-t-xl text-sm font-medium whitespace-nowrap transition-colors ${pathname === link.href
                                ? "bg-primary text-white"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main>
                {children}
            </main>
        </div>
    );
}
