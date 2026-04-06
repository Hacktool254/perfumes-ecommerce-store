"use client";

import { 
    Users, 
    MoreHorizontal, 
    Mail, 
    Phone, 
    ShoppingBag, 
    Calendar, 
    Search, 
    Filter,
    Plus,
    ChevronRight,
    Star
} from "lucide-react";
import { cn } from "@/lib/utils";

const customers = [
    { 
        id: "1", 
        name: "Sarah Johnstone", 
        email: "sarah.j@example.com", 
        phone: "+254 712 345 678", 
        spent: "KES 42,500", 
        orders: 8, 
        joined: "2023-11-12",
        status: "VIP",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop"
    },
    { 
        id: "2", 
        name: "Michael Chen", 
        email: "m.chen@example.com", 
        phone: "+254 722 987 654", 
        spent: "KES 12,800", 
        orders: 3, 
        joined: "2024-01-05",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop"
    },
    { 
        id: "3", 
        name: "Elena Rodriguez", 
        email: "elena.r@example.com", 
        phone: "+254 733 111 222", 
        spent: "KES 91,200", 
        orders: 15, 
        joined: "2023-05-20",
        status: "VIP",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop"
    },
    { 
        id: "4", 
        name: "David Kimani", 
        email: "dkimani@example.com", 
        phone: "+254 701 555 333", 
        spent: "KES 2,400", 
        orders: 1, 
        joined: "2024-03-15",
        status: "New",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop"
    },
];

export default function CustomersPage() {
    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Admin / CRM</p>
                    </div>
                    <h1 className="text-[42px] font-bold text-foreground leading-[1.1] tracking-tight">
                        Curated <span className="text-primary italic font-serif">Community</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                            <Search size={16} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Find a curator..." 
                            className="h-12 w-64 bg-surface-container-lowest border-none rounded-full pl-12 pr-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        />
                    </div>
                    <button className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Segment Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Curators", value: "1,284", color: "bg-surface-container-lowest" },
                    { label: "Top Segment (VIP)", value: "342", color: "bg-primary text-primary-foreground" },
                    { label: "Monthly Growth", value: "+12%", color: "bg-surface-container-lowest" },
                    { label: "Avg. Engagement", value: "85%", color: "bg-surface-container-lowest" }
                ].map((segment, i) => (
                    <div key={i} className={`p-8 rounded-[32px] shadow-sm flex flex-col justify-between h-[160px] ${segment.color}`}>
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">{segment.label}</p>
                            <Calendar size={14} className="opacity-40" />
                        </div>
                        <p className="text-4xl font-extrabold tracking-tighter mt-4">{segment.value}</p>
                    </div>
                ))}
            </div>

            {/* Customer Directory */}
            <div className="bg-surface-container-lowest rounded-[40px] p-10 shadow-sm relative">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">Member Directory</h2>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 h-10 px-5 rounded-full border border-surface-container-highest/20 text-xs font-bold text-muted-foreground hover:bg-surface-container transition-colors">
                            <Filter size={14} />
                            <span>Segment</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {customers.map((customer) => (
                        <div key={customer.id} className="flex items-center justify-between p-6 rounded-[28px] hover:bg-surface-container-low transition-all duration-300 group">
                            <div className="flex items-center gap-6">
                                <div className="relative w-16 h-16 rounded-[22px] overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-700 bg-white">
                                    <img src={customer.avatar} alt={customer.name} className="object-cover w-full h-full" />
                                    {customer.status === "VIP" && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-white shadow-sm">
                                            <Star size={10} className="text-white fill-white" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-foreground tracking-tight">{customer.name}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                            <Mail size={12} />
                                            <span>{customer.email}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                            <Phone size={12} />
                                            <span>{customer.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-16">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Investment</p>
                                    <p className="font-extrabold text-base text-foreground mt-1">{customer.spent}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Activity</p>
                                    <p className="font-extrabold text-base text-foreground mt-1">{customer.orders} Orders</p>
                                </div>
                                <button className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface-container-highest/20 transition-colors group/btn">
                                    <ChevronRight size={20} className="text-muted-foreground group-hover/btn:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <button className="h-12 px-10 rounded-full border border-surface-container-highest/30 text-xs font-bold text-muted-foreground uppercase tracking-widest hover:bg-surface-container transition-all">
                        Load Complete Directory
                    </button>
                </div>
            </div>

            {/* Retention Marketing Mini-Section */}
            <div className="bg-color-2 rounded-[40px] p-12 text-white overflow-hidden relative shadow-xl shadow-color-2/20">
                <div className="absolute bottom-0 right-0 p-10 opacity-10">
                    <Sparkles size={160} className="" />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                    <div className="max-w-[450px]">
                        <h3 className="text-3xl font-bold tracking-tight">Retention <span className="italic font-serif opacity-90">Protocol</span></h3>
                        <p className="mt-4 text-white/70 text-base leading-relaxed">
                            Create personalized fragrance recommendations for your top 10% curators based on their seasonal olfactory signatures.
                        </p>
                    </div>
                    <button className="h-14 px-10 rounded-full bg-white text-color-2 font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
                        Automate Campaign
                    </button>
                </div>
            </div>
        </div>
    );
}

function Sparkles({ size, className = "" }: { size: number, className?: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
        </svg>
    )
}
