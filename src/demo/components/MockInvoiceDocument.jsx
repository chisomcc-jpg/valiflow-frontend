import React from "react";
import { Building2 } from "lucide-react";

export default function MockInvoiceDocument({ invoice }) {
    if (!invoice) return null;

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: invoice.currency }).format(amount);
    };

    return (
        <div className="w-full bg-white text-slate-900 font-serif text-[10px] md:text-xs leading-relaxed overflow-hidden relative shadow-sm border border-slate-200 select-none cursor-default">
            {/* Aspect Ratio Container (A4 roughly 1:1.41) */}
            <div className="aspect-[1/1.41] flex flex-col p-8 md:p-12 relative">

                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div className="space-y-1">
                        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 font-sans uppercase">
                            {invoice.supplierName}
                        </h1>
                        <div className="text-slate-500 font-sans text-[10px]">
                            {invoice.supplierProfile?.location || "Stockholm"}
                            <br />
                            Org.nr: {invoice.vatNumber}
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest font-sans mb-1">Faktura</h2>
                        <table className="text-right ml-auto text-slate-600 font-sans">
                            <tbody>
                                <tr>
                                    <td className="pr-3 text-slate-400">Fakturanr:</td>
                                    <td className="font-medium font-mono">{invoice.metadata?.ocr || invoice.id}</td>
                                </tr>
                                <tr>
                                    <td className="pr-3 text-slate-400">Datum:</td>
                                    <td>{invoice.invoiceDate}</td>
                                </tr>
                                <tr>
                                    <td className="pr-3 text-slate-400">Förfallodag:</td>
                                    <td>{invoice.dueDate}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Addresses */}
                <div className="flex justify-between mb-16 font-sans">
                    <div className="w-1/3">
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Mottagare</p>
                        <p className="font-bold">Erat Företag AB</p>
                        <p>Storgatan 12</p>
                        <p>111 22 Stockholm</p>
                    </div>
                    <div className="w-1/3">
                        {/* Empty shipping or ref usually */}
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Er referens</p>
                        <p>{invoice.metadata?.reference || "-"}</p>
                        <p>Kundnr: {invoice.metadata?.customerNo}</p>
                    </div>
                </div>

                {/* Line Items */}
                <div className="flex-1">
                    <table className="w-full text-left font-sans mb-8">
                        <thead className="border-b-2 border-slate-100 text-slate-400 uppercase text-[9px] tracking-wider">
                            <tr>
                                <th className="py-2 w-1/2">Beskrivning</th>
                                <th className="py-2 text-right">Antal</th>
                                <th className="py-2 text-right">Pris</th>
                                <th className="py-2 text-right">Moms</th>
                                <th className="py-2 text-right">Belopp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {/* Generic Generated Lines based on context */}
                            {invoice.lineItems ? (
                                invoice.lineItems.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="py-3 font-medium text-slate-700">{item.desc}</td>
                                        <td className="py-3 text-right text-slate-500">{item.qty}</td>
                                        <td className="py-3 text-right text-slate-500">{formatCurrency(item.price)}</td>
                                        <td className="py-3 text-right text-slate-500">{item.vat}%</td>
                                        <td className="py-3 text-right font-medium text-slate-900">{formatCurrency(item.total)}</td>
                                    </tr>
                                ))
                            ) : (
                                // Fallback mock lines if not explicit in data
                                <>
                                    <tr>
                                        <td className="py-3 font-medium text-slate-700">Tjänster enl. specifikation</td>
                                        <td className="py-3 text-right text-slate-500">1</td>
                                        <td className="py-3 text-right text-slate-500">{formatCurrency(invoice.total * 0.8)}</td>
                                        <td className="py-3 text-right text-slate-500">25%</td>
                                        <td className="py-3 text-right font-medium text-slate-900">{formatCurrency(invoice.total * 0.8)}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 font-medium text-slate-700">Administrativ avgift</td>
                                        <td className="py-3 text-right text-slate-500">1</td>
                                        <td className="py-3 text-right text-slate-500">49,00 kr</td>
                                        <td className="py-3 text-right text-slate-500">25%</td>
                                        <td className="py-3 text-right font-medium text-slate-900">49,00 kr</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Totals */}
                <div className="flex justify-end border-t-2 border-slate-900 pt-4 mb-16">
                    <div className="w-1/2 md:w-1/3 space-y-2 font-sans">
                        <div className="flex justify-between text-slate-500">
                            <span>Netto:</span>
                            <span>{formatCurrency(invoice.total * 0.8)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                            <span>Moms (25%):</span>
                            <span>{formatCurrency(invoice.total * 0.2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200">
                            <span>ATT BETALA:</span>
                            <span>{formatCurrency(invoice.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="absolute bottom-8 left-8 right-8 border-t border-slate-100 pt-4 flex justify-between text-[9px] text-slate-400 font-sans uppercase tracking-wide">
                    <div>
                        <span className="font-bold text-slate-600 block mb-1">Betalning</span>
                        {invoice.metadata?.bankType}: {invoice.metadata?.bankAccount}
                        <br />
                        OCR: {invoice.metadata?.ocr}
                    </div>
                    <div>
                        <span className="font-bold text-slate-600 block mb-1">Kontakt</span>
                        {invoice.supplierProfile?.location || "Sverige"}
                        <br />
                        support@{invoice.supplierName.split(' ')[0].toLowerCase()}.se
                    </div>
                    <div className="text-right">
                        <span className="font-bold text-slate-600 block mb-1">Bolag</span>
                        Godkänd för F-skatt
                        <br />
                        Momsreg.nr: SE{invoice.vatNumber.replace(/-/g, '')}01
                    </div>
                </div>

                {/* Preview Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/20 mix-blend-overlay"></div>
            </div>
        </div>
    );
}
