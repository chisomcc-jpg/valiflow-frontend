import React from "react";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { LightBulbIcon } from "@heroicons/react/24/outline";

export default function AIIntegrationRecommendation({ recommendation }) {
    if (!recommendation) return null;

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-xl p-4 flex items-center gap-4 shadow-sm relative overflow-hidden group">
            {/* Decorative background blob */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />

            <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-indigo-100 flex items-center justify-center shrink-0 z-10">
                <SparklesIcon className="w-5 h-5 text-indigo-500" />
            </div>

            <div className="z-10">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-500">Valiflow Intelligence</span>
                    <div className="h-px w-8 bg-indigo-200" />
                </div>
                <p className="text-sm font-medium text-slate-800">
                    {recommendation.text}
                </p>
            </div>

            {recommendation.confidence > 0.8 && (
                <div className="ml-auto hidden md:flex flex-col items-end z-10">
                    <div className="text-xs font-medium text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                        {Math.round(recommendation.confidence * 100)}% matchning
                    </div>
                </div>
            )}
        </div>
    );
}
