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
        <div className="bg-surface-container-lowest rounded-[32px] p-8 shadow-sm flex flex-col justify-between group hover:shadow-lg transition-all duration-500 h-[200px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/5 transition-all duration-500" />
            
            <div className="flex items-start justify-between relative z-10">
                <div className="flex flex-col gap-5 w-full">
                    <div className="flex items-center justify-between w-full">
                        {icon && (
                            <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center shrink-0 shadow-sm text-primary group-hover:scale-110 transition-transform duration-500">
                                {icon}
                            </div>
                        )}
                        {trend && (
                            <div className={cn(
                                "flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-[12px] transition-colors duration-500",
                                trend.positive
                                    ? "text-emerald-600 bg-emerald-50"
                                    : "text-rose-600 bg-rose-50"
                            )}>
                                {trend.positive ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                                {trend.value}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-[11px] font-bold text-muted-foreground mb-1.5 uppercase tracking-[0.15em]">{title}</h3>
                        <p className="text-3xl font-bold text-foreground group-hover:-translate-y-0.5 transition-transform duration-500">{value}</p>
                    </div>
                </div>
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
