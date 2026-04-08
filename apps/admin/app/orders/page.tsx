"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import {
    Search,
    Filter,
    Eye,
    CheckCircle2,
    Truck,
    Clock,
    MoreHorizontal,
    XCircle,
    Download,
    ShoppingBag,
    CreditCard,
    PackageCheck,
    ChevronRight,
    ArrowUpRight
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
import { Id } from "@workspaceRoot/convex/_generated/dataModel";
import { AdminStatCard } from "@/components/admin/admin-stat-card";

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";

const STATUS_STEPS: OrderStatus[] = ["pending", "paid", "shipped", "delivered"];

export default function AdminOrdersPage() {
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
    const [searchTerm, setSearchTerm] = useState("");

    const orders = useQuery(api.orders.adminList, {
        status: statusFilter === "all" ? undefined : statusFilter
    });
    const stats = useQuery(api.orders.getStats);
    const updateStatus = useMutation(api.orders.updateStatus);

    const handleUpdateStatus = async (orderId: Id<"orders">, newStatus: OrderStatus) => {
        try {
            await updateStatus({ id: orderId, status: newStatus });
        } catch (error) {
            console.error("Failed to update order status", error);
        }
    };

    const filteredOrders = orders?.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order._id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusInfo = (status: OrderStatus) => {
        switch (status) {
            case "pending": return { label: "Awaiting Soul", color: "text-amber-500", bg: "bg-amber-500/10", icon: <Clock size={12} /> };
            case "paid": return { label: "Authenticated", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: <CreditCard size={12} /> };
            case "shipped": return { label: "In Transit", color: "text-blue-500", bg: "bg-blue-500/10", icon: <Truck size={12} /> };
            case "delivered": return { label: "Arrived", color: "text-primary", bg: "bg-primary/10", icon: <PackageCheck size={12} /> };
            case "cancelled": return { label: "Voided", color: "text-rose-500", bg: "bg-rose-500/10", icon: <XCircle size={12} /> };
            default: return { label: status, color: "text-muted-foreground", bg: "bg-muted/10", icon: null };
        }
    };

    const StatusTimeline = ({ currentStatus }: { currentStatus: OrderStatus }) => {
        if (currentStatus === "cancelled") return <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest italic">Protocol Terminated</span>;
        
        const currentIndex = STATUS_STEPS.indexOf(currentStatus);
        
        return (
            <div className="flex items-center gap-1">
                {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    return (
                        <div key={step} className="flex items-center gap-1">
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-700",
                                isCompleted ? "bg-primary shadow-[0_0_8px_var(--primary)]" : "bg-surface-container",
                                isCurrent && "animate-pulse"
                            )} title={step} />
                            {idx < STATUS_STEPS.length - 1 && (
                                <div className={cn(
                                    "w-3 h-[1px]",
                                    idx < currentIndex ? "bg-primary/40" : "bg-surface-container"
                                )} />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Editorial Header */}
            <div className="flex items-end justify-between border-b border-border/40 pb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-[1px] bg-primary/40 rounded-full" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/60">Logistics & Fulfilment</p>
                    </div>
                    <h1 className="text-5xl font-extrabold text-foreground tracking-tighter leading-none">
                        ORDER <span className="text-primary italic font-serif font-medium">STREAM</span>
                    </h1>
                </div>
                <Button variant="ghost" className="h-14 px-8 rounded-2xl bg-surface-container-lowest border border-border/50 text-xs font-extrabold uppercase tracking-widest hover:bg-surface-container transition-all shadow-sm gap-3">
                    <Download size={18} className="text-primary" />
                    Archive Manifest
                </Button>
            </div>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminStatCard
                    title="Gross Revenue"
                    value={`KES ${(stats?.totalRevenue || 0).toLocaleString()}`}
                    trend={{ value: "Stable Flow", positive: true }}
                    icon={<CreditCard size={20} />}
                    className="bg-surface-container-lowest"
                />
                <AdminStatCard
                    title="Active Spirits"
                    value={(stats?.totalSales || 0).toString()}
                    icon={<ShoppingBag size={20} />}
                    className="bg-surface-container-lowest"
                />
                <AdminStatCard
                    title="Conversion"
                    value={`${stats?.conversionRate || 0}%`}
                    icon={<ArrowUpRight size={20} />}
                    className="bg-surface-container-lowest"
                />
            </div>

            {/* Control Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Recall order by ID or patron name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-14 h-16 bg-surface-container-lowest border-none rounded-[24px] text-sm font-medium shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                    />
                </div>
                <div className="flex gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-16 px-8 rounded-[24px] bg-surface-container-lowest border border-border/50 text-xs font-bold uppercase tracking-widest gap-4 shadow-sm">
                                <Filter size={18} className="text-primary" />
                                {statusFilter === "all" ? "All Protocols" : `Protocol: ${statusFilter}`}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-[24px] bg-surface-container-lowest border border-border/50 shadow-2xl">
                            <DropdownMenuItem onClick={() => setStatusFilter("all")} className="p-4 rounded-xl cursor-pointer hover:bg-surface-container font-medium">All Protocols</DropdownMenuItem>
                            {["pending", "paid", "shipped", "delivered", "cancelled"].map((s) => (
                                <DropdownMenuItem key={s} onClick={() => setStatusFilter(s as any)} className="p-4 rounded-xl cursor-pointer hover:bg-surface-container font-medium capitalize">{s}</DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Master Order Table */}
            <div className="bg-surface-container-lowest border border-border/50 rounded-[48px] shadow-xl shadow-surface-container/20 overflow-hidden">
                <Table>
                    <TableHeader className="bg-surface-container/30">
                        <TableRow className="hover:bg-transparent border-border/50 h-20">
                            <TableHead className="w-[180px] pl-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trace ID</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Patron</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Chronicle</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tribute</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fulfillment Path</TableHead>
                            <TableHead className="text-right pr-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Protocol</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!orders ? (
                            [1, 2, 3, 4, 5].map((i) => (
                                <TableRow key={i} className="border-border/50 h-24 animate-pulse">
                                    <TableCell className="pl-10"><div className="w-24 h-4 bg-surface-container rounded-full" /></TableCell>
                                    <TableCell><div className="h-4 w-40 bg-surface-container rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-24 bg-surface-container rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-20 bg-surface-container rounded" /></TableCell>
                                    <TableCell><div className="h-4 w-32 bg-surface-container rounded" /></TableCell>
                                    <TableCell className="pr-10 text-right"><div className="h-10 w-10 bg-surface-container rounded-full ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : filteredOrders?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-40 text-muted-foreground/40 font-serif italic text-xl">
                                    No records found in the current protocol.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders?.map((order) => {
                                const info = getStatusInfo(order.status as OrderStatus);
                                return (
                                    <TableRow key={order._id} className="border-border/50 h-28 hover:bg-surface-container/20 transition-all duration-500 group">
                                        <TableCell className="pl-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-8 bg-primary/20 rounded-full" />
                                                <div>
                                                    <p className="font-mono text-[10px] font-black tracking-widest text-primary/60">
                                                        #{order._id.slice(-8).toUpperCase()}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Ref ID: {order._id.slice(0, 4)}...</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">{order.customerName}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1 opacity-60 tracking-wider">{order.customerEmail}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm font-bold text-foreground">{format(order.createdAt, "MMMM d")}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">{format(order.createdAt, "HH:mm")}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-black text-lg text-foreground tracking-tighter">KES {order.totalAmount.toLocaleString()}</p>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-3">
                                                <StatusTimeline currentStatus={order.status as OrderStatus} />
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border transition-all duration-500",
                                                    info.color, info.bg, "border-current/20"
                                                )}>
                                                    {info.icon}
                                                    {info.label}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-10">
                                            <div className="flex justify-end gap-3">
                                                <Button size="icon" variant="ghost" className="w-12 h-12 rounded-2xl bg-surface-container/50 hover:bg-surface-container text-muted-foreground">
                                                    <Eye size={18} />
                                                </Button>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button size="icon" variant="ghost" className="w-12 h-12 rounded-2xl bg-surface-container/50 hover:bg-surface-container text-muted-foreground">
                                                            <MoreHorizontal size={18} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-[24px] bg-surface-container-lowest border border-border/50 shadow-2xl">
                                                        <div className="p-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 border-b border-border/40 mb-2">Transition Protocol</div>
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, "paid")} className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-surface-container">
                                                            <span className="text-sm font-bold">Mark as Paid</span>
                                                            <ChevronRight size={14} className="opacity-40" />
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, "shipped")} className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-surface-container">
                                                            <span className="text-sm font-bold">Initiate Shipment</span>
                                                            <ChevronRight size={14} className="opacity-40" />
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleUpdateStatus(order._id, "delivered")} className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-surface-container">
                                                            <span className="text-sm font-bold">Confirm Arrival</span>
                                                            <ChevronRight size={14} className="opacity-40" />
                                                        </DropdownMenuItem>
                                                        <div className="h-[1px] bg-border/40 my-2" />
                                                        <DropdownMenuItem 
                                                            onClick={() => handleUpdateStatus(order._id, "cancelled")}
                                                            className="flex items-center justify-between p-4 rounded-xl text-rose-500 focus:text-rose-500 focus:bg-rose-500/5 cursor-pointer"
                                                        >
                                                            <span className="text-sm font-bold">Terminate Order</span>
                                                            <XCircle size={14} />
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
