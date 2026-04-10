"use client";

import { 
    FileText, 
    Download, 
    Upload, 
    Search, 
    Filter, 
    ChevronRight, 
    Lock, 
    Eye, 
    Clock, 
    CheckCircle2, 
    Info,
    Shield,
    FileDigit,
    Database,
    Loader2,
    HardDrive,
    Zap,
    History,
    SlidersHorizontal,
    FileSpreadsheet,
    Users as UsersIcon,
    ShoppingBag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useConvex } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { format } from "date-fns";
import { useState } from "react";
import { exportToCSV } from "@/lib/export-utils";
import { toast } from "sonner";

type DocType = "master" | "invoice" | "report";

export default function DocumentsPage() {
    const [activeTab, setActiveTab] = useState<DocType | "all">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [isExporting, setIsExporting] = useState<string | null>(null);

    const convex = useConvex();
    const orders = useQuery(api.orders.adminList, {});
    const stats = useQuery(api.orders.getStats);

    if (orders === undefined || stats === undefined || stats === null) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40 italic">
                        Accessing Encrypted Asset Streams...
                    </p>
                </div>
            </div>
        );
    }

    const handleExport = async (type: "orders" | "inventory" | "patrons" | "revenue") => {
        setIsExporting(type);
        try {
            let data;
            let filename;
            const date = format(new Date(), "yyyy-MM-dd");

            switch (type) {
                case "orders":
                    data = await convex.query(api.export.orders);
                    filename = `global_order_registry_${date}.csv`;
                    break;
                case "inventory":
                    data = await convex.query(api.export.inventory);
                    filename = `master_inventory_manifest_${date}.csv`;
                    break;
                case "patrons":
                    data = await convex.query(api.export.patrons);
                    filename = `patron_database_export_${date}.csv`;
                    break;
                case "revenue":
                    data = await convex.query(api.export.revenueReport);
                    filename = `fiscal_revenue_archive_${date}.csv`;
                    break;
            }

            if (data) {
                exportToCSV(data, filename);
                toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} manifest exported`);
            }
        } catch (error) {
            console.error("Export failed", error);
            toast.error("Failed to manifest asset");
        } finally {
            setIsExporting(null);
        }
    };

    // ── Pre-packaged Master Assets ──
    const masterAssets = [
        {
            id: "MASTER-INV",
            name: "Master Inventory Manifest",
            category: "master" as const,
            size: `${(stats.totalSales || 0) * 2} KB`, // Est
            date: Date.now(),
            meta: "Global Stock & Technical Specs",
            icon: HardDrive,
            action: () => handleExport("inventory")
        },
        {
            id: "MASTER-ORD",
            name: "Global Order Registry",
            category: "master" as const,
            size: `${(stats.totalSales || 0) * 4} KB`,
            date: Date.now(),
            meta: "Comprehensive Transactional Logs",
            icon: FileSpreadsheet,
            action: () => handleExport("orders")
        },
        {
            id: "MASTER-PTR",
            name: "Patron Database Export",
            category: "master" as const,
            size: "512 KB",
            date: Date.now(),
            meta: "Verified Customer Identities",
            icon: UsersIcon,
            action: () => handleExport("patrons")
        },
        {
            id: "MASTER-FIS",
            name: "Fiscal Revenue Archive",
            category: "master" as const,
            size: "128 KB",
            date: Date.now(),
            meta: "Aggregated Financial Intelligence",
            icon: FileDigit,
            action: () => handleExport("revenue")
        }
    ];

    // ── Individual Invoices Stream ──
    const invoiceAssets = orders.map(o => ({
        id: `INV-${o._id.slice(-6).toUpperCase()}`,
        name: `Fiscal Invoice — ${o.customerName}`,
        category: "invoice" as const,
        size: "64 KB",
        date: o._creationTime,
        meta: `Status: ${o.status.toUpperCase()}`,
        icon: FileText,
        action: () => toast.info("Individual PDF manifest coming soon. Use Global Registry for now.")
    }));

    const allAssets = [...masterAssets, ...invoiceAssets].filter(asset => {
        const matchesTab = activeTab === "all" || asset.category === activeTab;
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              asset.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
                .font-display { font-family: 'DM Serif Display', serif; }
                .font-body { font-family: 'DM Sans', sans-serif; }
                .vault-row:hover .vault-chevron { opacity: 1; transform: translateX(0); }
                .vault-chevron { opacity: 0; transform: translateX(-6px); transition: all 0.25s ease; }
                .glow-line { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent); }
            `}</style>

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/40 pb-12 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-[1.5px] bg-primary rounded-full shadow-[0_0_15px_#B07D5B33]" />
                        <p className="text-[11px] font-black uppercase tracking-[0.6em] text-primary/80">Asset Repository</p>
                    </div>
                    <h1 className="font-display text-5xl text-foreground leading-none tracking-tighter">
                        INTELLECTUAL <span className="italic text-primary font-medium">ASSETS</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-4 h-16 px-10 rounded-[24px] bg-surface-container-lowest border border-border/40 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary hover:bg-surface-container transition-all group shadow-sm">
                        <Upload size={18} strokeWidth={2.5} className="group-hover:-translate-y-0.5 transition-transform" />
                        Synchronize
                    </button>
                    <button className="w-16 h-16 rounded-[24px] bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl group border-2 border-primary/20">
                        <Shield size={22} className="group-hover:rotate-12 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            {/* ── Storage Dynamics ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Master Assets", value: masterAssets.length.toString(), icon: Database, sub: "Consolidated records" },
                    { label: "Stream Proofs", value: orders.length.toLocaleString(), icon: FileDigit, sub: "Live transaction feed" },
                    { label: "Vault Integrity", value: "99.9%", icon: Shield, sub: "Encrypted state" },
                    { label: "Uptime Sync", value: "Realtime", icon: Zap, sub: "Last sweep: Just now" },
                ].map((stat, i) => (
                    <div key={i} className="relative rounded-[40px] border border-border/40 bg-surface-container-lowest p-8 group hover:border-primary/20 transition-all duration-500 overflow-hidden shadow-sm">
                        <div className="absolute top-0 left-0 right-0 h-px glow-line opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-start justify-between mb-8">
                            <p className="text-[10px] font-black tracking-[0.4em] text-muted-foreground/30 uppercase leading-none">{stat.label}</p>
                            <stat.icon size={16} strokeWidth={1.5} className="text-primary/20" />
                        </div>
                        <p className="font-display text-4xl text-foreground leading-none mb-3 group-hover:translate-x-1 transition-transform">{stat.value}</p>
                        <p className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest">{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Document Vault Explorer ── */}
            <div className="bg-surface-container-lowest border border-border/40 rounded-[56px] shadow-2xl relative overflow-hidden group/hub">
                <div className="absolute top-0 left-1/2 w-[800px] h-80 bg-primary/5 rounded-full blur-[140px] -translate-y-1/2 -translate-x-1/2 group-hover/hub:bg-primary/10 transition-all duration-1000" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between px-10 py-12 border-b border-border/40 relative z-10 gap-8">
                    <div className="flex flex-wrap items-center gap-4">
                        {[
                            { id: "all", label: "All Records", icon: Database },
                            { id: "master", label: "Master Sheets", icon: FileSpreadsheet },
                            { id: "invoice", label: "Invoices", icon: FileDigit },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-3 h-12 px-8 rounded-full border border-border/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 group/tab hover:border-primary/40",
                                    activeTab === tab.id ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-surface-container text-muted-foreground/40"
                                )}
                            >
                                <tab.icon size={14} strokeWidth={2.5} className={cn("transition-transform group-hover/tab:scale-110", activeTab === tab.id ? "text-white" : "text-primary/30")} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative group/search w-full md:w-64">
                            <Search size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within/search:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Locate Manifest..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-12 w-full rounded-[20px] bg-surface-container border border-border/10 pl-12 pr-6 text-xs font-black placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary/20 focus:bg-surface-container-lowest transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-border/10 relative z-10 px-4 py-2">
                    {allAssets.length === 0 ? (
                        <div className="py-24 text-center">
                            <p className="text-[11px] font-black tracking-[0.5em] text-muted-foreground/15 uppercase italic">
                                Zero assets manifest in current spectral tab
                            </p>
                        </div>
                    ) : (
                        allAssets.map((doc) => (
                            <div
                                key={doc.id}
                                onClick={doc.action}
                                className="vault-row flex flex-col lg:flex-row lg:items-center justify-between p-8 rounded-[40px] hover:bg-surface-container/30 border border-transparent hover:border-primary/10 transition-all duration-700 cursor-pointer group/doc relative overflow-hidden"
                            >
                                <div className="flex items-center gap-8 min-w-0">
                                    <div className={cn(
                                        "w-20 h-20 rounded-[28px] flex items-center justify-center shadow-inner relative overflow-hidden group-hover/doc:scale-105 transition-transform duration-700",
                                        doc.category === 'master' ? "bg-primary/20 text-primary" : "bg-surface-container text-muted-foreground/20"
                                    )}>
                                        <doc.icon size={28} strokeWidth={1.5} />
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/doc:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="min-w-0 space-y-3">
                                        <div className="flex items-center gap-4">
                                            <p className="text-2xl font-black text-foreground tracking-tighter leading-none truncate max-w-md uppercase">{doc.name}</p>
                                            <span className={cn(
                                                "px-3 py-1 rounded-full border text-[9px] font-black tracking-widest uppercase leading-none",
                                                doc.category === 'master' ? "bg-primary/10 border-primary/20 text-primary" : "bg-surface-container border-border/10 text-muted-foreground/40"
                                            )}>
                                                {doc.id}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest flex items-center gap-2">
                                                <Clock size={12} className="text-primary/20" />
                                                Managed {format(doc.date, "dd MMM yyyy")}
                                            </p>
                                            <div className="w-1 h-1 rounded-full bg-border" />
                                            <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest italic">
                                                {doc.meta}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between lg:justify-end gap-12 md:gap-24 mt-8 lg:mt-0 px-6">
                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground/20 leading-none mb-2">Category</p>
                                        <p className="text-base font-black text-foreground leading-none uppercase tracking-tighter italic text-primary/60">{doc.category}</p>
                                    </div>

                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground/20 leading-none mb-2">Payload</p>
                                        <p className="font-display text-2xl text-foreground leading-none">{doc.size}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); doc.action(); }}
                                            className="w-14 h-14 rounded-[22px] bg-primary text-primary-foreground flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-primary/20"
                                        >
                                            <Download size={20} strokeWidth={2.5} />
                                        </button>
                                        <div className="vault-chevron w-12 h-12 rounded-[20px] bg-surface-container flex items-center justify-center border border-border/10 shadow-inner group-hover/doc:scale-110 group-hover/doc:rotate-12 transition-all duration-700">
                                            <ChevronRight size={18} className="text-primary/40 group-hover/doc:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-12 border-t border-border/10 flex justify-between items-center relative z-10 px-14">
                    <p className="text-[11px] font-black tracking-[0.4em] text-muted-foreground/20 uppercase italic">
                        {allAssets.length} Intellectual artifacts manifest in current vault
                    </p>
                </div>
            </div>

            {/* ── Secure Protocol Card ── */}
            <div className="bg-foreground rounded-[64px] p-12 md:p-16 text-background overflow-hidden relative shadow-2xl group/vault">
                <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12 transition-all group-hover/vault:rotate-0 duration-1000 group-hover/vault:opacity-15 pointer-events-none">
                    <Lock size={240} className="text-primary" />
                </div>
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                    <div className="max-w-[650px] space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-[1px] bg-primary rounded-full shadow-[0_0_10px_#B07D5B33]" />
                            <h3 className="text-[11px] font-black tracking-[0.6em] uppercase text-primary/80 leading-none">Security Protocol</h3>
                        </div>
                        <h3 className="text-6xl font-black tracking-tighter leading-[0.9] italic font-serif">Consolidated <span className="text-primary not-italic italic">Intelligence</span></h3>
                        <p className="text-background/40 text-2xl font-medium leading-relaxed italic max-w-lg">
                            Master manifests represent the crystalline state of your entire database. Export high-yield CSVs for external synthesis and record keeping.
                        </p>
                    </div>
                    <button 
                        onClick={() => handleExport("orders")}
                        className="h-20 px-14 rounded-[28px] bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 group"
                    >
                        <span className="flex items-center gap-4">
                            Global Sync Export
                            <Zap size={18} className="animate-pulse" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

