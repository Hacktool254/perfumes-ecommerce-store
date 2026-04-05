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

            {/* Slide-out Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-[280px] sm:w-[320px] bg-white z-[70] transform transition-transform duration-500 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col font-sans`}>
                <div className="p-6 flex justify-between items-center border-b border-gray-100">
                    <span className="font-bold tracking-widest text-sm text-[#2f2f2f]">MENU</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 text-[#2f2f2f] rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="px-4 py-6 overflow-y-auto flex-1">
                    <nav className="flex flex-col space-y-1">
                        <Link 
                            href="/" 
                            className="flex items-center gap-2 px-4 py-4 rounded-lg transition-all text-sm font-bold tracking-widest text-[#2f2f2f] hover:bg-gray-50 hover:text-[#5C4D42]"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            HOME
                        </Link>
                        {navItems.map((item, idx) => (
                            <Link 
                                key={idx}
                                href={item.href} 
                                className="flex items-center justify-between px-4 py-4 rounded-lg transition-all text-sm font-bold tracking-widest text-[#2f2f2f] hover:bg-gray-50 hover:text-[#5C4D42]"
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                {item.label}
                                {item.hasDropdown && <ChevronDown className="w-4 h-4 opacity-50" />}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <p className="text-[10px] text-gray-400 tracking-widest uppercase text-center">© 2026 UMMIES ESSENCE</p>
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
