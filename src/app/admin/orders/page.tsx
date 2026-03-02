"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
    Search,
    Filter,
    Eye,
    CheckCircle2,
    Truck,
    Clock,
    MoreVertical,
    XCircle,
    Download,
    ShoppingBag
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
import { format } from "date-fns";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

export default function AdminOrdersPage() {
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
    const [searchTerm, setSearchTerm] = useState("");

    const orders = useQuery(api.orders.adminList, {
        status: statusFilter === "all" ? undefined : statusFilter
    });

    const updateStatus = useMutation(api.orders.updateStatus);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "paid": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
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
            case "cancelled": return <XCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    const handleUpdateStatus = async (orderId: Id<"orders">, newStatus: OrderStatus) => {
        try {
            await updateStatus({ id: orderId, status: newStatus });
        } catch (error) {
            console.error("Failed to update order status", error);
        }
    };

    const filteredOrders = orders?.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = () => {
        if (!filteredOrders) return;

        const headers = ["Order ID", "Customer", "Email", "Date", "Items", "Total", "Status"];
        const rows = filteredOrders.map(order => [
            order._id,
            order.customerName,
            order.customerEmail,
            format(order.createdAt, "yyyy-MM-dd HH:mm"),
            "Items Hidden", // In a real app, we'd fetch item counts or join
            order.totalAmount,
            order.status
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `orders_${format(new Date(), "yyyy-MM-dd")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Order Management</h1>
                    <p className="text-muted-foreground">Track and fulfill customer orders across all collections.</p>
                </div>
                <Button onClick={exportToCSV} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by order ID or customer..."
                        className="pl-10 bg-card border-border h-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="border-border bg-card text-foreground gap-2 min-w-[140px]">
                                <Filter className="w-4 h-4" />
                                Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                            <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Statuses</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("paid")}>Paid</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("shipped")}>Shipped</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("delivered")}>Delivered</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("cancelled")}>Cancelled</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" className="border-border bg-card text-foreground">
                        Last 30 Days
                    </Button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden min-h-[400px]">
                {!orders ? (
                    <div className="flex items-center justify-center h-[400px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent border-border">
                                <TableHead className="text-foreground">Order ID</TableHead>
                                <TableHead className="text-foreground">Customer</TableHead>
                                <TableHead className="text-foreground">Date</TableHead>
                                <TableHead className="text-foreground">Total</TableHead>
                                <TableHead className="text-foreground">Status</TableHead>
                                <TableHead className="text-right text-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders?.map((order) => (
                                <TableRow key={order._id} className="border-border hover:bg-muted/30 transition-colors group">
                                    <TableCell className="font-mono text-[10px] text-primary">
                                        {order._id.slice(-8).toUpperCase()}
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">
                                        <div>
                                            <p>{order.customerName}</p>
                                            <p className="text-[10px] text-muted-foreground font-normal">{order.customerEmail}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {format(order.createdAt, "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell className="font-medium text-foreground">
                                        KES {order.totalAmount.toLocaleString()}
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
                                            <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-muted hover:text-foreground">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="w-8 h-8 hover:bg-muted">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-card border-border text-card-foreground">
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, "paid")} className="cursor-pointer">Mark as Paid</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, "shipped")} className="cursor-pointer">Mark as Shipped</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, "delivered")} className="cursor-pointer">Mark as Delivered</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, "cancelled")} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">Cancel Order</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                {filteredOrders?.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                        <ShoppingBag size={48} className="mb-4 opacity-20" />
                        <p>No orders found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}
