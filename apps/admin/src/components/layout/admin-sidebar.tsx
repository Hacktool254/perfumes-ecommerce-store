"use client";

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
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";

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
    const { isCollapsed, toggleCollapsed } = useSidebar();

    if (pathname?.startsWith("/login")) {
        return null;
    }

    return (
        <aside className={cn(
            "hidden lg:flex flex-col h-screen sticky top-0 bg-[#111412] border-r border-white/5 transition-all duration-500 ease-in-out z-20 overflow-hidden",
            isCollapsed ? "w-20" : "w-64"
        )}>
            {/* Command Center Logo */}
            <div className={cn(
                "flex items-center gap-4 mb-12 px-6 pt-10 min-h-[100px] transition-all duration-500",
                isCollapsed ? "justify-center px-0" : "px-6"
            )}>
                <div className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-[22px] bg-[#0d0d0e] border border-white/10 flex-shrink-0 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:scale-105 group-hover:border-[#DBC2A6]/30 transition-all duration-700 relative overflow-hidden">
                        <Image 
                            src="/logo_transparent.png" 
                            alt="Logo" 
                            width={42} 
                            height={42} 
                            className="object-contain scale-125 transition-all duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col whitespace-nowrap overflow-hidden transition-all duration-500 opacity-100">
                            <h2 className="text-sm font-black text-white tracking-widest leading-none">UMMIES</h2>
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#DBC2A6]/60 mt-1">Management</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 space-y-1.5 px-4 overflow-y-auto no-scrollbar">
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
                                    : "text-gray-500 hover:text-white hover:bg-white/5",
                                isCollapsed && "justify-center px-0"
                            )}
                        >
                            {isActive && !isCollapsed && (
                                <div className="absolute left-0 w-1 h-4 bg-[#DBC2A6] rounded-full" />
                            )}
                            <item.icon className={cn(
                                "w-4.5 h-4.5 flex-shrink-0 transition-all duration-300",
                                isActive ? "text-[#DBC2A6]" : "text-gray-500 group-hover:text-gray-300 group-hover:scale-110"
                            )} />
                            {!isCollapsed && (
                                <span className="text-xs font-bold tracking-tight whitespace-nowrap overflow-hidden transition-all duration-500">{item.name}</span>
                            )}
                            
                            {isCollapsed && (
                                <div className="absolute left-full ml-6 px-3 py-1 bg-[#1A1E1C] border border-white/10 text-[#DBC2A6] text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 whitespace-nowrap shadow-2xl">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Retraction Toggle & Logout */}
            <div className="p-4 border-t border-white/5 mt-auto space-y-2">
                <button
                    onClick={toggleCollapsed}
                    className={cn(
                        "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-gray-500 hover:text-[#DBC2A6] hover:bg-[#DBC2A6]/5 transition-all duration-300 group overflow-hidden",
                        isCollapsed && "justify-center px-0"
                    )}
                >
                    <div className="relative w-4.5 h-4.5 flex-shrink-0">
                        {isCollapsed ? (
                            <ChevronRight className="w-full h-full transition-transform" />
                        ) : (
                            <ChevronLeft className="w-full h-full transition-transform group-hover:-translate-x-1" />
                        )}
                    </div>
                    {!isCollapsed && (
                        <span className="text-xs font-bold tracking-tight whitespace-nowrap">Retract View</span>
                    )}
                </button>

                <button
                    onClick={logout}
                    className={cn(
                        "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300 group",
                        isCollapsed && "justify-center px-0"
                    )}
                >
                    <LogOut className="w-4.5 h-4.5 flex-shrink-0 transition-transform group-hover:-translate-x-1" />
                    {!isCollapsed && (
                        <span className="text-xs font-bold tracking-tight whitespace-nowrap">System Logout</span>
                    )}
                </button>
            </div>
        </aside>
    );
}
