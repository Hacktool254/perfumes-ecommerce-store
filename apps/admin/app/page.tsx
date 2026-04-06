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
            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Admin / Overview</p>
                    </div>
                    <h1 className="text-[42px] font-bold text-foreground leading-[1.1] tracking-tight">
                        Business <span className="text-primary italic font-serif">Aesthetics</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 rounded-full bg-surface-container-lowest shadow-sm flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold text-foreground">{format(new Date(), "MMMM yyyy")}</span>
                    </div>
                    <Link href="/products/new">
                        <button className="flex items-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:translate-y-[-2px] transition-transform shadow-lg shadow-primary/20">
                            <Plus size={18} />
                            <span>Add Product</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stat Cards - Phase 1 Metric Focus */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <AdminStatCard
                    title="Gross Revenue"
                    value={`KES ${stats.totalRevenue.toLocaleString()}`}
                    trend={trends.revenue}
                    icon={<DollarSign size={24} />}
                />
                <AdminStatCard
                    title="Volume"
                    value={stats.totalSales.toString()}
                    trend={trends.sales}
                    icon={<ShoppingBag size={24} />}
                />
                <AdminStatCard
                    title="Success Rate"
                    value={`${stats.conversionRate}%`}
                    trend={trends.conversion}
                    icon={<UsersIcon size={24} />}
                />
                <AdminStatCard
                    title="Inventory Health"
                    value={stats.lowStockCount.toString()}
                    trend={{ value: "Critical", positive: stats.lowStockCount === 0 }}
                    icon={<Package size={24} />}
                />
            </div>

            {/* Main Visual Data Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 mt-12">
                
                {/* Recent Transactions List */}
                <div className="bg-surface-container-lowest rounded-[40px] p-10 shadow-sm flex flex-col h-[600px] relative">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground tracking-tight">Recent Activity</h2>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">Real-time order flow and customer engagement</p>
                        </div>
                        <Link href="/transactions" className="w-12 h-12 rounded-full border border-surface-container flex items-center justify-center hover:bg-surface-container transition-colors group">
                            <ChevronRight size={20} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-4 custom-scrollbar">
                        {stats.recentOrders.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-5 rounded-[24px] hover:bg-surface-container-low transition-all duration-300 group">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                        <ShoppingBag size={22} className="text-primary" />
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-base text-foreground tracking-tight">{order.customerName}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs text-muted-foreground font-medium">{format(order.createdAt, "MMM d, h:mm a")}</p>
                                            <Dot className="text-muted-foreground w-3 h-3" />
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">#{order._id.slice(-6)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-extrabold text-lg text-foreground tracking-tighter">KES {order.totalAmount.toLocaleString()}</p>
                                    <div className="flex items-center justify-end gap-1.5 mt-1.5">
                                        <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            order.status === 'paid' || order.status === 'delivered' ? "bg-emerald-500" : "bg-amber-500"
                                        )} />
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-widest",
                                            order.status === 'paid' || order.status === 'delivered' ? "text-emerald-600" : "text-amber-600"
                                        )}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Assets (Products) Grid */}
                <div className="space-y-8 flex flex-col h-[600px]">
                    <div className="bg-surface-container rounded-[40px] p-10 flex-1 shadow-sm overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-8">
                            <TrendingUp size={24} className="text-primary opacity-20 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-10 tracking-tight">Top Curator Assets</h2>
                        
                        <div className="space-y-8 overflow-y-auto h-[calc(100%-80px)] pr-2 custom-scrollbar">
                            {stats.topProducts.map((product: any, idx: number) => (
                                <div key={product._id} className="flex items-center gap-5 transition-all duration-500 group/item">
                                    <div className="relative w-16 h-16 rounded-[20px] overflow-hidden shadow-md group-hover/item:scale-110 transition-transform duration-700 bg-white p-2">
                                        <img
                                            src={product.images[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=100&auto=format&fit=crop"}
                                            alt={product.name}
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-base text-foreground truncate tracking-tight">{product.name}</p>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">{product.brand || "Timeless"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-primary italic font-serif">No. {idx + 1}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest bg-surface-container-low px-2 py-0.5 rounded-full mt-1.5">{product.stock} units</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Distribution Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
                <div className="bg-surface-container-lowest rounded-[40px] p-10 shadow-sm flex flex-col items-center">
                    <div className="w-full mb-8 text-center">
                        <h2 className="text-xl font-bold text-foreground tracking-tight">Status Distribution</h2>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em] mt-1">Global Fulfillment</p>
                    </div>
                    <div className="w-56 h-56 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={75}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                            <span className="text-4xl font-black text-foreground tracking-tighter">{stats.totalSales}</span>
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.25em]">Orders</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-10 w-full">
                        {pieData.map((item) => (
                            <div key={item.name} className="flex flex-col items-center gap-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.name}</span>
                                </div>
                                <span className="text-xl font-bold text-foreground">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-primary rounded-[40px] p-12 text-primary-foreground relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <TrendingUp size={120} strokeWidth={1} />
                    </div>
                    <div className="relative z-10 max-w-[500px]">
                        <h3 className="text-3xl font-bold leading-tight tracking-[calc(-0.02em)]">Monthly <span className="italic font-serif opacity-90">Momentum</span></h3>
                        <p className="text-primary-foreground/70 text-base font-medium mt-6 leading-relaxed">
                            Your operations are showing exceptional growth. This month generated 
                            <span className="text-white font-bold mx-1.5 underline decoration-primary-foreground/30 underline-offset-4">KES {stats.monthlyRevenue.toLocaleString()}</span> 
                            across <span className="text-white font-bold mx-1">{stats.monthlySales} assets</span>.
                        </p>
                        
                        <div className="mt-12 space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest opacity-80">
                                <span>Target Achievement</span>
                                <span>65%</span>
                            </div>
                            <div className="w-full h-2 bg-primary-foreground/10 rounded-full overflow-hidden backdrop-blur-sm">
                                <div className="h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)]" style={{ width: '65%' }}></div>
                            </div>
                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">Approaching quarterly benchmark</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
