
import React from "react";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from "@heroicons/react/24/outline";

export default function InvoiceMicroTrend({ trend }) {
    if (!trend) return null;

    let Icon = MinusIcon;
    let color = "text-slate-400";
    let bg = "bg-slate-50 border-slate-100";
    let labelColor = "text-slate-500";

    // "up" implies increase. Whether that is good or bad depends on context, 
    // but usually user passes specific color classes or we infer standard semantics.
    // For this generic component, we'll assume neutral direction unless specified.

    if (trend.direction === 'up' || trend.value > 0) {
        Icon = ArrowTrendingUpIcon;
        // Check if "good" or "bad" context is known? 
        // For risk: up is bad. For trust: up is good.
        // We'll trust the parent to pass specific styling or rely on semantic label text.
        // But the prompt example shows: "Risktrend: ↓ stabil" (Green/Good?)
        // Let's default to a subtle style and allow override props if needed, or stick to simple logic:
    } else if (trend.direction === 'down' || trend.value < 0) {
        Icon = ArrowTrendingDownIcon;
    }

    // Determine colors based on intent if provided, otherwise default logic
    if (trend.intent === 'good') {
        color = "text-emerald-600";
        labelColor = "text-emerald-700";
        bg = "bg-emerald-50/50 border-emerald-100";
    } else if (trend.intent === 'bad') {
        color = "text-red-500";
        labelColor = "text-red-700";
        bg = "bg-red-50/50 border-red-100";
    } else if (trend.intent === 'warning') {
        color = "text-amber-500";
        labelColor = "text-amber-700";
        bg = "bg-amber-50/50 border-amber-100";
    }

    return (
        <div className={`inline-flex items-center gap-1.5 ml-2 px-1.5 py-0.5 rounded border shadow-sm ${bg} select-none`}>
            <Icon className={`w-3 h-3 ${color}`} />
            {trend.label && (
                <span className={`text-[10px] font-medium leading-none ${labelColor}`}>
                    {trend.label}
                </span>
            )}
        </div>
    );
}
