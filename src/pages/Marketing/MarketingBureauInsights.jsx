// src/pages/Marketing/MarketingBureauInsights.jsx
import React from "react";
// Importera riktiga komponenter från Insights-modulen
import AISummaryCard from "@/components/bureau/insights/AISummaryCard";
import CustomerRiskHeatmap from "@/components/bureau/insights/CustomerRiskHeatmap";
import SupplierRiskHighlights from "@/components/bureau/insights/SupplierRiskHighlights";
import TrendSection from "@/components/bureau/insights/TrendSection";
import RecommendationsList from "@/components/bureau/insights/RecommendationsList";

import { marketingMockData } from "../../demo/marketingMockData";
import {
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ShieldExclamationIcon,
    LightBulbIcon
} from "@heroicons/react/24/outline";

export default function MarketingBureauInsights() {
    const { aiSummary, customers } = marketingMockData;

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Insikter & Analys</h1>
                    <p className="text-slate-500 mt-1">
                        Djupgående analys av portföljens riskexponering och trender.
                    </p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700">
                    Exportera rapport
                </button>
            </div>

            {/* AI Summary */}
            <AISummaryCard summary={aiSummary} />

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-8">

                {/* Left: Heatmap & Trends */}
                <div className="col-span-12 lg:col-span-8 space-y-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <ChartBarIcon className="w-5 h-5 text-slate-400" />
                            Risk Heatmap (Topp 15 Kunder)
                        </h3>
                        <RiskHeatmap customers={customers} />
                    </div>

                    {/* Trend Chart Mock */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <ArrowTrendingUpIcon className="w-5 h-5 text-slate-400" />
                            Riskutveckling (30 dagar)
                        </h3>
                        <div className="h-64 flex items-end gap-2 px-2">
                            {/* Static Bars for Visuals */}
                            {Array.from({ length: 30 }).map((_, i) => {
                                const h = 20 + Math.random() * 60;
                                const color = h > 60 ? 'bg-amber-400' : 'bg-slate-200';
                                return (
                                    <div key={i} className={`flex-1 rounded-t-sm ${color}`} style={{ height: `${h}%` }} />
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right: Supplier Highlights */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <ShieldExclamationIcon className="w-5 h-5 text-slate-400" />
                            Leverantörsbevakning
                        </h3>
                        <div className="space-y-4">
                            {marketingMockData.suppliers.map((s, i) => (
                                <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-slate-900 text-sm">{s.name}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${s.risk > 50 ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>
                                            Risk: {s.risk}
                                        </span>
                                    </div>
                                    {s.issue && (
                                        <div className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded inline-block">
                                            ⚠️ {s.issue}
                                        </div>
                                    )}
                                    <div className="mt-2 text-xs text-slate-500">
                                        Påverkar {s.customers} kunder
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
