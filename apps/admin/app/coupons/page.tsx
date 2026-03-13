"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import {
    Plus,
    Calendar,
    Users,
    Trash2,
    Power,
    Tag,
    Search,
    Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Id } from "@workspaceRoot/convex/_generated/dataModel";

export default function AdminCouponsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const coupons = useQuery(api.coupons.adminList);
    const toggleStatus = useMutation(api.coupons.toggleStatus);
    const removeCoupon = useMutation(api.coupons.remove);

    const handleToggle = async (id: Id<"coupons">, currentStatus: boolean) => {
        try {
            await toggleStatus({ id, isActive: !currentStatus });
        } catch (error) {
            console.error("Failed to toggle coupon status", error);
        }
    };

    const handleDelete = async (id: Id<"coupons">) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        try {
            await removeCoupon({ id });
        } catch (error) {
            console.error("Failed to delete coupon", error);
        }
    };

    const filteredCoupons = coupons?.filter(coupon =>
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Coupon Management</h1>
                    <p className="text-muted-foreground">Create and manage marketing discounts and limited offers.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 rounded-full px-6">
                    <Plus className="w-4 h-4" />
                    New Coupon
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by coupon code..."
                    className="pl-10 bg-card border-border h-11"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!coupons ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse border border-border"></div>
                    ))
                ) : filteredCoupons?.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                        <Archive size={48} className="mb-4" />
                        <p>No coupons found</p>
                    </div>
                ) : (
                    filteredCoupons?.map((coupon) => (
                        <Card key={coupon._id} className={cn(
                            "bg-card border-border shadow-sm group transition-all duration-300",
                            !coupon.isActive && "opacity-60 grayscale"
                        )}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                                    <Tag className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="w-8 h-8 hover:bg-muted text-muted-foreground"
                                        onClick={() => handleToggle(coupon._id, coupon.isActive ?? false)}
                                    >
                                        <Power className={cn("w-4 h-4", coupon.isActive ? "text-primary" : "text-muted-foreground")} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="w-8 h-8 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                                        onClick={() => handleDelete(coupon._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-mono font-bold text-foreground tracking-widest uppercase">{coupon.code}</h3>
                                    <p className="text-sm text-primary font-bold">
                                        {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `KES ${coupon.discountValue.toLocaleString()} OFF`}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                                            <Users className="w-3 h-3" /> Usage
                                        </p>
                                        <p className="text-sm text-foreground font-medium">
                                            {coupon.usedCount} / {coupon.usageLimit || "∞"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest flex items-center gap-1.5">
                                            <Calendar className="w-3 h-3" /> Expires
                                        </p>
                                        <p className="text-sm text-foreground font-medium">
                                            {coupon.expiresAt ? format(coupon.expiresAt, "MMM d, yyyy") : "Never"}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: coupon.usageLimit ? `${(coupon.usedCount / coupon.usageLimit) * 100}%` : '40%' }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
