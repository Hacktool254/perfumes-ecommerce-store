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

export default function AdminDashboardOverview() {
    const stats = useQuery(api.orders.getStats);

    // Placeholder trend data (could be calculated if we had historical stats)
    const trends = {
        revenue: { value: "12.8%", positive: true },
        sales: { value: "8.4%", positive: true },
        conversion: { value: "2.1%", positive: false },
        lowStock: { value: stats?.lowStockCount.toString() || "0", positive: (stats?.lowStockCount || 0) === 0 }
    };

    if (!stats) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Prepare chart data from stats if available, otherwise use placeholders for visual consistency
    const salesData = [
        { name: 'Total', sales: stats.totalRevenue / 100, earning: stats.monthlyRevenue / 100 },
        // ... in a real app, we'd have historical data points here
    ];

    const pieData = [
        { name: 'Completed', value: stats.totalSales, color: '#4fc3f7' },
        { name: 'Pending', value: stats.recentOrders.filter(o => o.status === 'pending').length, color: '#f06292' },
    ];

    return (
        <div className="space-y-6 pt-4 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-foreground leading-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground text-sm font-medium">Real-time business performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2.5 rounded-xl bg-card text-card-foreground border border-border font-semibold text-sm">
                        {format(new Date(), "MMMM yyyy")}
                    </div>
                    <Link href="/admin/products/new">
                        <button className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 shadow-md shadow-primary/20 transition-all">
                            <Plus size={20} strokeWidth={3} />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Stat Cards - 4 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard
                    title="Total Revenue"
                    value={`KES ${stats.totalRevenue.toLocaleString()}`}
                    trend={trends.revenue}
                    icon={<DollarSign className="w-4 h-4 text-emerald-500" />}
                />

                <AdminStatCard
                    title="Total Sales"
                    value={stats.totalSales.toString()}
                    trend={trends.sales}
                    icon={<ShoppingBag className="w-4 h-4 text-primary" />}
                />

                <AdminStatCard
                    title="Conversion Rate"
                    value={`${stats.conversionRate}%`}
                    trend={trends.conversion}
                    icon={<UsersIcon className="w-4 h-4 text-purple-500" />}
                />

                <AdminStatCard
                    title="Low Stock Alert"
                    value={stats.lowStockCount.toString()}
                    trend={{ value: "Items", positive: stats.lowStockCount === 0 }}
                    icon={<Package className="w-4 h-4 text-amber-500" />}
                />
            </div>

            {/* Middle Section: Top Products + Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">

                {/* Recent Orders List */}
                <div className="bg-card rounded-[24px] p-6 shadow-sm border border-border flex flex-col h-[500px]">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold text-card-foreground">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                            View All <ChevronRight size={12} />
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {stats.recentOrders.map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <ShoppingBag size={18} className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-foreground">{order.customerName}</p>
                                        <p className="text-xs text-muted-foreground">{format(order.createdAt, "MMM d, h:mm a")}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-foreground">KES {order.totalAmount.toLocaleString()}</p>
                                    <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full border ${order.status === 'paid' || order.status === 'delivered'
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-card rounded-[24px] p-6 shadow-sm border border-border flex flex-col h-[500px]">
                    <h2 className="text-lg font-bold text-card-foreground mb-6">Top Products</h2>
                    <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                        {stats.topProducts.map((product: any, idx: number) => (
                            <div key={product._id} className="flex items-center gap-4 group">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border shrink-0">
                                    <img
                                        src={product.images[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=100&auto=format&fit=crop"}
                                        alt={product.name}
                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-foreground truncate">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{product.brand || "Ummie's Essence"}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-primary">#{idx + 1}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{product.stock} left</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link href="/admin/products" className="mt-6">
                        <button className="w-full py-3 rounded-xl bg-muted text-foreground font-bold text-xs uppercase tracking-widest hover:bg-muted/80 transition-colors">
                            Manage Inventory
                        </button>
                    </Link>
                </div>
            </div>

            {/* Traffic Source / Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-[24px] p-6 shadow-sm border border-border flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-card-foreground">Order Status Distribution</h2>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Lifetime</span>
                    </div>
                    <div className="w-48 h-48 relative mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={65}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={8}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-xl font-bold text-foreground">{stats.totalSales}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                    <div className="flex gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#4fc3f7]"></div>
                            <span className="text-xs font-medium text-muted-foreground">Completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#f06292]"></div>
                            <span className="text-xs font-medium text-muted-foreground">Pending</span>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-[24px] p-6 shadow-sm border border-border h-full flex flex-col justify-center items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Monthly Performance</h3>
                        <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-2">
                            You earned <span className="text-foreground font-bold">KES {stats.monthlyRevenue.toLocaleString()}</span> from <span className="text-foreground font-bold">{stats.monthlySales}</span> orders this month.
                        </p>
                    </div>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-4">
                        <div className="h-full bg-emerald-500" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">65% of target reached</p>
                </div>
            </div>
        </div>
    );
}
