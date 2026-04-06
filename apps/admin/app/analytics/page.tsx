"use client";

import { 
    Area, AreaChart, ResponsiveContainer, Bar, BarChart, Line, LineChart, 
    XAxis, YAxis, Tooltip, CartesianGrid, Legend 
} from "recharts";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, Download } from "lucide-react";

const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 145 },
    { month: 'Mar', revenue: 48000, orders: 132 },
    { month: 'Apr', revenue: 61000, orders: 178 },
    { month: 'May', revenue: 55000, orders: 160 },
    { month: 'Jun', revenue: 67000, orders: 195 },
];

const categoryData = [
    { name: 'Oud', value: 45 },
    { name: 'Floral', value: 30 },
    { name: 'Musk', value: 15 },
    { name: 'Spicy', value: 10 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Admin / Analytics</p>
                    </div>
                    <h1 className="text-[42px] font-bold text-foreground leading-[1.1] tracking-tight">
                        Predictive <span className="text-primary italic font-serif">Growth</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 h-12 px-6 rounded-full bg-surface-container-lowest text-foreground font-bold text-sm shadow-sm hover:bg-surface-container transition-colors">
                        <Download size={18} />
                        <span>Export Report</span>
                    </button>
                    <div className="px-6 py-3 rounded-full bg-primary text-primary-foreground flex items-center gap-3 shadow-lg shadow-primary/20">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-bold">Last 6 Months</span>
                    </div>
                </div>
            </div>

            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Average Order Value", value: "KES 8,450", trend: "+5.2%", positive: true },
                    { label: "Customer Acquisition Cost", value: "KES 1,200", trend: "-12.4%", positive: true },
                    { label: "Lifetime Value (LTV)", value: "KES 42,000", trend: "+18.2%", positive: true }
                ].map((stat, i) => (
                    <div key={i} className="bg-surface-container-lowest rounded-[32px] p-8 shadow-sm group hover:shadow-md transition-all duration-500">
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                            <div className={`flex items-center gap-1 text-xs font-bold ${stat.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 gap-8">
                {/* Revenue & Volume Chart */}
                <div className="bg-surface-container-lowest rounded-[40px] p-10 shadow-sm">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">Revenue Stream Analysis</h2>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">Comparison between gross income and order volume</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary/30" />
                                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Orders</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#BF8A68" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#BF8A68" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 12, fontWeight: 600, fill: '#A0A0A0' }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 12, fontWeight: 600, fill: '#A0A0A0' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '20px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                        padding: '12px 20px'
                                    }} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#BF8A68" 
                                    strokeWidth={4}
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="orders" 
                                    stroke="#BF8A68" 
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    fill="transparent" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sub Analysis Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Category Distribution */}
                    <div className="bg-surface-container rounded-[40px] p-10 shadow-sm border border-surface-container-highest/20">
                        <h2 className="text-xl font-bold text-foreground mb-8 tracking-tight">Fragrance Affinities</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        axisLine={false} 
                                        tickLine={false}
                                        tick={{ fontSize: 14, fontWeight: 700, fill: '#2A2121' }}
                                        width={80}
                                    />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar 
                                        dataKey="value" 
                                        fill="#A6568A" 
                                        radius={[0, 10, 10, 0]} 
                                        barSize={24}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Growth Momentum CTA */}
                    <div className="bg-color-3 rounded-[40px] p-12 text-white relative overflow-hidden flex flex-col justify-center shadow-lg shadow-color-3/20">
                        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
                                <TrendingUp className="text-white w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold italic font-serif">Market Sentiment</h3>
                            <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-[280px]">
                                Your brand equity is performing 24% above the industry average in the luxury fragrance segment.
                            </p>
                            <button className="mt-8 h-12 px-8 rounded-full bg-white text-color-3 font-bold text-sm tracking-wide hover:scale-105 transition-transform">
                                Review Full Audit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
