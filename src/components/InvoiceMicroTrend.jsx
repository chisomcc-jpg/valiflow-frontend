import React from "react";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from "@heroicons/react/24/outline";

export default function InvoiceMicroTrend({ trend }) {
    if (!trend) return null;

    let Icon = MinusIcon;
    let color = "text-slate-400";

    if (trend.direction === 'up') {
        Icon = ArrowTrendingUpIcon;
        color = "text-emerald-500";
    } else if (trend.direction === 'down') {
        Icon = ArrowTrendingDownIcon;
        color = "text-red-500";
    }

    return (
        <div className="flex items-center gap-1.5 ml-2 bg-white/50 px-1.5 py-0.5 rounded border border-slate-100 shadow-sm">
            <Icon className={`w-3 h-3 ${color}`} />
            <span className="text-[10px] font-medium text-slate-600">{trend.label}</span>
        </div>
    );
}
