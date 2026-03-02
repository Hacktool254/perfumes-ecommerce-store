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
}

export function AdminStatCard({ title, value, trend, chart, icon }: AdminStatCardProps) {
    return (
        <div className="bg-card rounded-[24px] p-6 shadow-sm border border-border flex flex-col justify-between group hover:shadow-md transition-all duration-300 h-[160px]">
            <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                    {icon && (
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h3 className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">{title}</h3>
                        <p className="text-2xl font-bold text-foreground group-hover:-translate-y-0.5 transition-transform duration-300">{value}</p>
                    </div>
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                        trend.positive
                            ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                            : "text-rose-500 bg-rose-500/10 border-rose-500/20"
                    )}>
                        {trend.positive ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                        {trend.value}
                    </div>
                )}
            </div>
            {/* Sparkline Chart Container */}
            {chart && (
                <div className="w-full h-12 mt-auto">
                    {chart}
                </div>
            )}
        </div>
    );
}
