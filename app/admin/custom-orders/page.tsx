"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
    Bell, BellOff, Printer, Clock, CheckCircle, ChefHat, Coffee,
    CreditCard, RefreshCw, Filter, Volume2, VolumeX, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderBurger {
    id: string;
    burger_name: string;
    product_id: string | null;
    is_custom: boolean;
    notes: string | null;
    total_price: number;
    burger_ingredients: {
        id: string;
        ingredient_name: string;
        quantity: number;
        unit_price: number;
    }[];
}

interface CustomOrder {
    id: string;
    order_number: string;
    table_number: number;
    customer_name: string | null;
    customer_phone: string | null;
    notes: string | null;
    total_price: number;
    status: string;
    created_at: string;
    printed_at: string | null;
    prepared_at: string | null;
    served_at: string | null;
    paid_at: string | null;
    order_burgers: OrderBurger[];
}

const statusConfig: Record<string, {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ReactNode;
    nextStatus: string | null;
    nextLabel: string | null;
}> = {
    pending: {
        label: "Bekliyor",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10 border-yellow-500/20",
        icon: <Clock size={16} />,
        nextStatus: "confirmed",
        nextLabel: "Onayla",
    },
    confirmed: {
        label: "Onaylandı",
        color: "text-blue-500",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        icon: <CheckCircle size={16} />,
        nextStatus: "preparing",
        nextLabel: "Hazırlanıyor",
    },
    preparing: {
        label: "Hazırlanıyor",
        color: "text-orange-500",
        bgColor: "bg-orange-500/10 border-orange-500/20",
        icon: <ChefHat size={16} />,
        nextStatus: "ready",
        nextLabel: "Hazır",
    },
    ready: {
        label: "Hazır",
        color: "text-green-500",
        bgColor: "bg-green-500/10 border-green-500/20",
        icon: <Coffee size={16} />,
        nextStatus: "served",
        nextLabel: "Teslim Edildi",
    },
    served: {
        label: "Teslim Edildi",
        color: "text-purple-500",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        icon: <CheckCircle size={16} />,
        nextStatus: "paid",
        nextLabel: "Ödendi",
    },
    paid: {
        label: "Ödendi",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10 border-emerald-500/20",
        icon: <CreditCard size={16} />,
        nextStatus: null,
        nextLabel: null,
    },
    cancelled: {
        label: "İptal",
        color: "text-red-500",
        bgColor: "bg-red-500/10 border-red-500/20",
        icon: <CheckCircle size={16} />,
        nextStatus: null,
        nextLabel: null,
    },
};

export default function CustomOrdersPage() {
    const [orders, setOrders] = useState<CustomOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("active"); // active, all, paid
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [autoPrintEnabled, setAutoPrintEnabled] = useState(false);
    const [isAlarmActive, setIsAlarmActive] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const prevOrderCount = useRef(0);

    // Request notification permission
    useEffect(() => {
        if ("Notification" in window) {
            Notification.requestPermission();
        }
    }, []);

    // Fetch orders
    const fetchOrders = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("custom_orders")
                .select(`
          *,
          order_burgers (
            *,
            burger_ingredients (*)
          )
        `)
                .order("created_at", { ascending: false })
                .limit(100);

            if (error) throw error;
            if (data) {
                setOrders(data as CustomOrder[]);

                const hasPending = data.some((o: CustomOrder) => o.status === "pending");
                setIsAlarmActive(hasPending);

                // Check for new orders
                if (prevOrderCount.current > 0 && data.length > prevOrderCount.current) {
                    const newOrdersCount = data.length - prevOrderCount.current;
                    const newOrders = data.slice(0, newOrdersCount);

                    // Native notification
                    if ("Notification" in window && Notification.permission === "granted") {
                        new Notification("YENİ SİPARİŞ GELDİ! 🚨", {
                            body: `Mutfak paneline ${newOrdersCount} yeni sipariş düştü.`,
                            icon: "/favicon.ico"
                        });
                    }

                    // Auto Print
                    if (autoPrintEnabled && newOrders.length > 0) {
                        setTimeout(() => printOrder(newOrders[0]), 1000);
                    }
                }
                prevOrderCount.current = data.length;
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [autoPrintEnabled]);

    // Notification sound
    const playAlarmSound = useCallback(() => {
        try {
            const ctx = new window.AudioContext();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "sawtooth"; // harsher sound for kitchen

            const now = ctx.currentTime;
            o.frequency.setValueAtTime(800, now);
            o.frequency.setValueAtTime(1200, now + 0.2);
            o.frequency.setValueAtTime(800, now + 0.4);
            o.frequency.setValueAtTime(1200, now + 0.6);

            g.gain.setValueAtTime(0.5, now);
            g.gain.exponentialRampToValueAtTime(0.01, now + 0.8);

            o.start(now);
            o.stop(now + 0.8);
        } catch (e) {
            console.log("Audio not available");
        }
    }, []);

    // Continuous Alarm Loop
    useEffect(() => {
        if (isAlarmActive && soundEnabled) {
            playAlarmSound(); // Play immediately
            alarmIntervalRef.current = setInterval(playAlarmSound, 3000); // Repeat every 3s
        } else {
            if (alarmIntervalRef.current) {
                clearInterval(alarmIntervalRef.current);
                alarmIntervalRef.current = null;
            }
        }
        return () => {
            if (alarmIntervalRef.current) {
                clearInterval(alarmIntervalRef.current);
                alarmIntervalRef.current = null;
            }
        };
    }, [isAlarmActive, soundEnabled, playAlarmSound]);

    // Realtime subscription
    useEffect(() => {
        fetchOrders();

        const channel = supabase
            .channel("custom_orders_changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "custom_orders",
                },
                () => {
                    fetchOrders();
                }
            )
            .subscribe();

        // Also poll every 15 seconds as backup
        const interval = setInterval(fetchOrders, 15000);

        return () => {
            supabase.removeChannel(channel);
            clearInterval(interval);
        };
    }, [fetchOrders]);

    // Update order status
    const updateStatus = async (orderId: string, newStatus: string) => {
        const updateData: Record<string, unknown> = { status: newStatus };

        // Set timestamps based on status
        if (newStatus === "preparing") updateData.printed_at = new Date().toISOString();
        if (newStatus === "ready") updateData.prepared_at = new Date().toISOString();
        if (newStatus === "served") updateData.served_at = new Date().toISOString();
        if (newStatus === "paid") updateData.paid_at = new Date().toISOString();

        const { error } = await supabase
            .from("custom_orders")
            .update(updateData)
            .eq("id", orderId);

        if (error) {
            console.error("Error updating status:", error);
            alert("Durum güncellenirken hata oluştu.");
        } else {
            fetchOrders();
        }
    };

    // Permanently delete order (with cascade)
    const deleteOrder = async (orderId: string, orderNumber: string) => {
        if (!confirm(`"${orderNumber}" numaralı siparişi silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz.`)) return;

        try {
            // 1. Get all order_burger IDs first
            const { data: burgers, error: fetchErr } = await supabase
                .from("order_burgers")
                .select("id")
                .eq("order_id", orderId);

            if (fetchErr) throw fetchErr;

            // 2. Delete burger_ingredients for each order_burger
            if (burgers && burgers.length > 0) {
                const burgerIds = burgers.map((b) => b.id);
                const { error: ingErr } = await supabase
                    .from("burger_ingredients")
                    .delete()
                    .in("order_burger_id", burgerIds);

                if (ingErr) throw ingErr;
            }

            // 3. Delete order_burgers
            const { error: burgersErr } = await supabase
                .from("order_burgers")
                .delete()
                .eq("order_id", orderId);

            if (burgersErr) throw burgersErr;

            // 4. Delete the main order
            const { error: orderErr } = await supabase
                .from("custom_orders")
                .delete()
                .eq("id", orderId);

            if (orderErr) throw orderErr;

            // Optimistic update
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } catch (error: any) {
            console.error("Error deleting order:", error);
            alert(`Sipariş silinirken hata oluştu: ${error?.message || error}`);
        }
    };

    // Print order
    const printOrder = (order: CustomOrder) => {
        const printWindow = window.open("", "_blank", "width=350,height=600");
        if (!printWindow) return;

        // Build item rows - handle both custom burgers (with ingredients) and standard items
        const itemRows = order.order_burgers.map(burger => {
            if (burger.is_custom && burger.burger_ingredients && burger.burger_ingredients.length > 0) {
                // Custom burger: show name + each ingredient
                const ingLines = burger.burger_ingredients
                    .map(i => `<tr><td style="padding:1px 0 1px 10px;color:#555">↳ ${i.ingredient_name}${i.quantity > 1 ? ` x${i.quantity}` : ""}</td><td style="text-align:right;padding:1px 0;color:#555">${(i.unit_price * i.quantity) > 0 ? `₺${(i.unit_price * i.quantity).toFixed(2)}` : "Dahil"}</td></tr>`)
                    .join("");
                return `
                    <tr><td class="bold" style="padding:3px 0">🍔 ${burger.burger_name}</td><td style="text-align:right;padding:3px 0" class="bold">₺${burger.total_price.toFixed(2)}</td></tr>
                    ${ingLines}
                `;
            } else {
                // Standard menu item: just name and price
                return `<tr><td class="bold" style="padding:3px 0">📦 ${burger.burger_name}</td><td style="text-align:right;padding:3px 0" class="bold">₺${burger.total_price.toFixed(2)}</td></tr>`;
            }
        }).join('<tr><td colspan="2"><hr style="border:none;border-top:1px dotted #ccc;margin:2px 0"/></td></tr>');

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sipariş #${order.order_number}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; width: 80mm; padding: 5mm; font-size: 12px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .line { border-top: 1px dashed #000; margin: 4px 0; }
          .big { font-size: 18px; }
          table { width: 100%; border-collapse: collapse; }
          .total { font-size: 14px; font-weight: bold; }
          @media print { body { width: 80mm; } }
        </style>
      </head>
      <body>
        <div class="center bold big">DR. BURGER</div>
        <div class="center" style="margin-bottom:4px">Sipariş Fişi</div>
        <div class="line"></div>
        <table>
          <tr><td class="bold">Masa:</td><td style="text-align:right" class="bold big">${order.table_number}</td></tr>
          <tr><td>Sipariş:</td><td style="text-align:right">${order.order_number}</td></tr>
          <tr><td>Saat:</td><td style="text-align:right">${new Date(order.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</td></tr>
          ${order.customer_name ? `<tr><td>Müşteri:</td><td style="text-align:right">${order.customer_name}</td></tr>` : ""}
        </table>
        <div class="line"></div>
        <table>${itemRows}</table>
        ${order.notes ? `<div class="line"></div><div><span class="bold">Not:</span> ${order.notes}</div>` : ""}
        <div class="line"></div>
        <table><tr><td class="total">TOPLAM:</td><td class="total" style="text-align:right">₺${order.total_price.toFixed(2)}</td></tr></table>
        <div class="line"></div>
        <div class="center" style="margin-top:8px;font-size:10px">
          ${new Date(order.created_at).toLocaleDateString("tr-TR")}<br/>
          Afiyet olsun! 🏪
        </div>
        <script>window.onload=()=>{window.print();}</script>
      </body>
      </html>
    `);
        printWindow.document.close();
    };

    // Filter orders
    const filteredOrders = orders.filter((o) => {
        if (filter === "active")
            return !["paid", "cancelled"].includes(o.status);
        if (filter === "paid") return o.status === "paid";
        return true;
    });

    // Count active orders
    const activeCount = orders.filter(
        (o) => !["paid", "cancelled"].includes(o.status)
    ).length;
    const pendingCount = orders.filter((o) => o.status === "pending").length;

    if (loading) {
        return (
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 relative">
            {/* Visual Alarm */}
            <AnimatePresence>
                {isAlarmActive && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="fixed inset-0 pointer-events-none z-[200] border-[16px] border-red-500/80 bg-red-500/10"
                    >
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-full font-black text-2xl tracking-widest shadow-[0_0_50px_rgba(255,0,0,0.8)]">
                            ⚠️ YENİ SİPARİŞ ⚠️
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 relative z-10">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                            🏪 Sipariş Yönetimi
                            {pendingCount > 0 && (
                                <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full animate-pulse">
                                    {pendingCount} yeni
                                </span>
                            )}
                        </h1>
                        <p className="text-gray-400 mt-1">
                            {activeCount} aktif sipariş
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Auto-Print toggle */}
                        <button
                            onClick={() => setAutoPrintEnabled(!autoPrintEnabled)}
                            className={`p-3 rounded-xl border transition-colors ${autoPrintEnabled
                                ? "bg-primary/10 border-primary/30 text-primary"
                                : "bg-white/5 border-white/10 text-gray-500"
                                }`}
                            title={autoPrintEnabled ? "Otomatik yazdırma açık" : "Otomatik yazdırma kapalı"}
                        >
                            <Printer size={20} />
                        </button>

                        {/* Sound toggle */}
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={`p-3 rounded-xl border transition-colors ${soundEnabled
                                ? "bg-primary/10 border-primary/30 text-primary"
                                : "bg-white/5 border-white/10 text-gray-500"
                                }`}
                            title={soundEnabled ? "Sesli bildirim açık" : "Sesli bildirim kapalı"}
                        >
                            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>

                        {/* Refresh */}
                        <button
                            onClick={fetchOrders}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                            title="Yenile"
                        >
                            <RefreshCw size={20} />
                        </button>

                        {/* Filter */}
                        <div className="flex bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                            {[
                                { key: "active", label: "Aktif" },
                                { key: "all", label: "Tümü" },
                                { key: "paid", label: "Ödenen" },
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key)}
                                    className={`px-4 py-2 text-sm font-medium transition-colors ${filter === key
                                        ? "bg-primary text-white"
                                        : "text-gray-400 hover:text-white"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders grid */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-lg">Henüz sipariş yok</p>
                        <p className="text-sm mt-1">Yeni siparişler burada görünecek</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredOrders.map((order) => {
                            const config = statusConfig[order.status] || statusConfig.pending;
                            return (
                                <div
                                    key={order.id}
                                    className={`border rounded-2xl overflow-hidden transition-all ${config.bgColor} ${order.status === "pending" ? "ring-2 ring-yellow-500/50 animate-pulse-slow" : ""
                                        }`}
                                >
                                    {/* Order header */}
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-black/20 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl font-bold text-white">
                                                    {order.table_number}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">
                                                        {order.order_number}
                                                    </span>
                                                    <span className={`flex items-center gap-1 text-xs font-medium ${config.color}`}>
                                                        {config.icon}
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400">
                                                    {new Date(order.created_at).toLocaleTimeString("tr-TR", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    {order.customer_name && ` • ${order.customer_name}`}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-lg font-bold text-primary">
                                            ₺{order.total_price.toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Ingredients */}
                                    <div className="px-4 pb-3">
                                        <div className="bg-black/20 rounded-xl p-3">
                                            {order.order_burgers.map((burger) => (
                                                <div key={burger.id} className="mb-3 last:mb-0">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-bold text-white text-sm">
                                                            {burger.is_custom ? "🍔 " : "📦 "}{burger.burger_name}
                                                        </span>
                                                        {(!burger.burger_ingredients || burger.burger_ingredients.length === 0) && (
                                                            <span className="text-primary font-bold text-xs">
                                                                ₺{burger.total_price.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {burger.burger_ingredients && burger.burger_ingredients.map((ing) => (
                                                        <div
                                                            key={ing.id}
                                                            className="text-xs text-gray-400 py-0.5 ml-4 flex justify-between"
                                                        >
                                                            <span>
                                                                • {ing.ingredient_name}
                                                                {ing.quantity > 1 && (
                                                                    <span className="text-gray-500">
                                                                        {" "}x{ing.quantity}
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                            {order.notes && (
                                                <div className="mt-2 pt-2 border-t border-white/10">
                                                    <p className="text-xs text-yellow-500">
                                                        📝 {order.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="px-4 pb-4 flex gap-2">
                                        {/* Print */}
                                        <button
                                            onClick={() => printOrder(order)}
                                            className="flex-shrink-0 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                            title="Yazdır"
                                        >
                                            <Printer size={18} />
                                        </button>

                                        {/* Next status */}
                                        {config.nextStatus && (
                                            <button
                                                onClick={() =>
                                                    updateStatus(order.id, config.nextStatus!)
                                                }
                                                className="flex-1 bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                                            >
                                                {config.nextLabel}
                                            </button>
                                        )}

                                        {/* Delete */}
                                        <button
                                            onClick={() => deleteOrder(order.id, order.order_number)}
                                            className="flex-shrink-0 p-3 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                                            title="Sil"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
