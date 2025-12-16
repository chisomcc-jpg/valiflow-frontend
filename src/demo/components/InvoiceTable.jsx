// src/demo/components/InvoiceTable.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ExclamationTriangleIcon,
    CheckBadgeIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: currency || 'SEK' }).format(amount);
};

const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat('sv-SE', { month: 'short', day: 'numeric' }).format(new Date(dateStr));
};

export default function InvoiceTable({ invoices, onSelect }) {
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedInvoices = [...invoices].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const getRiskColor = (score) => {
        if (score < 30) return 'bg-emerald-500'; // Low risk
        if (score < 70) return 'bg-amber-400';   // Medium
        return 'bg-red-500';                     // High
    };

    return (
        <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('invoiceId')}>ID</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('supplierName')}>Leverantör</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('trustScore')}>Trust / Risk</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('createdAt')}>Datum</th>
                            <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('total')}>Belopp</th>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100 transition" onClick={() => handleSort('status')}>Status</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {sortedInvoices.map((invoice) => (
                            <motion.tr
                                key={invoice.id}
                                layoutId={`row-${invoice.id}`}
                                onClick={() => onSelect(invoice)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.6)" }}
                                className="group cursor-pointer transition-colors relative"
                            >
                                {/* Left risk border indicator */}
                                <td className="absolute left-0 top-0 bottom-0 w-[4px]" style={{
                                    backgroundColor: invoice.riskScore > 70 ? '#ef4444' : invoice.riskScore > 30 ? '#fbbf24' : 'transparent'
                                }} />

                                {/* ID */}
                                <td className="px-6 py-4">
                                    <span className="font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                        {invoice.invoiceId}
                                    </span>
                                </td>

                                {/* Supplier */}
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        {/* Show Loading State for Parsing */}
                                        {invoice.pipelineStage === 'parsing' && !invoice.supplierName ? (
                                            <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                                        ) : (
                                            <>
                                                <span className="font-semibold text-sm text-slate-900">{invoice.supplierName}</span>
                                                <span className="text-[11px] text-slate-400 font-mono tracking-wide">{invoice.vatNumber}</span>
                                            </>
                                        )}
                                    </div>
                                </td>

                                {/* Trust / Risk */}
                                <td className="px-6 py-4">
                                    {invoice.pipelineStage === 'parsing' || invoice.pipelineStage === 'analyzing' ? (
                                        <span className="text-xs text-slate-400 italic flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                                            Beräknar...
                                        </span>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-slate-100 bg-white shadow-sm">
                                                <div className={`w-2 h-2 rounded-full ${getRiskColor(invoice.riskScore)}`} />
                                                <span className="text-xs font-semibold text-slate-700">{invoice.trustScore}</span>
                                            </div>
                                            {invoice.riskScore > 70 && (
                                                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 uppercase tracking-wide">High Risk</span>
                                            )}
                                        </div>
                                    )}
                                </td>

                                {/* Date */}
                                <td className="px-6 py-4">
                                    {invoice.pipelineStage === 'parsing' && !invoice.invoiceDate ? (
                                        <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                                    ) : (
                                        <div className="flex flex-col text-xs">
                                            <span className="text-slate-700">{formatDate(invoice.createdAt)}</span>
                                            <span className="text-slate-400">Förfaller {formatDate(invoice.dueDate)}</span>
                                        </div>
                                    )}
                                </td>

                                {/* Amount */}
                                <td className="px-6 py-4 text-right">
                                    {invoice.pipelineStage === 'parsing' && !invoice.total ? (
                                        <div className="h-4 w-16 bg-slate-100 rounded animate-pulse ml-auto" />
                                    ) : (
                                        <span className="font-mono font-medium text-sm text-slate-900">
                                            {formatCurrency(invoice.total, invoice.currency)}
                                        </span>
                                    )}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {invoice.pipelineStage === 'parsing' ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">Tolkar...</span>
                                        ) : invoice.pipelineStage === 'analyzing' ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 animate-pulse">Analyserar</span>
                                        ) : invoice.status === 'flagged' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                <ExclamationTriangleIcon className="w-3.5 h-3.5" /> Flagged
                                            </span>
                                        ) : invoice.status === 'needs_review' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                Review
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                <CheckBadgeIcon className="w-3.5 h-3.5" /> Approved
                                            </span>
                                        )}
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-blue-600 transition p-1 hover:bg-blue-50 rounded">
                                        <span className="sr-only">Quick View</span>
                                        <DocumentTextIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
