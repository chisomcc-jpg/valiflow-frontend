// src/demo/InvoicePageDemo.jsx
import React, { useState } from 'react';
import { useDemo } from './DemoContext';
import { demoEngine } from './demoEngine'; // Import the engine directly for actions
import InvoiceTable from './components/InvoiceTable';
import DashboardKPIs, { RiskPulseBar } from './components/DashboardKPIs';
import InvoiceQuickView from './components/InvoiceQuickView';
import DemoUploadModal from './components/DemoUploadModal'; // Import the modal
import { AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function InvoicePageDemo() {
    const { invoices, uploadModalOpen } = useDemo(); // Get modal state from context
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    // Filter Logic
    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.supplierName.toLowerCase().includes(search.toLowerCase()) ||
            inv.invoiceId.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'risk' && inv.riskScore > 30) ||
            (filter === 'flagged' && inv.flagged);
        return matchesSearch && matchesFilter;
    });

    const activeTabStyle = "text-slate-900 border-b-2 border-slate-900 font-semibold";
    const inactiveTabStyle = "text-slate-500 hover:text-slate-700 font-medium";

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans text-slate-900">
            {/* TOP NAVIGATION / HEADER (Mocked for dashboard feel) */}
            <header className="max-w-7xl mx-auto mb-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Invoice Audit Dashboard</h1>
                        <p className="text-slate-500 text-sm mt-1">Realtidsövervakning av leverantörsfakturor.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                            Exportera Rapport
                        </button>
                        <button
                            onClick={() => demoEngine.openUpload()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow hover:bg-indigo-700"
                        >
                            + Ladda upp faktura
                        </button>
                    </div>
                </div>

                {/* KPI SECTION */}
                <DashboardKPIs />

                {/* RISK PULSE */}
                <RiskPulseBar />
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="max-w-7xl mx-auto">

                {/* TOOLBAR & TABS */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center border-b border-slate-200 mb-6 gap-4">

                    {/* Tabs */}
                    <div className="flex gap-6 text-sm">
                        <button
                            onClick={() => setFilter('all')}
                            className={`pb-3 transition-colors ${filter === 'all' ? activeTabStyle : inactiveTabStyle}`}
                        >
                            Alla fakturor
                        </button>
                        <button
                            onClick={() => setFilter('flagged')}
                            className={`pb-3 transition-colors ${filter === 'flagged' ? activeTabStyle : inactiveTabStyle}`}
                        >
                            Kräver åtgärd <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">{invoices.filter(i => i.flagged).length}</span>
                        </button>
                        <button
                            onClick={() => setFilter('risk')}
                            className={`pb-3 transition-colors ${filter === 'risk' ? activeTabStyle : inactiveTabStyle}`}
                        >
                            Bevakning
                        </button>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex gap-3 pb-2">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Sök..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 w-64 bg-white border border-slate-200 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm">
                            <FunnelIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* INVOICE TABLE */}
                <InvoiceTable invoices={filteredInvoices} onSelect={setSelectedInvoice} />

                {/* FOOTER PAGINATION (Mock) */}
                <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
                    <p>Visar {filteredInvoices.length} av {invoices.length} fakturor</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded bg-white disabled:opacity-50">Föregående</button>
                        <button className="px-3 py-1 border border-slate-200 rounded bg-white disabled:opacity-50">Nästa</button>
                    </div>
                </div>

            </main>

            {/* QUICK VIEW SIDEBAR */}
            <AnimatePresence>
                {selectedInvoice && (
                    <InvoiceQuickView
                        invoice={selectedInvoice}
                        onClose={() => setSelectedInvoice(null)}
                    />
                )}
            </AnimatePresence>

            {/* UPLOAD MODAL */}
            <DemoUploadModal
                isOpen={uploadModalOpen}
                onClose={() => demoEngine.closeUpload()}
            />
        </div>
    );
}
