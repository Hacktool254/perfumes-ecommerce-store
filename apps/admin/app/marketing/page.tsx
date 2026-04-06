"use client";

import { 
    Megaphone, 
    Sparkles, 
    Plus, 
    ArrowUpRight, 
    ChevronRight, 
    Users, 
    Zap, 
    Tag, 
    Clock, 
    Image as ImageIcon, 
    Play, 
    BarChart3,
    Calendar,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";

const activeCampaigns = [
    { 
        id: "C-101", 
        name: "Eid al-Fitr '24", 
        budget: "KES 50,000", 
        reach: "12.5k", 
        engagement: "8.2%", 
        status: "Active",
        start: "2024-04-01",
        end: "2024-04-15"
    },
    { 
        id: "C-102", 
        name: "Rose Collection Launch", 
        budget: "KES 22,000", 
        reach: "5.8k", 
        engagement: "12.4%", 
        status: "Scheduled",
        start: "2024-05-01",
        end: "2024-05-07"
    },
    { 
        id: "C-103", 
        name: "Loyalty Flash Sale", 
        budget: "KES 15,000", 
        reach: "3.2k", 
        engagement: "18.5%", 
        status: "Closed",
        start: "2024-03-20",
        end: "2024-03-24"
    },
];

const discountCodes = [
    { code: "UMMIE20", type: "Percentage", value: "20%", usage: 145, active: true },
    { code: "RAMADAN5k", type: "Fixed", value: "KES 5,000", usage: 42, active: true },
    { code: "WELCOME10", type: "Percentage", value: "10%", usage: 890, active: true },
];

export default function MarketingPage() {
    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Admin / Creative</p>
                    </div>
                    <h1 className="text-[42px] font-bold text-foreground leading-[1.1] tracking-tight">
                        Creative <span className="text-primary italic font-serif">Strategy</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:translate-y-[-2px] transition-transform shadow-lg shadow-primary/20">
                        <Plus size={18} />
                        <span>Create Campaign</span>
                    </button>
                    <button className="w-12 h-12 rounded-full bg-surface-container-low border border-surface-container-highest/20 flex items-center justify-center hover:bg-surface-container transition-colors">
                        <Calendar size={20} />
                    </button>
                </div>
            </div>

            {/* Campaign Reach Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Reach", value: "245k", icon: <Users size={16} /> },
                    { label: "Conversion rate", value: "3.4%", icon: <Target size={16} /> },
                    { label: "Active Promos", value: "12", icon: <Tag size={16} /> },
                    { label: "Ad Spend / ROAS", value: "14.2x", icon: <BarChart3 size={16} /> }
                ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-[32px] bg-surface-container-lowest shadow-sm flex flex-col justify-between h-[160px] group hover:bg-surface-container-low transition-all duration-500">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]">{stat.label}</p>
                            {stat.icon}
                        </div>
                        <p className="text-4xl font-extrabold tracking-tighter mt-4">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Active Campaigns List */}
            <div className="bg-surface-container-lowest rounded-[40px] p-10 shadow-sm relative">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Campaign Streams</h2>
                    <div className="flex items-center gap-3">
                        <button className="h-10 px-6 rounded-full border border-surface-container-highest/20 text-xs font-bold text-muted-foreground hover:bg-surface-container transition-colors">
                            All History
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {activeCampaigns.map((camp) => (
                        <div key={camp.id} className="flex items-center justify-between p-6 rounded-[28px] group hover:bg-surface-container-low transition-all duration-300 relative overflow-hidden">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-[22px] bg-surface-container flex items-center justify-center shadow-sm text-primary group-hover:scale-105 transition-transform duration-500">
                                    <Megaphone size={24} />
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-foreground tracking-tight">{camp.name}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                            <Calendar size={12} />
                                            <span>{camp.start} — {camp.end}</span>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary italic font-serif opacity-80">{camp.id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12 text-right">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Allocation</p>
                                    <p className="font-extrabold text-base text-foreground tracking-tight">{camp.budget}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Engagement</p>
                                    <p className="font-extrabold text-base text-foreground tracking-tight">{camp.engagement}</p>
                                </div>
                                <div className="w-32 flex justify-end">
                                    <div className={cn(
                                        "px-4 py-1.5 rounded-full flex items-center gap-2 transition-all duration-500",
                                        camp.status === 'Active' ? "bg-emerald-50 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : 
                                        camp.status === 'Scheduled' ? "bg-primary/5 text-primary" : 
                                        "bg-surface-container-highest opacity-50"
                                    )}>
                                        {camp.status === 'Active' && <Zap size={10} className="fill-emerald-600" />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{camp.status}</span>
                                    </div>
                                </div>
                                <button className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface-container-highest/20 transition-colors group/btn">
                                    <ChevronRight size={20} className="text-muted-foreground group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Section: Discounts & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Discount Code Inventory */}
                <div className="bg-surface-container-lowest rounded-[40px] p-10 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-foreground tracking-tight">Active Promo Codes</h2>
                        <button className="text-[10px] font-bold underline decoration-primary/30 uppercase tracking-widest text-primary">Add New Code</button>
                    </div>
                    <div className="space-y-3">
                        {discountCodes.map((d) => (
                            <div key={d.code} className="flex items-center justify-between p-5 rounded-[24px] bg-surface-container-low/50 hover:bg-surface-container-low transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                        <Tag size={16} />
                                    </div>
                                    <div>
                                        <p className="font-extrabold text-sm text-foreground tracking-tighter">{d.code}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold opacity-60 uppercase">{d.type} — {d.value}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Usage</p>
                                        <p className="font-bold text-sm text-foreground">{d.usage}</p>
                                    </div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Creative Asset Hub */}
                <div className="bg-surface-container rounded-[40px] p-12 overflow-hidden relative shadow-sm group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 rotate-12 transition-all group-hover:rotate-0 duration-700">
                        <ImageIcon size={140} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-foreground mb-6 tracking-tight">Asset Library</h2>
                        <div className="flex gap-4 mb-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-20 h-20 rounded-2xl bg-white p-2 shadow-sm relative group/thumb overflow-hidden cursor-pointer">
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                                        <Play size={16} className="text-white fill-white" />
                                    </div>
                                    <div className="w-full h-full bg-surface-container rounded-xl" />
                                </div>
                            ))}
                            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-surface-container-highest/50 flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:text-primary transition-all cursor-pointer">
                                <Plus size={20} />
                                <span className="text-[8px] font-black uppercase mt-1">Upload</span>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground font-medium max-w-[280px] leading-relaxed mt-10">
                            Central branding assets, including the latest <span className="text-foreground font-bold">Serene Architect</span> design system tokens.
                        </p>
                        <button className="h-10 px-8 rounded-full border border-surface-container-highest/20 text-[10px] font-extrabold uppercase mt-6 tracking-widest text-muted-foreground hover:bg-surface-container-highest/20 transition-colors">
                            Enter Curator Hub
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
