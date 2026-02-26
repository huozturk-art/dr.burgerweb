"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
    Bell, BellOff, Printer, Clock, CheckCircle, ChefHat, Coffee,
    CreditCard, XCircle, RefreshCw, Filter, Volume2, VolumeX
} from "lucide-react";

interface OrderBurger {
    id: string;
    burger_name: string;
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
        icon: <XCircle size={16} />,
        nextStatus: null,
        nextLabel: null,
    },
};

export default function CustomOrdersPage() {
    const [orders, setOrders] = useState<CustomOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("active"); // active, all, paid
    const [soundEnabled, setSoundEnabled] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const prevOrderCount = useRef(0);

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

                // Play sound for new orders
                if (
                    prevOrderCount.current > 0 &&
                    data.length > prevOrderCount.current &&
                    soundEnabled
                ) {
                    playNotificationSound();
                }
                prevOrderCount.current = data.length;
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [soundEnabled]);

    // Notification sound
    const playNotificationSound = () => {
        try {
            const ctx = new AudioContext();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.type = "sine";

            // Play a pleasant notification melody
            const now = ctx.currentTime;
            o.frequency.setValueAtTime(880, now);         // A5
            o.frequency.setValueAtTime(1100, now + 0.15); // C#6
            o.frequency.setValueAtTime(1320, now + 0.3);  // E6

            g.gain.setValueAtTime(0.3, now);
            g.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

            o.start(now);
            o.stop(now + 0.5);
        } catch (e) {
            console.log("Audio not available");
        }
    };

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

    // Cancel order
    const cancelOrder = async (orderId: string) => {
        if (!confirm("Bu siparişi iptal etmek istediğinize emin misiniz?")) return;
        await updateStatus(orderId, "cancelled");
    };

    // Print order
    const printOrder = (order: CustomOrder) => {
        const printWindow = window.open("", "_blank", "width=350,height=600");
        if (!printWindow) return;

        const allIngredients = order.order_burgers.flatMap(b => b.burger_ingredients);

        // Group by category (basic grouping by position)
        const ingredientLines = allIngredients
            .map(i => `<tr><td style="padding:2px 0">${i.ingredient_name}${i.quantity > 1 ? ` x${i.quantity}` : ""}</td><td style="text-align:right;padding:2px 0">${(i.unit_price * i.quantity) > 0 ? `₺${(i.unit_price * i.quantity).toFixed(2)}` : "Dahil"}</td></tr>`)
            .join("");

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
          table { width: 100%; }
          .total { font-size: 16px; font-weight: bold; }
          @media print { body { width: 80mm; } }
        </style>
      </head>
      <body>
        <div class="center bold big">DR. BURGER</div>
        <div class="center" style="margin-bottom:4px">Custom Burger Sipariş</div>
        <div class="line"></div>
        <table>
          <tr><td class="bold">Masa:</td><td style="text-align:right" class="bold big">${order.table_number}</td></tr>
          <tr><td>Sipariş:</td><td style="text-align:right">${order.order_number}</td></tr>
          <tr><td>Saat:</td><td style="text-align:right">${new Date(order.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</td></tr>
          ${order.customer_name ? `<tr><td>Müşteri:</td><td style="text-align:right">${order.customer_name}</td></tr>` : ""}
        </table>
        <div class="line"></div>
        <div class="bold" style="margin-bottom:4px">🍔 Custom Burger</div>
        <table>${ingredientLines}</table>
        ${order.notes ? `<div class="line"></div><div><span class="bold">Not:</span> ${order.notes}</div>` : ""}
        <div class="line"></div>
        <table><tr><td class="total">TOPLAM:</td><td class="total" style="text-align:right">₺${order.total_price.toFixed(2)}</td></tr></table>
        <div class="line"></div>
        <div class="center" style="margin-top:8px;font-size:10px">
          ${new Date(order.created_at).toLocaleDateString("tr-TR")}<br/>
          Afiyet olsun! 🍔
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
        <div className="p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                            🍔 Custom Burger Siparişleri
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
                                                <div key={burger.id}>
                                                    {burger.burger_ingredients.map((ing) => (
                                                        <div
                                                            key={ing.id}
                                                            className="text-sm text-gray-300 py-0.5 flex justify-between"
                                                        >
                                                            <span>
                                                                {ing.ingredient_name}
                                                                {ing.quantity > 1 && (
                                                                    <span className="text-gray-500">
                                                                        {" "}x{ing.quantity}
                                                                    </span>
                                                                )}
                                                            </span>
                                                            {ing.unit_price > 0 && (
                                                                <span className="text-gray-500 text-xs">
                                                                    ₺{(ing.unit_price * ing.quantity).toFixed(2)}
                                                                </span>
                                                            )}
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

                                        {/* Cancel */}
                                        {!["paid", "cancelled"].includes(order.status) && (
                                            <button
                                                onClick={() => cancelOrder(order.id)}
                                                className="flex-shrink-0 p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                                                title="İptal"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        )}
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
