"use client";

import Link from "next/link";
import { 
    LayoutGrid, 
    ShoppingBag, 
    Users, 
    Receipt, 
    Megaphone, 
    Files, 
    Settings,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";

const modules = [
    { name: "Overview", href: "/overview", icon: LayoutGrid, description: "Real-time performance analytics & metrics", color: "from-[#DBC2A6] to-[#99744A]" },
    { name: "Products", href: "/products", icon: ShoppingBag, description: "Manage fragrance catalog & inventory", color: "from-primary/60 to-primary" },
    { name: "Orders", href: "/orders", icon: Receipt, description: "Track & fulfill customer purchases", color: "from-[#414A37] to-[#2B3124]" },
    { name: "Customers", href: "/customers", icon: Users, description: "Client database & engagement tracking", color: "from-[#A6568A] to-[#732A24]" },
    { name: "Marketing", href: "/marketing", icon: Megaphone, description: "Campaign management & promotions", color: "from-blue-400 to-indigo-600" },
    { name: "Settings", href: "/settings", icon: Settings, description: "Platform configuration & preferences", color: "from-gray-600 to-gray-800" },
];

export default function CommandCenter() {
    const stats = useQuery(api.orders.getStats);

    return (
        <div className="min-h-[80vh] flex flex-col justify-center py-10 animate-in fade-in duration-1000">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto w-full text-center space-y-8 mb-20">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-12 h-[1px] bg-primary/30" />
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high border border-border/50 shadow-sm">
                        <ShieldCheck size={14} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Admin Secure Gateway</span>
                    </div>
                    <div className="w-12 h-[1px] bg-primary/30" />
                </div>

                <h1 className="text-7xl font-black text-foreground tracking-tighter leading-none mb-6">
                    COMMAND <span className="text-primary italic font-serif font-medium">CENTER</span>
                </h1>
                
                <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto font-medium leading-relaxed">
                    Exclusive operational gateway for <span className="text-foreground font-extrabold italic">Ummie&apos;s Essence</span>. 
                    Monitor performance, curate collections, and manage the luxury experience from a single point of truth.
                </p>

                <div className="pt-10">
                    <Link href="/overview">
                        <button className="group relative px-12 py-6 rounded-[32px] bg-primary text-primary-foreground font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <div className="flex items-center gap-4 relative z-10">
                                <span>Access Dashboard</span>
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center rotate-[-45deg] group-hover:rotate-0 transition-transform duration-500">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Quick Access Grid */}
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                {modules.map((item, idx) => (
                    <Link key={item.name} href={item.href}>
                        <div className="group bg-surface-container-lowest border border-border/50 rounded-[40px] p-8 h-full shadow-xl shadow-surface-container/10 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 relative overflow-hidden">
                            <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 blur-2xl", item.color)} />
                            
                            <div className="flex flex-col h-full relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-500", item.color)}>
                                        <item.icon size={24} />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight size={18} />
                                    </div>
                                </div>
                                
                                <h3 className="text-2xl font-black text-foreground tracking-tighter mb-2">{item.name}</h3>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">{item.description}</p>
                                
                                <div className="mt-auto pt-8 flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60">Module Active</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Footer Status */}
            <div className="mt-20 text-center">
                <div className="inline-flex items-center gap-6 px-8 py-4 rounded-full bg-surface-container-low border border-border/30 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Systems Online</span>
                    </div>
                    <div className="w-[1px] h-4 bg-border/50" />
                    <div className="flex items-center gap-2">
                        <Sparkles size={12} className="text-primary" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Convex Storage Encrypted</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
