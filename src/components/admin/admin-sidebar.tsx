"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Box,
    Users,
    Settings,
    ShoppingBag,
    ChevronRight,
    Search,
    Bell
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Inventory", href: "/admin/inventory", icon: Box },
    { name: "Customer", href: "/admin/coupons", icon: Users },
    { name: "Manage User", href: "#", icon: Users },
    { name: "Settings", href: "#", icon: Settings },
];

const messages = [
    { name: "Abir Mahmud", unread: 2, avatar: "https://i.pravatar.cc/150?u=abir" },
    { name: "Jessia Pio", unread: 0, avatar: "https://i.pravatar.cc/150?u=jessia" },
    { name: "Handal Kawa", unread: 1, avatar: "https://i.pravatar.cc/150?u=handal" },
    { name: "Levrino", unread: 0, avatar: "https://i.pravatar.cc/150?u=levrino" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-card shadow-sm border-r border-border flex flex-col sticky top-0 z-50">
            {/* Logo area */}
            <div className="p-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary">
                        <ShoppingBag size={20} className="fill-primary/20 stroke-primary" />
                    </div>
                    <span className="font-bold text-2xl text-foreground tracking-tight">Ummie&apos;s</span>
                </Link>
                <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600">
                    <ChevronRight size={14} />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar px-4 pb-6">
                <div>
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">Menu</h3>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group font-medium text-[15px]",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600")} strokeWidth={isActive ? 2.5 : 2} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-8">
                    <div className="flex items-center justify-between px-2 mb-3">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Message</h3>
                        <div className="flex gap-1 text-gray-400">
                            <ChevronRight size={12} className="rotate-180 cursor-pointer hover:text-gray-600" />
                            <ChevronRight size={12} className="cursor-pointer hover:text-gray-600" />
                        </div>
                    </div>

                    <div className="space-y-3 px-2">
                        {messages.map((msg, i) => (
                            <div key={i} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <img src={msg.avatar} alt={msg.name} className="w-8 h-8 rounded-full border border-gray-100 object-cover" />
                                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">{msg.name}</span>
                                </div>
                                {msg.unread > 0 && (
                                    <span className="text-[10px] w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                                        {msg.unread}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="px-2 mt-4">
                        <button className="w-full py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
                            View All Contacts
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
