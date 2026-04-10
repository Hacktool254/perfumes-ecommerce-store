"use client";

import React from "react";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
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
    Sparkles,
    X
} from "lucide-react";

// Same nav items as AdminSidebar
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

export function MobileSidebar() {
    const { isOpen, setOpen } = useSidebar();
    const pathname = usePathname();
    const { logout } = useAuth();

    if (pathname?.startsWith("/login")) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            <div 
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setOpen(false)}
            />

            {/* Side Drawer */}
            <aside className={cn(
                "fixed inset-y-0 left-0 w-[280px] bg-[#111412] z-[70] transition-transform duration-500 ease-in-out lg:hidden flex flex-col",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-10 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-[22px] bg-[#0d0d0e] border border-white/10 flex items-center justify-center relative overflow-hidden shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                             <Image 
                                src="/logo_transparent.png" 
                                alt="Logo" 
                                width={42} 
                                height={42} 
                                className="object-contain scale-125" 
                             />
                             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-sm font-black text-white tracking-widest leading-none">UMMIES</h2>
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#DBC2A6]/60 mt-1">Management</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setOpen(false)}
                        className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 border border-white/5"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-4 overflow-y-auto no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-300 group",
                                    isActive 
                                        ? "text-[#DBC2A6] bg-[#1A1E1C]/50 border border-white/5 shadow-xl" 
                                        : "text-gray-500 hover:text-white"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-4.5 h-4.5 transition-all duration-300",
                                    isActive ? "text-[#DBC2A6]" : "text-gray-500"
                                )} />
                                <span className="text-xs font-bold tracking-tight">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300"
                    >
                        <LogOut className="w-4.5 h-4.5" />
                        <span className="text-xs font-bold tracking-tight">System Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
