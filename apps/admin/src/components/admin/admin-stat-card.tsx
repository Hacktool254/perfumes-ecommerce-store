"use client";

import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
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

export function AdminStatCard({ title, value, trend, chart, icon, className }: AdminStatCardProps & { className?: string }) {
    return (
        <div className={cn(
            "bg-[#111412] border border-white/5 rounded-[32px] p-8 flex flex-col justify-between group hover:border-[#414A37]/50 transition-all duration-500 h-[220px] relative overflow-hidden shadow-2xl",
            className
        )}>
            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#414A37]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-[#414A37]/10 transition-all duration-500" />
            
            <div className="flex items-start justify-between relative z-10 w-full">
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex items-center justify-between w-full">
                        {icon && (
                            <div className="w-12 h-12 rounded-2xl bg-[#1A1E1C] border border-white/5 flex items-center justify-center shrink-0 text-[#DBC2A6] group-hover:scale-110 group-hover:border-[#414A37]/30 transition-all duration-500">
                                {icon}
                            </div>
                        )}
                        {trend && (
                            <div className={cn(
                                "flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full transition-all duration-500 border",
                                trend.positive
                                    ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
                                    : "text-rose-400 border-rose-500/20 bg-rose-500/5"
                            )}>
                                {trend.positive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                                {trend.value}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-[10px] font-black text-gray-500 mb-2 uppercase tracking-[0.3em]">{title}</h3>
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-black text-white tracking-tighter group-hover:-translate-y-0.5 transition-transform duration-500 leading-none">{value}</p>
                            <div className="w-1.5 h-1.5 rounded-full bg-[#DBC2A6] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Sparkline Chart Container */}
            {chart && (
                <div className="w-full h-10 mt-auto relative z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                    {chart}
                </div>
            )}
        </div>
    );
}
