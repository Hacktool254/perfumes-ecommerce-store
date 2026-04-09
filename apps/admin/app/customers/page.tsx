"use client";

import { 
    Users as UsersIcon, 
    Mail, 
    Phone, 
    ShoppingBag, 
    Calendar, 
    Search, 
    Filter,
    Plus,
    ChevronRight,
    Star,
    Sparkles,
    Loader2,
    Activity,
    ArrowUpRight
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { cn } from "@/lib/utils";
import { AdminStatCard } from "@/components/admin/admin-stat-card";

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const customers = useQuery(api.users.list, { searchTerm });

    // Loading State
    if (customers === undefined) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">Syncing Curated Community Hierarchy...</p>
                </div>
            </div>
        );
    }

    // Derived Metrics
    const totalCurators = customers.length;
    const vipSegment = customers.filter(c => c.status === "VIP").length;
    const totalInvestment = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
    const avgEngagement = totalCurators > 0 ? Math.round((customers.reduce((acc, c) => acc + (c.orderCount || 0), 0) / totalCurators) * 10) / 10 : 0;

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Editorial Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-12 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1.5px] bg-primary animate-glow rounded-full shadow-[0_0_15px_#B07D5B33]" />
                        <p className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/80">Patron Directory</p>
                    </div>
                    <h1 className="text-6xl font-black text-foreground tracking-tighter leading-none">
                        CURATED <span className="text-primary italic font-serif font-medium">COMMUNITY</span>
                    </h1>
                </div>
                <div className="flex items-center gap-5">
                    <div className="relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Identify Patron..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-16 w-full md:w-80 bg-surface-container-lowest border border-border/40 rounded-[24px] pl-14 pr-8 text-sm font-black focus:ring-2 focus:ring-primary/20 transition-all shadow-sm hover:border-primary/20 placeholder:text-muted-foreground/20 leading-none"
                        />
                    </div>
                    <button className="w-16 h-16 rounded-[24px] bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30 group">
                        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            {/* Segment Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard 
                    title="Total Curators" 
                    value={totalCurators.toLocaleString()} 
                    icon={<UsersIcon size={18} />}
                    trend={{ value: "Live Stream", positive: true }}
                />
                <AdminStatCard 
                    title="VIP Integrity" 
                    value={vipSegment.toString()} 
                    icon={<Star size={18} />}
                    trend={{ value: `${totalCurators > 0 ? Math.round((vipSegment/totalCurators)*100) : 0}% Yield`, positive: true }}
                />
                <AdminStatCard 
                    title="Total Investment" 
                    value={`KES ${totalInvestment.toLocaleString()}`} 
                    icon={<ShoppingBag size={18} />}
                />
                <AdminStatCard 
                    title="Avg. Acquisition" 
                    value={`${avgEngagement} Flows`} 
                    icon={<Calendar size={18} />}
                />
            </div>

            {/* Patron Profile Hub */}
            <div className="bg-surface-container-lowest border border-border/40 rounded-[56px] p-10 md:p-14 shadow-2xl relative overflow-hidden group/hub h-fit">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 group-hover/hub:bg-primary/10 transition-all duration-1000" />
                
                <div className="flex items-center justify-between mb-14 relative z-10">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-foreground tracking-tighter leading-none">Hierarchy <span className="italic font-serif font-medium text-primary">Manifest</span></h2>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-[1px] bg-primary/40 rounded-full" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Verified Identity Stream</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 relative z-10">
                    {customers.length === 0 ? (
                        <div className="py-24 text-center space-y-4">
                            <Activity className="w-12 h-12 text-primary/20 mx-auto animate-pulse" />
                            <p className="text-muted-foreground/40 font-black uppercase tracking-[0.4em] text-[10px] italic">Zero active signatures found in this spectrum</p>
                        </div>
                    ) : (
                        customers.map((customer, idx) => (
                            <div key={customer._id} className="flex flex-col lg:flex-row lg:items-center justify-between p-8 rounded-[40px] hover:bg-surface-container/30 border border-transparent hover:border-primary/10 transition-all duration-700 group/patron relative overflow-hidden">
                                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-border/20 to-transparent group-last/patron:hidden" />
                                
                                <div className="flex items-center gap-8">
                                    <div className="relative w-20 h-20 rounded-[28px] overflow-hidden shadow-2xl group-hover/patron:scale-105 transition-transform duration-1000 bg-surface-container ring-1 ring-border/5">
                                        <img 
                                            src={customer.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.email}`} 
                                            alt={customer.name || "Curator"} 
                                            className="object-cover w-full h-full group-hover/patron:scale-110 transition-transform duration-1000" 
                                        />
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/patron:opacity-100 transition-opacity" />
                                        {customer.status === "VIP" && (
                                            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-4 border-surface-container-lowest shadow-xl animate-in zoom-in-0 duration-500 delay-300">
                                                <Star size={12} className="text-white fill-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-4">
                                            <h3 className="font-black text-2xl text-foreground tracking-tighter leading-none">
                                                {customer.name || "Anonymous Curator"}
                                            </h3>
                                            {customer.role === "admin" && <span className="text-[9px] bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest font-black border border-primary/20">Executive</span>}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">
                                                <Mail size={12} className="text-primary/40" />
                                                <span>{customer.email}</span>
                                            </div>
                                            {customer.phone && (
                                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 font-black uppercase tracking-widest">
                                                    <Phone size={12} className="text-primary/40" />
                                                    <span>{customer.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between lg:justify-end gap-12 md:gap-20 mt-8 lg:mt-0">
                                    <div className="text-right space-y-2 group-hover/patron:-translate-y-1 transition-transform duration-700">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Total Investment</p>
                                        <p className="font-black text-2xl text-foreground tracking-tighter leading-none">KES {(customer.totalSpent || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right space-y-2 group-hover/patron:-translate-y-1 transition-transform duration-700 delay-75">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Engagement Vol.</p>
                                        <p className="font-black text-2xl text-foreground tracking-tighter leading-none">{customer.orderCount || 0} Flows</p>
                                    </div>
                                    <button className="w-14 h-14 rounded-[20px] flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-700 group/btn bg-surface-container border border-border/10 shadow-inner group-hover/patron:scale-110 group-hover/patron:rotate-12">
                                        <ChevronRight size={22} className="group-hover/btn:translate-x-0.5 transition-all" />
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>

                <div className="mt-16 flex justify-center relative z-10">
                    <button className="h-16 px-14 rounded-[24px] border border-primary/10 bg-surface-container/50 text-[10px] font-black text-primary uppercase tracking-[0.5em] hover:bg-primary hover:text-primary-foreground transition-all duration-1000 shadow-sm hover:shadow-xl group">
                        <span className="flex items-center gap-4">
                            Expand Hierarchy Matrix
                            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </span>
                    </button>
                </div>
            </div>

            {/* Retention Marketing Protocol */}
            <div className="bg-foreground rounded-[64px] p-12 md:p-16 text-background overflow-hidden relative shadow-2xl group/marketing">
                <div className="absolute top-0 right-0 p-16 opacity-5 group-hover/marketing:opacity-20 transition-opacity duration-1000 rotate-12 group-hover/marketing:rotate-0 scale-150 group-hover/marketing:scale-100 pointer-events-none">
                    <SparklesIcon size={280} />
                </div>
                <div className="absolute top-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2" />
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="max-w-[650px] space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[1px] bg-primary rounded-full shadow-[0_0_10px_#B07D5B33]" />
                            <h3 className="text-[13px] font-black tracking-[0.6em] uppercase text-primary/80">Retention Protocol</h3>
                        </div>
                        <h3 className="text-6xl font-black tracking-tighter leading-[0.8] italic font-serif group-hover/marketing:scale-[1.02] transition-transform duration-1000">Aura of <span className="text-primary not-italic italic">Re-engagement</span></h3>
                        <p className="text-background/50 text-2xl font-medium leading-relaxed italic">
                            Manifest personalized fragrance signatures for your top curators based on seasonal olfactory acquisitions.
                        </p>
                    </div>
                    <button className="h-20 px-16 rounded-[28px] bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-primary/40 whitespace-nowrap group">
                        <span className="flex items-center gap-4">
                            Deploy Campaign
                            <Zap size={18} className="animate-pulse" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function SparklesIcon({ size, className = "" }: { size: number, className?: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
        </svg>
    )
}

function Zap({ size, className = "" }: { size: number, className?: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    )
}
