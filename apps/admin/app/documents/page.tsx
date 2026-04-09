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
    SlidersHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@workspaceRoot/convex/_generated/api";
import { format } from "date-fns";
import { useState } from "react";

type DocType = "invoice" | "report" | "inventory" | "legal";

export default function DocumentsPage() {
    const [activeTab, setActiveTab] = useState<DocType | "all">("all");
    const [searchTerm, setSearchTerm] = useState("");

    const orders = useQuery(api.orders.adminList, {});
    const users = useQuery(api.users.list, { searchTerm: "" });
    const products = useQuery(api.products.listRecent, { limit: 50 });

    if (orders === undefined || users === undefined || products === undefined) {
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

    // ── Generate Virtual Documents ──
    const virtualInvoices = orders.map(o => ({
        id: `INV-${o._id.slice(-6).toUpperCase()}`,
        name: `Fiscal Invoice — ${o.customerName || "Anonymous"}`,
        category: "invoice" as const,
        size: "128 KB",
        date: o.createdAt,
        status: o.status === "paid" || o.status === "delivered" ? "Active" : "Pending",
        meta: `Order Reference: ${o._id.slice(-8)}`
    }));

    const virtualReports = users.map(u => ({
        id: `REP-${u._id.slice(-6).toUpperCase()}`,
        name: `Patron Proof — ${u.name || u.email}`,
        category: "report" as const,
        size: "245 KB",
        date: u.createdAt || Date.now(),
        status: (u.totalSpent || 0) > 50000 ? "VIP" : "Active",
        meta: `Lifetime Yield: KES ${u.totalSpent?.toLocaleString() || 0}`
    }));

    const virtualInventory = products.map(p => ({
        id: `SPEC-${p._id.slice(-6).toUpperCase()}`,
        name: `Technical Spec — ${p.name}`,
        category: "inventory" as const,
        size: "512 KB",
        date: p.updatedAt || Date.now(),
        status: p.stock < 10 ? "Critical" : "Active",
        meta: `Stock Manifest: ${p.stock} units`
    }));

    const allDocs = [
        ...virtualInvoices,
        ...virtualReports,
        ...virtualInventory
    ].sort((a, b) => b.date - a.date);

    const filteredDocs = allDocs.filter(doc => {
        const matchesTab = activeTab === "all" || doc.category === activeTab;
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              doc.id.toLowerCase().includes(searchTerm.toLowerCase());
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
                .active-vault-tab { background: #B07D5B; color: #ffffff; border-color: #B07D5B; }
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
                        Upload Reference
                    </button>
                    <button className="w-16 h-16 rounded-[24px] bg-foreground text-background flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl group">
                        <Shield size={22} className="group-hover:rotate-12 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            {/* ── Storage Dynamics ── */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Vault Records", value: allDocs.length.toLocaleString(), icon: Database, sub: "Verified entities" },
                    { label: "Fiscal Proofs", value: virtualInvoices.length.toLocaleString(), icon: FileDigit, sub: "Invoice stream" },
                    { label: "Patron Reports", value: virtualReports.length.toLocaleString(), icon: FileText, sub: "Intelligence logs" },
                    { label: "Vault Integrity", value: "99.8%", icon: Shield, sub: "Encrypted state" },
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
                <div className="absolute top-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[140px] -translate-y-1/2 -translate-x-1/2 group-hover/hub:bg-primary/10 transition-all duration-1000" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between px-10 py-12 border-b border-border/40 relative z-10 gap-8">
                    <div className="flex flex-wrap items-center gap-4">
                        {[
                            { id: "all", label: "All Records", icon: Database },
                            { id: "invoice", label: "Invoices", icon: FileDigit },
                            { id: "report", label: "Reports", icon: FileText },
                            { id: "inventory", label: "Logs", icon: History },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex items-center gap-3 h-12 px-8 rounded-full border border-border/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 group/tab hover:border-primary/40",
                                    activeTab === tab.id ? "bg-primary text-primary-foreground border-primary" : "bg-surface-container text-muted-foreground/40"
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
                        <button className="flex items-center gap-3 h-12 px-6 rounded-[20px] bg-surface-container border border-border/10 text-[10px] font-black text-muted-foreground/40 hover:text-primary transition-all uppercase tracking-widest shrink-0">
                            <SlidersHorizontal size={14} strokeWidth={2} />
                            Filter
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-border/10 relative z-10 px-4 py-2">
                    {filteredDocs.length === 0 ? (
                        <div className="py-24 text-center">
                            <p className="text-[11px] font-black tracking-[0.5em] text-muted-foreground/15 uppercase italic">
                                Zero assets manifest in current spectral tab
                            </p>
                        </div>
                    ) : (
                        filteredDocs.map((doc) => (
                            <div
                                key={doc.id}
                                className="vault-row flex flex-col lg:flex-row lg:items-center justify-between p-8 rounded-[40px] hover:bg-surface-container/30 border border-transparent hover:border-primary/10 transition-all duration-700 cursor-pointer group/doc relative overflow-hidden"
                            >
                                <div className="flex items-center gap-8 min-w-0">
                                    <div className={cn(
                                        "w-20 h-20 rounded-[28px] flex items-center justify-center shadow-inner relative overflow-hidden group-hover/doc:scale-105 transition-transform duration-700",
                                        doc.category === 'invoice' ? "bg-emerald-500/10 text-emerald-500" :
                                        doc.category === 'report' ? "bg-primary/10 text-primary" :
                                        "bg-surface-container text-muted-foreground/20"
                                    )}>
                                        <FileText size={28} strokeWidth={1.5} />
                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/doc:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="min-w-0 space-y-3">
                                        <div className="flex items-center gap-4">
                                            <p className="text-2xl font-black text-foreground tracking-tighter leading-none truncate max-w-md">{doc.name}</p>
                                            <span className="px-3 py-1 rounded-full bg-surface-container border border-border/10 text-[9px] font-black tracking-widest text-muted-foreground/40 uppercase leading-none">
                                                {doc.id}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest flex items-center gap-2">
                                                <Clock size={12} className="text-primary/20" />
                                                Modified {format(doc.date, "dd MMM yyyy")}
                                            </p>
                                            <div className="w-1 h-1 rounded-full bg-border" />
                                            <p className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest flex items-center gap-2 italic">
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
                                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground/20 leading-none mb-2">Footprint</p>
                                        <p className="font-display text-2xl text-foreground leading-none">{doc.size}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <button className="w-14 h-14 rounded-[22px] bg-surface-container border border-border/10 flex items-center justify-center hover:bg-surface-container-lowest hover:border-primary/20 transition-all group/btn shadow-sm">
                                                <Eye size={18} className="text-muted-foreground/40 group-hover/btn:text-primary transition-colors" />
                                            </button>
                                            <button className="w-14 h-14 rounded-[22px] bg-surface-container border border-border/10 flex items-center justify-center hover:bg-surface-container-lowest hover:border-primary/20 transition-all group/btn shadow-sm">
                                                <Download size={18} className="text-muted-foreground/40 group-hover/btn:text-primary transition-colors" />
                                            </button>
                                        </div>
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
                        {filteredDocs.length} Manifestations indexed across current stream
                    </p>
                    <button className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/40 hover:text-primary transition-colors flex items-center gap-4 group">
                        Enter Administrative Archive
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
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
                        <h3 className="text-6xl font-black tracking-tighter leading-[0.9] italic font-serif">Encrypted <span className="text-primary not-italic italic">Vault Access</span></h3>
                        <p className="text-background/40 text-2xl font-medium leading-relaxed italic max-w-lg">
                            Synchronize your administrative archives with secure cloud manifests. Multi-layer verification required for high-yield exports.
                        </p>
                    </div>
                    <button className="h-20 px-14 rounded-[28px] bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/40 group">
                        <span className="flex items-center gap-4">
                            Configure Protocol
                            <Zap size={18} className="animate-pulse" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

