
import React from "react";
import {
    CheckCircleIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    BoltIcon,
    ChartBarIcon,
    ArrowLongRightIcon,
    ClockIcon
} from "@heroicons/react/24/outline";

export function BureauDemoOverview() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">

            {/* HEADER: Operational Impact (Replacement for Status Summary) */}
            <section className="max-w-6xl mx-auto mb-12">
                <h1 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
                    Valiflow hanterade det operativa åt dig idag
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-demo-target="impact-cards">
                    {/* Card 1: Automation */}
                    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                        <div className="flex items-start justify-between mb-4">
                            <BoltIcon className="w-8 h-8 text-emerald-600" />
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wide">
                                Automation
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">38</p>
                        <p className="text-sm font-semibold text-slate-800 mb-2">fakturor godkända automatiskt</p>
                        <p className="text-xs text-slate-500">Ingen manuell granskning krävdes</p>
                    </div>

                    {/* Card 2: Risk Filtering */}
                    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                        <div className="flex items-start justify-between mb-4">
                            <ExclamationTriangleIcon className="w-8 h-8 text-amber-500" />
                            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-wide">
                                Riskfilter
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">5</p>
                        <p className="text-sm font-semibold text-slate-800 mb-2">avvikelser stoppades före bokföring</p>
                        <p className="text-xs text-slate-500">Avviker från historiska mönster</p>
                    </div>

                    {/* Card 3: Assurance */}
                    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                        <div className="flex items-start justify-between mb-4">
                            <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wide">
                                Trygghet
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">0</p>
                        <p className="text-sm font-semibold text-slate-800 mb-2">ärenden kräver eskalering</p>
                        <p className="text-xs text-slate-500">Trust Engine är inom säkra gränser</p>
                    </div>
                </div>
            </section>

            {/* CONTRAST BLOCK: If Valiflow had not been active */}
            <section className="max-w-6xl mx-auto mb-16" data-demo-target="contrast-block">
                <div className="bg-slate-900 rounded-2xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
                    {/* Subtle background pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                        Om Valiflow inte var aktivt idag
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-2 border-l-2 border-slate-700 pl-4">
                            <p className="text-lg font-medium text-slate-200">38 fakturor</p>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                hade krävt manuell stickprovskontroll av dig eller dina konsulter.
                            </p>
                        </div>
                        <div className="space-y-2 border-l-2 border-slate-700 pl-4">
                            <p className="text-lg font-medium text-slate-200">5 avvikelser</p>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                hade kunnat bokföras utan varning, vilket ökar risken för fel.
                            </p>
                        </div>
                        <div className="space-y-2 border-l-2 border-slate-700 pl-4">
                            <p className="text-lg font-medium text-slate-200">Ingen överblick</p>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Ingen samlad riskbild över byråns kundportfölj hade funnits tillgänglig.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* LEFT COLUMN: Network Intelligence ("Byråflöde") */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Section: Network Intelligence */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <ChartBarIcon className="w-5 h-5 text-indigo-600" />
                                Insikter från din byråportfölj
                            </h2>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                            <div className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                                <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                                    <UsersIconMini className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">2 kunder uppvisar nya leverantörsmönster</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Avviker från branschsnittet för konsultbolag.</p>
                                </div>
                            </div>

                            <div className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                                <div className="p-2 bg-amber-50 rounded-lg shrink-0">
                                    <ExclamationTriangleIconMini className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">1 avvikelse matchar beteende hos andra byråkunder</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Kors-analys indikerar potentiell bluffaktura.</p>
                                </div>
                            </div>

                            <div className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                                <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
                                    <ArrowDownIconMini className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Risknivån har sjunkit hos 3 kundbolag</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Senaste 30 dagarna baserat på fakturakvalitet.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section: Learning Block */}
                    <div className="relative pt-6">
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                        <div className="pl-6">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                Valiflow lär sig just nu
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <LearningPill label="Normala belopp per leverantör" progress={92} />
                                <LearningPill label="Betalningsintervall per kund" progress={85} />
                                <LearningPill label="Avvikelseprofil per bolag" progress={78} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Today's Focus (Accountability) */}
                <div>
                    <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden sticky top-8">
                        <div className="bg-red-50/50 p-4 border-b border-red-100 flex items-center justify-between">
                            <h3 className="font-bold text-red-900 flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                                Åtgärd krävs
                            </h3>
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">5</span>
                        </div>

                        <div className="p-6">
                            <p className="text-lg font-bold text-slate-900 mb-1">
                                5 fakturor stoppades
                            </p>
                            <p className="text-sm text-slate-600 mb-6">
                                från automatisk bokföring. Avviker från belopp, leverantör eller betalmönster.
                            </p>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-sm text-slate-700 p-2 bg-slate-50 rounded border border-slate-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    <span>Acme Corp (Nytt Bankgiro)</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700 p-2 bg-slate-50 rounded border border-slate-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    <span>Logistik AB (Högt belopp)</span>
                                </div>
                            </div>

                            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 group">
                                Granska nu
                                <ArrowLongRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* TRUST STATEMENT: Auditor/Compliance Cue */}
                <section className="max-w-6xl mx-auto mt-24 pb-8 text-center">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                        Alla beslut och filtreringar är spårbara och kan revideras i efterhand.
                    </p>
                </section>

            </div>
        </div>
    );
}

// Micro components
function UsersIconMini(props) { return <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> }
function ExclamationTriangleIconMini(props) { return <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg> }
function ArrowDownIconMini(props) { return <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg> }

function LearningPill({ label, progress }) {
    return (
        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-sm">
            <div className="flex justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-700">{label}</span>
                <span className="text-xs text-blue-600 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    )
}
