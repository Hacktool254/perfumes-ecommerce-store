"use client";

import { useState } from "react";
import Link from "next/link";
import { User, X, Menu, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";

const navItemsLeft = [
    { label: "SHOP", href: "/shop", hasDropdown: true },
    { label: "NEW ARRIVALS", href: "/shop?sort=new", hasDropdown: true },
    { label: "BEST SELLERS", href: "/shop?sort=trending", hasDropdown: true },
];

const navItemsRight = [
    { label: "COLLECTIONS", href: "/categories", hasDropdown: true },
    { label: "BUNDLES", href: "/shop?category=bundles" },
    { label: "TRACK MY ORDER", href: "/account" },
];

export function Header() {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href);

    return (
        <header className="absolute top-0 left-0 w-full z-50 pt-3 px-3 sm:px-4 md:px-6 lg:px-8 pointer-events-none">
            {/* The main header bar (rounded pill) - GLASS MORPHISM */}
            <div className="relative mx-auto w-full h-[4.5rem] bg-white/20 backdrop-blur-md rounded-[2rem] shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-between pointer-events-auto border border-white/40">
                
                {/* Center dip for the logo - Using an absolute div to simulate the curve */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
                    {/* The physical shape of the background dipping down */}
                    <div 
                        className="absolute top-0 w-[180px] md:w-[220px] h-[85px] md:h-[95px] bg-white/20 backdrop-blur-md border-b border-x border-white/40 shadow-[0_10px_20px_rgba(255,255,255,0.1)] transition-all duration-300" 
                        style={{ borderBottomLeftRadius: '5rem', borderBottomRightRadius: '5rem' }} 
                    />
                    
                    {/* The Logo Image */}
                    <Link href="/" className="relative z-10 mt-2 md:mt-3 hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                        <img
                            src="/logo.png"
                            alt="Ummie's Essence Logo"
                            className="w-[140px] md:w-[170px] h-[55px] md:h-[65px] object-cover rounded-full mix-blend-multiply contrast-[1.05]"
                        />
                    </Link>
                </div>

                {/* Left Side Links */}
                <div className="flex items-center flex-1 h-full pl-5 md:pl-8">
                    {/* Hamburger Menu Trigger - GLASS BUTTON */}
                    <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="bg-white/20 backdrop-blur-md border border-white/40 text-white w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-white/40 transition-all active:scale-95 mr-2 md:mr-6"
                        aria-label="Open Menu"
                    >
                        <Menu className="w-5 h-5 text-[#5C4D42]" />
                    </button>

                    {/* Desktop Left Nav */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-10">
                        {navItemsLeft.map(item => (
                            <Link 
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-1 text-[0.65rem] lg:text-[0.7rem] font-bold tracking-[0.16em] transition-all px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/30 drop-shadow-md ${isActive(item.href) ? "text-[#5C4D42]" : "text-[#7B6F63] hover:text-[#5C4D42]"}`}
                            >
                                {item.label}
                                {item.hasDropdown && <ChevronDown className="w-3 h-3 text-current opacity-80" />}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Side Links */}
                <div className="flex items-center justify-end flex-1 h-full pr-5 md:pr-8 gap-6 lg:gap-10">
                    {/* Desktop Right Nav */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-10">
                        {navItemsRight.map(item => (
                            <Link 
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-1 text-[0.65rem] lg:text-[0.7rem] font-bold tracking-[0.16em] transition-all px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/30 drop-shadow-md ${isActive(item.href) ? "text-[#5C4D42]" : "text-[#7B6F63] hover:text-[#5C4D42]"}`}
                            >
                                {item.label}
                                {item.hasDropdown && <ChevronDown className="w-3 h-3 text-current opacity-80" />}
                            </Link>
                        ))}
                    </nav>

                    {/* User Icon - GLASS BUTTON */}
                    <div className="relative">
                        <Link 
                          href="/account" 
                          className="bg-white/20 backdrop-blur-md border border-white/40 text-[#5C4D42] w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-white/40 transition-all active:scale-95"
                        >
                            <User className="w-5 h-5 fill-current" />
                        </Link>
                        {/* Notification dot */}
                        <div className="absolute top-0 right-0 w-[12px] h-[12px] bg-[#D2929B] text-white text-[7px] font-bold rounded-full flex items-center justify-center border border-white/80 transform translate-x-1/4 -translate-y-1/4">
                            !
                        </div>
                    </div>
                </div>

            </div>

             {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity pointer-events-auto"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Slide-out Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-[280px] sm:w-80 bg-[#F8DFE1]/70 backdrop-blur-3xl z-[70] transform transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col border-r border-[#D2929B]/30 pointer-events-auto`}>
                <div className="p-6 flex justify-between items-center border-b border-[#D2929B]/30">
                    <span className="font-serif font-bold tracking-wider text-[#5C4D42] drop-shadow-sm">MENU</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/30 text-[#5C4D42] rounded-full transition-all active:scale-90">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="px-4 py-8 overflow-y-auto flex-1">
                    <nav className="flex flex-col space-y-2 text-lg font-medium tracking-wide text-[#7B6F63]">
                        {[
                            { label: 'HOME', href: '/' },
                            ...navItemsLeft,
                            ...navItemsRight,
                            { label: 'MY ACCOUNT', href: '/account' }
                        ].map((item, idx) => (
                            <Link 
                                key={idx}
                                href={item.href} 
                                className={`flex items-center gap-2 px-4 py-4 rounded-xl transition-all duration-300 hover:bg-white/40 hover:backdrop-blur-xl hover:text-[#5C4D42] hover:pl-8 border border-transparent hover:border-white/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                {item.label}
                                {'hasDropdown' in item && item.hasDropdown && <ChevronDown className="w-5 h-5 opacity-60" />}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="p-8 border-t border-[#D2929B]/30">
                    <p className="text-[10px] text-[#A67B5B] tracking-[0.3em] uppercase">© 2026 UMMIES ESSENCE</p>
                </div>
            </div>
        </header>
    );
}
