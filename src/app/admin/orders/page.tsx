"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
    Search,
    Filter,
    Eye,
    CheckCircle2,
    Truck,
    Clock,
    MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function AdminOrdersPage() {
    // These will eventually be connected to Convex queries
    const orders = [
        { id: "ORD-1025", customer: "Amara Okonkwo", date: "2024-02-28", total: 12500, status: "pending", items: 3 },
        { id: "ORD-1024", customer: "Kwame Mensah", date: "2024-02-28", total: 8200, status: "shipped", items: 2 },
        { id: "ORD-1023", customer: "Zoya Patel", date: "2024-02-27", total: 45000, status: "delivered", items: 5 },
        { id: "ORD-1022", customer: "Sami Yusuf", date: "2024-02-27", total: 15600, status: "pending", items: 1 },
        { id: "ORD-1021", customer: "Elena Petrova", date: "2024-02-26", total: 22000, status: "cancelled", items: 4 },
    ];

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "shipped": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "delivered": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-neutral-500/10 text-neutral-500 border-neutral-500/20";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending": return <Clock className="w-3 h-3" />;
            case "shipped": return <Truck className="w-3 h-3" />;
            case "delivered": return <CheckCircle2 className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-serif font-bold text-white mb-2">Order Management</h1>
                <p className="text-neutral-400">Track and fulfill customer orders across all collections.</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input
                        placeholder="Search by order ID or customer..."
                        className="pl-10 bg-neutral-900 border-neutral-800 h-11"
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-neutral-800 bg-neutral-900 text-neutral-300 gap-2">
                        <Filter className="w-4 h-4" />
                        Status: All
                    </Button>
                    <Button variant="outline" className="border-neutral-800 bg-neutral-900 text-neutral-300">
                        Last 30 Days
                    </Button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 shadow-xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-neutral-800/50">
                        <TableRow className="hover:bg-transparent border-neutral-800">
                            <TableHead className="text-neutral-300">Order ID</TableHead>
                            <TableHead className="text-neutral-300">Customer</TableHead>
                            <TableHead className="text-neutral-300">Date</TableHead>
                            <TableHead className="text-neutral-300">Items</TableHead>
                            <TableHead className="text-neutral-300">Total</TableHead>
                            <TableHead className="text-neutral-300">Status</TableHead>
                            <TableHead className="text-right text-neutral-300">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} className="border-neutral-800 hover:bg-neutral-800/30 transition-colors group">
                                <TableCell className="font-mono text-sm text-primary">
                                    {order.id}
                                </TableCell>
                                <TableCell className="font-medium text-neutral-200">
                                    {order.customer}
                                </TableCell>
                                <TableCell className="text-neutral-400 text-sm">
                                    {order.date}
                                </TableCell>
                                <TableCell className="text-neutral-400">
                                    {order.items} items
                                </TableCell>
                                <TableCell className="font-medium text-white">
                                    KES {order.total.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border",
                                        getStatusStyles(order.status)
                                    )}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-neutral-800 hover:text-white">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-neutral-800">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 text-neutral-300">
                                                <DropdownMenuItem className="cursor-pointer">Mark as Shipped</DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">Mark as Delivered</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer">Cancel Order</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
