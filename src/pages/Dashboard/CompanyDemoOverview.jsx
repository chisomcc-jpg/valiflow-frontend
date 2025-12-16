
import React from "react";
import {
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    BoltIcon,
    ChartBarIcon,
    ArrowLongRightIcon,
    BanknotesIcon
} from "@heroicons/react/24/outline";

// Mini Icons for the list
const ExclamationTriangleIconMini = ({ className }) => <ExclamationTriangleIcon className={className} />;
const BanknotesIconMini = ({ className }) => <BanknotesIcon className={className} />;
const ShieldCheckIconMini = ({ className }) => <ShieldCheckIcon className={className} />;

// Learning Pill Component
const LearningPill = ({ label, progress }) => (
    <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
            <span>{label}</span>
            <span className="text-indigo-600">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
        </div>
    </div>
);

export function CompanyDemoOverview() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">

            {/* HEADER: OPERATIONAL IMPACT */}
            <section className="max-w-6xl mx-auto mb-12">
                <h1 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
                    Valiflow hanterade det operativa åt er idag
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
                        <p className="text-3xl font-bold text-slate-900 mb-1">127</p>
                        <p className="text-sm font-semibold text-slate-800 mb-2">fakturor godkända automatiskt</p>
                        <p className="text-xs text-slate-500">Skickade direkt till bokföring</p>
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
                        <p className="text-3xl font-bold text-slate-900 mb-1">3</p>
                        <p className="text-sm font-semibold text-slate-800 mb-2">avvikelser stoppades</p>
                        <p className="text-xs text-slate-500">Kräver beslut av ekonomiteamet</p>
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
                        <p className="text-3xl font-bold text-slate-900 mb-1">100%</p>
                        <p className="text-sm font-semibold text-slate-800 mb-2">efterlevnad (Compliance)</p>
                        <p className="text-xs text-slate-500">Inga utbetalningar till svartlistade bolag</p>
                    </div>
                </div>
            </section>

            {/* CONTRAST BLOCK: "Om det inte fanns" */}
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
                            <p className="text-lg font-medium text-slate-200">127 manuella moment</p>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                hade krävt rutinmässig attest eller granskning av er personal.
                            </p>
                        </div>
                        <div className="space-y-2 border-l-2 border-slate-700 pl-4">
                            <p className="text-lg font-medium text-slate-200">3 potentiella fel</p>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                hade kunnat slinka igenom eller krävt tidskrävande utredning i efterhand.
                            </p>
                        </div>
                        <div className="space-y-2 border-l-2 border-slate-700 pl-4">
                            <p className="text-lg font-medium text-slate-200">Reaktiv kontroll</p>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Ni hade saknat realtidsdata på leverantörsrisker inför veckans betalningar.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* LEFT COLUMN: Company Intelligence */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Section: Intelligence */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <ChartBarIcon className="w-5 h-5 text-indigo-600" />
                                Insikter från er leverantörsreskontra
                            </h2>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                            <div className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                                <div className="p-2 bg-indigo-50 rounded-lg shrink-0">
                                    <BanknotesIconMini className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">2 leverantörer har bytt bankgiro</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Verifierat mot Bankgirot. Ingen anmärkning.</p>
                                </div>
                            </div>

                            <div className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                                <div className="p-2 bg-amber-50 rounded-lg shrink-0">
                                    <ExclamationTriangleIconMini className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">1 ny leverantör saknar F-skatt</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Bolaget har avregistrerats för F-skatt senaste veckan.</p>
                                </div>
                            </div>

                            <div className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                                <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
                                    <ShieldCheckIconMini className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Betalningsflödet är stabilt</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Inga dubbelbetalningar upptäckta (30 dagar).</p>
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
                                Valiflow lär sig ert mönster
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <LearningPill label="Leverantörers beloppsgränser" progress={94} />
                                <LearningPill label="Attestflödes-struktur" progress={88} />
                                <LearningPill label="Normala fakturaintervall" progress={82} />
                            </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Today's Focus (Actionable) */}
                <div>
                    <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden sticky top-8">
                        <div className="bg-red-50/50 p-4 border-b border-red-100 flex items-center justify-between">
                            <h3 className="font-bold text-red-900 flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                                Åtgärd krävs
                            </h3>
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                        </div>

                        <div className="p-6">
                            <p className="text-lg font-bold text-slate-900 mb-1">
                                3 avvikelser stoppade
                            </p>
                            <p className="text-sm text-slate-600 mb-6">
                                Valiflow har pausat dessa för er kontroll innan betalning sker.
                            </p>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-sm text-slate-700 p-2 bg-slate-50 rounded border border-slate-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    <span>Konsult AB (Avviker från avtal)</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700 p-2 bg-slate-50 rounded border border-slate-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                    <span>TechStore (Nytt konto)</span>
                                </div>
                            </div>

                            <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 group">
                                Granska avvikelser
                                <ArrowLongRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
