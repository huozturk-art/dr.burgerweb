"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
    BarChart3, TrendingUp, DollarSign, ShoppingBag,
    Clock, ArrowUpRight, ArrowDownRight, Package,
    ChevronRight, Calendar, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReportStats {
    todayRevenue: number;
    todayCount: number;
    monthlyRevenue: number;
    monthlyCount: number;
    avgOrderValue: number;
    hourlyData: { hour: number; count: number; revenue: number }[];
    topIngredients: { name: string; count: number; totalRev: number }[];
    statusBreakdown: Record<string, number>;
}

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ReportStats | null>(null);
    const [timeframe, setTimeframe] = useState<"7d" | "30d">("7d");

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const now = new Date();
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

            // 1. Fetch Today's Orders
            const { data: todayOrders, error: todayErr } = await supabase
                .from("custom_orders")
                .select("*")
                .gte("created_at", todayStart)
                .neq("status", "cancelled");

            if (todayErr) throw todayErr;

            // 2. Fetch Month's Orders
            const { data: monthOrders, error: monthErr } = await supabase
                .from("custom_orders")
                .select("*")
                .gte("created_at", monthStart)
                .neq("status", "cancelled");

            if (monthErr) throw monthErr;

            // 3. Fetch Ingredient Performance
            const { data: ingPerformance, error: ingErr } = await supabase
                .from("burger_ingredients")
                .select(`
          ingredient_name,
          quantity,
          unit_price
        `);

            if (ingErr) throw ingErr;

            // Process Data
            const todayRevenue = (todayOrders || []).reduce((sum, o) => sum + Number(o.total_price), 0);
            const monthlyRevenue = (monthOrders || []).reduce((sum, o) => sum + Number(o.total_price), 0);

            // Hourly distribution (Last 30 days)
            const hourlyData = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0, revenue: 0 }));
            (monthOrders || []).forEach(o => {
                const h = new Date(o.created_at).getHours();
                hourlyData[h].count++;
                hourlyData[h].revenue += Number(o.total_price);
            });

            // Top Ingredients
            const ingMap: Record<string, { count: number; totalRev: number }> = {};
            (ingPerformance || []).forEach(i => {
                if (!ingMap[i.ingredient_name]) {
                    ingMap[i.ingredient_name] = { count: 0, totalRev: 0 };
                }
                ingMap[i.ingredient_name].count += i.quantity;
                ingMap[i.ingredient_name].totalRev += i.quantity * Number(i.unit_price);
            });

            const topIngredients = Object.entries(ingMap)
                .map(([name, data]) => ({ name, ...data }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 8);

            // Status Breakdown
            const statusMap: Record<string, number> = {};
            (monthOrders || []).forEach(o => {
                statusMap[o.status] = (statusMap[o.status] || 0) + 1;
            });

            setStats({
                todayRevenue,
                todayCount: todayOrders?.length || 0,
                monthlyRevenue,
                monthlyCount: monthOrders?.length || 0,
                avgOrderValue: monthlyRevenue / (monthOrders?.length || 1),
                hourlyData,
                topIngredients,
                statusBreakdown: statusMap
            });

        } catch (error) {
            console.error("Report Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading || !stats) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="text-primary animate-spin" size={48} />
                <p className="text-gray-400 font-medium">Veriler analiz ediliyor...</p>
            </div>
        );
    }

    const maxHourCount = Math.max(...stats.hourlyData.map(d => d.count), 1);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <BarChart3 className="text-primary" size={32} />
                        İşletme Raporları
                    </h1>
                    <p className="text-gray-400 mt-1">Dr. Burger özel sipariş sisteminin canlı performans verileri.</p>
                </div>
                <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10">
                    <button className="px-6 py-2 rounded-xl text-sm font-bold text-primary bg-primary/10">Bu Ay</button>
                    <button className="px-6 py-2 rounded-xl text-sm font-bold text-gray-500 hover:text-white transition-colors">Tümü</button>
                </div>
            </header>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Bugünkü Ciro"
                    value={`₺${stats.todayRevenue.toLocaleString("tr-TR")}`}
                    subtext={`${stats.todayCount} Sipariş`}
                    icon={<DollarSign className="text-emerald-500" />}
                    trend={+12.5}
                />
                <StatCard
                    title="Aylık Toplam"
                    value={`₺${stats.monthlyRevenue.toLocaleString("tr-TR")}`}
                    subtext={`${stats.monthlyCount} Toplam Sipariş`}
                    icon={<TrendingUp className="text-primary" />}
                    trend={+5.2}
                />
                <StatCard
                    title="Ort. Sipariş"
                    value={`₺${stats.avgOrderValue.toFixed(2)}`}
                    subtext="Sepet ortalaması"
                    icon={<ShoppingBag className="text-blue-500" />}
                    trend={-2.1}
                />
                <StatCard
                    title="Popüler Saat"
                    value={`${stats.hourlyData.sort((a, b) => b.count - a.count)[0].hour}:00`}
                    subtext="En yoğun dönem"
                    icon={<Clock className="text-orange-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Hourly Chart */}
                <div className="lg:col-span-2 bg-zinc-900/50 border border-white/10 rounded-3xl p-8">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-bold text-white">Yoğunluk Grafiği</h3>
                            <p className="text-sm text-gray-500">Saatlik sipariş dağılımı</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <div className="w-3 h-3 bg-primary rounded-full" /> Sipariş Sayısı
                            </div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end gap-1 md:gap-2">
                        {stats.hourlyData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center group relative">
                                <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-zinc-800 text-white text-[10px] py-1 px-2 rounded-lg border border-white/10 z-10">
                                    {d.count} Sip.
                                </div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.count / maxHourCount) * 100}%` }}
                                    className={`w-full rounded-t-lg transition-all ${d.count === maxHourCount ? 'bg-primary' : 'bg-primary/30 group-hover:bg-primary/60'}`}
                                />
                                <span className="text-[10px] text-gray-600 mt-2 rotate-45 md:rotate-0">{d.hour}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Ingredients */}
                <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">En Çok Satanlar</h3>
                    <div className="space-y-4">
                        {stats.topIngredients.map((ing, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-xs font-bold text-primary">
                                        #{i + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{ing.name}</p>
                                        <p className="text-xs text-gray-500">{ing.count} adet kullanıldı</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-gray-700 group-hover:text-primary" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoBlock
                    title="Sipariş Durumları"
                    data={Object.entries(stats.statusBreakdown).map(([k, v]) => ({ label: k, value: v }))}
                />
                <div className="bg-gradient-to-br from-primary/20 to-orange-600/5 border border-primary/20 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white">Otomatik Fiş Tasarrufu</h3>
                        <p className="text-sm text-gray-400 mt-2">Dijital sipariş sistemi ile ayda yaklaşık 120gr termal kağıt tasarrufu sağladınız.</p>
                    </div>
                    <div className="mt-8 flex items-center gap-4">
                        <div className="text-4xl">☘️</div>
                        <div className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Çevre Dostu İşletme</div>
                    </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                    <Calendar className="text-gray-600 mb-4" size={48} />
                    <h4 className="text-white font-bold">Detaylı Rapor Al</h4>
                    <p className="text-xs text-gray-500 mt-2 px-4">Tüm sipariş dökümünü Excel formatında bilgisayarınıza indirin.</p>
                    <button className="mt-6 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-2xl transition-all border border-white/10">
                        Dışa Aktar (.xlsx)
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtext, icon, trend }: { title: string; value: string; subtext: string; icon: React.ReactNode; trend?: number }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 p-6 rounded-3xl relative overflow-hidden group"
        >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-zinc-800 rounded-2xl border border-white/5">
                    {icon}
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</p>
                <h4 className="text-3xl font-black text-white mt-1">{value}</h4>
                <p className="text-xs text-gray-600 mt-2">{subtext}</p>
            </div>
        </motion.div>
    );
}

function InfoBlock({ title, data }: { title: string; data: { label: string; value: number }[] }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
            <div className="space-y-4">
                {data.map((item, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-gray-400 capitalize">{item.label}</span>
                            <span className="text-white">{item.value}</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(item.value / total) * 100}%` }}
                                className="h-full bg-primary"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
