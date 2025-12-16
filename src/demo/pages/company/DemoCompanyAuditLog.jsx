import React, { useState } from "react";
import {
    ClipboardDocumentCheckIcon,
    ArrowDownTrayIcon,
    ClockIcon,
    UserCircleIcon,
    ChatBubbleLeftEllipsisIcon,
    ShieldExclamationIcon,
    CheckCircleIcon,
    XCircleIcon,
    InformationCircleIcon
} from "@heroicons/react/24/outline";
import { demoAuditLogs } from "@/demo/mocks/demoAuditLogMock";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function DemoCompanyAuditLog() {
    const userRole = "OWNER";
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
    const [isTimelineOpen, setIsTimelineOpen] = useState(false);

    // KPI Calc (CFO Executive Summary)
    const approvedCount = demoAuditLogs.filter(l => l.category === 'routine' || l.action === 'approved').length + 36; // inferred history
    const manualReviewCount = demoAuditLogs.filter(l => l.category === 'human_decision').length;
    const autoDecisionCount = 0; // STATED CANON: "0 beslut fattade automatiskt"

    const openTimeline = (invoiceId) => {
        setSelectedInvoiceId(invoiceId);
        setIsTimelineOpen(true);
    };

    // Filter logs for selected invoice (Case File)
    const timelineLogs = selectedInvoiceId
        ? demoAuditLogs.filter(l => l.invoiceId === selectedInvoiceId).sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans pb-20">
            <div className="max-w-[1200px] mx-auto py-12 px-8">

                {/* 1. Header & Export */}
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
                            Intern kontroll & beslutshistorik
                        </h1>
                        <p className="text-lg text-slate-600 max-w-3xl">
                            Alla fakturarelaterade riskbedömningar och beslut är spårbara och kan granskas i efterhand för revision, styrelse och myndigheter.
                        </p>
                    </div>

                    {userRole === "OWNER" && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" className="text-slate-700 border-slate-300 hover:bg-slate-50 gap-2 font-medium">
                                        <ArrowDownTrayIcon className="w-4 h-4" />
                                        Exportera revisionslogg
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Används vid revision, styrelsegenomgång eller myndighetsförfrågan.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </header>

                {/* 2. Executive Summary (CFO KPIs) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Godkända (30 dagar)</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{approvedCount}</p>
                        <p className="text-xs text-slate-400 mt-1">Attesterade enligt regelverk</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Manuell granskning</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{manualReviewCount}</p>
                        <p className="text-xs text-slate-400 mt-1">Fakturor som krävde mänskligt beslut</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Automatiska avslag</p>
                        <p className="text-2xl font-bold text-slate-400 mt-1">{autoDecisionCount}</p>
                        <p className="text-xs text-slate-400 mt-1">Endast människor avvisar.</p>
                    </div>
                </div>

                {/* 3. Decision Ledger (The "Truth" Table) */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-medium">
                            <tr>
                                <th className="py-4 px-6 w-40">Tidpunkt</th>
                                <th className="py-4 px-6">Händelse & Beslutsunderlag</th>
                                <th className="py-4 px-6 w-40">Ärende (Faktura-ID)</th>
                                <th className="py-4 px-6 text-right">Ansvarig</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {demoAuditLogs.map((log) => (
                                <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                                    {/* 1. Time */}
                                    <td className="py-4 px-6 text-slate-500 font-mono text-xs whitespace-nowrap align-top">
                                        {log.date}
                                    </td>

                                    {/* 2. Event & Type */}
                                    <td className="py-4 px-6 align-top">
                                        <div className="flex items-start gap-3">
                                            {/* Icon Logic */}
                                            <div className={`mt-0.5 shrink-0`}>
                                                {log.category === 'system_signal' && (
                                                    <ShieldExclamationIcon className="w-5 h-5 text-amber-500" />
                                                )}
                                                {log.category === 'human_decision' && log.action === 'rejected' && (
                                                    <XCircleIcon className="w-5 h-5 text-red-600" />
                                                )}
                                                {log.category === 'human_decision' && log.action.includes('approved') && (
                                                    <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
                                                )}
                                                {log.category === 'routine' && (
                                                    <CheckCircleIcon className="w-5 h-5 text-slate-400" />
                                                )}
                                            </div>

                                            <div>
                                                <span className={`block font-semibold text-sm ${log.category === 'system_signal' ? 'text-amber-900' :
                                                        log.category === 'human_decision' && log.action === 'rejected' ? 'text-red-900' :
                                                            'text-slate-900'
                                                    }`}>
                                                    {log.type}
                                                </span>
                                                <span className="block text-slate-600 mt-1 leading-relaxed max-w-xl">
                                                    {log.description}
                                                </span>
                                                {/* Always show Human Comments inline for Audit Clarity */}
                                                {log.comment && (
                                                    <div className="mt-2 flex items-start gap-2 text-xs bg-slate-50 border border-slate-200/60 p-2 rounded-md text-slate-700 italic">
                                                        <ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5 mt-0.5 text-slate-400 shrink-0" />
                                                        "{log.comment}"
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* 3. Invoice / Case File */}
                                    <td className="py-4 px-6 align-top">
                                        <button
                                            onClick={() => openTimeline(log.invoiceId)}
                                            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 font-mono text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 rounded-md transition-all shadow-sm group-hover:border-indigo-200"
                                        >
                                            <ClockIcon className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                                            {log.invoiceId}
                                        </button>
                                        <div className="text-[10px] text-slate-400 mt-1.5 pl-1">
                                            {log.supplier}
                                        </div>
                                    </td>

                                    {/* 4. Accountability (User) */}
                                    <td className="py-4 px-6 text-right align-top">
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="flex items-center gap-2 text-slate-900 font-medium text-sm">
                                                {log.user}
                                                <UserCircleIcon className="w-4 h-4 text-slate-400" />
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {log.role}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CASE FILE (Sheet) */}
            <Sheet open={isTimelineOpen} onOpenChange={setIsTimelineOpen}>
                <SheetContent className="sm:max-w-lg overflow-y-auto">
                    <SheetHeader className="mb-8 border-b border-slate-100 pb-6">
                        <SheetTitle className="text-xl">Händelsehistorik</SheetTitle>
                        <p className="text-sm text-slate-500">
                            Fullständig logg för ärende <span className="font-mono text-slate-700 font-semibold">{selectedInvoiceId}</span>
                        </p>
                    </SheetHeader>

                    <div className="relative border-l-2 border-slate-100 ml-4 space-y-10 pb-10">
                        {timelineLogs.map((log, idx) => (
                            <div key={log.id} className="relative pl-8">
                                {/* Dot on timeline */}
                                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white ring-1 ring-slate-100 shadow-sm ${log.category === 'system_signal' ? 'bg-amber-400' :
                                        log.category === 'human_decision' && log.action === 'rejected' ? 'bg-red-500' :
                                            log.category === 'human_decision' ? 'bg-emerald-500' :
                                                'bg-slate-300'
                                    }`} />

                                <span className="text-xs font-mono text-slate-400 mb-1.5 block">
                                    {log.date}
                                </span>

                                <h4 className={`text-sm font-bold ${log.category === 'system_signal' ? 'text-amber-900' :
                                        'text-slate-900'
                                    }`}>
                                    {log.type}
                                </h4>

                                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                    {log.description}
                                </p>

                                {log.comment && (
                                    <div className="mt-3 bg-slate-50 border-l-2 border-slate-300 pl-3 py-1 pr-2 text-sm text-slate-700 italic">
                                        "{log.comment}"
                                    </div>
                                )}

                                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                                    <UserCircleIcon className="w-3 h-3" />
                                    <span className="font-medium text-slate-700">{log.user}</span>
                                    <span className="text-slate-400">({log.role})</span>
                                </div>
                            </div>
                        ))}
                        {timelineLogs.length === 0 && (
                            <p className="pl-6 text-sm text-slate-400 italic">Ingen historik hittades.</p>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
