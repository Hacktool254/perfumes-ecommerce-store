"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { format } from "date-fns";
import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
    const orders = useQuery(api.orders.list) as any[];

    if (orders === undefined) return <div className="p-8 text-center text-muted-foreground text-sm">Loading orders...</div>;

    return (
        <div className="max-w-4xl pb-10">
            <h1 className="text-[28px] font-bold text-foreground leading-tight mb-6">Order History</h1>

            {orders.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="text-muted-foreground" size={32} />
                    </div>
                    <h2 className="text-lg font-semibold text-card-foreground mb-2">No orders yet</h2>
                    <p className="text-sm text-muted-foreground mb-6">When you place an order, it will appear here.</p>
                    <Link
                        href="/shop"
                        className="inline-block px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            key={order._id}
                            href={`/account/orders/${order._id}`}
                            className="block bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-colors group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-card-foreground text-sm">Order #{order._id.slice(-8)}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{format(order.createdAt, "PPP")}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="font-semibold text-card-foreground text-sm">KES {order.totalAmount.toLocaleString()}</p>
                                        <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider ${order.status === "delivered" ? "bg-green-500/10 text-green-700 border border-green-500/20" :
                                            order.status === "cancelled" ? "bg-red-500/10 text-red-700 border border-red-500/20" :
                                                "bg-muted text-card-foreground border border-border"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <ChevronRight className="text-muted-foreground group-hover:text-foreground transition-colors" size={20} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
