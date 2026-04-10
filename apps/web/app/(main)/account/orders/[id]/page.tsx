"use client";

import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { 
    ChevronLeft, 
    Printer, 
    Package, 
    Truck, 
    CheckCircle2, 
    Clock, 
    ShieldCheck, 
    Hash,
    Calendar,
    MapPin,
    CreditCard,
    Zap,
    Download,
    ArrowUpRight,
    Search,
    Fingerprint
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@workspaceRoot/packages/ui/src/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Id } from "@workspaceRoot/convex/_generated/dataModel";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as Id<"orders">;
    
    const order = useQuery(api.orders.get, { orderId });

    if (order === undefined) {
        return (
            <div className="space-y-12 animate-pulse">
                <div className="h-16 bg-white/[0.02] rounded-[32px] w-96" />
                <div className="h-[800px] bg-white/[0.02] rounded-[64px] w-full" />
            </div>
        );
    }

    if (order === null) {
        return (
            <div className="min-h-[600px] flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-24 h-24 bg-white/[0.01] border border-white/5 rounded-[40px] flex items-center justify-center">
                    <Search className="text-white/10" size={40} />
                </div>
                <h1 className="font-display text-4xl text-white italic tracking-tight">Record Not Found</h1>
                <p className="text-white/30 text-sm max-w-sm uppercase tracking-[0.2em] font-black">
                    The requested procurement manifest [ {orderId} ] does not exist in the active ledger.
                </p>
                <button 
                    onClick={() => router.back()}
                    className="px-10 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-white/10 transition-all"
                >
                    Return to Archive
                </button>
            </div>
        );
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 md:space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000 print:p-0">
            {/* ── Top Navigation / Actions ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-4 print:hidden">
                <button 
                    onClick={() => router.back()}
                    className="group flex items-center gap-4 text-white/30 hover:text-white transition-colors"
                >
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:border-[#B07D5B33] group-hover:bg-[#B07D5B1A] transition-all">
                        <ChevronLeft size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Back to Ledger</span>
                </button>

                <button 
                    onClick={handlePrint}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#B07D5B1A] border border-[#B07D5B33] rounded-[22px] md:rounded-[24px] text-[#B07D5B] hover:bg-[#B07D5B26] transition-all shadow-xl shadow-[#B07D5B05] group"
                >
                    <Printer size={16} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Print Manifest</span>
                </button>
            </div>

            {/* ── Main Manifest View ── */}
            <div className="bg-[#0a0a0b] border border-[#B07D5B1A] rounded-[48px] md:rounded-[64px] shadow-3xl relative overflow-hidden flex flex-col min-h-[800px] print:border-none print:shadow-none print:bg-white print:text-black">
                {/* Visual Header Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#B07D5B33] to-transparent opacity-30 print:hidden" />
                
                {/* Manifest Header */}
                <div className="p-8 md:p-12 lg:p-20 border-b border-white/5 relative print:p-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B07D5B05] blur-[120px] -mr-40 -mt-40 rounded-full print:hidden" />
                    
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-12 relative z-10">
                        <div className="space-y-6 w-full lg:w-auto">
                            <div className="flex items-center gap-4">
                                <div className="w-1.5 h-10 bg-[#B07D5B] rounded-full shadow-[0_0_15px_#B07D5B66] print:bg-black" />
                                <h1 className="font-display text-3xl md:text-5xl text-white tracking-tight italic print:text-black leading-none">Procurement Manifest</h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-white/30 uppercase text-[9px] md:text-[10px] font-black tracking-[0.4em] print:text-black/60">
                                <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-full lg:bg-transparent lg:border-none lg:p-0">
                                    <Hash size={12} className="text-[#B07D5B]" />
                                    <span>UTX—{order._id.slice(-8).toUpperCase()}</span>
                                </div>
                                <div className="hidden lg:block w-1 h-1 rounded-full bg-white/10 print:bg-black/10" />
                                <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-full lg:bg-transparent lg:border-none lg:p-0">
                                    <Calendar size={12} className="text-[#B07D5B]" />
                                    <span>{format(order.createdAt, "MMM d, yyyy")}</span>
                                </div>
                                <div className="hidden lg:block w-1 h-1 rounded-full bg-white/10 print:bg-black/10" />
                                <div className="flex items-center gap-2 bg-[#B07D5B0A] border border-[#B07D5B26] px-3 py-1.5 rounded-full lg:bg-transparent lg:border-none lg:p-0">
                                    <ShieldCheck size={12} className="text-[#B07D5B]" />
                                    <span className="text-[#B07D5B]">Verified</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-start lg:items-end gap-3 w-full lg:w-auto">
                            <div className={cn(
                                "w-full lg:w-auto px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border shadow-sm transition-all duration-1000 text-center",
                                order.status === "delivered" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                order.status === "cancelled" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                "bg-[#B07D5B1A] text-[#B07D5B] border-[#B07D5B33]"
                            )}>
                                Status: {order.status}
                            </div>
                            <p className="hidden md:block text-[10px] text-white/10 uppercase tracking-[0.2em] font-black print:text-black/20">Archived at Global Operations Hub 01</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                    {/* Left Column: Artifacts (Items) */}
                    <div className="lg:col-span-8 p-8 md:p-12 lg:p-20 space-y-12 lg:space-y-16 border-b lg:border-b-0 lg:border-r border-white/5 print:border-none print:p-10">
                        <div className="space-y-8 md:space-y-10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 italic text-center lg:text-left">Curated Artifact Selection</h2>
                            
                            <div className="space-y-6 md:space-y-8">
                                {order.items.map((item: any) => (
                                    <div key={item._id} className="group relative flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-8 bg-white/[0.01] border border-white/5 rounded-[32px] md:rounded-[40px] hover:border-[#B07D5B33] transition-all duration-700 hover:bg-white/[0.02]">
                                        <div className="relative w-24 md:w-32 aspect-[3/4] rounded-[20px] md:rounded-[24px] overflow-hidden border border-white/5 mx-auto md:mx-0 shrink-0">
                                            <Image 
                                                src={item.product?.images?.[0] || "/placeholder.jpg"}
                                                alt={item.product?.name || "Artifact"}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-4 pt-0 md:pt-2">
                                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-4">
                                                <div className="space-y-2">
                                                    <h3 className="font-display text-2xl md:text-3xl text-white italic tracking-tight group-hover:text-[#B07D5B] transition-colors leading-none">{item.product?.name}</h3>
                                                    <p className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">
                                                        Synthesis · {item.product?.size || "Full Size"}
                                                    </p>
                                                </div>
                                                <div className="text-center md:text-right">
                                                    <p className="font-display text-xl md:text-2xl text-white leading-none">KES {item.unitPrice.toLocaleString()}</p>
                                                    <p className="text-[9px] md:text-[10px] text-white/20 uppercase tracking-[0.2em] font-black mt-2">Quantity: 0{item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-center md:justify-start gap-4 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-[#B07D5B]/40 group-hover:text-[#B07D5B] transition-colors">
                                                <Zap size={10} />
                                                Verified Release Sequence
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Telemetry & Logistics */}
                    <div className="lg:col-span-4 bg-white/[0.01] p-8 md:p-12 lg:p-16 space-y-12 lg:space-y-16 flex flex-col print:bg-transparent print:p-10">
                        {/* Status Telemetry */}
                        <div className="space-y-10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 italic text-center lg:text-left">Shipping Telemetry</h2>
                            <div className="space-y-10 md:space-y-12 relative max-w-sm mx-auto lg:max-w-none">
                                <div className="absolute left-[23px] md:left-[27px] top-4 bottom-4 w-px bg-white/5" />
                                
                                <TimelineStep 
                                    icon={<CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />} 
                                    title="Manifest Secured" 
                                    time={format(order.createdAt, "HH:mm, MMM d")}
                                    description="Order protocol initiated."
                                    active={true}
                                />
                                <TimelineStep 
                                    icon={<CreditCard className="w-3.5 h-3.5 md:w-4 md:h-4" />} 
                                    title="Authenticity Check" 
                                    time={format(order.createdAt, "HH:mm, MMM d")}
                                    description="Payment verified."
                                    active={order.status !== "pending"}
                                />
                                <TimelineStep 
                                    icon={<Truck className="w-3.5 h-3.5 md:w-4 md:h-4" />} 
                                    title="Routing Protocol" 
                                    time={order.status === "shipped" || order.status === "delivered" ? "Active" : "--:--"}
                                    description="Dispatched to logistics."
                                    active={order.status === "shipped" || order.status === "delivered"}
                                />
                                <TimelineStep 
                                    icon={<Package className="w-3.5 h-3.5 md:w-4 md:h-4" />} 
                                    title="Sequence Complete" 
                                    time={order.status === "delivered" ? "Confirmed" : "--:--"}
                                    description="Delivered to deployment zone."
                                    active={order.status === "delivered"}
                                />
                            </div>
                        </div>

                        {/* Valuation Breakdown */}
                        <div className="space-y-10">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 italic text-center lg:text-left">Valuation Summary</h2>
                            <div className="bg-[#0a0a0b] border border-white/5 rounded-[32px] md:rounded-[40px] p-8 md:p-10 space-y-6 shadow-inner relative overflow-hidden group/value transition-all duration-700 hover:border-[#B07D5B1A]">
                                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest italic leading-none">
                                    <span>Base Value</span>
                                    <span className="text-white">KES {(order.totalAmount + (order.discountApplied || 0)).toLocaleString()}</span>
                                </div>
                                {order.discountApplied > 0 && (
                                    <div className="flex justify-between text-[10px] font-bold text-[#B07D5B]/40 uppercase tracking-widest italic leading-none">
                                        <span>Offset Applied</span>
                                        <span className="text-[#B07D5B]">- KES {order.discountApplied.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="h-px bg-white/5" />
                                <div className="flex justify-between items-end gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 italic pb-1">Final Settlement</span>
                                    <span className="font-display text-3xl md:text-4xl text-white tracking-tight leading-none transition-colors group-hover/value:text-[#B07D5B]">KES {order.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Coordinates */}
                        <div className="space-y-8">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 italic text-center lg:text-left">Coordinates</h2>
                            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left max-w-sm mx-auto lg:max-w-none">
                                <div className="w-14 h-14 bg-[#B07D5B1A] border border-[#B07D5B33] rounded-[20px] flex items-center justify-center shrink-0 shadow-[0_0_15px_#B07D5B26]">
                                    <MapPin size={20} className="text-[#B07D5B]" />
                                </div>
                                <div className="space-y-2 pt-1">
                                    <p className="text-[11px] font-black text-white uppercase tracking-[0.4em] leading-none mb-1">{order.customerName}</p>
                                    <p className="text-xs md:text-sm text-white/50 font-medium italic leading-relaxed">
                                        {order.shippingAddress}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Security Stamp */}
                        <div className="mt-auto pt-12 md:pt-16 flex items-center justify-center gap-6 opacity-10">
                            <Fingerprint className="w-5 h-5 md:w-6 md:h-6 text-[#B07D5B]" />
                            <div className="h-6 w-px bg-white/20" />
                            <div className="text-left">
                                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em]">SECURE LEDGER RECORD</p>
                                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em]">UMMIES PROCUREMENT NODE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineStep({ 
    icon, 
    title, 
    time, 
    description, 
    active 
}: { 
    icon: React.ReactNode; 
    title: string; 
    time: string; 
    description: string; 
    active: boolean;
}) {
    return (
        <div className={cn(
            "flex gap-8 group transition-all duration-700",
            active ? "opacity-100" : "opacity-20 grayscale"
        )}>
            <div className={cn(
                "w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 border transition-all duration-700 z-10",
                active ? "bg-[#B07D5B] text-[#0a0a0b] border-[#B07D5B] shadow-[0_0_20px_#B07D5B4D]" : "bg-white/5 text-white/20 border-white/5"
            )}>
                {icon}
            </div>
            <div className="space-y-2 pt-1 transition-all">
                <div className="flex items-center gap-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">{title}</h4>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#B07D5B]">{time}</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed italic font-medium tracking-tight">
                    {description}
                </p>
            </div>
        </div>
    );
}
