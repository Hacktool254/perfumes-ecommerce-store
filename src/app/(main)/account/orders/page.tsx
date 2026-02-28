"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { format } from "date-fns";
import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
    const orders = useQuery(api.orders.list) as any[];

    if (orders === undefined) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8" style={{ color: "#8b1538" }}>Order History</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border shadow-sm">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="text-gray-300" size={32} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
                    <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
                    <Link
                        href="/shop"
                        className="inline-block px-8 py-3 rounded-full bg-[#8b1538] text-white font-semibold hover:bg-[#6b102b] transition-all"
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
                            className="block bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#8b1538]/5 rounded-xl flex items-center justify-center text-[#8b1538]">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</p>
                                        <p className="text-sm text-gray-500">{format(order.createdAt, "PPP")}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="font-bold text-gray-900">KES {order.totalAmount.toLocaleString()}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium uppercase tracking-wider ${order.status === "delivered" ? "bg-green-100 text-green-700" :
                                            order.status === "cancelled" ? "bg-red-100 text-red-700" :
                                                "bg-blue-100 text-blue-700"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-[#8b1538] transition-colors" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
