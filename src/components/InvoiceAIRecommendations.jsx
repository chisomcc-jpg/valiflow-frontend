import React from "react";
import { CheckBadgeIcon, ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/24/solid";

export default function InvoiceAIRecommendations({ recommendations }) {
    if (!recommendations || recommendations.length === 0) return null;

    return (
        <div className="space-y-3 mt-4">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                AI-rekommendationer
            </h5>
            {recommendations.map((rec) => {
                let colorClass = "bg-blue-50 border-blue-100 text-blue-900";
                let Icon = InformationCircleIcon;

                if (rec.type === 'positive') {
                    colorClass = "bg-emerald-50 border-emerald-100 text-emerald-900";
                    Icon = CheckBadgeIcon;
                } else if (rec.type === 'warning') {
                    colorClass = "bg-amber-50 border-amber-100 text-amber-900";
                    Icon = ExclamationCircleIcon;
                } else if (rec.type === 'critical') {
                    colorClass = "bg-red-50 border-red-100 text-red-900";
                    Icon = ExclamationCircleIcon;
                }

                return (
                    <div key={rec.id} className={`p-4 rounded-lg border flex gap-3 ${colorClass}`}>
                        <Icon className="w-5 h-5 shrink-0 mt-0.5 opacity-80" />
                        <div>
                            <p className="text-sm font-semibold">{rec.text}</p>
                            <p className="text-xs opacity-80 mt-1">{rec.subText}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
