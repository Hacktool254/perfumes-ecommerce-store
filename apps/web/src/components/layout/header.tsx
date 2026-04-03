"use client";

import { useState } from "react";
import Link from "next/link";
import { AlignLeft, User, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";

const navItemsLeft = [
    { label: "FOR MEN", href: "/shop?gender=men" },
    { label: "FOR WOMEN", href: "/shop?gender=women" },
];

const navItemsRight = [
    { label: "ABOUT US", href: "/about" },
    { label: "CONTACT", href: "/contact" },
];

export function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href);

    return (
        <header className="absolute top-0 left-0 w-full z-50 pt-3 px-3 sm:px-4 md:px-6 lg:px-8 pointer-events-none">
            {/* The main header bar (rounded pill) */}
            <div className="relative mx-auto w-full h-[4.5rem] bg-white/20 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-between pointer-events-auto border border-white/40">
                
                {/* Center dip for the logo - Using an absolute div to simulate the curve */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
                    {/* The physical shape of the background dipping down */}
                    <div 
                        className="absolute top-0 w-[130px] h-[95px] bg-white/20 backdrop-blur-md border-b border-x border-white/40 shadow-[0_10px_20px_rgba(255,255,255,0.1)]" 
                        style={{ borderBottomLeftRadius: '3.5rem', borderBottomRightRadius: '3.5rem' }} 
                    />
                    
                    {/* The Logo Image */}
                    <Link href="/" className="relative z-10 mt-3 hover:scale-105 transition-transform duration-300">
                        <img
                            src="/logo.png"
                            alt="Ummie's Essence Logo"
                            className="w-[65px] h-[65px] object-contain drop-shadow-md brightness-90 sepia-[0.2] hue-rotate-[-10deg]"
                        />
                    </Link>
                </div>

                {/* Left Side Links */}
                <div className="flex items-center flex-1 h-full pl-5 md:pl-8">
                    {/* Hamburger Mobile Menu Trigger */}
                    <button 
                        className="p-2 mr-2 md:mr-6 text-[#5C4D42] hover:text-[#A67B5B] transition-colors"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <AlignLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    {/* Desktop Left Nav */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-10">
                        {navItemsLeft.map(item => (
                            <Link 
                                key={item.label}
                                href={item.href}
                                className={`text-[0.65rem] lg:text-[0.7rem] font-bold tracking-[0.16em] transition-all hover:-translate-y-0.5 ${isActive(item.href) ? "text-[#A67B5B]" : "text-[#7B6F63] hover:text-[#A67B5B]"}`}
                            >
                                {item.label}
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
                                className={`text-[0.65rem] lg:text-[0.7rem] font-bold tracking-[0.16em] transition-all hover:-translate-y-0.5 ${isActive(item.href) ? "text-[#A67B5B]" : "text-[#7B6F63] hover:text-[#A67B5B]"}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* User Icon */}
                    <div className="relative">
                        <Link href="/account" className="p-2 text-[#7B6F63] hover:text-[#A67B5B] transition-colors flex items-center justify-center rounded-full hover:bg-[#A67B5B]/10">
                            <User className="w-5 h-5 fill-current" />
                        </Link>
                        {/* Notification dot similar to mock */}
                        <div className="absolute top-1 right-1 w-[13px] h-[13px] bg-[#A2887A] text-white text-[8px] font-bold rounded-full flex items-center justify-center border-[1.5px] border-[#F6F3ED]">
                            !
                        </div>
                    </div>
                </div>

            </div>

             {/* Mobile Menu Overlay */}
             {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-[#F6F3ED]/98 backdrop-blur-xl pointer-events-auto flex flex-col transition-all duration-300">
                    <div className="flex items-center justify-between p-6 border-b border-[#A67B5B]/10">
                        <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-[#5C4D42] hover:bg-black/5 rounded-full transition-colors">
                            <X className="w-7 h-7" />
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center flex-1 gap-10">
                        {[...navItemsLeft, ...navItemsRight].map(item => (
                            <Link
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xl sm:text-2xl font-bold tracking-[0.2em] text-[#5C4D42] hover:text-[#A67B5B] uppercase hover:scale-105 transition-transform"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
