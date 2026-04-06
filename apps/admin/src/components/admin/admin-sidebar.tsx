"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutGrid,
    TrendingUp,
    Users,
    Receipt,
    Megaphone,
    Files,
    Settings,
    ShoppingBag,
    ChevronRight,
    Search,
    Bell,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Sales", href: "/", icon: LayoutGrid },
    { name: "Analytics", href: "/analytics", icon: TrendingUp },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Marketing", href: "/marketing", icon: Megaphone },
    { name: "Documents", href: "/documents", icon: Files },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-80 h-screen bg-surface-container-lowest/80 backdrop-blur-xl border-none flex flex-col sticky top-0 z-50">
            {/* Brand Identity Section */}
            <div className="p-10 flex flex-col gap-6">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 rotate-[-4deg] group-hover:rotate-0 transition-transform duration-500">
                        <ShoppingBag size={28} className="fill-white/20" />
                    </div>
                    <div>
                        <span className="font-extrabold text-2xl text-foreground tracking-tighter block leading-none">Ummie&apos;s</span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mt-1 block">Essence / Admin</span>
                    </div>
                </Link>

                <div className="relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Global Curator Search" 
                        className="h-12 w-full bg-surface-container border-none rounded-2xl pl-12 pr-6 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                    />
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-12">
                <div className="mb-12">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 px-4">Core Management</p>
                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                                        isActive
                                            ? "bg-surface-container text-foreground shadow-sm"
                                            : "text-muted-foreground hover:bg-surface-container-low hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                            isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-surface-container-low text-muted-foreground group-hover:text-primary"
                                        )}>
                                            <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                        </div>
                                        <span className={cn(
                                            "text-sm font-bold tracking-tight",
                                            isActive ? "text-foreground" : "text-muted-foreground"
                                        )}>{item.name}</span>
                                    </div>
                                    {isActive && <div className="w-1.5 h-6 bg-primary rounded-full absolute right-0 translate-x-1" />}
                                    <ChevronRight size={14} className={cn(
                                        "transition-all duration-500 relative z-10",
                                        isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-40 group-hover:translate-x-0"
                                    )} />
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* System Health / Quick Actions */}
                <div className="px-4">
                    <div className="p-8 rounded-[32px] bg-primary text-primary-foreground relative overflow-hidden shadow-xl shadow-primary/20 group">
                        <div className="absolute -right-6 -top-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <Sparkles size={100} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Cloud Sync</p>
                            <h4 className="text-xl font-bold mt-2 leading-tight">Live <span className="italic font-serif opacity-80">Feed</span></h4>
                            <div className="flex items-center gap-2 mt-4">
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                <span className="text-[10px] font-bold">Systems Normal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Profile Hook */}
            <div className="p-8 border-t border-surface-container-highest/10 bg-surface-container-low/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-surface-container overflow-hidden p-1 shadow-sm">
                            <img 
                                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=200&auto=format&fit=crop" 
                                alt="User" 
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-extrabold text-foreground tracking-tight">Admin Curator</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Kenya HQ</span>
                        </div>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
                        <Bell size={18} className="text-muted-foreground" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
