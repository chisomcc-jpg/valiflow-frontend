
import React from 'react';
import { SparklesIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function AISummarySection({ summary }) {
    if (!summary) return null;

    return (
        <div className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-xl p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <SparklesIcon className="w-32 h-32 text-indigo-500 transform rotate-12" />
            </div>

            <div className="flex-1 z-10">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide">AI-Analys</span>
                    <span className="text-xs text-indigo-600 font-medium">Senaste 24h</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800">
                    41 fakturor analyserade utan anmärkning
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                    Systemet har identifierat 2 metadatafel som kräver din granskning. Inga kritiska risker upptäckta.
                </p>
            </div>

            <div className="flex items-center gap-6 z-10">
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-slate-800">2</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Avvikelser</span>
                </div>
                <div className="w-px h-10 bg-indigo-100"></div>
                <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-slate-800">0</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Högrisk</span>
                </div>

                <button className="bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2 ml-4">
                    Granska metadata
                    <ArrowRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
