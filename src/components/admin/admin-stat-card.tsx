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
    chart: ReactNode;
}

export function AdminStatCard({ title, value, trend, chart }: AdminStatCardProps) {
    return (
        <div className="bg-white rounded-[20px] p-6 shadow-[0_2px_10px_0_rgba(0,0,0,0.02)] flex flex-col justify-between group hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 border border-gray-50 h-[160px]">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-1 leading-tight">{title}</h3>
                    <p className="text-2xl font-bold text-gray-900 group-hover:-translate-y-0.5 transition-transform duration-300">{value}</p>
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md",
                        trend.positive ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"
                    )}>
                        {trend.positive ? <TrendingUp size={14} strokeWidth={3} /> : <TrendingDown size={14} strokeWidth={3} />}
                        {trend.value}
                    </div>
                )}
            </div>
            {/* Sparkline Chart Container */}
            <div className="w-full h-12 mt-auto">
                {chart}
            </div>
        </div>
    );
}
