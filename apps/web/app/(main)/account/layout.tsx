"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, User, MapPin, Heart, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

const navItems = [
    { label: "Dashboard", href: "/account/dashboard", icon: LayoutDashboard },
    { label: "Orders", href: "/account/orders", icon: ShoppingBag },
    { label: "Profile", href: "/account", icon: User },
    { label: "Addresses", href: "/account/addresses", icon: MapPin },
    { label: "Wishlist", href: "/account/wishlist", icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { signOut } = useAuthActions();

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-[240px] shrink-0">
                    <div className="bg-card border border-border rounded-lg p-3">
                        {/* User Profile Summary (matches screenshot) */}
                        <div className="flex items-center gap-4 mb-4 p-2 border-b border-border pb-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                                T
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold text-sm text-card-foreground">testuser</span>
                                <span className="text-xs text-muted-foreground">testuser@test.com</span>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-medium ${isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            }`}
                                    >
                                        <Icon size={16} className={isActive ? "text-primary-foreground" : "text-muted-foreground"} />
                                        <span>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Sign Out Button (Not in screenshot explicitly, but necessary) */}
                        <div className="mt-6 pt-4 border-t border-border">
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-destructive hover:bg-destructive/10 transition-all duration-200 text-sm font-medium"
                            >
                                <LogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
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
