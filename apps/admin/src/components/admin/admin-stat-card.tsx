"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
    title: string;
    value: string | number;
    trend?: {
        value: string;
        positive: boolean;
    };
    chart?: ReactNode;
    icon?: ReactNode;
    className?: string;
}

export function AdminStatCard({ title, value, trend, chart, icon, className }: AdminStatCardProps) {
    return (
        <div className={cn(
            "bg-surface-container-lowest border border-border/40 rounded-[40px] p-8 flex flex-col justify-between group/stat-card hover:bg-surface-container/30 transition-all duration-700 h-[240px] relative overflow-hidden shadow-xl shadow-surface-container/5",
            className
        )}>
            {/* Cinematic Aura Layer */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px] group-hover/stat-card:bg-primary/10 transition-all duration-1000" />
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent scale-x-0 group-hover/stat-card:scale-x-100 transition-transform duration-1000 origin-center" />
            
            {/* Topographical Grid Pattern (Subtle) */}
            <div className="absolute inset-0 opacity-[0.02] group-hover/stat-card:opacity-[0.04] transition-opacity pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />

            <div className="flex flex-col gap-6 w-full relative z-10">
                <div className="flex items-center justify-between w-full">
                    {icon ? (
                        <div className="w-14 h-14 rounded-2xl bg-surface-container border border-border/10 flex items-center justify-center shrink-0 text-primary group-hover/stat-card:scale-110 group-hover/stat-card:border-primary/20 transition-all duration-700 shadow-inner">
                            {icon}
                        </div>
                    ) : (
                        <div className="w-14 h-14 rounded-2xl bg-surface-container border border-border/10 flex items-center justify-center shrink-0 text-primary group-hover/stat-card:scale-110 transition-all duration-700 shadow-inner">
                            <Activity size={20} />
                        </div>
                    )}
                    
                    {trend && (
                        <div className={cn(
                            "flex items-center gap-1.5 text-[10px] font-black px-4 py-1.5 rounded-full transition-all duration-700 border shadow-sm",
                            trend.positive
                                ? "text-emerald-500 border-emerald-500/10 bg-emerald-500/5 group-hover/stat-card:bg-emerald-500/10 "
                                : "text-rose-500 border-rose-500/10 bg-rose-500/5 group-hover/stat-card:bg-rose-500/10 "
                        )}>
                            {trend.positive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                            <span className="tracking-[0.1em]">{trend.value}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <h3 className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em] leading-none mb-1 group-hover/stat-card:tracking-[0.5em] transition-all duration-700">{title}</h3>
                    <div className="flex items-end gap-3 translate-y-2 group-hover/stat-card:translate-y-0 transition-transform duration-700">
                        <p className="text-4xl font-black text-foreground tracking-tighter leading-none">{value}</p>
                        <div className="w-2 h-2 rounded-full bg-primary mb-1 shadow-[0_0_10px_#B07D5B4D] opacity-0 group-hover/stat-card:opacity-100 transition-all duration-700" />
                    </div>
                </div>
            </div>
            
            {/* Optional Mini-Sparkline / Logic Container */}
            {chart && (
                <div className="w-full h-12 mt-auto relative z-10 opacity-40 group-hover/stat-card:opacity-100 transition-all duration-700">
                    {chart}
                </div>
            )}
        </div>
    );
}
