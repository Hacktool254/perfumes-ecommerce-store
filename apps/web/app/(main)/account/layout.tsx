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
    ChevronRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/account/dashboard" },
        { icon: ShoppingBag, label: "Orders", href: "/account/orders" },
        { icon: MapPin, label: "Addresses", href: "/account/addresses" },
        { icon: Bell, label: "Notifications", href: "/account/notifications" },
        { icon: Heart, label: "Wishlist", href: "/account/wishlist" },
        { icon: User, label: "Profile", href: "/account" },
    ];

    return (
        <div className="min-h-screen bg-[#0A0D0B] text-white pt-20">
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-80 shrink-0">
                        <div className="sticky top-32 space-y-8">
                            {/* User Profile Card */}
                            <div className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DBC2A6]/5 blur-[64px] rounded-full translate-x-1/2 -translate-y-1/2" />
                                
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full bg-white/5 border-2 border-[#DBC2A6]/20 p-1 mb-6 group-hover:border-[#DBC2A6]/40 transition-all duration-500 overflow-hidden relative">
                                        {user?.image ? (
                                            <Image 
                                              src={user.image} 
                                              alt="Profile" 
                                              fill 
                                              className="object-cover rounded-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/20">
                                                {(user?.name?.[0] || user?.firstName?.[0] || "U").toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-xl font-black tracking-tight text-white mb-1">
                                        {user?.firstName ? `${user.firstName} ${user.lastName || ""}` : (user?.name || "Premium Member")}
                                    </h2>
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#DBC2A6]/60 mb-4">Account Verified</p>
                                    
                                    <div className="w-full h-px bg-white/5 my-4" />
                                    
                                    <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                        Identity Synchronized
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <nav className="bg-[#1A1E1C] border border-white/5 rounded-[40px] p-4 shadow-2xl overflow-hidden">
                                <div className="space-y-1">
                                    {menuItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={cn(
                                                    "group relative flex items-center gap-4 px-6 py-4 rounded-[24px] transition-all duration-500 overflow-hidden",
                                                    isActive 
                                                        ? "bg-[#DBC2A6] text-[#0A0D0B]" 
                                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    "w-5 h-5 transition-transform duration-500",
                                                    isActive ? "scale-110" : "group-hover:scale-110"
                                                )} />
                                                <span className="text-sm font-bold tracking-tight">{item.label}</span>
                                                {isActive && (
                                                    <ChevronRight className="ml-auto w-4 h-4 opacity-50" />
                                                )}
                                                {!isActive && (
                                                    <div className="absolute inset-0 bg-white/5 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500" />
                                                )}
                                            </Link>
                                        );
                                    })}

                                    <div className="pt-4 mt-4 border-t border-white/5">
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-4 px-6 py-4 rounded-[24px] text-white/40 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-300 group"
                                        >
                                            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                            <span className="text-sm font-bold tracking-tight">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 bg-[#1A1E1C] border border-white/5 rounded-[48px] p-8 lg:p-12 shadow-2xl min-h-[80vh] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#DBC2A6]/20 to-transparent" />
                        <div className="relative z-10">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
