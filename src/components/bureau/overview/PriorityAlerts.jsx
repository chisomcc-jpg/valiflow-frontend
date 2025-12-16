import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, ExclamationCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

function PriorityCard({ title, items, emptyText, renderItem, badgeColor, icon: Icon }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-slate-500" />}
                    <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">{title}</h3>
                </div>
                {items && items.length > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${badgeColor || 'bg-slate-200 text-slate-600'}`}>
                        {items.length} st
                    </span>
                )}
            </div>
            <div className="p-0 flex-1 flex flex-col">
                {(!items || items.length === 0) ? (
                    <div className="p-4 text-center">
                        <p className="text-sm text-slate-400 italic">{emptyText}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {items.map((item, idx) => (
                            <div key={item.id || idx} className="px-4 py-2 hover:bg-slate-50 transition-colors group">
                                {renderItem(item)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {items && items.length > 0 && (
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 text-right">
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs text-indigo-600 font-medium">
                        Visa alla &rarr;
                    </Button>
                </div>
            )}
        </div>
    );
}

export function PriorityAlerts({ data }) {
    if (!data) return <div className="h-48 w-full bg-slate-100 animate-pulse rounded-xl" />;

    return (
        <div className="space-y-4">
            {/* EXCEPTION RADAR CTA */}
            {data.exceptionCount > 0 && (
                <div className="bg-indigo-600 rounded-xl p-1 shadow-sm flex items-center justify-between pl-6 pr-2 py-2">
                    <div className="flex items-baseline gap-3 text-white">
                        <span className="font-bold text-lg">Hantera alla avvikelser ({data.exceptionCount})</span>
                        <span className="text-indigo-200 text-sm font-medium">Endast fakturor som kräver åtgärd</span>
                    </div>
                    <Button
                        onClick={() => window.location.href = "/bureau/radar"}
                        className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold border-none"
                    >
                        Öppna Radar &rarr;
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* 1. Kritiska kunder (Priority 1) */}
                <PriorityCard
                    title="Kunder: Kritiska risker"
                    items={data.criticalCustomers}
                    badgeColor="bg-red-100 text-red-700"
                    icon={ExclamationCircleIcon}
                    emptyText="Inga kunder med kritisk risk just nu."
                    renderItem={(c) => (
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{c.risk}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                    <span>{c.issue}</span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-slate-400">Upptäckt idag</span>
                                </p>
                            </div>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-300 hover:text-indigo-600 -mr-2">
                                <ChevronRightIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                />

                {/* 2. Leverantörsproblem (Priority 2) */}
                <PriorityCard
                    title="Leverantörsproblem"
                    items={data.supplierIssues}
                    badgeColor="bg-orange-100 text-orange-700"
                    icon={ExclamationCircleIcon}
                    emptyText="Inga akuta leverantörsproblem."
                    renderItem={(s) => (
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-slate-900 text-sm">{s.name}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                    <p className="text-xs text-slate-500">{s.issue}</p>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-300 hover:text-indigo-600 -mr-2">
                                <ChevronRightIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                />

                {/* 3. Nya avvikelser (Priority 3) */}
                <PriorityCard
                    title="Nya avvikande fakturor"
                    items={data.invoiceIssues}
                    badgeColor="bg-amber-100 text-amber-700"
                    icon={ClockIcon}
                    emptyText="Inga nya faktura-avvikelser."
                    renderItem={(inv) => (
                        <div className="flex justify-between items-center">
                            <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{inv.invoiceNumber}</span>
                                    <span className="text-xs font-semibold text-slate-700 truncate">{inv.customer}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 truncate">{inv.issue}</p>
                            </div>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-300 hover:text-indigo-600 -mr-2 flex-shrink-0">
                                <ChevronRightIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                />
            </div>
        </div>
    );
}
