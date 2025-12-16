import React from "react";
import { LightBulbIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function RecommendationsList({ recommendations = [] }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <LightBulbIcon className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-slate-800">Rekommenderade åtgärder</h3>
            </div>

            <div className="space-y-0 divide-y divide-slate-100">
                {recommendations.length === 0 && <p className="text-sm text-slate-400 py-4">Inga åtgärder krävs just nu.</p>}

                {recommendations.map((rec) => (
                    <div key={rec.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group">
                        <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {rec.category}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                                {rec.text}
                            </p>
                        </div>
                        <button className="flex items-center gap-1 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            {rec.actionLabel}
                            <ChevronRightIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
