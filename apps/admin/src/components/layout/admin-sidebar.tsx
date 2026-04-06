"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
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
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Customers", href: "/customers", icon: Users },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Marketing", href: "/marketing", icon: Megaphone },
    { name: "Documents", href: "/documents", icon: Files },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();

    if (pathname?.startsWith("/login")) {
        return null;
    }

    return (
        <aside className="w-72 h-screen sticky top-0 bg-surface-container border-none flex flex-col p-6 overflow-hidden">
            {/* Brand Logo / Section */}
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles className="text-primary-foreground w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-foreground leading-none">Ummie's</h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-1">Admin Portal</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group",
                                isActive 
                                    ? "bg-surface-container-lowest text-primary shadow-sm" 
                                    : "text-muted-foreground hover:bg-surface-container-low hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            )} />
                            <span className="text-sm font-bold tracking-tight">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section / User Action */}
            <div className="pt-6 border-t border-surface-container-highest/30">
                <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-error-container hover:text-error transition-all duration-300 group">
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-bold">Sign Out</span>
                </button>
            </div>

            {/* Glassmorphic decorative element */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </aside>
    );
}
