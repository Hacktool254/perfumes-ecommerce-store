"use client";

import {
    Area, AreaChart, ResponsiveContainer, Bar, BarChart, Line, LineChart,
    XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell
} from "recharts";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { Calendar, LayoutGrid, Plus, MoreHorizontal, ChevronRight, Dot, TrendingUp } from "lucide-react";

// Mock Data
const visitorData = Array.from({ length: 20 }, () => ({ value: Math.floor(Math.random() * 50) + 20 }));
const productData = Array.from({ length: 15 }, () => ({ value: Math.floor(Math.random() * 100) + 50 }));
const viewsData = Array.from({ length: 10 }, () => ({ value: Math.floor(Math.random() * 30) + 10 }));
const averageOrdersData = Array.from({ length: 15 }, () => ({ value: Math.floor(Math.random() * 40) + 60 }));

const salesData = [
    { name: 'Jan', sales: 400, earning: 240 },
    { name: 'Feb', sales: 300, earning: 139 },
    { name: 'Mar', sales: 500, earning: 680 },
    { name: 'Apr', sales: 278, earning: 390 },
    { name: 'May', sales: 189, earning: 480 },
    { name: 'Jun', sales: 980, earning: 700 }, // Matching image tooltip
    { name: 'Jul', sales: 800, earning: 580 },
    { name: 'Aug', sales: 600, earning: 400 },
    { name: 'Sep', sales: 700, earning: 500 },
    { name: 'Oct', sales: 450, earning: 340 },
    { name: 'Nov', sales: 600, earning: 480 },
    { name: 'Dec', sales: 400, earning: 200 },
];

const pieData = [
    { name: 'Direct', value: 400, color: '#f06292' },
    { name: 'Organic', value: 300, color: '#4fc3f7' },
    { name: 'Referral', value: 300, color: '#5e35b1' },
];

export default function AdminDashboardOverview() {
    return (
        <div className="space-y-6 pt-4 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Dashboard</h1>
                    <p className="text-gray-400 text-sm font-medium">Here is the summary of overall data</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-600 border border-gray-100 font-semibold text-sm hover:shadow-sm">
                        <Calendar size={18} className="text-gray-400" />
                        August 2024
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-gray-600 border border-gray-100 font-semibold text-sm hover:shadow-sm">
                        <LayoutGrid size={18} className="text-gray-400" />
                        Manage Widget Label
                    </button>
                    <button className="w-10 h-10 rounded-full bg-[#0b5cff] text-white flex items-center justify-center hover:bg-blue-600 shadow-md shadow-blue-500/20">
                        <Plus size={20} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Stat Cards - 4 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard
                    title="Total Visitor"
                    value="$45,987"
                    trend={{ value: "12.87%", positive: true }}
                    chart={
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={visitorData}>
                                <defs>
                                    <linearGradient id="colorVisitor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4fc3f7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4fc3f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" stroke="#4fc3f7" strokeWidth={2} fillOpacity={1} fill="url(#colorVisitor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    }
                />

                <AdminStatCard
                    title="Total products"
                    value="$632,235"
                    trend={{ value: "85.23%", positive: true }}
                    chart={
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productData}>
                                <Bar dataKey="value" fill="#00bcd4" radius={[4, 4, 0, 0]} barSize={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    }
                />

                <AdminStatCard
                    title="Total Product Views"
                    value="$25,987"
                    trend={{ value: "90.89%", positive: true }}
                    chart={
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={viewsData}>
                                <Line type="monotone" dataKey="value" stroke="#00acc1" strokeWidth={2} dot={{ r: 3, fill: "#00acc1", strokeWidth: 0 }} strokeDasharray="3 3" />
                            </LineChart>
                        </ResponsiveContainer>
                    }
                />

                <AdminStatCard
                    title="Average Orders"
                    value="$19,214"
                    trend={{ value: "21.12%", positive: true }}
                    chart={
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={averageOrdersData}>
                                <defs>
                                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f06292" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#f06292" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="value" stroke="#f06292" strokeWidth={2} fillOpacity={1} fill="url(#colorAvg)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    }
                />
            </div>

            {/* Middle Section: Main Chart + Featured Product */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">

                {/* Product Sales Chart */}
                <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col h-[500px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Product Sales</h2>
                            <select className="bg-gray-50 border-none text-xs font-semibold text-gray-600 rounded-lg px-3 py-1.5 focus:ring-0 cursor-pointer">
                                <option>All Category</option>
                                <option>Electronics</option>
                                <option>Fashion</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-12">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#0b5cff]"></span>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Sales</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-gray-900">2590</span>
                                    <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-md flex items-center">
                                        <TrendingUp size={12} className="mr-0.5" strokeWidth={3} /> 2.87%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Earning</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-gray-900">$27,208</span>
                                    <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-md flex items-center">
                                        <TrendingUp size={12} className="mr-0.5" strokeWidth={3} /> 2.87%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0b5cff" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0b5cff" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#fbc02d" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#fbc02d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 500 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', fontWeight: 'bold' }}
                                    itemStyle={{ fontSize: '13px' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#0b5cff" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                <Area type="monotone" dataKey="earning" stroke="#fbc02d" strokeWidth={3} fillOpacity={1} fill="url(#colorEarning)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Selling Product */}
                <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.02)] border border-gray-50 flex flex-col items-center justify-between h-[500px]">
                    <div className="w-full flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Top Selling Products</h2>
                        <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-[#0b5cff] font-bold shadow-sm">
                            2
                        </div>
                    </div>

                    <div className="relative flex-1 w-full flex items-center justify-center mt-4">
                        <div className="w-56 h-56 rounded-full bg-[#00bcd4] absolute mix-blend-multiply blur-[2px] opacity-90 right-2 top-8"></div>
                        <img
                            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"
                            alt="Nike Shoes"
                            className="relative z-10 w-64 h-auto transform -rotate-[25deg] hover:scale-105 transition-transform duration-500 drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
                        />
                    </div>

                    <div className="text-center mt-6 w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Nike Shoes</h3>
                        <p className="text-sm font-semibold text-gray-500 mb-6">$12,32</p>

                        <div className="flex items-center justify-center gap-1.5">
                            <span className="w-6 h-1.5 rounded-full bg-[#0b5cff]"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Map, Traffic Source, Comments */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.02)] border border-gray-50 h-[320px] flex flex-col">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Top Countries By Sales</h2>
                    <div className="flex-1 w-full flex items-center justify-center alpha-mask opacity-80">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" className="w-full h-auto opacity-40 grayscale sepia hue-rotate-[190deg]" alt="World Map" />
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.02)] border border-gray-50 h-[320px] flex flex-col items-center">
                    <div className="w-full flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Sales by traffic source</h2>
                        <select className="bg-gray-50 border-none text-xs font-semibold text-gray-600 rounded-lg px-2 py-1 focus:ring-0 cursor-pointer">
                            <option>Monthly</option>
                        </select>
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
                            <span className="text-xl font-bold text-gray-900">April</span>
                            <span className="text-sm font-semibold text-gray-400">2025</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.02)] border border-gray-50 h-[320px] overflow-hidden">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">New Comment</h2>

                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <img src="https://i.pravatar.cc/150?u=kathryn" alt="Kathryn Murphy" className="w-10 h-10 rounded-full shrink-0" />
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm mb-0.5">Kathryn Murphy</h4>
                                <div className="text-[#fbc02d] text-xs mb-1.5 flex gap-0.5">
                                    ★ ★ ★ ★ ★
                                </div>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nec dolor vel est interdum.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 opacity-50">
                            <img src="https://i.pravatar.cc/150?u=leslie" alt="Leslie Alexander" className="w-10 h-10 rounded-full shrink-0" />
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm mb-0.5">Leslie Alexander</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
