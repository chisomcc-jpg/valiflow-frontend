
import React from "react";
import {
    ExclamationTriangleIcon,
    ShieldExclamationIcon,
    ArrowTrendingUpIcon,
    EyeIcon,
    CheckCircleIcon
} from "@heroicons/react/24/outline";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    Tooltip,
} from "recharts";

export function BureauDemoRisk() {

    // Demo Data for Chart
    const chartData = [
        { date: "1", events: 2 },
        { date: "5", events: 5 },
        { date: "10", events: 3 },
        { date: "15", events: 8 },
        { date: "20", events: 4 },
        { date: "25", events: 6 },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">

            {/* 1. HERO / PAGE HEADER: Intervention Framing */}
            <section className="max-w-6xl mx-auto mb-10">
                <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight" data-demo-target="risk-header">
                    Risker som Valiflow aktivt fångar innan bokföring
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                    Samlad riskbild över hela din kundportfölj – uppdateras löpande.
                </p>
            </section>

            {/* 2. KPI CARDS: Intervention Actions */}
            <section className="max-w-6xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-3 gap-6" data-demo-target="risk-kpis">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                    <div className="flex items-start justify-between mb-4">
                        <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                        <span className="text-xs font-semibold text-red-700 bg-red-50 px-2 py-1 rounded-full uppercase tracking-wide">
                            Stoppade fakturor
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mb-1">4</p>
                    <p className="text-sm font-semibold text-slate-800 mb-2">fakturor stoppades från automatisk bokföring</p>
                    <p className="text-xs text-slate-500">Kräver manuell bedömning</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                    <div className="flex items-start justify-between mb-4">
                        <ShieldExclamationIcon className="w-8 h-8 text-amber-500" />
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-wide">
                            Bedrägerisignal
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 mb-1">1</p>
                    <p className="text-sm font-semibold text-slate-800 mb-2">potentiellt bedrägligt mönster upptäckt</p>
                    <p className="text-xs text-slate-500">Avviker från normalt beteende</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                    <div className="flex items-start justify-between mb-4">
                        <ArrowTrendingUpIcon className="w-8 h-8 text-blue-600" />
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wide">
                            Portföljstatus
                        </span>
                    </div>
                    <div className="flex items-end gap-2 mb-1">
                        <p className="text-3xl font-bold text-slate-900">14 %</p>
                        <p className="text-sm text-emerald-600 font-bold mb-1.5 flex items-center">
                            -1,2%
                        </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 mb-2">av portföljen under förhöjd bevakning</p>
                    <p className="text-xs text-slate-500">senaste 30 dagarna</p>
                </div>
            </section>

            {/* 3. DEMO CONTRAST BLOCK */}
            <section className="max-w-6xl mx-auto mb-16" data-demo-target="risk-contrast">
                <div className="bg-slate-900 rounded-2xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                        Om dessa risker inte hade fångats
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2 border-l-2 border-slate-700 pl-4">
                            <CheckCircleIcon className="w-5 h-5 text-slate-500 mb-2" />
                            <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                Avvikande fakturor kunde ha bokförts utan varning
                            </p>
                        </div>
                        <div className="space-y-2 border-l-2 border-slate-700 pl-4">
                            <CheckCircleIcon className="w-5 h-5 text-slate-500 mb-2" />
                            <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                Byrån hade saknat samlad risköverblick
                            </p>
                        </div>
                        <div className="space-y-2 border-l-2 border-slate-700 pl-4">
                            <CheckCircleIcon className="w-5 h-5 text-slate-500 mb-2" />
                            <p className="text-sm text-slate-200 leading-relaxed font-medium">
                                Fel hade upptäckts först i efterhand
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. RISK & EXCEPTIONS TABLE + 5. TREND */}
            <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: Curated Table */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">Beslut krävs</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" data-demo-target="risk-table">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Kund</th>
                                    <th className="px-6 py-3">Händelse</th>
                                    <th className="px-6 py-3">Risk</th>
                                    <th className="px-6 py-3">Upptäckt</th>
                                    <th className="px-6 py-3 text-right">Åtgärd</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                <tr className="hover:bg-slate-50 transition group cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-slate-900">Exempelkund AB</td>
                                    <td className="px-6 py-4 text-slate-600">Avvikande transaktionsbelopp</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                            Mellanrisk (50/100)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">Idag</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-blue-600 font-medium group-hover:underline">Granska</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition group cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-slate-900">Bygg & Betong AB</td>
                                    <td className="px-6 py-4 text-slate-600">Nytt Bankgiro</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                            Högrisk (85/100)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">Igår</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-blue-600 font-medium group-hover:underline">Granska</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-slate-50 transition group cursor-pointer">
                                    <td className="px-6 py-4 font-medium text-slate-900">Logistik AB</td>
                                    <td className="px-6 py-4 text-slate-600">Dubbelbetalning misstänkt</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                            Mellanrisk (60/100)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">2 dagar sen</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-blue-600 font-medium group-hover:underline">Granska</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: Trend with Interpretation */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-slate-800">Risktrend (30d)</h2>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="h-40 w-full mb-4">
                            <ResponsiveContainer>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRiskDemo" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#DC2626" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" hide />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="events" stroke="#DC2626" strokeWidth={2} fillOpacity={1} fill="url(#colorRiskDemo)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium text-center border-t border-slate-100 pt-4">
                            Risknivån i portföljen har ökat till följd av nya avvikande mönster.
                        </p>
                    </div>
                </div>

            </section>

            {/* 6. TRUST TRIGGER: Auditor Reassurance */}
            <section className="max-w-6xl mx-auto mt-24 pb-8 text-center" data-demo-target="risk-trust-trigger">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium opacity-80">
                    Alla riskbedömningar och åtgärder är spårbara och kan revideras i efterhand.
                </p>
            </section>

        </div>
    );
}
