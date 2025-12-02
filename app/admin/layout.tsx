"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { LogOut } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Top Bar */}
            <div className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
                    <div className="font-bold text-xl">Dr. Burger Admin</div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm font-semibold"
                    >
                        <LogOut size={18} />
                        Çıkış Yap
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main>
                {children}
            </main>
        </div>
    );
}
