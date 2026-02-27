"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, Heart, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

const navItems = [
    { label: "Profile", href: "/account", icon: User },
    { label: "Orders", href: "/account/orders", icon: ShoppingBag },
    { label: "Wishlist", href: "/account/wishlist", icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { signOut } = useAuthActions();

    return (
        <div className="min-height-screen bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 flex flex-col lg:flex-row gap-12">
                {/* Sidebar */}
                <aside className="w-full lg:w-64 shrink-0">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border overflow-hidden">
                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${isActive
                                                ? "bg-[#8b1538] text-white shadow-md shadow-[#8b1538]/20"
                                                : "text-gray-600 hover:bg-gray-100/80"
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-200 mt-4"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </nav>
                    </div>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
