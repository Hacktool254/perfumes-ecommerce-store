"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    ShoppingBag, 
    User, 
    MapPin, 
    Heart, 
    LogOut,
    Bell,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/account/dashboard" },
        { icon: ShoppingBag, label: "Orders", href: "/account/orders" },
        { icon: MapPin, label: "Addresses", href: "/account/addresses" },
        { icon: Bell, label: "Notifications", href: "/account/notifications" },
        { icon: Heart, label: "Wishlist", href: "/account/wishlist" },
        { icon: User, label: "Profile Settings", href: "/account" },
    ];

    return (
        <div className="flex h-screen bg-[#0A0D0B] text-white overflow-hidden font-sans">
            {/* Left Management Sidebar */}
            <aside className="w-72 bg-[#0A0D0B] border-r border-white/5 flex flex-col shrink-0">
                {/* Branding Top */}
                <div className="p-8 pb-12">
                    <div className="flex items-center gap-3 group px-4">
                        <div className="w-10 h-10 rounded-xl bg-[#1A1E1C] border border-white/5 flex items-center justify-center text-[#DBC2A6] group-hover:scale-110 transition-transform shadow-2xl">
                             <Sparkles size={18} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black tracking-[0.2em] text-white uppercase leading-none">Ummies</h2>
                            <p className="text-[9px] font-black tracking-[0.3em] text-white/30 uppercase mt-1.5">Management</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 rounded-[18px] transition-all duration-500 relative group overflow-hidden",
                                    isActive 
                                        ? "bg-white/5 text-[#DBC2A6] shadow-xl" 
                                        : "text-white/20 hover:text-white/60 hover:bg-white/[0.02]"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#DBC2A6] rounded-full shadow-[0_0_12px_#DBC2A6]" />
                                )}
                                <item.icon className={cn(
                                    "w-5 h-5 transition-transform duration-500",
                                    isActive ? "scale-110" : "group-hover:scale-110"
                                )} />
                                <span className={cn(
                                    "text-[12px] font-black uppercase tracking-widest",
                                    isActive ? "opacity-100" : "opacity-60"
                                )}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* System Logout Bottom */}
                <div className="p-8 border-t border-white/5">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-[18px] text-white/20 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300 group"
                    >
                        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="text-[11px] font-black uppercase tracking-widest">System Logout</span>
                    </button>
                    <div className="mt-8 flex items-center gap-3 px-6">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-[10px] font-black text-white/20">
                             N
                        </div>
                        <div className="text-[10px] font-bold text-white/20 leading-none">
                            localhost:3000
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden pt-20">
                {/* Content Workspace */}
                <div className="flex-1 overflow-y-auto px-8 md:px-12 py-12 custom-scrollbar relative z-10">
                    {children}
                </div>

                {/* Tech Status Footer */}
                <footer className="h-14 bg-[#0A0D0B] border-t border-white/5 flex items-center justify-between px-10 relative z-10">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Systems Online</span>
                        </div>
                        <div className="h-4 w-px bg-white/5" />
                        <div className="flex items-center gap-2.5">
                            <Sparkles size={11} className="text-[#DBC2A6] opacity-40" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Convex Storage Encrypted</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-[10px] font-black text-white/10 tracking-widest">VER-3.4.1</span>
                    </div>
                </footer>

                {/* Background Decor */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#DBC2A6]/5 blur-[200px] -mr-80 -mt-80 rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.02] blur-[150px] -ml-60 -mb-60 rounded-full" />
                </div>
            </main>
        </div>
    );
}
