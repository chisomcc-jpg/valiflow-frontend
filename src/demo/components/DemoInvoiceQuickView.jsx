import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { useDemoStory } from "../context/DemoStoryContext";
import {
    X,
    Building2,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    Activity,
    ShieldCheck,
    ShieldAlert,
    MapPin,
    ExternalLink,
    Eye,
    Download,
    Send,
    Ban,
    FileText,
    SparklesIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Reuse pure UI components where safe
import InvoiceTooltipInfo from "@/components/quickview/InvoiceTooltipInfo";
import InvoiceMicroTrend from "@/components/quickview/InvoiceMicroTrend";
// Demo Specific
import MockInvoiceDocument from "@/demo/components/MockInvoiceDocument";

export default function DemoInvoiceQuickView({ isOpen, onClose, demoInvoice }) {
    // const { advance, activeStep } = useDemoStory();
    const scrollContainerRef = useRef(null);

    // --- STORY TRIGGERS (DISABLED) ---
    /*
    React.useEffect(() => {
        if (isOpen && activeStep === 'anomaly') {
            advance('insight');
        }
    }, [isOpen, activeStep, advance]);
    
    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // Trigger action step if near bottom and currently on insight step
        if (activeStep === 'insight' && (scrollHeight - scrollTop - clientHeight < 100)) {
            advance('action');
        }
    };
    */

    const handleScroll = () => { }; // No-op

    // Auto-scroll to AI section if highlighted
    React.useEffect(() => {
        if (isOpen && demoInvoice?.highlightAI) {
            setTimeout(() => {
                const el = document.getElementById("ai-analysis-section");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 300);
        }
    }, [isOpen, demoInvoice]);

    if (!isOpen || !demoInvoice) return null;

    // Derive display state from mock data
    const riskState = demoInvoice.riskScore > 50 ? 'HIGH_RISK' : 'SAFE';

    const handleAction = (type) => {
        toast.success(`Demo Action: ${type === 'approve' ? 'Godkänd' : 'Avvisad'}`);
        onClose();
    };

    return (
        <AnimatePresence>
            {/* Backdrop - Subtle, no blur, allows context visibility */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/10 z-[45] transition-opacity"
            />

            {/* Slide-over Panel - Fixed, top-anchored, internal scroll */}
            <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
                className="fixed inset-y-0 right-0 w-full md:max-w-[560px] bg-white shadow-2xl z-[50] flex flex-col font-sans border-l border-slate-200"
            >

                {/* HEADER */}
                <div className="px-8 py-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="bg-indigo-600 text-white text-[10px] uppercase font-bold text-center py-1 absolute top-0 left-0 right-0 z-50">
                        DEMO MODE — Offline
                    </div>

                    {/* Top Row */}
                    <div className="flex justify-between items-start mb-4 mt-2">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                                {demoInvoice.id}
                            </span>

                            {riskState === 'HIGH_RISK' ? (
                                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                                    <ShieldAlert className="w-3 h-3 mr-1" /> Avvikelse
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                                    <ShieldCheck className="w-3 h-3 mr-1" /> Verifierad
                                </Badge>
                            )}

                            <span className="text-[10px] text-slate-400">
                                Analys uppdaterad: Just nu
                            </span>
                        </div>

                        <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Main Info */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {demoInvoice.supplierName}
                                {demoInvoice.supplierProfile?.isNew && (
                                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium border border-indigo-100">NY</span>
                                )}
                            </h2>
                            <div className="flex gap-4 mt-1 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5" />
                                    {demoInvoice.vatNumber || "556000-0000"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    Förfaller: {demoInvoice.dueDate}
                                </span>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                <span className="block text-2xl font-bold text-slate-900 tracking-tight">
                                    {demoInvoice.total.toLocaleString()} {demoInvoice.currency}
                                </span>
                                <InvoiceMicroTrend trend={demoInvoice.trustScore > 80 ? 'up' : 'down'} />
                            </div>
                            <div className="flex items-center justify-end gap-1.5 mt-1">
                                <span className={`text-xs font-bold ${riskState === 'HIGH_RISK' ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {demoInvoice.trustScore}% Trust
                                </span>
                                <div className={`w-2 h-2 rounded-full ${riskState === 'HIGH_RISK' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-slate-50/30"
                >

                    {/* Supplier Profile */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-medium mb-1">Land / Säte</p>
                            <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {demoInvoice.supplierProfile?.location || "Sverige"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase font-medium mb-1">Riskprofil</p>
                            <p className={`font-semibold ${riskState === 'HIGH_RISK' ? 'text-red-600' : 'text-emerald-600'}`}>
                                {demoInvoice.supplierProfile?.riskLevel}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-slate-400 uppercase font-medium mb-1">Status</p>
                            <div className="flex gap-1 flex-wrap">
                                {demoInvoice.supplierProfile?.tags?.map((t, i) => (
                                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded border border-slate-100 bg-slate-50 text-slate-600">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="space-y-3" id="ai-analysis-section">
                        {demoInvoice.highlightAI && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-indigo-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg mb-2"
                            >
                                <SparklesIcon className="w-4 h-4 text-indigo-300" />
                                Det här är vad Valiflow reagerade på i fakturan
                            </motion.div>
                        )}
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-indigo-500" />
                            AI-analys av fakturan
                        </h3>
                        <div className={`rounded-xl p-5 border ${riskState === 'HIGH_RISK' ? 'bg-red-50/50 border-red-100' : 'bg-indigo-50/50 border-indigo-100'
                            }`}>
                            <p className={`text-sm mb-4 font-medium leading-relaxed ${riskState === 'HIGH_RISK' ? 'text-red-900' : 'text-indigo-900'
                                }`}>
                                {demoInvoice.aiAnalysis?.summary || "Ingen analys tillgänglig."}
                            </p>
                            <div className="space-y-3 pl-1">
                                {demoInvoice.aiAnalysis?.bullets?.map((b, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm">
                                        <div className={`w-5 h-5 flex items-center justify-center rounded-full shrink-0 ${b.icon === 'check' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                            }`}>
                                            {b.icon === 'check' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className="text-slate-700">{b.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            Fakturadata
                        </h3>
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="grid grid-cols-2 divide-x divide-slate-100">
                                <div className="p-4 space-y-4">
                                    <div>
                                        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">OCR-nummer</label>
                                        <p className="text-sm font-mono text-slate-900">{demoInvoice.metadata?.ocr || "-"}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Kundnummer</label>
                                        <p className="text-sm font-mono text-slate-900">{demoInvoice.metadata?.customerNo || "-"}</p>
                                    </div>
                                </div>
                                <div className="p-4 space-y-4">
                                    <div>
                                        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Betalning till</label>
                                        <p className="text-sm font-mono text-slate-900">
                                            {demoInvoice.metadata?.bankType}: {demoInvoice.metadata?.bankAccount}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Villkor</label>
                                        <p className="text-sm text-slate-900">{demoInvoice.metadata?.terms}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PDF Preview */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Eye className="w-4 h-4 text-slate-400" />
                                Förhandsgranskning
                            </h3>
                            <span className="text-xs text-slate-400">PDF-visare (Mock)</span>
                        </div>

                        {/* Document Container */}
                        <div className="relative rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-slate-100 p-2 md:p-4">
                            <div className="pointer-events-none origin-top-left transform scale-[1] md:scale-100">
                                <MockInvoiceDocument invoice={demoInvoice} />
                            </div>

                            {/* Overlay to prevent interaction/copying to simulate "image" feel */}
                            <div className="absolute inset-0 z-10 bg-transparent" />
                        </div>
                    </div>

                    <div className="h-12" />
                </div>

                {/* FOOTER */}
                <div
                    className="p-5 border-t border-slate-200 bg-white sticky bottom-0 z-20 flex flex-col gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
                >
                    <div className="flex gap-3">
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="border-slate-300 text-slate-500">
                                <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="border-slate-300 text-slate-500">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex-1 flex justify-end gap-3">
                            <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50" onClick={() => handleAction('reject')}>
                                <Ban className="w-4 h-4 mr-2" />
                                Avvisa
                            </Button>
                            <Button className="bg-slate-800 hover:bg-slate-900 text-white shadow-lg" onClick={() => handleAction('approve')}>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Godkänn
                            </Button>
                        </div>
                    </div>
                </div>

            </motion.div>
        </AnimatePresence>
    );
}
