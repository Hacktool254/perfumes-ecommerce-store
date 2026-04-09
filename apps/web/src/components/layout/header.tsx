"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, X, Menu, ChevronDown, ArrowUpRight, Search, ShoppingBag } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { CartDrawer } from "@/components/cart/cart-drawer";

// ─── Dropdown: SHOP ────────────────────────────────────────────────────────
// Shows categories + brands + trending products

const trendProducts = [
    {
        name: "Khamrah",
        brand: "LATTAFA",
        image: "/products/Lattafa-Khamrah.jpg",
        href: "/product/lattafa-khamrah",
        price: "KES 6,500"
    },
    {
        name: "Nebras",
        brand: "LATTAFA",
        image: "/products/Lattafa-Nebras.jpg",
        href: "/product/lattafa-nebras",
        price: "KES 4,800"
    }
];

function ShopDropdown() {
    return (
        <div className="absolute left-0 top-full w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-[60] pointer-events-none group-hover:pointer-events-auto">
            <div className="w-full bg-white shadow-xl shadow-black/10 border-t border-gray-100">
                <div className="w-full px-4 md:px-8 xl:px-12 py-12 relative flex">
                    
                    {/* Columns Wrapper */}
                    <div className="flex gap-16 xl:gap-24 flex-1">
                        
                        {/* Col 1: Main Links */}
                        <div className="flex flex-col gap-6">
                            <Link href="/shop?sort=trending" className="font-serif text-lg text-[#1c2e36] hover:text-[#5C4D42] transition-colors">Best Sellers</Link>
                            <Link href="/shop?sort=new" className="font-serif text-lg text-[#1c2e36] hover:text-[#5C4D42] transition-colors">New Arrivals</Link>
                            <Link href="/shop" className="font-serif text-lg text-[#1c2e36] hover:text-[#5C4D42] transition-colors">All Products</Link>
                        </div>

                        {/* Col 2: By Category */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-serif text-[#1c2e36] text-[15px] mb-1">By Category</h3>
                            <Link href="/shop" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">All Fragrances</Link>
                            <Link href="/shop?gender=women" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">Women&apos;s Fragrances</Link>
                            <Link href="/shop?gender=men" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">Men&apos;s Fragrances</Link>
                            <Link href="/shop?gender=unisex" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">Unisex Fragrances</Link>
                        </div>

                        {/* Col 3: By Type */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-serif text-[#1c2e36] text-[15px] mb-1">By Type</h3>
                            <Link href="/shop" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">Eau de Parfum (EDP)</Link>
                            <Link href="/shop" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">Deodorant</Link>
                            <Link href="/shop" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">Air Freshener</Link>
                            <Link href="/shop" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">All Over Spray</Link>
                        </div>

                        {/* Col 4: By Brand */}
                        <div className="flex flex-col gap-4">
                            <h3 className="font-serif text-[#1c2e36] text-[15px] mb-1">By Brand</h3>
                            <Link href="/shop?brand=Lattafa" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">Lattafa</Link>
                            <Link href="/shop?brand=Swiss+Arabian" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">Swiss Arabian</Link>
                            <Link href="/shop?brand=Rave" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">Rave</Link>
                            <Link href="/shop?brand=Armaf" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">Armaf</Link>
                            <Link href="/shop?brand=Afnan" className="text-[13px] font-medium text-[#2f2f2f] hover:text-[#5C4D42] transition-colors">Afnan</Link>
                        </div>

                    </div>

                    {/* Trend This Week */}
                    <div className="w-[450px] shrink-0 border-l border-gray-100 pl-12 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-serif text-[#1c2e36] text-[15px]">Trend This Week</h3>
                        </div>
                        <div className="flex gap-4">
                            {trendProducts.map((p) => (
                                <Link key={p.name} href={p.href} className="flex-1 group/item">
                                    <div className="relative aspect-[4/5] bg-[#f7f7f7] rounded-xl overflow-hidden mb-4">
                                        <Image src={p.image} alt={p.name} fill sizes="200px" className="object-contain group-hover/item:scale-105 transition-transform duration-500 p-2" />
                                    </div>
                                    <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">{p.brand}</p>
                                    <p className="font-medium text-[#1c2e36] mb-1">{p.name}</p>
                                    <p className="font-bold text-[#1c2e36]">{p.price}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// ─── Dropdown: NEW ARRIVALS ─────────────────────────────────────────────────
// Shows different products than Best Sellers and Collections

const newArrivalProducts = [
    {
        id: "h1",
        name: "Angham",
        brand: "Lattafa",
        image: "/products/Lattafa-Angham.jpg",
        href: "/product/lattafa-angham"
    },
    {
        id: "h2",
        name: "Rimmah",
        brand: "Lattafa",
        image: "/products/Lattafa-Rimmah.jpg",
        href: "/product/lattafa-rimmah"
    },
    {
        id: "h3",
        name: "Scarlet",
        brand: "Lattafa",
        image: "/products/Lattafa-Scarlet.jpg",
        href: "/product/lattafa-scarlet"
    },
    {
        id: "h4",
        name: "Atheri",
        brand: "Lattafa",
        image: "/products/Lattafa-Atheri.jpg",
        href: "/product/lattafa-atheri"
    }
];

function NewArrivalsDropdown() {
    return (
        <div className="absolute left-0 top-full w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-[60] pointer-events-none group-hover:pointer-events-auto">
            <div className="w-full bg-white shadow-xl shadow-black/10 border-t border-gray-100">
                <div className="w-full px-4 md:px-8 xl:px-12 py-10 relative">
                    <div className="flex justify-between gap-6 w-full">
                        {newArrivalProducts.map((p) => (
                            <Link key={p.id} href={p.href} className="group/item flex flex-col flex-1 relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform hover:shadow-md hover:-translate-y-1">
                                <div className="relative aspect-[4/3] bg-[#f7f7f7] w-full overflow-hidden">
                                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover/item:scale-[1.03]" />
                                </div>
                                <div className="flex items-center justify-between p-5 bg-white">
                                    <p className="font-serif text-[#1c2e36] text-[15px]">{p.name}</p>
                                    <div className="w-8 h-8 rounded-full bg-[#f4f4f4] flex items-center justify-center transition-colors group-hover/item:bg-[#1c2e36] group-hover/item:text-white">
                                        <ArrowUpRight className="w-4 h-4" />
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

// ─── Dropdown: BEST SELLERS ─────────────────────────────────────────────────
// Different products from New Arrivals

const bestSellerProducts = [
    {
        id: "b1",
        name: "Asad",
        brand: "Lattafa",
        image: "/products/Lattafa-Assad.jpg",
        href: "/product/lattafa-asad"
    },
    {
        id: "b2",
        name: "Yara",
        brand: "Lattafa",
        image: "/products/Lattafa-Yara.jpg",
        href: "/product/lattafa-yara"
    },
    {
        id: "b3",
        name: "Mayar",
        brand: "Lattafa",
        image: "/products/Lattafa-Mayar.jpg",
        href: "/product/lattafa-mayar"
    },
    {
        id: "b4",
        name: "Sublime",
        brand: "Lattafa",
        image: "/products/Lattafa-Sublime.jpg",
        href: "/product/lattafa-sublime"
    }
];

function BestSellersDropdown() {
    return (
        <div className="absolute left-0 top-full w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-[60] pointer-events-none group-hover:pointer-events-auto">
            <div className="w-full bg-white shadow-xl shadow-black/10 border-t border-gray-100">
                <div className="w-full px-4 md:px-8 xl:px-12 py-10 relative">
                    <div className="flex justify-between gap-6 w-full">
                        {bestSellerProducts.map((p) => (
                            <Link key={p.id} href={p.href} className="group/item flex flex-col flex-1 relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform hover:shadow-md hover:-translate-y-1">
                                <div className="relative aspect-[4/3] bg-[#f7f7f7] w-full overflow-hidden">
                                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 ease-out group-hover/item:scale-[1.03]" />
                                </div>
                                <div className="flex items-center justify-between p-5 bg-white">
                                    <p className="font-serif text-[#1c2e36] text-[15px]">{p.name}</p>
                                    <div className="w-8 h-8 rounded-full bg-[#f4f4f4] flex items-center justify-center transition-colors group-hover/item:bg-[#1c2e36] group-hover/item:text-white">
                                        <ArrowUpRight className="w-4 h-4" />
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

// ─── Dropdown: COLLECTIONS ──────────────────────────────────────────────────
// Shows CATEGORIES (Men's, Women's, Unisex, Perfumes, Body Wash, Body Oil) with images

const collectionCategories = [
    {
        id: "c1",
        name: "Men's Fragrances",
        image: "/categories/mens-fragrance.jpg",
        href: "/shop?gender=men"
    },
    {
        id: "c2",
        name: "Women's Fragrances",
        image: "/categories/womens-fragrance.jpg",
        href: "/shop?gender=women"
    },
    {
        id: "c3",
        name: "Unisex Fragrances",
        image: "/categories/unisex-fragrance.jpg",
        href: "/shop?gender=unisex"
    },
    {
        id: "c4",
        name: "Perfumes",
        image: "/categories/perfumes.jpg",
        href: "/categories"
    },
    {
        id: "c5",
        name: "Body Wash",
        image: "/categories/bodywash.jpg",
        href: "/categories"
    },
    {
        id: "c6",
        name: "Body Oil",
        image: "/categories/body-oil.jpg",
        href: "/categories"
    }
];

function CollectionsDropdown() {
    return (
        <div className="absolute left-0 top-full w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-[60] pointer-events-none group-hover:pointer-events-auto">
            <div className="w-full bg-white shadow-xl shadow-black/10 border-t border-gray-100">
                <div className="w-full px-4 md:px-8 xl:px-12 py-10 relative">
                    <div className="grid grid-cols-6 gap-5 w-full">
                        {collectionCategories.map((c) => (
                            <Link key={c.id} href={c.href} className="group/item flex flex-col relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform hover:shadow-md hover:-translate-y-1">
                                <div className="relative aspect-[3/4] w-full overflow-hidden">
                                    <Image src={c.image} alt={c.name} fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover transition-transform duration-700 ease-out group-hover/item:scale-[1.05]" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover/item:from-black/40 transition-colors duration-500" />
                                </div>
                                <div className="absolute inset-0 flex items-end p-4">
                                    <p className="font-serif text-white text-[14px] leading-tight">{c.name}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Nav Items (BUNDLES removed) ────────────────────────────────────────────

const navItems = [
    { label: "SHOP", href: "/shop", dropdown: "shop" },
    { label: "NEW ARRIVALS", href: "/shop?sort=new", dropdown: "new" },
    { label: "BEST SELLERS", href: "/shop?sort=trending", dropdown: "best" },
    { label: "COLLECTIONS", href: "/categories", dropdown: "collections" },
    { label: "TRACK MY ORDER", href: "/track" },
];

function getDropdown(type?: string) {
    switch (type) {
        case "shop": return <ShopDropdown />;
        case "new": return <NewArrivalsDropdown />;
        case "best": return <BestSellersDropdown />;
        case "collections": return <CollectionsDropdown />;
        default: return null;
    }
}

export function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { items } = useCart();
    const logSearch = useMutation(api.searches.log);

    const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const executeSearch = (query: string) => {
        if (!query.trim()) return;
        const normalizedQuery = query.trim();
        setIsSearchOpen(false);
        setSearchQuery("");
        
        // Log search (non-blocking)
        logSearch({ query: normalizedQuery }).catch(console.error);
        
        // Redirect
        router.push(`/shop?search=${encodeURIComponent(normalizedQuery)}`);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            executeSearch(searchQuery);
        }
    };

    return (
        <>
            <header className="sticky top-0 left-0 w-full z-50 bg-[#F3C7C8] transition-all font-sans">
                <div className="w-full flex items-center justify-between h-24 px-4 md:px-8 xl:px-12 relative">
                    
                    {/* Left: Logo */}
                    <div className="flex flex-1 items-center">
                        <Link href="/" className="z-10 hover:opacity-90 transition-opacity">
                            <Image
                                src="/logo_transparent.png"
                                alt="Ummie's Essence Logo"
                                width={160}
                                height={80}
                                className="h-20 md:h-24 w-auto object-contain scale-110 md:scale-125 transform origin-left"
                            />
                        </Link>
                    </div>

                    {/* Center: Navigation (Desktop) */}
                    <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8 h-full">
                        {navItems.map(item => (
                            <div key={item.label} className="group h-full flex items-center border-b-2 border-transparent hover:border-[#5C4D42] transition-all">
                                <Link 
                                    href={item.href}
                                    className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#2f2f2f] hover:text-[#5C4D42] transition-colors whitespace-nowrap px-1 uppercase h-full"
                                >
                                    {item.label}
                                    {item.dropdown && <ChevronDown className="w-3.5 h-3.5 text-current opacity-70 group-hover:rotate-180 transition-transform duration-300" />}
                                </Link>
                                {item.dropdown && getDropdown(item.dropdown)}
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
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="text-[#2f2f2f] hover:text-[#5C4D42] transition-all hover:scale-105 relative group"
                        >
                            <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                            {totalItemCount > 0 && (
                                <div 
                                    key={totalItemCount} /* Key forcing animation on count change */
                                    className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 bg-[#AA8C77] text-white text-[9px] font-black rounded-full flex items-center justify-center animate-[bounce-in_0.4s_cubic-bezier(0.18,0.89,0.32,1.28)] shadow-lg shadow-[#AA8C77]/20 border border-white/20"
                                >
                                    {totalItemCount}
                                </div>
                            )}
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

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

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
                    <Link href="/" onClick={() => setIsSidebarOpen(false)} className="relative w-32 h-14">
                        <Image
                            src="/logo_transparent.png"
                            alt="Ummie's Essence"
                            fill
                            sizes="128px"
                            className="object-contain"
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
                                {item.dropdown && (
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
                    <div className="relative mb-8 flex items-center gap-2">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 stroke-[2] group-focus-within:text-black transition-colors" />
                            <input
                                type="text"
                                placeholder="Search our premium collection..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-gray-100 bg-[#f7f7f7] focus:outline-none focus:border-black focus:bg-white transition-all text-sm placeholder:text-gray-400"
                                autoFocus
                            />
                        </div>
                        <button 
                            onClick={() => executeSearch(searchQuery)}
                            className="h-[52px] px-6 bg-[#2f2f2f] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#1a1a1a] transition-all active:scale-95 disabled:opacity-50"
                            disabled={!searchQuery.trim()}
                        >
                            Find
                        </button>
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
                            {/* Product Item 1: Teriaq */}
                            <Link href="/product/lattafa-teriaq" onClick={() => setIsSearchOpen(false)} className="flex items-center gap-5 group">
                                <div className="w-20 h-20 bg-[#f7f7f7] rounded-xl flex items-center justify-center p-2 shrink-0">
                                    <img src="/products/Lattafa-Teriaq.jpg" alt="Teriaq" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h4 className="text-[15px] font-medium text-[#1a2c3a] group-hover:text-[#5C4D42] transition-colors">Teriaq</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[15px] font-bold text-[#1a2c3a]">KES 6,000</span>
                                    </div>
                                </div>
                            </Link>

                            {/* Product Item 2: Sakeena */}
                            <Link href="/product/lattafa-sakeena" onClick={() => setIsSearchOpen(false)} className="flex items-center gap-5 group">
                                <div className="w-20 h-20 bg-[#f7f7f7] rounded-xl flex items-center justify-center p-2 shrink-0">
                                    <img src="/products/Lattafa-Sakeena.jpg" alt="Sakeena" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h4 className="text-[15px] font-medium text-[#1a2c3a] group-hover:text-[#5C4D42] transition-colors">Sakeena</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[15px] font-bold text-[#1a2c3a]">KES 6,500</span>
                                    </div>
                                </div>
                            </Link>

                            {/* Product Item 3: The Kingdom */}
                            <Link href="/product/lattafa-the-kingdom" onClick={() => setIsSearchOpen(false)} className="flex items-center gap-5 group">
                                <div className="w-20 h-20 bg-[#f7f7f7] rounded-xl flex items-center justify-center p-2 shrink-0">
                                    <img src="/products/Lattafa-The-Kingdom.jpg" alt="The Kingdom" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h4 className="text-[15px] font-medium text-[#1a2c3a] group-hover:text-[#5C4D42] transition-colors">The Kingdom</h4>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[15px] font-bold text-[#1a2c3a]">KES 5,500</span>
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
