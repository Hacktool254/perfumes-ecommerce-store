"use client";

import React from "react";
import { Menu, Sparkles, Bell } from "lucide-react";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function MobileHeader() {
    const { toggleOpen } = useSidebar();
    const pathname = usePathname();
    const { user } = useAuth();

    if (pathname?.startsWith("/login")) {
        return null;
    }

    // Map pathname to a friendly title
    const getPageTitle = (path: string) => {
        if (path === "/") return "Overview";
        const part = path.split("/")[1];
        if (!part) return "Overview";
        return part.charAt(0).toUpperCase() + part.slice(1);
    };

    return (
        <header className="lg:hidden sticky top-0 z-40 w-full bg-[#0A0D0B]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleOpen}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DBC2A6]">Command</span>
                    <h1 className="text-sm font-bold text-white leading-none mt-0.5">{getPageTitle(pathname || "/")}</h1>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 border border-white/5">
                    <Bell className="w-4 h-4" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#414A37] to-[#2B3124] flex items-center justify-center border border-[#414A37]/20 relative overflow-hidden shadow-lg">
                    {user?.image ? (
                        <Image 
                            src={user.image} 
                            alt="Profile" 
                            fill 
                            className="object-cover" 
                        />
                    ) : (
                        <Sparkles className="text-[#DBC2A6] w-4 h-4" />
                    )}
                </div>
            </div>
        </header>
    );
}
