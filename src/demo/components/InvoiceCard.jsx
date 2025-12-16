// src/demo/components/InvoiceCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ShieldExclamationIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline'; // Using Heroicons as standard in project, mapping from user request

// Mapping status to styling
const STATUS_STYLES = {
    'approved': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: CheckCircleIcon, label: 'Approved' },
    'flagged': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', icon: ExclamationTriangleIcon, label: 'High Risk' },
    'needs_review': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', icon: ShieldExclamationIcon, label: 'Review' },
    'pending': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-100', icon: null, label: 'Pending' },
};

export default function InvoiceCard({ invoice, onClick }) {
    const style = STATUS_STYLES[invoice.status] || STATUS_STYLES['pending'];
    const StatusIcon = style.icon;
    const isRisk = invoice.status === 'flagged' || invoice.trustScore < 40;

    return (
        <motion.div
            layoutId={`invoice-card-${invoice.id}`}
            onClick={onClick}
            whileHover={{ y: -4, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            className={`
                group relative bg-white rounded-xl border p-5 cursor-pointer transition-all duration-200
                ${invoice.status === 'flagged' ? 'border-red-200 shadow-sm' : 'border-slate-200 hover:border-blue-300'}
            `}
        >
            {/* HOVER INDICATOR */}
            <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl bg-transparent group-hover:bg-blue-500 transition-colors" />

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {invoice.supplierName}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {invoice.invoiceId}
                    </p>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${style.bg} ${style.text} ${style.border}`}>
                    {StatusIcon && <StatusIcon className="w-3.5 h-3.5" />}
                    {style.label}
                </div>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <p className="text-xs text-slate-400 mb-1">Total Amount</p>
                    <p className="text-lg font-bold text-slate-900">
                        {Number(invoice.total).toLocaleString()}
                        <span className="text-xs font-normal text-slate-500 ml-1">{invoice.currency}</span>
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 mb-1">Due Date</p>
                    <p className="text-sm font-medium text-slate-700">
                        {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM d, yyyy') : '-'}
                    </p>
                </div>
            </div>

            {/* RISK BAR VISUALIZATION */}
            <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                    <span>Trust Score</span>
                    <span className={invoice.trustScore < 50 ? 'text-red-500' : 'text-emerald-600'}>
                        {invoice.trustScore}/100
                    </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${invoice.trustScore}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full ${invoice.trustScore < 40 ? 'bg-red-500' :
                                invoice.trustScore < 70 ? 'bg-amber-400' : 'bg-emerald-500'
                            }`}
                    />
                </div>
            </div>
        </motion.div>
    );
}
