"use client";

import { 
    Settings, 
    User, 
    Lock, 
    Bell, 
    Globe, 
    Palette, 
    ShieldCheck, 
    CreditCard, 
    LogOut, 
    ChevronRight, 
    Camera, 
    CheckCircle2, 
    Sparkles,
    Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const settingGroups = [
    { name: "Brand Identity", icon: <Palette size={18} />, active: true },
    { name: "Security & Access", icon: <Lock size={18} />, active: false },
    { name: "Notifications", icon: <Bell size={18} />, active: false },
    { name: "Billing & Plans", icon: <CreditCard size={18} />, active: false },
    { name: "Global Settings", icon: <Globe size={18} />, active: false },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("Brand Identity");

    return (
        <div className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Page Header */}
            <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Admin / Preferences</p>
                    </div>
                    <h1 className="text-[42px] font-bold text-foreground leading-[1.1] tracking-tight">
                        System <span className="text-primary italic font-serif">Curations</span>
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:translate-y-[-2px] transition-transform shadow-lg shadow-primary/20">
                        <Save size={18} />
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    {settingGroups.map((group) => (
                        <button 
                            key={group.name}
                            onClick={() => setActiveTab(group.name)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group",
                                activeTab === group.name 
                                    ? "bg-surface-container-lowest text-primary shadow-sm" 
                                    : "text-muted-foreground hover:bg-surface-container-low hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                    activeTab === group.name ? "bg-primary/10 text-primary" : "bg-surface-container-low text-muted-foreground group-hover:text-foreground"
                                )}>
                                    {group.icon}
                                </div>
                                <span className={cn(
                                    "text-sm font-bold tracking-tight",
                                    activeTab === group.name ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {group.name}
                                </span>
                            </div>
                            <ChevronRight size={16} className={cn(
                                "transition-transform group-hover:translate-x-0.5",
                                activeTab === group.name ? "text-primary opacity-100" : "text-muted-foreground opacity-30"
                            )} />
                        </button>
                    ))}

                    <div className="pt-6 mt-6 border-t border-surface-container-highest/20">
                        <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-bold text-sm group">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-all">
                                <LogOut size={18} />
                            </div>
                            Terminate Session
                        </button>
                    </div>
                </div>

                {/* Main Settings Panel */}
                <div className="bg-surface-container-lowest rounded-[40px] p-12 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 transition-all group-hover:scale-110 group-hover:rotate-0 duration-500 pointer-events-none">
                        <Sparkles size={160} />
                    </div>

                    <div className="max-w-[800px] relative z-10">
                        <div className="flex items-center gap-8 mb-12">
                            <div className="relative group/avatar">
                                <div className="w-32 h-32 rounded-[32px] bg-surface-container overflow-hidden shadow-lg border-4 border-white">
                                    <img 
                                        src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=200&auto=format&fit=crop" 
                                        className="object-cover w-full h-full"
                                        alt="Profile Avatar"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                        <Camera size={24} className="text-white" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-extrabold text-foreground tracking-tight">Administrative Curator</h3>
                                <p className="text-sm text-muted-foreground font-medium mt-1">Super Admin Role — Kenya HQ</p>
                                <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full w-fit">
                                    <ShieldCheck size={12} /> Verified Identity
                                </div>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Display Name</label>
                                    <input 
                                        type="text" 
                                        defaultValue="Ummie's Essence HQ" 
                                        className="h-14 w-full bg-surface-container-low border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Administrative Email</label>
                                    <input 
                                        type="email" 
                                        defaultValue="admin@ummiesessence.com" 
                                        className="h-14 w-full bg-surface-container-low border-none rounded-2xl px-6 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">Business Narrative (Meta Description)</label>
                                <textarea 
                                    className="w-full h-32 bg-surface-container-low border-none rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all resize-none leading-relaxed"
                                    defaultValue="The ultimate destination for luxury fragrance curators. Delivering olfactory excellence through high-fidelity craftmanship and cultural heritage."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="p-8 rounded-[32px] bg-primary/5 border border-primary/10 relative group cursor-pointer hover:bg-primary/10 transition-colors">
                                    <h4 className="font-bold text-sm text-primary uppercase tracking-widest">Enterprise API Key</h4>
                                    <p className="text-[10px] text-muted-foreground font-medium mt-1">Generated 2 days ago</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="font-mono text-xs text-foreground font-bold opacity-60">UM_SK_••••••••••••</p>
                                        <Save size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                                <div className="p-8 rounded-[32px] bg-surface-container-low border border-surface-container-highest/10 relative group cursor-pointer hover:bg-surface-container transition-colors">
                                    <h4 className="font-bold text-sm text-foreground uppercase tracking-widest">Two-Factor Authentication</h4>
                                    <p className="text-[10px] text-muted-foreground font-medium mt-1">Enabled via Authenticator</p>
                                    <div className="mt-4">
                                        <CheckCircle2 size={18} className="text-emerald-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
