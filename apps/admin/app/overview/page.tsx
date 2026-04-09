"use client";

import {
    Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Line
} from "recharts";
import { 
    Calendar, 
    Plus, 
    ShoppingBag, 
    DollarSign, 
    Activity,
    Zap,
    Ticket,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Package
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Branding Palette
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

// Custom Stream Tooltip (Dual Axis)
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

export default function UmmiesEssenceDashboard() {
    const stats = useQuery(api.orders.getStats);

    if (stats === undefined || stats === null) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Editorial Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-10 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1.5px] bg-primary rounded-full shadow-[0_0_15px_#b07d5b33]" />
                        <p className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/80">Operational Intelligence</p>
                    </div>
                    <h1 className="text-6xl font-black text-foreground tracking-tighter leading-none">
                        REVENUE <span className="text-primary italic font-serif font-medium">STREAM</span>
                    </h1>
                </div>
                <div className="flex items-center gap-5">
                    <div className="px-8 h-16 rounded-[24px] bg-surface-container-lowest border border-border/40 shadow-sm flex items-center gap-6 group hover:bg-surface-container transition-all hover:border-primary/20">
                        <Calendar className="w-5 h-5 text-primary/60 group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 leading-none mb-1">Cycle Profile</span>
                            <span className="text-sm font-extrabold text-foreground tracking-tight uppercase leading-none">{format(new Date(), "MMMM yyyy")}</span>
                        </div>
                    </div>
                    <Link href="/products/new">
                        <button className="flex items-center gap-4 h-16 px-10 rounded-[24px] bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.03] active:scale-95 transition-all shadow-2xl shadow-primary/30 group relative overflow-hidden">
                            <Plus size={20} className="relative z-10 group-hover:rotate-180 transition-transform duration-700" />
                            <span className="relative z-10">Curate Essence</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Revenue", value: `KES ${Math.round(stats.totalRevenue / 1000)}K`, delta: stats.revenueDelta, icon: <DollarSign /> },
                    { label: "Total Orders", value: stats.totalSales.toLocaleString(), delta: stats.salesDelta, icon: <ShoppingBag /> },
                    { label: "Avg Order Value", value: `KES ${Math.round(stats.p0AOV).toLocaleString()}`, delta: stats.aovDelta, icon: <Zap /> },
                    { label: "Conversion Rate", value: `${stats.p0Conversion.toFixed(1)}%`, delta: stats.conversionDelta, icon: <Activity /> },
                ].map((kpi, i) => (
                    <div key={i} className="bg-surface-container-lowest border border-border/40 p-8 rounded-[40px] shadow-sm hover:border-primary/20 transition-all duration-500">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-4">{kpi.label}</p>
                        <div className="space-y-2">
                            <p className="text-4xl font-black text-foreground tracking-tighter leading-none">{kpi.value}</p>
                            <div className={cn(
                                "flex items-center gap-1.5 text-[11px] font-bold tracking-tight",
                                kpi.delta >= 0 ? "text-emerald-500" : "text-rose-500"
                            )}>
                                {kpi.delta >= 0 ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
                                <span>{Math.abs(kpi.delta)}% vs last period</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Stream Analysis */}
                <div className="lg:col-span-2 bg-surface-container-lowest border border-border/40 rounded-[48px] p-10 shadow-2xl flex flex-col h-[500px]">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-foreground tracking-tight">Revenue stream analysis</h3>
                        <p className="text-xs text-muted-foreground tracking-tight mt-1 opacity-60 italic">Gross income vs order volume — Jan to Jun</p>
                        <div className="flex gap-6 mt-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full border border-muted border-dashed" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Orders</span>
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
                                    strokeWidth={2}
                                    fill="url(#revenueGrad)"
                                    animationDuration={2000}
                                    dot={{ fill: COLORS.primary, r: 3 }}
                                />
                                <Line 
                                    yAxisId="right"
                                    name="Orders"
                                    type="monotone" 
                                    dataKey="orders" 
                                    stroke={COLORS.muted} 
                                    strokeWidth={1.5}
                                    strokeDasharray="4 3"
                                    dot={{ fill: COLORS.muted, r: 3 }}
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue by Category */}
                <div className="bg-surface-container-lowest border border-border/40 rounded-[48px] p-10 shadow-2xl flex flex-col h-[500px]">
                    <div className="mb-0">
                        <h3 className="text-xl font-black text-foreground tracking-tight">Revenue by category</h3>
                        <p className="text-xs text-muted-foreground tracking-tight mt-1 opacity-60 italic">Distribution this period</p>
                    </div>
                    <div className="flex-1 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.revenueByCategory}
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {stats.revenueByCategory.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        {stats.revenueByCategory.map((cat: any, i: number) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black uppercase text-foreground leading-none">{cat.name}</p>
                                    <p className="text-[11px] font-bold text-muted-foreground/40 mt-1">{cat.percentage}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                
                {/* Top Products */}
                <div className="bg-surface-container-lowest border border-border/40 rounded-[48px] p-10 shadow-2xl flex flex-col h-[520px]">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-foreground tracking-tight">Top products</h3>
                        <p className="text-xs text-muted-foreground tracking-tight mt-1 opacity-60 italic">By revenue this period</p>
                    </div>
                    <div className="flex-1 space-y-6 overflow-hidden">
                        {stats.topProducts.map((product: any, i: number) => (
                            <div key={product._id} className="flex items-center gap-6 group">
                                <span className="text-xs font-black text-muted-foreground/20 group-hover:text-primary/40 transition-colors w-4">{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-extrabold text-foreground truncate">{product.name}</p>
                                    <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary transition-all duration-1000 ease-out"
                                            style={{ width: `${product.share}%` }} 
                                        />
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-black text-foreground">KES {Math.round(product.revenue / 1000)}K</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Monthly Revenue Bar View */}
                <div className="bg-surface-container-lowest border border-border/40 rounded-[48px] p-10 shadow-2xl flex flex-col h-[520px]">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-foreground tracking-tight">Monthly revenue</h3>
                        <p className="text-xs text-muted-foreground tracking-tight mt-1 opacity-60 italic">Bar view Jan–Jun</p>
                    </div>
                    <div className="flex-1 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.months}>
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
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
                                                <div className="bg-surface-container-pover border border-white/5 p-4 rounded-3xl shadow-2xl backdrop-blur-xl">
                                                    <p className="text-lg font-black text-foreground tracking-tighter">KES {payload[0].value.toLocaleString()}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar 
                                    dataKey="value" 
                                    radius={[8, 8, 8, 8]}
                                    animationDuration={2000}
                                >
                                    {stats.months.map((entry: any, index: number) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={index === stats.months.length - 1 ? COLORS.primary : "rgba(176, 125, 91, 0.2)"} 
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Status Breakdown */}
                <div className="bg-surface-container-lowest border border-border/40 rounded-[48px] p-10 shadow-2xl flex flex-col h-[520px]">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-foreground tracking-tight">Order status</h3>
                        <p className="text-xs text-muted-foreground tracking-tight mt-1 opacity-60 italic">Current fulfillment breakdown</p>
                    </div>
                    <div className="flex-1 space-y-2">
                        {[
                            { label: "Delivered", key: "delivered", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
                            { label: "Shipped", key: "shipped", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
                            { label: "Processing", key: "processing", color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.06)" },
                            { label: "Pending", key: "pending", color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.06)" },
                            { label: "Cancelled", key: "cancelled", color: "#f43f5e", bg: "rgba(244,63,94,0.1)" },
                        ].map((status, i) => {
                            const count = (stats.statusBreakdown as any)[status.key] || 0;
                            const percentage = stats.totalSales > 0 ? Math.round((count / stats.totalSales) * 100) : 0;
                            return (
                                <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors rounded-2xl group">
                                    <p className="text-sm font-medium text-foreground tracking-tight">{status.label}</p>
                                    <div className="flex items-center gap-6">
                                        <span className="text-xs font-medium text-muted-foreground/40">{count}</span>
                                        <div 
                                            className="min-w-14 text-center py-1 px-3 rounded-full text-[10px] font-bold tracking-widest uppercase"
                                            style={{ backgroundColor: status.bg, color: status.color }}
                                        >
                                            {percentage}%
                                        </div>
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
