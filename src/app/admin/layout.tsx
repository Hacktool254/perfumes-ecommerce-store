"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminGuard } from "@/components/admin/admin-guard";
import { Search, Bell, ChevronDown } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="flex min-h-screen bg-[#f4f7fe] text-gray-900 overflow-hidden">
                <AdminSidebar />
                <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                    {/* Admin Header */}
                    <header className="h-24 px-8 flex items-center justify-between bg-transparent w-full mt-2">
                        {/* Search Bar */}
                        <div className="relative w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Anythings"
                                className="w-full h-12 pl-12 pr-4 bg-white rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#0b5cff]/20 text-sm shadow-sm placeholder:text-gray-400"
                            />
                        </div>

                        {/* Right Area: Notifications & Profile */}
                        <div className="flex items-center gap-6">
                            {/* Notification Bell */}
                            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative shadow-sm border border-gray-50 hover:bg-gray-50">
                                <Bell className="w-5 h-5 text-gray-500 fill-gray-100" />
                                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[#0b5cff] border-2 border-white" />
                            </button>

                            {/* User Profile Info */}
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden md:block">
                                    <p className="text-xs text-gray-500 font-medium leading-none mb-1">Your Balance</p>
                                    <p className="text-lg font-bold text-gray-900 leading-none">$1365</p>
                                </div>
                                <div className="flex items-center gap-2 cursor-pointer bg-white px-2 py-1.5 rounded-full pr-4 shadow-sm border border-gray-50 hover:bg-gray-50">
                                    <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-9 h-9 rounded-full object-cover" />
                                    <span className="text-sm font-semibold text-gray-700">Khandaker Rasel</span>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Area */}
                    <div className="px-8 pb-8 flex-1">
                        {children}
                    </div>
                </main>
            </div>
        </AdminGuard>
    );
}
