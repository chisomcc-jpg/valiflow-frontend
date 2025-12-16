
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUpTrayIcon,
    DocumentTextIcon,
    XMarkIcon,
    SparklesIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ShieldCheckIcon,
    LockClosedIcon,
    BoltIcon
} from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// --- API INTEGRATION ---
const API_URL = "http://localhost:4000/api/demo/invoice-understanding"; // Dev URL

export default function DemoInvoiceUnderstanding({ onCancel, embedded = false }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle"); // idle | scanning | result | error
    const [result, setResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            // toast.info(`Fil vald: ${selectedFile.name}`); // DEBUG REMOVED
            console.log("File selected:", selectedFile.name);
            setFile(selectedFile);
            await performScan(selectedFile);
        }
    };

    const performScan = async (fileToScan) => {
        setStatus("scanning");

        const formData = new FormData();
        formData.append("file", fileToScan);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Upload failed");

            const data = await response.json();

            // Handle Backend Errors
            if (data.error) {
                if (data.error === "OCR_NOT_AVAILABLE") {
                    setResult({ meta: data.meta });
                    setStatus("ocr_required");
                    return;
                }
                throw new Error(data.error + (data.details ? `: ${data.details}` : ""));
            }

            // Map API response to UI format (V2.2 - IVC)
            // GUARD: Check if backend returned valid IVC payload
            if (!data.financials || !data.verification) {
                console.error("Backend Schema Mismatch. Received:", data);
                if (data.extraction) {
                    throw new Error("Backend still returning v2.1 Schema (Old Format). Please wait for backend restart.");
                }
                throw new Error("Invalid Response from Analysis Engine.");
            }

            setResult({
                financials: data.financials,
                verification: data.verification,
                meta: data.meta
            });

            // Artificial delay for "Scanning" feel
            setTimeout(() => {
                setStatus("result");
            }, 800);

        } catch (error) {
            console.error("Scan failed:", error);
            setStatus("error");
        }
    };

    const handleReset = () => {
        setFile(null);
        setStatus("idle");
        setResult(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Helper to format currency (Cents -> SEK string)
    const formatMoney = (cents, currency = "SEK") => {
        return (cents / 100).toLocaleString("sv-SE", { style: "currency", currency });
    };

    // Helper to render field value or fallback
    const renderValue = (val) => {
        if (val) return <span className="font-mono font-medium text-slate-900">{val}</span>;
        return <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Ej identifierad</span>;
    };

    // RENDER: IDLE (Embedded Inline Upload Box - CFO TRUST MODE)
    if (status === "idle") {
        return (
            <div className="w-full">
                <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group cursor-pointer bg-white rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-slate-50/50 transition-all duration-300 p-5 text-center relative overflow-hidden"
                >
                    {/* Background decoration (Smaller) */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50/50 rounded-bl-full -mr-8 -mt-8 pointer-events-none transition-transform group-hover:scale-110" />

                    <div className="relative z-10 flex flex-col items-center gap-3">
                        {/* Icon: Shield/Verification (Smaller) */}
                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                            <ShieldCheckIcon className="w-5 h-5 text-indigo-600" />
                        </div>

                        <div className="max-w-xs mx-auto space-y-1">
                            <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                Verifiera faktura & leverantör
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed mx-auto max-w-[240px]">
                                Simulera kontrollflödet i en isolerad miljö. Analys av innehåll, risk & compliance.
                            </p>
                        </div>

                        {/* Trust Microcopy (Compacted) */}
                        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-1">
                            <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                                <LockClosedIcon className="w-2.5 h-2.5 text-slate-400" />
                                Demo
                            </div>
                            <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded">
                                <BoltIcon className="w-2.5 h-2.5 text-slate-400" />
                                RAM-analys
                            </div>
                        </div>

                        <Button variant="outline" size="sm" className="mt-2 h-8 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold shadow-sm">
                            Välj PDF-underlag
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // RENDER: ACTIVE (Modal Popup)
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
                {/* COMPONENT HEADER */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <SparklesIcon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Riskscan av faktura</h2>
                            <p className="text-sm text-slate-500">Analysresultat & Beslutsunderlag</p>
                        </div>
                    </div>
                    <button onClick={handleReset} className="text-slate-400 hover:text-slate-600 rounded-full p-1 hover:bg-slate-200 transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-8">

                    {/* --- STATE: SCANNING --- */}
                    {status === "scanning" && (
                        <div className="max-w-md mx-auto text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-6 relative">
                                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                                <DocumentTextIcon className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 animate-pulse">Tolkar dokument...</h3>
                            <p className="text-slate-500 mt-2">Extraherar leverantörsdata, belopp och letar efter risker.</p>

                            <div className="mt-8 space-y-2 max-w-xs mx-auto">
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                        className="h-full bg-indigo-500 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- STATE: OCR REQUIRED --- */}
                    {status === "ocr_required" && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ExclamationTriangleIcon className="w-8 h-8 text-amber-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Ingen tolkbar text hittades</h3>
                            <p className="text-slate-500 mt-2 max-w-md mx-auto">
                                Filen innehåller ingen text som går att kopiera (inskannad bild?).
                                Valiflows demo stöder för närvarande endast digitala PDF:er med textlager.
                            </p>
                            <Button onClick={handleReset} variant="outline" className="mt-6">Försök igen</Button>
                        </div>
                    )}

                    {/* --- STATE: ERROR --- */}
                    {status === "error" && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Analys misslyckades</h3>
                            <p className="text-slate-500 mt-2">Kunde inte ansluta till servern eller tolka filen.</p>
                            <Button onClick={handleReset} variant="outline" className="mt-6">Försök igen</Button>
                        </div>
                    )}

                    {/* --- STATE: RESULT (VERIFICATION CARDS) --- */}
                    {status === "result" && result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* 1. FINANCIAL SUMMARY (TRUST ANCHOR) */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total</span>
                                    <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(result.financials.totalAmount, result.financials.currency)}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Moms</span>
                                    <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(result.financials.vatAmount, result.financials.currency)}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Netto</span>
                                    <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(result.financials.netAmount, result.financials.currency)}</div>
                                </div>
                            </div>

                            {/* 2. VERIFICATION CARDS LIST */}
                            <div className="space-y-3">
                                {result.verification.cards.map((card, idx) => (
                                    <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${card.status === 'pass' ? 'bg-green-50/50 border-green-100' :
                                            card.status === 'warn' ? 'bg-amber-50/50 border-amber-100' :
                                                'bg-red-50/50 border-red-100'
                                        }`}>
                                        <div className={`mt-0.5 shrink-0 ${card.status === 'pass' ? 'text-green-600' :
                                                card.status === 'warn' ? 'text-amber-600' :
                                                    'text-red-600'
                                            }`}>
                                            {card.status === 'pass' && <CheckCircleIcon className="w-6 h-6" />}
                                            {card.status === 'warn' && <ExclamationTriangleIcon className="w-6 h-6" />}
                                            {card.status === 'fail' && <XMarkIcon className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className={`text-sm font-bold ${card.status === 'pass' ? 'text-green-900' :
                                                    card.status === 'warn' ? 'text-amber-900' :
                                                        'text-red-900'
                                                }`}>{card.title}</h4>
                                            <p className={`text-sm mt-0.5 ${card.status === 'pass' ? 'text-green-800/80' :
                                                    card.status === 'warn' ? 'text-amber-800/80' :
                                                        'text-red-800/80'
                                                }`}>{card.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 3. CONTROLLER SUMMARY (CLOSURE) */}
                            {result.verification.summary && (
                                <div className="mt-4 p-5 bg-slate-50/80 rounded-xl border border-dashed border-slate-300">
                                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <ShieldCheckIcon className="w-3 h-3" />
                                        Systemutlåtande
                                    </h5>
                                    <p className="text-sm text-slate-600 italic font-serif leading-relaxed">
                                        "{result.verification.summary}"
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-center pt-4">
                                <Button variant="outline" onClick={handleReset} className="text-slate-600 border-slate-200 hover:bg-slate-50">
                                    Stäng & Rensa
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
