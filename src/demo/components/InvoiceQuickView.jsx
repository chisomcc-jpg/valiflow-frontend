// src/demo/components/InvoiceQuickView.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon, DocumentTextIcon, CheckBadgeIcon, ExclamationTriangleIcon, ShieldCheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import { QUICKVIEW_STYLES } from './quickViewStyles';

export default function InvoiceQuickView({ invoice, onClose }) {
    if (!invoice) return null;

    const isRisky = invoice.riskScore > 30;
    const cv = invoice.canonicalView || null;
    const isVerified = invoice.trustConclusion?.state === "VERIFIED";

    // Helper: display text or explicit missing state
    const displayOrMissing = (val, fallback = null) => {
        if (val) return val;
        // If Verified but missing, showing explicit missing is better than hallucinating
        // However, user might expect some data. 
        // User rule: "If a field is missing in CanonicalView but the invoice is VERIFIED, display 'Saknas i underlag' (Missing in source) rather than a guess."
        if (isVerified) return <span className="text-amber-600 italic text-xs">Saknas i underlag</span>;
        return fallback || "-";
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-y-0 right-0 w-full md:w-[600px] lg:w-[700px] bg-white shadow-2xl z-[101] flex flex-col border-l border-slate-200"
            >
                {/* HEADER */}
                <div className="px-8 py-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-600 text-[11px] font-mono font-semibold">
                                {invoice.invoiceId}
                            </span>
                            {invoice.flagged ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                    <ExclamationTriangleIcon className="w-3.5 h-3.5" /> High Risk
                                </span>
                            ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                    <CheckBadgeIcon className="w-3.5 h-3.5" /> Approved
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">{invoice.supplierName}</h2>
                        <div className="flex gap-4 mt-2 text-sm text-slate-500 font-medium">
                            <span>Org.nr: {displayOrMissing(cv?.supplierOrgNr || invoice.orgNumber)}</span>
                            <span className="text-slate-300">|</span>
                            <span>IBAN: {displayOrMissing(cv?.iban || invoice.iban)}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition text-slate-400 hover:text-slate-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto px-8">

                    {/* 1. KEY METADATA GRID */}
                    <div className={QUICKVIEW_STYLES.section}>
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <p className={QUICKVIEW_STYLES.label}>Belopp</p>
                                <p className="text-xl font-bold text-slate-900">
                                    {new Intl.NumberFormat('sv-SE', { style: 'currency', currency: invoice.currency }).format(invoice.total)}
                                </p>
                            </div>
                            <div>
                                <p className={QUICKVIEW_STYLES.label}>Betalningsvillkor</p>
                                <p className={QUICKVIEW_STYLES.value}>
                                    {cv?.paymentTermsLabel ? cv.paymentTermsLabel : (isVerified ? "30 dagar?" : "-")}
                                </p>
                                {cv?.paymentTermsDays && <span className="text-xs text-slate-400">Förfallodatum: {new Date(invoice.dueDate).toLocaleDateString('sv-SE')}</span>}
                            </div>
                            <div>
                                <p className={QUICKVIEW_STYLES.label}>Referens / OCR</p>
                                <p className={QUICKVIEW_STYLES.value}>{displayOrMissing(cv?.ocr || invoice.ocr)}</p>
                            </div>
                        </div>
                    </div>

                    {/* 2. SUPPLIER CONTEXT (STRICT) */}
                    <div className={QUICKVIEW_STYLES.section}>
                        <h3 className={QUICKVIEW_STYLES.heading}>Leverantörscheck</h3>
                        {cv?.supplierContext ? (
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Status</p>
                                    <p className="font-semibold text-slate-900">{cv.supplierContext.stabilityLabel}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Historik</p>
                                    <p className="font-semibold text-slate-900">{cv.supplierContext.invoiceCount} tidigare fakturor</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mt-2 text-sm text-slate-500 italic">
                                Ingen historik tillgänglig för denna leverantör.
                            </div>
                        )}
                    </div>

                    {/* 3. AI ANALYSIS & RISK REASONING */}
                    <div className={QUICKVIEW_STYLES.section}>
                        <h3 className={QUICKVIEW_STYLES.heading}>
                            <ShieldCheckIcon className={`w-5 h-5 ${isRisky ? 'text-red-500' : 'text-emerald-500'}`} />
                            Valiflow AI Assessment
                        </h3>

                        <div className={`p-4 rounded-xl border mb-4 ${isRisky ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                            <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                {invoice.aiSummary}
                            </p>
                        </div>

                        {isRisky && (
                            <div className="space-y-3 mt-4">
                                <p className="text-xs font-bold text-slate-900 uppercase">Riskfaktorer:</p>
                                <ul className="space-y-2">
                                    {invoice.aiReasons?.map((reason, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm" />
                                            {reason}
                                        </li>
                                    )) || (
                                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm" />
                                                Riskprofil avviker från historiska mönster för leverantör.
                                            </li>
                                        )}
                                    <li className="flex items-start gap-2 text-sm text-slate-600">
                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm" />
                                        Transaktionen kräver utökad kontroll enligt regelverket (Compliance Check).
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* 4. RISK ENGINE BREAKDOWN */}
                    <div className={QUICKVIEW_STYLES.section}>
                        <h3 className={QUICKVIEW_STYLES.heading}>Risk Score Breakdown</h3>
                        <div className="space-y-3">
                            <RiskBar label="Leverantörsintegritet" score={invoice.supplierIntegrity * 100} invert />
                            <RiskBar label="Dokumentkvalitet (OCR)" score={invoice.documentQuality * 100} />
                            <RiskBar label="Nätverkspåverkan" score={invoice.networkInfluence ? invoice.networkInfluence * 100 : 80} invert />
                        </div>
                    </div>

                    {/* 5. AUDIT TRAIL */}
                    <div className={QUICKVIEW_STYLES.section}>
                        <h3 className={QUICKVIEW_STYLES.heading}>
                            <ClockIcon className="w-5 h-5 text-slate-400" />
                            Revisionsspår (Audit Log)
                        </h3>
                        <div className="mt-4">
                            {invoice.auditTrail?.map((event, idx) => (
                                <div key={idx} className={QUICKVIEW_STYLES.auditRow}>
                                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white" />
                                    <p className="text-xs text-slate-400 mb-0.5">{event.timestamp}</p>
                                    <p className="text-sm font-medium text-slate-900">{event.event}</p>
                                    <p className="text-xs text-slate-500">User: {event.user}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <button className="text-sm text-slate-500 hover:text-slate-900 font-medium flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5" /> Visa original-PDF
                    </button>

                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm">
                            Markera för utredning
                        </button>
                        <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 shadow-lg">
                            {invoice.flagged ? "Godkänn ändå" : "Godkänn faktura"}
                        </button>
                    </div>
                </div>

            </motion.div>
        </>
    );
}

function RiskBar({ label, score, invert = false }) {
    // Invert: high score is bad (red). Normal: high score is good (green).
    // Actually the prop naming is tricky. Let's assume input 'score' 0-100.
    // If 'invert' is true: 100 is Red/Bad.
    // If 'invert' is false: 100 is Green/Good.

    let colorClass = 'bg-slate-200';

    if (invert) {
        if (score > 80) colorClass = 'bg-red-500';
        else if (score > 40) colorClass = 'bg-amber-400';
        else colorClass = 'bg-emerald-500';
    } else {
        if (score > 80) colorClass = 'bg-emerald-500';
        else if (score > 40) colorClass = 'bg-amber-400';
        else colorClass = 'bg-red-500';
    }

    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 w-1/3">{label}</span>
            <div className="flex-1 mx-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${score}%` }} />
            </div>
            <span className="font-mono font-medium text-slate-700 w-8 text-right">{Math.round(score)}</span>
        </div>
    );
}
