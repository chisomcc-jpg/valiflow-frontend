
import React from 'react';
import { LightBulbIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function InvoiceAIRecommendation({ recommendations }) {
    if (!recommendations || recommendations.length === 0) return null;

    return (
        <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <LightBulbIcon className="w-3.5 h-3.5" />
                Rekommenderade åtgärder
            </h4>

            <div className="grid gap-2">
                {recommendations.map((rec, idx) => (
                    <div
                        key={idx}
                        className={`
                            relative pl-3 border-l-2 py-1
                            ${rec.type === 'positive' ? 'border-emerald-300' : ''}
                            ${rec.type === 'warning' ? 'border-amber-400' : ''}
                            ${rec.type === 'info' ? 'border-blue-300' : ''}
                            ${(!rec.type || rec.type === 'neutral') ? 'border-slate-300' : ''}
                        `}
                    >
                        <p className="text-sm font-medium text-slate-800">
                            {rec.text}
                        </p>
                        {rec.subText && (
                            <p className="text-xs text-slate-500 mt-0.5">
                                {rec.subText}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
