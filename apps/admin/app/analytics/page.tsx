"use client";

import {
    Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Line
} from "recharts";
import { 
    Calendar, 
    ShoppingBag, 
    DollarSign, 
    Activity,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Package,
    TrendingUp,
    Download
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Branding Palette (Stable Hex Values)
const COLORS = {
    primary: "#B07D5B",
    muted: "#888780",
    skincare: "#D4A98A",
    accessories: "#B4B2A9",
    background: "#0A0D0B",
    surface: "#141815",
    border: "rgba(255,255,255,0.06)"
};

const DONUT_COLORS = [COLORS.primary, COLORS.skincare, COLORS.muted, COLORS.accessories];

// Custom Stream Tooltip (Dual Axis - Stable Strings)
const StreamTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-surface-container-lowest/95 backdrop-blur-2xl border border-white/5 p-6 rounded-[32px] shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40">{label}</p>
                <div className="space-y-3">
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-4">
                            <div className="w-1 h-8 rounded-full" style={{ backgroundColor: entry.color }} />
                            <div>
                                <p className="text-xl font-black text-foreground tracking-tighter leading-none">
                                    {entry.name === "Revenue" ? `KES ${entry.value.toLocaleString()}` : `${entry.value} orders`}
                                </p>
                                <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Verified {entry.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export default function AnalyticsDashboard() {
    const stats = useQuery(api.orders.getStats);

    if (stats === undefined || stats === null) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Editorial Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-12 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1.5px] bg-primary rounded-full shadow-[0_0_15px_#B07D5B33]" />
                        <p className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/80">Analytical Intelligence</p>
                    </div>
                    <h1 className="text-6xl font-black text-foreground tracking-tighter leading-none uppercase">
                        REVENUE <span className="text-primary italic font-serif font-medium">STREAM</span>
                    </h1>
                </div>
                <div className="flex items-center gap-5">
                    <button className="px-8 h-16 rounded-[24px] bg-surface-container-lowest border border-border/40 shadow-sm flex items-center gap-6 group hover:bg-surface-container transition-all hover:border-primary/20">
                        <Download className="w-5 h-5 text-primary/60 group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col text-left">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none mb-1">Fiscal Record</span>
                            <span className="text-sm font-extrabold text-foreground tracking-tight uppercase leading-none">Download Report</span>
                        </div>
                    </button>
                    <div className="px-8 h-16 rounded-[24px] bg-primary text-primary-foreground flex items-center gap-4 shadow-2xl shadow-primary/30 group">
                        <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <div className="flex flex-col items-start leading-none">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-foreground/40 mb-1 leading-none">Cycle Profile</span>
                            <span className="text-sm font-black uppercase tracking-tight leading-none">{format(new Date(), "MMMM yyyy")}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Revenue", value: `KES ${Math.round(stats.totalRevenue / 1000)}K`, delta: stats.revenueDelta, icon: <DollarSign /> },
                    { label: "Total Orders", value: stats.totalSales.toLocaleString(), delta: stats.salesDelta, icon: <ShoppingBag /> },
                    { label: "Avg Order Value", value: `KES ${Math.round(stats.p0AOV).toLocaleString()}`, delta: stats.aovDelta, icon: <Zap /> },
                    { label: "Conversion Rate", value: `${stats.p0Conversion.toFixed(1)}%`, delta: stats.conversionDelta, icon: <Activity /> },
                ].map((kpi, i) => (
                    <div key={i} className="bg-surface-container-lowest border border-border/40 p-8 rounded-[40px] shadow-sm hover:border-primary/20 transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-6">{kpi.label}</p>
                        <div className="space-y-3 relative z-10">
                            <p className="text-4xl font-black text-foreground tracking-tighter leading-none">{kpi.value}</p>
                            <div className={cn(
                                "flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase",
                                kpi.delta >= 0 ? "text-emerald-500" : "text-rose-500"
                            )}>
                                {kpi.delta >= 0 ? <TrendingUp size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
                                <span>{Math.abs(kpi.delta)}% vs last period</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Stream Analysis */}
                <div className="lg:col-span-2 bg-surface-container-lowest border border-border/40 rounded-[56px] p-12 shadow-2xl flex flex-col h-[520px]">
                    <div className="mb-10">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Revenue stream analysis</h3>
                        </div>
                        <p className="text-xs text-muted-foreground tracking-tight ml-5 opacity-60 italic">Gross income vs order volume — Jan to Jun</p>
                        <div className="flex gap-8 mt-8 ml-5">
                            <div className="flex items-center gap-3 group/leg">
                                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_#B07D5B4D]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 group-hover/leg:text-primary transition-colors">Revenue</span>
                            </div>
                            <div className="flex items-center gap-3 group/leg">
                                <div className="w-3 h-3 rounded-full border-2 border-muted border-dashed" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 group-hover/leg:text-muted transition-colors">Orders</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.months} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.15}/>
                                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" strokeDasharray="8 8" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis 
                                    yAxisId="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                                    tickFormatter={(val) => `KES ${val / 1000}K`}
                                />
                                <YAxis 
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                                />
                                <Tooltip content={<StreamTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                                <Area 
                                    yAxisId="left"
                                    name="Revenue"
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke={COLORS.primary} 
                                    strokeWidth={3}
                                    fill="url(#revenueGrad)"
                                    animationDuration={2500}
                                    dot={{ fill: COLORS.primary, r: 4, stroke: "#141815", strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: COLORS.primary, stroke: "#FFF", strokeWidth: 2 }}
                                />
                                <Line 
                                    yAxisId="right"
                                    name="Orders"
                                    type="monotone" 
                                    dataKey="orders" 
                                    stroke={COLORS.muted} 
                                    strokeWidth={2}
                                    strokeDasharray="6 4"
                                    dot={{ fill: COLORS.muted, r: 4, stroke: "#141815", strokeWidth: 2 }}
                                    animationDuration={2500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue by Category */}
                <div className="bg-surface-container-lowest border border-border/40 rounded-[56px] p-12 shadow-2xl flex flex-col h-[520px]">
                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Revenue by category</h3>
                        </div>
                        <p className="text-xs text-muted-foreground tracking-tight ml-5 opacity-60 italic">Distribution this period</p>
                    </div>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.revenueByCategory}
                                    innerRadius={80}
                                    outerRadius={115}
                                    paddingAngle={10}
                                    dataKey="value"
                                    stroke="none"
                                    animationDuration={2000}
                                >
                                    {stats.revenueByCategory.map((entry: any, index: number) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={DONUT_COLORS[index % DONUT_COLORS.length]} 
                                            className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-8">
                        {stats.revenueByCategory.map((cat: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 group cursor-default">
                                <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-transform group-hover:scale-125" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase text-foreground leading-none tracking-widest">{cat.name}</p>
                                    <p className="text-[12px] font-black text-muted-foreground/40 mt-1">{cat.percentage}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                
                {/* Top Products */}
                <div className="bg-surface-container-lowest border border-border/40 rounded-[56px] p-12 shadow-2xl flex flex-col h-[560px]">
                    <div className="mb-10">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Top products</h3>
                        </div>
                        <p className="text-xs text-muted-foreground tracking-tight ml-5 opacity-60 italic">By revenue this period</p>
                    </div>
                    <div className="flex-1 space-y-8 overflow-hidden pr-2">
                        {stats.topProducts.map((product: any, i: number) => (
                            <div key={product._id} className="flex items-center gap-8 group">
                                <span className="text-xs font-black text-muted-foreground/20 group-hover:text-primary transition-colors w-6 flex-shrink-0">{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-end justify-between mb-2">
                                        <p className="text-sm font-black text-foreground uppercase tracking-tight truncate group-hover:text-primary transition-colors">{product.name}</p>
                                        <p className="text-xs font-black text-muted-foreground tracking-widest uppercase">KES {Math.round(product.revenue / 1000)}K</p>
                                    </div>
                                    <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className="h-full bg-primary transition-all duration-2000 ease-out shadow-[0_0_10px_#B07D5B4D]"
                                            style={{ width: `${product.share}%` }} 
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Revenue Bar View */}
                <div className="bg-surface-container-lowest border border-border/40 rounded-[56px] p-12 shadow-2xl flex flex-col h-[560px]">
                    <div className="mb-10">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Monthly revenue</h3>
                        </div>
                        <p className="text-xs text-muted-foreground tracking-tight ml-5 opacity-60 italic">Bar view Jan–Jun</p>
                    </div>
                    <div className="flex-1 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.months}>
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                                    tickFormatter={(val) => `${val / 1000}K`}
                                />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                    content={({ active, payload }: any) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-surface-container-pover border border-white/5 p-6 rounded-[32px] shadow-2xl backdrop-blur-2xl animate-in zoom-in-95">
                                                    <p className="text-2xl font-black text-foreground tracking-tighter">KES {payload[0].value.toLocaleString()}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    radius={[12, 12, 12, 12]}
                                    animationDuration={2500}
                                >
                                    {stats.months.map((entry: any, index: number) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={index === stats.months.length - 1 ? COLORS.primary : "rgba(176, 125, 91, 0.25)"} 
                                            stroke={index === stats.months.length - 1 ? COLORS.primary : "none"}
                                            strokeWidth={2}
                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Breakdown */}
                <div className="bg-surface-container-lowest border border-border/40 rounded-[56px] p-12 shadow-2xl flex flex-col h-[560px]">
                    <div className="mb-10">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Order status</h3>
                        </div>
                        <p className="text-xs text-muted-foreground tracking-tight ml-5 opacity-60 italic">Current fulfillment breakdown</p>
                    </div>
                    <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                        {[
                            { label: "Delivered", key: "delivered", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
                            { label: "Shipped", key: "shipped", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
                            { label: "Processing", key: "processing", color: "rgba(255,255,255,0.45)", bg: "rgba(255,255,255,0.06)" },
                            { label: "Pending", key: "pending", color: "rgba(255,255,255,0.45)", bg: "rgba(255,255,255,0.06)" },
                            { label: "Cancelled", key: "cancelled", color: "#f43f5e", bg: "rgba(244,63,94,0.1)" },
                        ].map((status, i) => {
                            const count = (stats.statusBreakdown as any)[status.key] || 0;
                            const percentage = stats.totalSales > 0 ? Math.round((count / stats.totalSales) * 100) : 0;
                            return (
                                <div key={i} className="flex items-center justify-between p-6 border border-border/20 hover:bg-white/[0.04] transition-all rounded-[32px] group cursor-default">
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-foreground tracking-tight uppercase">{status.label}</p>
                                        <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">{count} Transactions</p>
                                    </div>
                                    <div 
                                        className="min-w-16 text-center py-2 px-4 rounded-full text-[11px] font-black tracking-widest uppercase shadow-sm transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: status.bg, color: status.color }}
                                    >
                                        {percentage}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
