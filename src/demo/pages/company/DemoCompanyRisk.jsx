import React, { useState } from "react";
import {
    ShieldExclamationIcon,
    ExclamationTriangleIcon,
    ArrowRightIcon
} from "@heroicons/react/24/outline";
import { demoInvoices } from "@/demo/mocks/demoInvoicesMock";
import DemoInvoiceQuickView from "@/demo/components/DemoInvoiceQuickView";

export default function DemoCompanyRisk() {
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const openQuickView = (invoice) => {
        setSelectedInvoice(invoice);
        setIsQuickViewOpen(true);
    };

    // Filter for risks (Unique Invoices)
    const riskyInvoices = demoInvoices.filter(inv => inv.riskScore > 50);

    // Business Logic for Impacts & Recommendations
    const getAnalysis = (inv) => {
        const impacts = [];
        let recommendation = "Kontrollera fakturan mot beställning.";

        if (inv.flags?.includes("BGIRO_CHANGE")) {
            impacts.push("Nytt bankgiro (avviker från 14 tidigare fakturor)");
            recommendation = "Rekommenderad kontroll: Bekräfta bankuppgifter med leverantör.";
        }
        if (inv.flags?.includes("AMOUNT_ANOMALY") || inv.total > 100000) {
            impacts.push(`Beloppet är signifikant högre än snittet (${inv.currency})`);
            if (impacts.length === 1) recommendation = "Rekommenderad kontroll: Jämför belopp mot avtal eller budget.";
        }
        if (inv.supplierProfile?.riskLevel === "Critical" || inv.mockChange === "Svartlistad") {
            impacts.push("Leverantören finns på varningslista");
            recommendation = "Rekommenderad kontroll: Pausa betalning och utred leverantör.";
        }
        if (inv.flags?.includes("NEW_SUPPLIER")) {
            impacts.push("Ny leverantör (första fakturan)");
        }

        return { impacts, recommendation };
    };

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-20">
            <div className="max-w-[1000px] mx-auto py-12 px-8">

                {/* 1. CFO Summary (Calm, Executive) */}
                <div className="mb-10 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                            {riskyInvoices.length} fakturor kräver granskning innan betalning
                        </h1>
                    </div>
                    <p className="text-slate-500 ml-6 text-base">
                        Övriga fakturor följer normala mönster och kan hanteras automatiskt.
                    </p>
                </div>

                {/* 2. Decision Surface (One Invoice = One Row) */}
                <div className="space-y-4">
                    {riskyInvoices.map((inv) => {
                        const { impacts, recommendation } = getAnalysis(inv);
                        return (
                            <div
                                key={inv.id}
                                onClick={() => openQuickView(inv)}
                                className="group bg-white border border-slate-200 rounded-xl p-6 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer relative"
                            >
                                <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center justify-between">

                                    {/* Left: Invoice & Decision Context */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-slate-900">
                                                {inv.supplierName}
                                            </h3>
                                            <span className="text-sm text-slate-400 font-mono tracking-wide">
                                                {inv.invoiceNumber || `INV-${inv.id}`}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <ExclamationTriangleIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 mb-1.5">
                                                    Kräver manuell kontroll
                                                </p>
                                                <ul className="space-y-1 mb-3">
                                                    {impacts.map((impact, i) => (
                                                        <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                                            <span className="w-1 h-1 rounded-full bg-slate-400" />
                                                            {impact}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <p className="text-sm text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md inline-block font-medium">
                                                    {recommendation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Amount & Action */}
                                    <div className="flex bg-slate-50 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none items-center gap-8 justify-between md:justify-end w-full md:w-auto">
                                        <div className="text-right">
                                            <span className="block text-xs text-slate-400 uppercase tracking-wider mb-1">Belopp</span>
                                            <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                                                {inv.total.toLocaleString()} {inv.currency}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold group-hover:translate-x-1 transition-transform whitespace-nowrap">
                                            Granska
                                            <ArrowRightIcon className="w-4 h-4" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}

                    {riskyInvoices.length === 0 && (
                        <div className="text-center py-24 bg-white rounded-xl border border-dashed border-slate-200">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldExclamationIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">Allt ser bra ut</h3>
                            <p className="text-slate-500 mt-1">Inga fakturor kräver manuell granskning just nu.</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Quick View */}
            <DemoInvoiceQuickView
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                demoInvoice={selectedInvoice}
            />
        </div>
    );
}
