// src/pages/Marketing/MarketingBureauCustomers.jsx
import React from "react";
import { marketingMockData } from "../../demo/marketingMockData";
import { Button } from "@/components/ui/button";
import { PlusIcon, FunnelIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function MarketingBureauCustomers() {
    const { customers } = marketingMockData;

    // Enhance customers with marketing-specific fields for the table
    const tableData = customers.map(c => ({
        ...c,
        statusDef: c.status === 'critical'
            ? { label: "Kritisk", color: "bg-red-100 text-red-700" }
            : c.status === 'warning'
                ? { label: "Varning", color: "bg-amber-100 text-amber-700" }
                : { label: "Aktiv", color: "bg-emerald-100 text-emerald-700" }
    })).sort((a, b) => b.risk - a.risk);

    return (
        <div className="space-y-6 pb-12 h-screen overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Kunder</h1>
                    <p className="text-slate-500 mt-1">
                        Hantera och övervaka samtliga anslutna kundbolag.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 text-slate-600">
                        <ArrowDownTrayIcon className="w-4 h-4" /> Exportera
                    </Button>
                    <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                        <PlusIcon className="w-4 h-4" /> Lägg till kund
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm shrink-0">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Sök kund..."
                        className="w-full pl-4 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <Button variant="ghost" className="text-slate-600 gap-2">
                    <FunnelIcon className="w-4 h-4" /> Filter
                </Button>
            </div>

            {/* Table Area - Forced to visually expanded state */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 overflow-hidden relative">
                <div className="overflow-auto h-full">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
                            <tr>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Företag</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Org.nr</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Riskvärde</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Fakturavolym</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Senast Aktiv</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tableData.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <td className="py-4 px-6 font-medium text-slate-900">
                                        {customer.name}
                                    </td>
                                    <td className="py-4 px-6 font-mono text-xs text-slate-500">
                                        {customer.orgNr}
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${customer.statusDef.color}`}>
                                            {customer.statusDef.label}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right font-bold">
                                        <span className={`${customer.risk > 50 ? 'text-red-600' : customer.risk > 20 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            {customer.risk}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right text-sm text-slate-700 tabular-nums">
                                        {(customer.volume / 1000).toLocaleString('sv-SE')} kSEK
                                    </td>
                                    <td className="py-4 px-6 text-right text-sm text-slate-500">
                                        {customer.lastActivity}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Detail Sheet Sidebar Mock (Visual) */}
                <div className="absolute top-0 right-0 h-full w-[400px] bg-white border-l border-slate-200 shadow-2xl p-6 overflow-y-auto z-20">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Scandia Energi AB</h2>
                            <p className="text-sm text-slate-500">559990-5531</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs ring-4 ring-red-50">
                            84
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Varningar</h4>
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-800 font-medium">
                                ⚠️ Avvikande betalningsmönster upptäckt idag 08:45.
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Nyckeltal</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="text-xs text-slate-500">Antal fakturor</div>
                                    <div className="text-lg font-bold text-slate-900">207</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="text-xs text-slate-500">Volym (30d)</div>
                                    <div className="text-lg font-bold text-slate-900">2.1M</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Senaste Fakturor</h4>
                            <ul className="space-y-2">
                                <li className="flex justify-between text-sm py-2 border-b border-slate-50">
                                    <span>INV-2023-001</span>
                                    <span className="font-mono">45 000 kr</span>
                                </li>
                                <li className="flex justify-between text-sm py-2 border-b border-slate-50">
                                    <span>INV-2023-002</span>
                                    <span className="font-mono">12 500 kr</span>
                                </li>
                                <li className="flex justify-between text-sm py-2 border-b border-slate-50">
                                    <span>INV-2023-003</span>
                                    <span className="font-mono text-red-600 font-bold">128 000 kr</span>
                                </li>
                            </ul>
                        </div>

                        <Button className="w-full">Gå till detaljvy</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
