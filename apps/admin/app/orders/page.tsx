"use client";

import { useState } from "react";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { exportToCSV } from "@/lib/export-utils";
import { toast } from "sonner";
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
    ArrowUpRight,
    MapPin,
    Package,
    ArrowLeft,
    Loader2
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
    const [selectedOrderId, setSelectedOrderId] = useState<Id<"orders"> | null>(null);

    const orders = useQuery(api.orders.adminList, {
        status: statusFilter === "all" ? undefined : statusFilter
    });
    const stats = useQuery(api.orders.getStats);
    const updateStatus = useMutation(api.orders.updateStatus);

    const selectedOrder = useQuery(api.orders.get, selectedOrderId ? { orderId: selectedOrderId } : "skip" as any);

    const convex = useConvex();
    const [isExporting, setIsExporting] = useState(false);

    const handleExportManifest = async () => {
        setIsExporting(true);
        try {
            const data = await convex.query(api.export.orders);
            exportToCSV(data, `orders_manifest_${format(new Date(), "yyyy-MM-dd")}.csv`);
            toast.success("Order Manifest exported successfully");
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Failed to export manifest");
        } finally {
            setIsExporting(false);
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

    return (
        <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            {/* Editorial Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-10 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-[1px] bg-primary/40 rounded-full" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/60">Logistics & Fulfilment</p>
                    </div>
                    <h1 className="text-5xl font-extrabold text-foreground tracking-tighter leading-none">
                        ORDER <span className="text-primary italic font-serif font-medium">STREAM</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        disabled={isExporting}
                        onClick={handleExportManifest}
                        className="h-14 px-8 rounded-2xl bg-surface-container-lowest border border-border/50 text-xs font-extrabold uppercase tracking-widest hover:bg-surface-container transition-all shadow-sm gap-3 shrink-0"
                    >
                        {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} className="text-primary" />}
                        <span>{isExporting ? "Manifesting..." : "Manifest"}</span>
                    </Button>
                </div>
            </div>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AdminStatCard
                    title="Gross Revenue"
                    value={`KES ${(stats?.totalRevenue || 0).toLocaleString()}`}
                    trend={{ value: "Stable Flow", positive: true }}
                    icon={<CreditCard size={18} />}
                />
                <AdminStatCard
                    title="Active Spirits"
                    value={(stats?.totalSales || 0).toString()}
                    trend={{ value: `${stats?.recentOrders?.length} pending`, positive: true }}
                    icon={<ShoppingBag size={18} />}
                />
                <AdminStatCard
                    title="Conversion"
                    value={`${stats?.p0Conversion?.toFixed(1) || 0}%`}
                    icon={<ArrowUpRight size={18} />}
                />
            </div>

            {/* Layout: Stream + Detail Flyout */}
            <div className="flex flex-col lg:flex-row gap-8 relative items-start">
                
                {/* Main Order Stream */}
                <div className={cn(
                    "flex-1 space-y-8 transition-all duration-700",
                    selectedOrderId ? "lg:w-[60%]" : "w-full"
                )}>
                    {/* Control Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
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
                                        <span>{statusFilter === "all" ? "Protocols" : `Filter: ${statusFilter}`}</span>
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

                    {/* Master Stream Table */}
                    <div className="bg-surface-container-lowest border border-border/50 rounded-[48px] shadow-xl shadow-surface-container/10 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-surface-container/20">
                                <TableRow className="hover:bg-transparent border-border/10 h-20">
                                    <TableHead className="pl-10 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Trace</TableHead>
                                    <TableHead className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Patron</TableHead>
                                    <TableHead className="hidden md:table-cell text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Tribute</TableHead>
                                    <TableHead className="text-right pr-10 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Protocol</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!orders ? (
                                    [1, 2, 3, 4, 5].map((i) => (
                                        <TableRow key={i} className="border-border/10 h-24 animate-pulse">
                                            <TableCell className="pl-10"><div className="w-24 h-4 bg-surface-container rounded-full" /></TableCell>
                                            <TableCell><div className="h-4 w-40 bg-surface-container rounded" /></TableCell>
                                            <TableCell className="hidden md:table-cell"><div className="h-4 w-20 bg-surface-container rounded" /></TableCell>
                                            <TableCell className="pr-10 text-right"><div className="h-10 w-24 bg-surface-container rounded-full ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : filteredOrders?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-40 text-muted-foreground/40 font-serif italic text-xl">
                                            No records found in the current trajectory.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders?.map((order) => {
                                        const info = getStatusInfo(order.status as OrderStatus);
                                        const isActive = selectedOrderId === order._id;
                                        return (
                                            <TableRow 
                                                key={order._id} 
                                                onClick={() => setSelectedOrderId(order._id)}
                                                className={cn(
                                                    "border-border/10 h-28 cursor-pointer transition-all duration-500 group relative",
                                                    isActive ? "bg-primary/[0.03] shadow-inner" : "hover:bg-surface-container/20"
                                                )}
                                            >
                                                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-primary rounded-r-full shadow-[2px_0_15px_#B07D5B33]" />}
                                                <TableCell className="pl-10">
                                                    <div>
                                                        <p className="font-mono text-[10px] font-black tracking-widest text-primary/60 uppercase">
                                                            ORD-{order._id.slice(-6).toUpperCase()}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1.5">{format(order.createdAt, "MMM d, HH:mm")}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">{order.customerName}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground/50 uppercase mt-1 tracking-wider">{order.customerEmail}</p>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <p className="font-black text-lg text-foreground tracking-tighter">KES {order.totalAmount.toLocaleString()}</p>
                                                </TableCell>
                                                <TableCell className="text-right pr-10">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                                                        info.color, info.bg, "border-current/10"
                                                    )}>
                                                        {info.icon}
                                                        {info.label}
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

                {/* Vertical Detail Flyout (or Inline Info) */}
                {selectedOrderId && (
                    <div className="w-full lg:w-[38%] bg-surface-container-lowest border border-border/40 rounded-[48px] shadow-2xl p-8 sticky top-6 animate-in slide-in-from-right-10 fade-in duration-700 h-fit lg:max-h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden custom-scrollbar">
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-border/5">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80 flex items-center gap-3">
                                <Package size={14} />
                                Protocol Manifest
                            </h3>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setSelectedOrderId(null)}
                                className="w-10 h-10 rounded-full hover:bg-surface-container text-muted-foreground"
                            >
                                <ArrowLeft size={18} />
                            </Button>
                        </div>

                        {!selectedOrder ? (
                            <div className="py-20 flex flex-col items-center justify-center opacity-40">
                                <Loader2 size={32} className="animate-spin text-primary mb-4" />
                                <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Extracting Core Data...</p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {/* Header / ID info */}
                                <div>
                                    <h2 className="text-3xl font-extrabold tracking-tighter text-foreground mb-4">
                                        ORD-{selectedOrder._id.slice(-12).toUpperCase()}
                                    </h2>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="px-4 py-2 rounded-2xl bg-surface-container text-[10px] font-bold uppercase tracking-widest text-foreground/60 shadow-inner">
                                            Established {format(selectedOrder.createdAt, "MMMM d, yyyy")}
                                        </div>
                                        <div className={cn(
                                            "px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm",
                                            getStatusInfo(selectedOrder.status as OrderStatus).bg,
                                            getStatusInfo(selectedOrder.status as OrderStatus).color
                                        )}>
                                            {getStatusInfo(selectedOrder.status as OrderStatus).label}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Bundle */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Manifest Bundle</p>
                                    <div className="space-y-4">
                                        {selectedOrder.items.map((item: any) => (
                                            <div key={item._id} className="flex items-center gap-6 p-4 rounded-3xl bg-surface-container/30 border border-border/5 group hover:bg-surface-container/50 transition-colors">
                                                <div className="w-16 h-16 rounded-2xl bg-surface-container-low overflow-hidden shadow-inner p-2 border border-border/5">
                                                    <img 
                                                        src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=100&auto=format&fit=crop"} 
                                                        alt={item.product?.name} 
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-extrabold text-foreground group-hover:text-primary transition-colors truncate">{item.product?.name}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1 italic">{item.product?.brand || "Ummies Essence"}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-foreground">{item.quantity}x</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">KES {item.unitPrice.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-6 rounded-3xl bg-surface-container-low/50 border border-border/10 flex items-center justify-between shadow-inner">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 italic">Tribute Manifested</p>
                                        <p className="text-2xl font-black text-foreground tracking-tighter leading-none">KES {selectedOrder.totalAmount.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Shipping Intel */}
                                <div className="space-y-6 p-8 rounded-[40px] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden group/intel">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/intel:opacity-20 transition-opacity duration-1000 rotate-12">
                                        <MapPin size={100} strokeWidth={1} />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60 mb-8">Shipping Trajectory</p>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Primary Recipient</p>
                                                <p className="text-lg font-extrabold tracking-tight">{selectedOrder.customerName}</p>
                                                <p className="text-xs font-medium opacity-70 mt-1">{selectedOrder.customerEmail}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Delivery Axis</p>
                                                <p className="text-xs font-bold leading-relaxed opacity-90">{selectedOrder.shippingAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Protocols */}
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Administrative Protocol</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button 
                                            disabled={selectedOrder.status === "paid" || selectedOrder.status === "shipped" || selectedOrder.status === "delivered" || selectedOrder.status === "cancelled"}
                                            onClick={() => handleUpdateStatus(selectedOrder._id, "paid")}
                                            className="h-14 rounded-2xl bg-surface-container border border-border/10 text-foreground font-extrabold text-[10px] uppercase tracking-widest hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20 transition-all shadow-sm"
                                        >
                                            Mark Paid
                                        </Button>
                                        <Button 
                                            disabled={selectedOrder.status === "shipped" || selectedOrder.status === "delivered" || selectedOrder.status === "cancelled"}
                                            onClick={() => handleUpdateStatus(selectedOrder._id, "shipped")}
                                            className="h-14 rounded-2xl bg-surface-container border border-border/10 text-foreground font-extrabold text-[10px] uppercase tracking-widest hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/20 transition-all shadow-sm"
                                        >
                                            Dispatch
                                        </Button>
                                    </div>
                                    <Button 
                                        disabled={selectedOrder.status === "delivered" || selectedOrder.status === "cancelled"}
                                        onClick={() => handleUpdateStatus(selectedOrder._id, "delivered")}
                                        className="w-full h-16 rounded-2xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                                    >
                                        Confirm Fulfillment
                                    </Button>
                                    <Button 
                                        disabled={selectedOrder.status === "cancelled" || selectedOrder.status === "delivered"}
                                        onClick={() => handleUpdateStatus(selectedOrder._id, "cancelled")}
                                        variant="ghost"
                                        className="w-full h-12 text-rose-500 hover:text-rose-600 hover:bg-rose-500/5 font-extrabold text-[10px] uppercase tracking-widest transition-all"
                                    >
                                        Terminate Protocol
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
