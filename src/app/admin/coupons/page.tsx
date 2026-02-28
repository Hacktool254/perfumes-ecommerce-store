"use client";

import {
    Plus,
    Ticket,
    Calendar,
    Users,
    Trash2,
    ToggleLeft,
    Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function AdminCouponsPage() {
    const coupons = [
        { code: "RAMADAN24", type: "percentage", value: 15, usage: 45, limit: 100, expiry: "2024-04-10", active: true },
        { code: "VALENTINE", type: "fixed", value: 2000, usage: 12, limit: 50, expiry: "2024-02-14", active: false },
        { code: "WELCOME20", type: "percentage", value: 20, usage: 125, limit: null, expiry: "2024-12-31", active: true },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">Coupon Management</h1>
                    <p className="text-neutral-400">Create and manage marketing discounts and limited offers.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-full px-6">
                    <Plus className="w-4 h-4" />
                    New Coupon
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                    <Card key={coupon.code} className={cn(
                        "bg-neutral-900 border-neutral-800 shadow-xl group transition-all duration-300",
                        !coupon.active && "opacity-60 grayscale"
                    )}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                <Tag className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-neutral-800 text-neutral-400 hover:text-white">
                                    <ToggleLeft className={cn("w-5 h-5", coupon.active ? "text-primary" : "text-neutral-600")} />
                                </Button>
                                <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-red-950/30 text-neutral-400 hover:text-red-500">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-xl font-mono font-bold text-white tracking-widest">{coupon.code}</h3>
                                <p className="text-sm text-neutral-400">
                                    {coupon.type === "percentage" ? `${coupon.value}% OFF` : `KES ${coupon.value.toLocaleString()} OFF`}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                                        <Users className="w-3 h-3" /> Usage
                                    </p>
                                    <p className="text-sm text-neutral-200">
                                        {coupon.usage} / {coupon.limit || "∞"}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" /> Expires
                                    </p>
                                    <p className="text-sm text-neutral-200">{coupon.expiry}</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: coupon.limit ? `${(coupon.usage / coupon.limit) * 100}%` : '40%' }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
