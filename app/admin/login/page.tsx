"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple hardcoded PIN for demo purposes
        if (pin === "1234") {
            localStorage.setItem("adminAuth", "true");
            router.push("/admin");
        } else {
            setError("Hatalı PIN kodu!");
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 rounded-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-primary/20 p-4 rounded-full text-primary">
                        <Lock size={32} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white text-center mb-8">
                    Yönetici Girişi
                </h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            PIN Kodu
                        </label>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-center text-2xl tracking-widest"
                            placeholder="••••"
                            maxLength={4}
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors"
                    >
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
    );
}
