"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    BarChart3,
    Users,
    Receipt,
    Megaphone,
    Files,
    Settings,
    LogOut,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/products", icon: Package },
    { name: "Orders", href: "/orders", icon: ShoppingBag },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Marketing", href: "/marketing", icon: Megaphone },
    { name: "Documents", href: "/documents", icon: Files },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    if (pathname?.startsWith("/login")) {
        return null;
    }

    return (
        <aside className="w-64 h-screen sticky top-0 bg-[#111412] border-r border-white/5 flex flex-col px-4 py-8 overflow-hidden z-20">
            {/* Command Center Logo */}
            <div className="flex items-center gap-4 mb-12 px-4 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#414A37] to-[#2B3124] flex items-center justify-center shadow-lg shadow-[#414A37]/10 border border-[#414A37]/20 group-hover:scale-105 transition-transform duration-500">
                    <Sparkles className="text-[#DBC2A6] w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-sm font-black text-white tracking-widest leading-none">UMMIES</h2>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#DBC2A6]/60 mt-1">Management</p>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
                                isActive 
                                    ? "text-[#DBC2A6] bg-[#1A1E1C]/50 border border-white/5 shadow-xl" 
                                    : "text-gray-500 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 w-1 h-4 bg-[#DBC2A6] rounded-full" />
                            )}
                            <item.icon className={cn(
                                "w-4.5 h-4.5 transition-all duration-300",
                                isActive ? "text-[#DBC2A6]" : "text-gray-500 group-hover:text-gray-300 group-hover:scale-110"
                            )} />
                            <span className="text-xs font-bold tracking-tight">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Secondary/System Action */}
            <div className="pt-6 border-t border-white/5 mx-2">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300 group"
                >
                    <LogOut className="w-4.5 h-4.5 transition-transform group-hover:-translate-x-1" />
                    <span className="text-xs font-bold tracking-tight">System Logout</span>
                </button>
            </div>
        </aside>
    );
}
