"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
    LayoutDashboard, 
    ShoppingBag, 
    User, 
    MapPin, 
    Heart, 
    LogOut,
    Bell,
    ChevronRight,
    Sparkles,
    Shield,
    Fingerprint,
    PanelLeftClose,
    PanelLeftOpen,
    ArrowLeftRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/account/dashboard" },
        { icon: ShoppingBag, label: "Acquisition Records", href: "/account/orders" },
        { icon: MapPin, label: "Deployment Hubs", href: "/account/addresses" },
        { icon: Bell, label: "Intelligence Alerts", href: "/account/notifications" },
        { icon: Heart, label: "The Vault", href: "/account/wishlist" },
        { icon: User, label: "Identity Matrix", href: "/account" },
    ];

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-[#0a0a0b] text-white overflow-hidden font-sans selection:bg-[#B07D5B66] selection:text-white">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');
                .font-display { font-family: 'DM Serif Display', serif; }
                .font-body { font-family: 'DM Sans', sans-serif; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(176, 125, 91, 0.1); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(176, 125, 91, 0.3); }
            `}</style>
            
            {/* ── Mobile Header ── */}
            <header className="lg:hidden h-20 bg-[#0a0a0b] border-b border-[#B07D5B1A] flex items-center justify-between px-6 shrink-0 relative z-[60]">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-[18px] bg-white/[0.02] border border-[#B07D5B33] flex items-center justify-center relative overflow-hidden shrink-0 shadow-[0_0_15px_#B07D5B26]">
                         <Image 
                            src="/logo_transparent.png" 
                            alt="Logo" 
                            width={32} 
                            height={32} 
                            className="object-contain scale-125" 
                         />
                    </div>
                    <h2 className="font-display text-xl tracking-tight text-white italic">Ummies</h2>
                </Link>

                <button 
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-12 h-12 rounded-[18px] bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/40 active:scale-90 transition-all"
                >
                    {isMobileMenuOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                </button>
            </header>

            {/* ── Mobile Menu Overlay ── */}
            <div className={cn(
                "fixed inset-0 z-[55] lg:hidden transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)]",
                isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <div 
                    className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                <aside className={cn(
                    "absolute top-0 right-0 h-full w-[85%] max-w-[400px] bg-[#0a0a0b] border-l border-[#B07D5B1A] flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)]",
                    isMobileMenuOpen ? "translate-x-0 shadow-[0_0_100px_rgba(0,0,0,1)]" : "translate-x-full"
                )}>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#B07D5B08] to-transparent pointer-events-none" />
                    
                    <div className="p-10 border-b border-white/5 relative z-10">
                        <p className="text-[10px] font-black tracking-[0.4em] text-[#B07D5B] uppercase opacity-60">VAULT ACCESS</p>
                        <h2 className="font-display text-3xl text-white mt-4 italic">Patron Control</h2>
                    </div>

                    <nav className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-4 relative z-10">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center justify-between px-8 py-6 rounded-[28px] transition-all duration-500",
                                        isActive 
                                            ? "bg-[#B07D5B0A] text-[#B07D5B] border border-[#B07D5B33] shadow-lg" 
                                            : "text-white/30 hover:text-white/70"
                                    )}
                                >
                                    <div className="flex items-center gap-6">
                                        <item.icon className={cn(
                                            "w-6 h-6 transition-all duration-500",
                                            isActive ? "scale-110 drop-shadow-[0_0_8px_#B07D5B66]" : ""
                                        )} strokeWidth={1.5} />
                                        <span className="text-[12px] font-black uppercase tracking-[0.3em]">{item.label}</span>
                                    </div>
                                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#B07D5B] shadow-[0_0_10px_#B07D5B]" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-10 border-t border-white/5 space-y-8 relative z-10">
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-between px-8 py-6 rounded-[28px] text-rose-500 bg-rose-500/5 border border-rose-500/10 active:scale-95 transition-all"
                        >
                            <div className="flex items-center gap-6">
                                <LogOut size={20} strokeWidth={1.5} />
                                <span className="text-[12px] font-black uppercase tracking-[0.3em]">Disconnect</span>
                            </div>
                        </button>
                    </div>
                </aside>
            </div>
            
            {/* ── Desktop Sidebar ── */}
            <aside className={cn(
                "hidden lg:flex bg-[#0a0a0b] border-r border-[#B07D5B1A] flex-col shrink-0 relative overflow-hidden group/sidebar transition-all duration-700 ease-[cubic-bezier(0.2,0,0,1)] z-50",
                isCollapsed ? "w-24" : "w-80"
            )}>
                <div className="absolute inset-0 bg-gradient-to-b from-[#B07D5B08] to-transparent opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-1000" />
                
                {/* Branding Top */}
                <div className={cn(
                    "p-8 transition-all duration-700",
                    isCollapsed ? "pb-10 pt-12 flex justify-center" : "pb-14 pt-10"
                )}>
                    <Link href="/" className="flex items-center gap-5 group">
                        <div className="w-14 h-14 rounded-[22px] bg-[#0d0d0e] border border-[#B07D5B33] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-[0_0_20px_#B07D5B26] relative overflow-hidden shrink-0">
                             <Image 
                                src="/logo_transparent.png" 
                                alt="Logo" 
                                width={40} 
                                height={40} 
                                className="object-contain scale-[1.2] opacity-80 group-hover:opacity-100 transition-opacity" 
                             />
                             <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                        </div>
                        {!isCollapsed && (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                                <h2 className="font-display text-2xl tracking-tight text-white leading-none italic">Ummies</h2>
                                <p className="text-[10px] font-black tracking-[0.4em] text-[#B07D5B] uppercase mt-2 opacity-60">PATRON HUB</p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className={cn(
                    "flex-1 space-y-2 overflow-y-auto custom-scrollbar relative z-10 py-4",
                    isCollapsed ? "px-4" : "px-6"
                )}>
                    {!isCollapsed && (
                        <div className="px-5 mb-8 animate-in fade-in duration-700">
                            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 mb-6 font-sans">Management Core</p>
                        </div>
                    )}
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={isCollapsed ? item.label : ""}
                                className={cn(
                                    "flex items-center rounded-[24px] transition-all duration-700 relative group/item overflow-hidden",
                                    isCollapsed ? "justify-center h-14 w-14 mx-auto p-0" : "justify-between px-6 py-4",
                                    isActive 
                                        ? "bg-white/[0.03] text-[#B07D5B] shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-[#B07D5B33]" 
                                        : "text-white/30 hover:text-white/70 hover:bg-white/[0.01]"
                                )}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <item.icon className={cn(
                                        "w-5 h-5 transition-all duration-700 shrink-0",
                                        isActive ? "scale-110 drop-shadow-[0_0_8px_#B07D5B66]" : "group-hover/item:scale-110 group-hover/item:text-[#B07D5B]"
                                    )} strokeWidth={1.5} />
                                    {!isCollapsed && (
                                        <span className={cn(
                                            "text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-700 whitespace-nowrap animate-in fade-in slide-in-from-left-4",
                                            isActive ? "translate-x-1" : "group-hover/item:translate-x-1"
                                        )}>{item.label}</span>
                                    )}
                                </div>
                                {!isCollapsed && isActive && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#B07D5B] shadow-[0_0_10px_#B07D5B]" />
                                )}
                            </Link>
                        );
                    })}
                    {/* Toggle */}
                    <div className={cn(
                        "mt-4 transition-all duration-700",
                        isCollapsed ? "px-4" : "px-6"
                    )}>
                        <button 
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={cn(
                                "flex items-center rounded-[24px] transition-all duration-700 group/toggle border border-white/5 bg-white/[0.01] text-white/20 hover:text-[#B07D5B] hover:border-[#B07D5B33]",
                                isCollapsed ? "h-14 w-14 justify-center mx-auto" : "w-full justify-between px-6 py-4"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                                {!isCollapsed && <span className="text-[11px] font-black uppercase tracking-[0.25em]">Retract</span>}
                            </div>
                        </button>
                    </div>
                </nav>

                {/* Identity Bottom */}
                <div className={cn(
                    "p-10 border-t border-[#B07D5B1A] relative z-10",
                    isCollapsed ? "hidden" : "block"
                )}>
                    <div className="flex items-center gap-4 px-2">
                        <div className="w-10 h-10 rounded-[14px] bg-[#B07D5B1A] border border-[#B07D5B33] flex items-center justify-center text-sm font-display text-[#B07D5B] shrink-0 italic">U</div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black text-white/20 tracking-widest truncate uppercase leading-none">Patron Instance</p>
                            <p className="text-[10px] font-bold text-white/10 uppercase tracking-tighter truncate mt-1.5">Alpha Protocol Active</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0a0a0b]">
                {/* Visual Glows */}
                <div className="absolute top-0 right-0 w-full h-1/2 bg-[#B07D5B03] blur-[200px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[#B07D5B02] blur-[200px] pointer-events-none" />

                {/* Content Workspace */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-16 custom-scrollbar relative z-10">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>

                {/* Tech Status Footer */}
                <footer className="h-16 bg-[#0a0a0b] border-t border-[#B07D5B1A] flex items-center justify-between px-6 md:px-12 relative z-[45] shrink-0">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 leading-none">Status: Linked</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-3">
                            <Shield size={11} className="text-[#B07D5B] opacity-60" />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 leading-none italic uppercase">Encryption Enabled</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Fingerprint size={12} className="text-white/10" />
                        <span className="text-[8px] font-black text-white/10 tracking-[0.4em] uppercase">V-ID: UX-254</span>
                    </div>
                </footer>
            </main>
        </div>
    );
}
