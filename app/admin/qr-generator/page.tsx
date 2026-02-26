"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, Printer, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QRGeneratorPage() {
    const [baseUrl, setBaseUrl] = useState("");
    const [tableNumber, setTableNumber] = useState(1);
    const [qrValue, setQrValue] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Detect current domain for QR link
        const host = window.location.origin;
        setBaseUrl(host);
    }, []);

    useEffect(() => {
        if (baseUrl) {
            setQrValue(`${baseUrl}/custom?t=${tableNumber}`);
        }
    }, [baseUrl, tableNumber]);

    const handleCopy = () => {
        navigator.clipboard.writeText(qrValue);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <QrCode className="text-primary" size={32} />
                    Masa QR Kod Oluşturucu
                </h1>
                <p className="text-gray-400 mt-2">Masalara özel QR kodları oluşturun ve yazdırın.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Configuration */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Masa Numarası</label>
                        <input
                            type="number"
                            min="1"
                            max="99"
                            value={tableNumber}
                            onChange={(e) => setTableNumber(parseInt(e.target.value) || 1)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary transition-colors text-2xl font-bold"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Hedef Link</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={qrValue}
                                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs text-gray-500 font-mono"
                            />
                            <button
                                onClick={handleCopy}
                                className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                            >
                                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 italic">
                        * Bu QR kod taratıldığında müşteri doğrudan <strong>Masa {tableNumber}</strong> seçimli sipariş ekranına yönlendirilir.
                    </p>
                </div>

                {/* Preview & Actions */}
                <div className="flex flex-col items-center gap-6">
                    <div id="qr-to-print" className="bg-white p-8 rounded-3xl shadow-2xl shadow-primary/20 flex flex-col items-center gap-4">
                        <QRCodeSVG
                            value={qrValue}
                            size={200}
                            fgColor="#000000"
                            bgColor="#FFFFFF"
                            level="H"
                            includeMargin={false}
                        />
                        <div className="text-center">
                            <p className="text-black font-black text-2xl tracking-tighter">DR. BURGER</p>
                            <p className="text-black/60 text-xs font-bold uppercase tracking-widest mt-1">Masa No: {tableNumber}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full">
                        <button
                            onClick={handlePrint}
                            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all"
                        >
                            <Printer size={20} />
                            Şimdi Yazdır
                        </button>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    div#qr-to-print, div#qr-to-print * {
                        visibility: visible;
                    }
                    div#qr-to-print {
                        position: absolute;
                        left: 50%;
                        top: 20%;
                        transform: translateX(-50%);
                        scale: 1.5;
                        border: none;
                        box-shadow: none;
                    }
                }
            `}</style>
        </div>
    );
}
