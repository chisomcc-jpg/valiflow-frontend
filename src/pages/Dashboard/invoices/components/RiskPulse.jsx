
import React from 'react';
import { ShieldCheckIcon, ShieldExclamationIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import SimpleTooltip from "@/components/SimpleTooltip";

export default function RiskPulse({ counts, total, onFilter }) {
    if (!total) return null;

    const safePct = Math.round((counts.safe / total) * 100);
    const mediumPct = Math.round((counts.medium / total) * 100);
    const highPct = Math.round((counts.high / total) * 100);

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800">Riskpuls</h3>
                    <p className="text-sm text-slate-500">Realtidsövervakning av portföljens riskfördelning</p>
                </div>

                {/* Legend / Actions */}
                <div className="flex gap-4">
                    {/* Can place specific actions here */}
                </div>
            </div>

            {/* The Bar */}
            <div className="h-6 w-full rounded-full overflow-hidden flex bg-slate-100 mb-4 cursor-pointer">
                {/* Low Risk Segment */}
                <SimpleTooltip content={`${counts.safe} fakturor med låg risk (Trust > 80)`}>
                    <div
                        style={{ width: `${safePct}%` }}
                        className="bg-emerald-400 hover:bg-emerald-500 transition-colors h-full flex items-center justify-center text-[10px] text-emerald-900 font-bold opacity-90 hover:opacity-100"
                        onClick={() => onFilter('safe')}
                    >
                        {safePct > 5 && `${safePct}%`}
                    </div>
                </SimpleTooltip>

                {/* Medium Risk Segment */}
                <SimpleTooltip content={`${counts.medium} fakturor med medelrisk (Trust 50-80). Klicka för att filtrera.`}>
                    <div
                        style={{ width: `${mediumPct}%` }}
                        className="bg-amber-400 hover:bg-amber-500 transition-colors h-full flex items-center justify-center text-[10px] text-amber-900 font-bold opacity-90 hover:opacity-100 relative"
                        onClick={() => onFilter('medium')}
                    >
                        {mediumPct > 5 && `${mediumPct}%`}
                        {/* Interactive marker example */}
                        {counts.medium > 0 && (
                            <div className="absolute -top-1 right-1/2 translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse" />
                        )}
                    </div>
                </SimpleTooltip>

                {/* High Risk Segment */}
                <SimpleTooltip content={`${counts.high} högriskfakturor. Kräver omedelbar åtgärd!`}>
                    <div
                        style={{ width: `${highPct}%` }}
                        className="bg-red-500 hover:bg-red-600 transition-colors h-full flex items-center justify-center text-[10px] text-white font-bold opacity-90 hover:opacity-100 pattern-diagonal-lines"
                        onClick={() => onFilter('high')}
                    >
                        {highPct > 5 && `${highPct}%`}
                    </div>
                </SimpleTooltip>
            </div>

            {/* Detailed Legend */}
            <div className="grid grid-cols-3 gap-4 mt-6">
                <button onClick={() => onFilter('safe')} className="p-3 rounded-lg border border-slate-100 hover:bg-emerald-50 hover:border-emerald-200 text-left transition-all group">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                        <span className="text-xs font-semibold text-slate-700">Låg risk (Godkända)</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-800 tracking-tight">{counts.safe}</span>
                </button>

                <button onClick={() => onFilter('medium')} className="p-3 rounded-lg border border-slate-100 hover:bg-amber-50 hover:border-amber-200 text-left transition-all group relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-1 relative z-10">
                        <div className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
                        <span className="text-xs font-semibold text-slate-700">Monitorera</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-800 tracking-tight relative z-10">{counts.medium}</span>
                    {/* Subtle background icon */}
                    <ExclamationTriangleIcon className="absolute -bottom-2 -right-2 w-12 h-12 text-amber-400/10 -rotate-12" />
                </button>

                <button onClick={() => onFilter('high')} className="p-3 rounded-lg border border-red-100 bg-red-50/30 hover:bg-red-50 hover:border-red-200 text-left transition-all group relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-1 relative z-10">
                        <div className="w-2 h-2 rounded-full bg-red-500 group-hover:scale-125 transition-transform animate-pulse" />
                        <span className="text-xs font-semibold text-red-800">Kritisk risk</span>
                    </div>
                    <span className="text-2xl font-bold text-red-900 tracking-tight relative z-10">{counts.high}</span>
                    <ShieldExclamationIcon className="absolute -bottom-2 -right-2 w-12 h-12 text-red-500/10 -rotate-12" />
                </button>
            </div>
        </div>
    );
}
