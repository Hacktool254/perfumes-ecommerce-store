"use client";

import {
    Area, AreaChart, ResponsiveContainer, Bar, BarChart, Line, LineChart,
    XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell
} from "recharts";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { Calendar, LayoutGrid, Plus, MoreHorizontal, ChevronRight, Dot, TrendingUp, Package, ShoppingBag, Users as UsersIcon, DollarSign } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function SalesOverview() {
    const stats = useQuery(api.orders.getStats);

    // stats === undefined = loading; stats === null = not authenticated (redirect pending)
    if (stats === undefined || stats === null) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const trends = {
        revenue: { value: "+12.8%", positive: true },
        sales: { value: "+8.4%", positive: true },
        conversion: { value: "-2.1%", positive: false },
        lowStock: { value: stats?.lowStockCount.toString() || "0", positive: (stats?.lowStockCount || 0) === 0 }
    };

    const pieData = [
        { name: 'Completed', value: stats.totalSales, color: '#A6568A' },
        { name: 'Pending', value: stats.recentOrders.filter(o => o.status === 'pending').length, color: '#BF8A68' },
    ];

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Command Center Header */}
            <div className="flex items-end justify-between border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full bg-[#414A37] animate-pulse shadow-[0_0_10px_rgba(65,74,55,0.5)]" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#DBC2A6]/60">System / Live Intelligence</p>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                        COMMAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DBC2A6] to-[#99744A] italic font-serif font-medium">CENTER</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-5 py-3 rounded-2xl bg-[#111412] border border-white/5 shadow-xl flex items-center gap-3 group hover:border-[#414A37]/30 transition-all">
                        <Calendar className="w-4 h-4 text-[#DBC2A6]" />
                        <span className="text-xs font-bold text-gray-300 tracking-tight uppercase">{format(new Date(), "MMMM yyyy")}</span>
                    </div>
                    <Link href="/products/new">
                        <button className="flex items-center gap-2 h-12 px-6 rounded-2xl bg-[#DBC2A6] text-[#111412] font-black text-xs uppercase tracking-widest hover:scale-105 hover:bg-[#E5D5C5] transition-all shadow-[0_8px_20px_rgba(219,194,166,0.15)] group">
                            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                            <span>New Asset</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Core Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard
                    title="Gross Revenue"
                    value={`KES ${stats.totalRevenue.toLocaleString()}`}
                    trend={trends.revenue}
                    icon={<DollarSign size={20} />}
                />
                <AdminStatCard
                    title="Order Volume"
                    value={stats.totalSales.toString()}
                    trend={trends.sales}
                    icon={<ShoppingBag size={20} />}
                />
                <AdminStatCard
                    title="Civic Activity"
                    value={`${stats.conversionRate}%`}
                    trend={trends.conversion}
                    icon={<UsersIcon size={20} />}
                />
                <AdminStatCard
                    title="Asset Health"
                    value={stats.lowStockCount.toString()}
                    trend={{ value: stats.lowStockCount === 0 ? "Optimal" : "Check Stock", positive: stats.lowStockCount === 0 }}
                    icon={<Package size={20} />}
                />
            </div>

            {/* Operational Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mt-12">
                
                {/* Real-time Order Stream */}
                <div className="bg-[#111412] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col h-[650px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#414A37]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]" />
                    
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tighter">Live Order Stream</h2>
                            <p className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-[0.2em]">Real-time customer engagement metrics</p>
                        </div>
                        <Link href="/transactions" className="w-12 h-12 rounded-2xl bg-[#1A1E1C] border border-white/5 flex items-center justify-center hover:bg-[#DBC2A6] hover:text-[#111412] transition-all duration-500 group/link">
                            <ChevronRight size={20} className="group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-4 custom-scrollbar relative z-10">
                        {stats.recentOrders.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-5 rounded-[24px] bg-[#1A1E1C]/30 border border-transparent hover:border-white/5 hover:bg-[#1A1E1C]/60 transition-all duration-300 group/row">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-[#111412] border border-white/5 flex items-center justify-center shadow-inner relative overflow-hidden group-hover/row:scale-105 transition-transform duration-500">
                                        <ShoppingBag size={20} className="text-[#DBC2A6]" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-base text-white tracking-tight">{order.customerName}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{format(order.createdAt, "MMM d, h:mm a")}</p>
                                            <Dot className="text-gray-700 w-3 h-3" />
                                            <p className="text-[10px] font-black text-[#414A37] tracking-[0.2em]">#{order._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-xl text-white tracking-tighter">KES {order.totalAmount.toLocaleString()}</p>
                                    <div className="flex items-center justify-end gap-2 mt-2">
                                        <div className={cn(
                                            "w-1 h-1 rounded-full animate-pulse",
                                            order.status === 'paid' || order.status === 'delivered' ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                        )} />
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-[0.2em]",
                                            order.status === 'paid' || order.status === 'delivered' ? "text-emerald-400/80" : "text-amber-400/80"
                                        )}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Curator Assets */}
                <div className="space-y-8 flex flex-col h-[650px]">
                    <div className="bg-[#414A37] rounded-[40px] p-10 flex-1 shadow-2xl overflow-hidden relative group border border-white/5">
                        <div className="absolute top-0 right-0 p-10">
                            <TrendingUp size={32} className="text-[#DBC2A6] opacity-10 group-hover:opacity-40 transition-opacity duration-700" />
                        </div>
                        <h2 className="text-2xl font-black text-white tracking-tighter mb-10 relative z-10">Top Tier Assets</h2>
                        
                        <div className="space-y-6 overflow-y-auto h-[calc(100%-100px)] pr-2 custom-scrollbar relative z-10">
                            {stats.topProducts.map((product: any, idx: number) => (
                                <div key={product._id} className="flex items-center gap-5 transition-all duration-500 group/item bg-[#2B3124]/40 p-4 rounded-3xl border border-white/5 hover:bg-[#2B3124]/60">
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-2xl group-hover/item:scale-110 transition-transform duration-700 bg-white/5 p-1.5 border border-white/10">
                                        <img
                                            src={product.images[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=100&auto=format&fit=crop"}
                                            alt={product.name}
                                            className="object-contain w-full h-full opacity-90 group-hover/item:opacity-100"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-white truncate tracking-tight">{product.name}</p>
                                        <p className="text-[9px] text-[#DBC2A6]/60 font-black uppercase tracking-[0.2em] mt-1">{product.brand || "Ummies Essence"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-[#DBC2A6] uppercase tracking-widest italic">Rank {idx + 1}</p>
                                        <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest bg-[#111412]/40 border border-white/5 px-2.5 py-1 rounded-full mt-2 inline-block leading-none">{product.stock} units</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 mt-4">
                <div className="bg-[#111412] border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col items-center group relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#414A37]/5 rounded-full blur-[80px]" />
                    
                    <div className="w-full mb-10 text-center relative z-10">
                        <h2 className="text-xl font-black text-white tracking-tighter">Strategic Distribution</h2>
                        <p className="text-[9px] uppercase font-black text-[#DBC2A6]/40 tracking-[0.3em] mt-2">Operational Fulfillment Map</p>
                    </div>
                    
                    <div className="w-56 h-56 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={75}
                                    outerRadius={95}
                                    paddingAngle={10}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#DBC2A6' : '#414A37'} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-4xl font-black text-white tracking-tighter">{stats.totalSales}</span>
                            <span className="text-[9px] font-black text-[#DBC2A6]/40 uppercase tracking-[0.4em] mt-1">Status</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-12 w-full relative z-10 px-4">
                        {pieData.map((item, idx) => (
                            <div key={item.name} className="flex flex-col items-center gap-2 bg-[#1A1E1C]/50 py-4 rounded-3xl border border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-1.5 h-1.5 rounded-full", idx === 0 ? "bg-[#DBC2A6]" : "bg-[#414A37]")} />
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{item.name}</span>
                                </div>
                                <span className="text-2xl font-black text-white tracking-tighter">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#111412] border border-white/5 rounded-[40px] p-12 text-white relative overflow-hidden flex flex-col justify-center group">
                    <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12 group-hover:rotate-0 transform-gpu">
                        <TrendingUp size={200} strokeWidth={1} />
                    </div>
                    
                    <div className="relative z-10 max-w-[550px]">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-1 bg-[#DBC2A6] rounded-full" />
                            <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-[#DBC2A6]/60">Performance Intelligence</h3>
                        </div>
                        <h3 className="text-5xl font-black leading-[0.9] tracking-tighter mb-8 italic font-serif">Monthly <span className="text-[#DBC2A6]">Momentum</span></h3>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed">
                            Operations are sustaining optimal growth velocity. Current monitoring reflects revenue acquisition of 
                            <span className="text-white font-black mx-2 underline decoration-[#414A37] underline-offset-8">KES {stats.monthlyRevenue.toLocaleString()}</span> 
                            distributed across <span className="text-white font-black mx-1 italic">{stats.monthlySales} verified assets</span>.
                        </p>
                        
                        <div className="mt-14 space-y-5">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.3em] text-[#DBC2A6]">
                                <span>Deployment Target Achievement</span>
                                <span className="text-white">82.4%</span>
                            </div>
                            <div className="w-full h-2.5 bg-[#1A1E1C] rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-gradient-to-r from-[#414A37] to-[#DBC2A6] rounded-full shadow-[0_0_15px_rgba(219,194,166,0.3)] transition-all duration-1000 ease-out" style={{ width: '82.4%' }}></div>
                            </div>
                            <p className="text-[9px] uppercase font-black tracking-[0.2em] text-gray-600">Syncing with quarterly management benchmarks...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
