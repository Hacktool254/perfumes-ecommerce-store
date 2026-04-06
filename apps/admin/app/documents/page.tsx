"use client";

import { 
    Files, 
    FileText, 
    Download, 
    Upload, 
    Search, 
    Filter, 
    MoreHorizontal, 
    ChevronRight, 
    Lock, 
    Eye, 
    Clock, 
    CheckCircle2, 
    AlertCircle,
    Info,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

const documents = [
    { 
        id: "DOC-901", 
        name: "Brand Equity — Q2 Guidelines.pdf", 
        category: "Creative", 
        size: "4.2 MB", 
        date: "2024-04-06", 
        status: "Updated",
        type: "pdf"
    },
    { 
        id: "DOC-902", 
        name: "Supply Chain Log — Mombasa.xlsx", 
        category: "Logistics", 
        size: "1.8 MB", 
        date: "2024-04-05", 
        status: "Active",
        type: "excel"
    },
    { 
        id: "DOC-903", 
        name: "Terms of Engagement — Kenya.docx", 
        category: "Legal", 
        size: "850 KB", 
        date: "2024-03-28", 
        status: "Active",
        type: "doc"
    },
    { 
        id: "DOC-904", 
        name: "Franchise Agreement — Diani.pdf", 
        category: "Legal", 
        size: "12.4 MB", 
        date: "2024-02-15", 
        status: "Critical",
        type: "pdf"
    },
];

export default function DocumentsPage() {
    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Admin / Assets</p>
                    </div>
                    <h1 className="text-[42px] font-bold text-foreground leading-[1.1] tracking-tight">
                        Intellectual <span className="text-primary italic font-serif">Assets</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 h-12 px-8 rounded-full bg-surface-container-lowest text-foreground font-bold text-sm shadow-sm hover:bg-surface-container transition-colors">
                        <Upload size={18} />
                        <span>Upload New</span>
                    </button>
                </div>
            </div>

            {/* Storage Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Used Storage", value: "84 GB / 250 GB", progress: 35 },
                    { label: "Active Files", value: "1,240 Assets", progress: 0 },
                    { label: "Compliance Status", value: "98.2%", progress: 98 },
                    { label: "Shared Links", value: "42 Active", progress: 0 }
                ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-[32px] bg-surface-container-lowest shadow-sm flex flex-col justify-between h-[160px] group">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-muted-foreground">{stat.label}</p>
                        <div className="mt-4">
                            <p className="text-2xl font-extrabold tracking-tighter">{stat.value}</p>
                            {stat.progress > 0 && (
                                <div className="w-full h-1 bg-surface-container-low rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: `${stat.progress}%` }} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Document Library */}
            <div className="bg-surface-container-lowest rounded-[40px] p-10 shadow-sm relative">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-8">
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">Internal Repository</h2>
                        <div className="relative group">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search by name or metadata..." 
                                className="h-10 w-64 bg-surface-container-low border-none rounded-full pl-11 pr-6 text-xs font-bold focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 h-10 px-5 rounded-full border border-surface-container-highest/20 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:bg-surface-container transition-colors">
                            <Filter size={14} />
                            <span>Filter Type</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-5 rounded-[24px] hover:bg-surface-container-low transition-all duration-300 group">
                            <div className="flex items-center gap-6">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-surface-container",
                                )}>
                                    <FileText size={22} className="text-primary" />
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-foreground tracking-tight">{doc.name}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary italic font-serif opacity-80">{doc.category}</p>
                                        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none flex items-center gap-1.5">
                                            {doc.size}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12 text-right">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-end gap-1.5 whitespace-nowrap">
                                        <Clock size={10} /> Updated {doc.date}
                                    </p>
                                    <div className="flex justify-end">
                                        <div className={cn(
                                            "px-3 py-1 rounded-full flex items-center gap-1.5 transition-all duration-500",
                                            doc.status === 'Active' ? "bg-emerald-50 text-emerald-600" : 
                                            doc.status === 'Updated' ? "bg-primary/5 text-primary" : 
                                            "bg-rose-50 text-rose-600"
                                        )}>
                                            {doc.status === 'Active' ? <CheckCircle2 size={10} /> : <Info size={10} />}
                                            <span className="text-[9px] font-bold uppercase tracking-widest">{doc.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="w-10 h-10 rounded-full border border-surface-container-highest/20 flex items-center justify-center hover:bg-surface-container transition-colors group/btn">
                                        <Eye size={16} className="text-muted-foreground group-hover/btn:text-primary" />
                                    </button>
                                    <button className="w-10 h-10 rounded-full border border-surface-container-highest/20 flex items-center justify-center hover:bg-surface-container transition-colors group/btn">
                                        <Download size={16} className="text-muted-foreground group-hover/btn:text-primary" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Actions Card */}
            <div className="bg-primary rounded-[40px] p-12 text-primary-foreground relative overflow-hidden flex flex-col justify-center shadow-lg shadow-primary/20">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <Lock size={120} strokeWidth={1} />
                </div>
                <div className="relative z-10 max-w-[500px]">
                    <h3 className="text-3xl font-bold leading-tight tracking-[calc(-0.02em)]">Secure <span className="italic font-serif opacity-90">Vault</span></h3>
                    <p className="text-primary-foreground/70 text-base font-medium mt-6 leading-relaxed">
                        Automate your legal compliance check by connecting your Kenya Revenue Authority (KRA) and legal endpoints for real-time document verification.
                    </p>
                    <button className="mt-8 h-12 px-8 rounded-full bg-white text-primary font-bold text-sm tracking-wide hover:scale-105 transition-transform uppercase">
                        Configure Vault
                    </button>
                </div>
            </div>
        </div>
    );
}
