// src/demo/components/DashboardKPIs.jsx
import React from 'react';
import { useDemo } from '../DemoContext';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const formatCompactCurrency = (amount) => {
    return new Intl.NumberFormat('sv-SE', {
        style: 'currency',
        currency: 'SEK',
        notation: "compact",
        maximumFractionDigits: 1
    }).format(amount);
};

export default function DashboardKPIs() {
    const { stats } = useDemo();

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

            {/* KPI 1: Invoices Processed */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fakturor (30 d)</p>
                <div>
                    <span className="text-3xl font-bold text-slate-900">{stats.totalCount}</span>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1 font-medium">
                        <ArrowUpIcon className="w-3 h-3" />
                        <span>12% vs fg. månad</span>
                    </div>
                </div>
            </div>

            {/* KPI 2: AI Validated */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI-Validerat</p>
                <div>
                    <span className="text-3xl font-bold text-slate-900">100%</span>
                    <p className="text-xs text-slate-400 mt-1">Realtidskontroll aktiv</p>
                </div>
            </div>

            {/* KPI 3: Flagged */}
            <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-2 -mt-2 z-0"></div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider z-10">Kräver Åtgärd</p>
                <div className="z-10">
                    <span className="text-3xl font-bold text-red-600">{stats.flaggedCount}</span>
                    <p className="text-xs text-red-400 mt-1">Hög risk detekterad</p>
                </div>
            </div>

            {/* KPI 4: Financial Exposure */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Riskexponering</p>
                <div>
                    <span className="text-3xl font-bold text-slate-900">{formatCompactCurrency(stats.financialExposure || 0)}</span>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                </div>
            </div>

            {/* Contextual Risk Pulse (Optional Row, or integrated) - Doing integration here */}
        </div>
    );
}

export function RiskPulseBar() {
    const { stats } = useDemo();
    const total = stats.totalCount || 1;
    const lowPct = (stats.riskDistribution.low / total) * 100;
    const medPct = (stats.riskDistribution.medium / total) * 100;
    const highPct = (stats.riskDistribution.high / total) * 100;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm">
            <div className="flex justify-between items-end mb-3">
                <h3 className="text-sm font-semibold text-slate-700">Riskfördelning</h3>
                <div className="flex gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"></div>Låg risk ({stats.riskDistribution.low})</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400"></div>Medium ({stats.riskDistribution.medium})</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div>Hög risk ({stats.riskDistribution.high})</span>
                </div>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden">
                <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${lowPct}%` }} />
                <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${medPct}%` }} />
                <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${highPct}%` }} />
            </div>
        </div>
    );
}
