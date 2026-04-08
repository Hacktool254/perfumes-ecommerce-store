"use client";

import {
    Area, AreaChart, ResponsiveContainer, Bar, BarChart, Line, LineChart,
    XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell
} from "recharts";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { Calendar, LayoutGrid, Plus, MoreHorizontal, ChevronRight, Dot, TrendingUp, Package, ShoppingBag, Users as UsersIcon, DollarSign, Activity } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SeedButton } from "../../src/components/admin/seed-button";

export default function UmmiesEssenceDashboard() {
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
        { name: 'Completed', value: stats.totalSales, color: 'var(--color-2)' },
        { name: 'Pending', value: stats.recentOrders.filter(o => o.status === 'pending').length, color: 'var(--color-1)' },
    ];

    const chartColors = ['var(--color-1)', 'var(--color-2)', 'var(--color-4)', 'var(--color-5)'];

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Elegant Header Area */}
            <div className="flex items-end justify-between border-b border-border/40 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-[1px] bg-primary/40 rounded-full" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/60">Boutique Intelligence</p>
                    </div>
                    <h1 className="text-5xl font-extrabold text-foreground tracking-tighter leading-none">
                        UMMIE&apos;S <span className="text-primary italic font-serif font-medium">ESSENCE</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 h-14 rounded-2xl bg-surface-container border border-border/50 shadow-sm flex items-center gap-4 group hover:bg-surface-container-high transition-all">
                        <Calendar className="w-5 h-5 text-primary/60" />
                        <span className="text-sm font-bold text-foreground/80 tracking-tight uppercase">{format(new Date(), "MMMM yyyy")}</span>
                    </div>
                    <Link href="/products/new">
                        <button className="flex items-center gap-3 h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-extrabold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 group">
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                            <span>New Fragrance</span>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Premium Stat Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard
                    title="Total Revenue"
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
                    title="Customer Velocity"
                    value={`${stats.conversionRate}%`}
                    trend={trends.conversion}
                    icon={<UsersIcon size={20} />}
                />
                <AdminStatCard
                    title="Inventory Health"
                    value={stats.lowStockCount.toString()}
                    trend={{ value: stats.lowStockCount === 0 ? "Optimal" : "Check Stock", positive: stats.lowStockCount === 0 }}
                    icon={<Package size={20} />}
                />
            </div>

            {/* Editorial Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 mt-12">
                
                {/* Visual Sales Stream */}
                <div className="bg-surface-container-lowest border border-border/50 rounded-[48px] p-10 shadow-xl shadow-surface-container/20 flex flex-col h-[700px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
                    
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                            <h2 className="text-3xl font-extrabold text-foreground tracking-tighter">Engagement Stream</h2>
                            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-3 bg-surface-container w-fit px-3 py-1 rounded-full">Real-time Acquisition</p>
                        </div>
                        <Link href="/orders" className="w-14 h-14 rounded-2xl bg-surface-container border border-border/50 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-500 group/link">
                            <ChevronRight size={22} className="group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar relative z-10">
                        {stats.recentOrders.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-6 rounded-[32px] bg-surface-container/40 border border-transparent hover:border-primary/20 hover:bg-surface-container-lowest transition-all duration-500 group/row shadow-sm hover:shadow-md">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-surface-container-lowest border border-border/20 flex items-center justify-center shadow-inner relative overflow-hidden group-hover/row:scale-105 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/row:opacity-100 transition-opacity" />
                                        <ShoppingBag size={24} className="text-primary/60" />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-lg text-foreground tracking-tight">{order.customerName}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{format(order.createdAt, "MMM d, h:mm a")}</p>
                                            <Dot className="text-primary/20 w-4 h-4" />
                                            <p className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em]">{order._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-extrabold text-2xl text-foreground tracking-tighter">KES {order.totalAmount.toLocaleString()}</p>
                                    <div className="flex items-center justify-end gap-2 mt-3">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            order.status === 'paid' || order.status === 'delivered' ? "bg-primary shadow-[0_0_12px_var(--primary)]" : "bg-muted-foreground/30 shadow-none"
                                        )} />
                                        <span className={cn(
                                            "text-[10px] font-extrabold uppercase tracking-[0.2em]",
                                            order.status === 'paid' || order.status === 'delivered' ? "text-primary/80" : "text-muted-foreground/60"
                                        )}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Intelligence */}
                <div className="space-y-8 flex flex-col h-[700px]">
                    <div className="bg-primary text-primary-foreground rounded-[48px] p-12 flex-1 shadow-2xl overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-25 transition-opacity duration-1000 rotate-12 group-hover:rotate-0 transform-gpu">
                            <Activity size={120} strokeWidth={1} />
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tighter mb-12 relative z-10 leading-none">Curator<br/>Success</h2>
                        
                        <div className="space-y-6 overflow-y-auto h-[calc(100%-140px)] pr-2 custom-scrollbar relative z-10">
                            {stats.topProducts.map((product: any, idx: number) => (
                                <div key={product._id} className="flex items-center gap-6 transition-all duration-500 group/item bg-white/10 p-5 rounded-[32px] border border-white/10 hover:bg-white/20">
                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl group-hover/item:scale-110 transition-transform duration-700 bg-white/20 p-2 border border-white/20">
                                        <img
                                            src={product.images[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=100&auto=format&fit=crop"}
                                            alt={product.name}
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-extrabold text-base text-white truncate tracking-tight">{product.name}</p>
                                        <p className="text-[10px] text-white/60 font-bold uppercase tracking-[0.3em] mt-2 italic">{product.brand || "Ummies Essence"}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-serif italic text-sm mb-2 ml-auto border border-white/20">#{idx + 1}</div>
                                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">{product.stock} Units</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategic Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 mt-4">
                <div className="bg-surface-container border border-border/50 rounded-[48px] p-12 shadow-inner flex flex-col items-center group relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-[100px]" />
                    
                    <div className="w-full mb-12 text-center relative z-10">
                        <h2 className="text-2xl font-extrabold text-foreground tracking-tighter">Strategic Impact</h2>
                        <p className="text-[10px] uppercase font-bold text-primary/60 tracking-[0.4em] mt-3">Distribution Fidelity</p>
                    </div>
                    
                    <div className="w-64 h-64 relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={80}
                                    outerRadius={105}
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
                            <span className="text-5xl font-extrabold text-foreground tracking-tighter leading-none">{stats.totalSales}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-3">Verified</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mt-14 w-full relative z-10">
                        {pieData.map((item, idx) => (
                            <div key={item.name} className="flex flex-col items-center gap-3 bg-surface-container-lowest py-6 rounded-[32px] shadow-sm border border-border/20">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.name}</span>
                                </div>
                                <span className="text-3xl font-extrabold text-foreground tracking-tighter leading-none">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-surface-container-lowest border border-border/50 rounded-[48px] p-14 text-foreground relative overflow-hidden flex flex-col justify-center group shadow-xl shadow-surface-container/10">
                    <div className="absolute top-0 right-0 p-20 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000 scale-150 group-hover:scale-100 transform-gpu pointer-events-none">
                        <TrendingUp size={300} strokeWidth={1} className="text-primary" />
                    </div>
                    
                    <div className="relative z-10 max-w-[650px] space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[2px] bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
                            <h3 className="text-[13px] font-bold uppercase tracking-[0.5em] text-primary/80">Monthly Velocity Analysis</h3>
                        </div>
                        <h3 className="text-6xl font-extrabold leading-[0.85] tracking-tighter italic font-serif">Aura of <span className="text-primary not-italic">Success</span></h3>
                        <p className="text-muted-foreground text-xl font-medium leading-relaxed max-w-[550px]">
                            Operational monitoring confirms a record acquisition of 
                            <span className="text-foreground font-extrabold italic mx-2 border-b-2 border-primary/20">KES {stats.monthlyRevenue.toLocaleString()}</span> 
                            manifested through <span className="text-primary font-bold mx-1">{stats.monthlySales} verified assets</span> in this cycle.
                        </p>
                        
                        <div className="pt-10 space-y-6">
                            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.4em] text-primary/80">
                                <span>Deployment Fidelity Benchmark</span>
                                <span className="text-foreground font-extrabold">92.8%</span>
                            </div>
                            <div className="w-full h-3.5 bg-surface-container rounded-full overflow-hidden border border-border/20 p-[2px]">
                                <div className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full shadow-lg shadow-primary/30 transition-all duration-1000 ease-out" style={{ width: '92.8%' }}></div>
                            </div>
                            <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-muted-foreground/40 italic">Syncing with global essence standards...</p>
                        </div>
                    </div>
                </div>
            </div>
            <SeedButton />
        </div>
    );
}
