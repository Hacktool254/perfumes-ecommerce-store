"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, X, Menu, ChevronDown, ArrowUpRight, Search, ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";

const megaMenuProducts = [
    {
        id: "p1",
        name: "Sakeena",
        brand: "Lattafa",
        image: "/products/Lattafa-Sakeena.jpg",
        href: "/product/lattafa-sakeena"
    },
    {
        id: "p2",
        name: "Asad",
        brand: "Lattafa",
        image: "/products/Lattafa-Assad.jpg",
        href: "/product/lattafa-assad"
    },
    {
        id: "p3",
        name: "Khamrah",
        brand: "Lattafa",
        image: "/products/Lattafa-Khamrah.jpg",
        href: "/product/lattafa-khamrah"
    },
    {
        id: "p4",
        name: "Yara",
        brand: "Lattafa",
        image: "/products/Lattafa-Yara.jpg",
        href: "/product/lattafa-yara"
    }
];

function MegaMenuDropdown() {
    return (
        <div className="absolute left-0 top-[100%] w-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 pointer-events-none group-hover:pointer-events-auto">
            {/* The actual dropdown panel */}
            <div className="w-full bg-white/95 backdrop-blur-xl border border-black/5 shadow-[0_30px_60px_rgba(0,0,0,0.1)] rounded-b-xl border-t-0">
                <div className="container mx-auto px-6 py-10 relative">
                    {/* Horizontally scrollable container */}
                    <div 
                        className="flex gap-4 md:gap-8 overflow-x-auto pb-4 snap-x justify-center"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* CSS trick to hide webkit scrollbars inline since no-scrollbar isn't guaranteed */}
                        <style>{`
                            div::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        
                        {megaMenuProducts.map((p) => (
                            <Link key={p.id} href={p.href} className="flex-none w-[180px] md:w-[220px] snap-center group/item flex flex-col focus:outline-none">
                                <div className="relative aspect-[4/5] bg-[#f5f5f5] hover:bg-[#eaeaea] overflow-hidden mb-4 border border-black/5 flex items-center justify-center p-4 transition-colors">
                                    <Image src={p.image} alt={p.name} fill className="object-contain transition-transform duration-500 ease-out group-hover/item:scale-105" />
                                </div>
                                <div className="flex items-center justify-between px-2">
                                    <div>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.brand}</p>
                                        <p className="font-serif font-medium text-primary text-sm">{p.name}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const navItems = [
    { label: "SHOP", href: "/shop", hasDropdown: true },
    { label: "NEW ARRIVALS", href: "/shop?sort=new", hasDropdown: true },
    { label: "BEST SELLERS", href: "/shop?sort=trending", hasDropdown: true },
    { label: "COLLECTIONS", href: "/categories", hasDropdown: true },
    { label: "BUNDLES", href: "/shop?category=bundles" },
    { label: "TRACK MY ORDER", href: "/account" },
];

export function Header() {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 left-0 w-full z-50 bg-[#F3C7C8] transition-all font-sans">
                <div className="w-full flex items-center justify-between h-24 px-4 md:px-8 xl:px-12 relative">
                    
                    {/* Left: Logo */}
                    <div className="flex flex-1 items-center gap-4 lg:min-w-[200px]">
                        <Link href="/" className="absolute top-0 -left-1 md:-left-4 xl:-left-6 z-10 hover:opacity-90 transition-opacity">
                            <img
                                src="/logo.png"
                                alt="Ummie's Essence Logo"
                                className="h-24 w-auto object-contain"
                            />
                        </Link>
                        {/* Spacer to push nav away from logo area */}
                        <div className="w-[120px] md:w-[180px] flex-shrink-0" />
                    </div>

                    {/* Center: Navigation (Desktop) */}
                    <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 h-full">
                        {navItems.map(item => (
                            <div key={item.label} className="group h-full flex items-center border-b-2 border-transparent hover:border-[#5C4D42] transition-all relative">
                                <Link 
                                    href={item.href}
                                    className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#2f2f2f] hover:text-[#5C4D42] transition-colors whitespace-nowrap px-1 uppercase"
                                >
                                    {item.label}
                                    {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-current opacity-70 group-hover:rotate-180 transition-transform duration-300" />}
                                </Link>
                                {item.hasDropdown && <MegaMenuDropdown />}
                            </div>
                        ))}
                    </nav>

                    {/* Right: Action Icons */}
                    <div className="flex flex-1 justify-end items-center gap-4 lg:gap-6 lg:min-w-[200px]">
                        <button 
                            onClick={() => setIsSearchOpen(true)}
                            className="text-[#2f2f2f] hover:text-[#5C4D42] transition-all hover:scale-105"
                        >
                            <Search className="w-6 h-6 stroke-[1.5]" />
                        </button>
                        <Link href="/account" className="text-[#2f2f2f] hover:text-[#5C4D42] transition-all hover:scale-105 hidden lg:block">
                            <User className="w-6 h-6 stroke-[1.5]" />
                        </Link>
                        <button className="text-[#2f2f2f] hover:text-[#5C4D42] transition-all hover:scale-105 relative">
                            <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#AA8C77] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                0
                            </div>
                        </button>
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden text-[#2f2f2f] hover:text-[#5C4D42] transition-colors"
                        >
                            <Menu className="w-6 h-6 stroke-[1.5]" />
                        </button>
                    </div>

                </div>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Slide-out Sidebar — Full-width Lattafa style */}
            <div className={`fixed top-0 left-0 h-full w-full sm:w-[420px] bg-[#F3C7C8] z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col font-sans`}>
                
                {/* Header — Logo + Close */}
                <div className="p-5 flex justify-between items-center">
                    <Link href="/" onClick={() => setIsSidebarOpen(false)}>
                        <img
                            src="/logo.png"
                            alt="Ummie's Essence"
                            className="h-14 w-auto object-contain"
                        />
                    </Link>
                    <button 
                        onClick={() => setIsSidebarOpen(false)} 
                        className="p-2 hover:bg-gray-100 text-[#2f2f2f] rounded-full transition-all"
                    >
                        <X className="w-6 h-6 stroke-[1.5]" />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto px-2">
                    <nav className="flex flex-col">
                        {navItems.map((item, idx) => (
                            <Link 
                                key={idx}
                                href={item.href} 
                                className="flex items-center justify-between px-5 py-[18px] text-[15px] font-medium tracking-wide text-[#2f2f2f] hover:text-[#AA8C77] transition-colors border-b border-[#d4a5a5]/30"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <span>{item.label.charAt(0) + item.label.slice(1).toLowerCase()}</span>
                                {item.hasDropdown && (
                                    <ChevronDown className="w-4 h-4 -rotate-90 opacity-40" />
                                )}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom Section — Country, Login, Socials */}
                <div className="mt-auto border-t border-[#d4a5a5]/30">
                    
                    {/* Country Selector */}
                    <div className="px-5 py-4 flex items-center gap-2.5 cursor-pointer hover:bg-white/20 transition-colors rounded-lg mx-2">
                        <span className="text-xl leading-none">🇰🇪</span>
                        <span className="text-sm text-[#2f2f2f] font-medium">Kenya (KES Ksh)</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
                    </div>

                    {/* Login Button */}
                    <div className="px-5 pb-4">
                        <Link 
                            href="/login"
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center justify-center w-full py-3.5 bg-[#2f2f2f] hover:bg-[#1a1a1a] text-white text-sm font-bold tracking-[0.15em] uppercase rounded-full transition-all active:scale-[0.98]"
                        >
                            LOG IN
                        </Link>
                    </div>

                    {/* Social Icons */}
                    <div className="px-5 pb-6 flex items-center justify-center gap-6">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[#2f2f2f] hover:text-[#AA8C77] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[#2f2f2f] hover:text-[#AA8C77] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-[#2f2f2f] hover:text-[#AA8C77] transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Search Drawer Overlay */}
            {isSearchOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-[80] backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSearchOpen(false)}
                />
            )}

            {/* Search Drawer Modal */}
            <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-[90] transform transition-transform duration-500 ease-in-out ${isSearchOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl flex flex-col font-sans`}>
                {/* Search Header */}
                <div className="p-6 flex justify-between items-center bg-white z-10 shrink-0">
                    <span className="text-xl font-medium text-[#1c2e36]">Search</span>
                    <button onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-gray-100 text-[#2f2f2f] rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="px-6 pb-6 overflow-y-auto flex-1">
                    {/* Search Input */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 stroke-[2]" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-black transition-all text-sm placeholder:text-gray-400"
                        />
                    </div>

                    {/* Keywords Section */}
                    <div className="mb-6">
                        <h3 className="font-serif text-[#1a2c3a] text-[15px] mb-3">Most searched keywords</h3>
                        <p className="text-sm text-[#2f2f2f]">Khamrah, Asad, Badee Al Oud, Yara</p>
                    </div>

                    <div className="w-full h-px bg-gray-100 mb-8" />

                    {/* Products Section */}
                    <div>
                        <h3 className="font-serif text-[#1a2c3a] text-[15px] mb-6">Most searched products</h3>
                        <div className="space-y-4">
                            {/* Product Item 1: Atheri */}
                            <Link href="/product/lattafa-atheri" onClick={() => setIsSearchOpen(false)} className="flex items-center gap-5 group">
                                <div className="w-20 h-20 bg-[#f7f7f7] rounded-xl flex items-center justify-center p-2 shrink-0">
                                    <img src="/products/Lattafa-Atheri.jpg" alt="Atheri" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h4 className="text-[15px] font-medium text-[#1a2c3a] group-hover:text-[#5C4D42] transition-colors">Atheri</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[15px] font-bold text-[#d14b39]">$44.99 USD</span>
                                        <span className="text-sm text-[#8c8c8c] line-through decoration-1">$47.99 USD</span>
                                    </div>
                                </div>
                            </Link>

                            {/* Product Item 2: Fakhar Femme */}
                            <Link href="/product/lattafa-fakhar-femme" onClick={() => setIsSearchOpen(false)} className="flex items-center gap-5 group">
                                <div className="w-20 h-20 bg-[#f7f7f7] rounded-xl flex items-center justify-center p-2 shrink-0">
                                    <img src="/products/Lattafa-Fakhar-Femme.jpg" alt="Fakhar Femme" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h4 className="text-[15px] font-medium text-[#1a2c3a] group-hover:text-[#5C4D42] transition-colors">Fakhar Femme</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[15px] font-bold text-[#d14b39]">$39.99 USD</span>
                                        <span className="text-sm text-[#8c8c8c] line-through decoration-1">$49.99 USD</span>
                                    </div>
                                </div>
                            </Link>

                            {/* Product Item 3: Haya */}
                            <Link href="/product/lattafa-haya" onClick={() => setIsSearchOpen(false)} className="flex items-center gap-5 group">
                                <div className="w-20 h-20 bg-[#f7f7f7] rounded-xl flex items-center justify-center p-2 shrink-0">
                                    <img src="/products/Lattafa-Haya.jpg" alt="Haya" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h4 className="text-[15px] font-medium text-[#1a2c3a] group-hover:text-[#5C4D42] transition-colors">Haya</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[15px] font-bold text-[#1a2c3a]">$35.00 USD</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
