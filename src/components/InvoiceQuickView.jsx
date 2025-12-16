// src/components/InvoiceQuickView.jsx
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  Building2,
  Calendar,
  AlertTriangle,
  AlertTriangle as ExclamationTriangleIcon, // Aliasing for consistency with my snippet above or just use AlertTriangle
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
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import * as invoiceService from "@/services/invoiceService";
import { supplierService } from "@/services/supplierService";
import { getSmartMockContext } from "@/demo/invoiceQuickViewMock";
import InvoiceTooltipInfo from "./quickview/InvoiceTooltipInfo";
import InvoiceMicroTrend from "./quickview/InvoiceMicroTrend";
import InvoiceAIRecommendation from "./quickview/InvoiceAIRecommendation";

// ----------------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------------

export default function InvoiceQuickView({ invoiceId, isOpen, onClose, onUpdate, demoInvoice, advisoryContext }) {
  const [baseInvoice, setBaseInvoice] = useState(null);
  const [extendedData, setExtendedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFullscreenPdf, setIsFullscreenPdf] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (demoInvoice) {
        // DEMO MODE: Bypass fetch
        setBaseInvoice(demoInvoice);
        setLoading(false);
      } else if (invoiceId) {
        loadInvoice();
      }
    } else {
      setBaseInvoice(null);
      setExtendedData(null);
      setIsFullscreenPdf(false);
    }
  }, [isOpen, invoiceId, demoInvoice]);

  const loadInvoice = async () => {
    setLoading(true);
    try {
      // 1. Fetch Core Invoice
      const data = await invoiceService.fetchInvoiceById(invoiceId);
      setBaseInvoice(data);

      // 2. Fetch Extended Intelligence (Parallel)
      // We wrap these in try-catch blocks or use allSettled to ensure UI loads even if one fails
      const [context, trends, recs, supplierStats] = await Promise.all([
        invoiceService.fetchInvoiceContext(invoiceId).catch(() => null),
        invoiceService.fetchInvoiceTrends(invoiceId).catch(() => null),
        invoiceService.fetchInvoiceRecommendations(invoiceId).catch(() => null),
        data.companyId && data.supplierName // simplistic check, ideally we use supplierId
          ? supplierService.fetchStats(data.companyId).catch(() => null)
          : Promise.resolve(null)
      ]);

      setExtendedData({
        context,
        trends,
        recommendations: recs,
        supplierStats
      });

    } catch (err) {
      console.error(err);
      toast.error("Kunde inte ladda faktura");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Merge Real Data with Smart Mock Fallback
  const invoice = useMemo(() => {
    if (!baseInvoice) return null;

    // DEMO: If in pipeline stage, return raw baseInvoice (which has partial fields)
    if (baseInvoice.pipelineStage && baseInvoice.pipelineStage !== 'complete') {
      return {
        ...baseInvoice,
        // Defaults for UI safety
        supplierProfile: { tags: [], location: "..." },
        aiAnalysis: { summary: "Analys pågår...", bullets: [] },
        metadata: { ocr: baseInvoice.ocr, bankAccount: "..." },
        trends: {},
        total: baseInvoice.total
      };
    }

    // Generate smart mock data based on the invoice ID (FALLBACK ONLY)
    const mock = getSmartMockContext(baseInvoice);

    // Determines if we are in a real mode or simulation
    // If the invoice has a createdAt date and ID, it's likely real from DB
    const isRealData = !!baseInvoice.createdAt || !!baseInvoice.supplierId;

    return {
      ...baseInvoice,
      // Merge Extended Data or Fallback to Mock (only if not real data)
      context: extendedData?.context || (isRealData ? {} : mock.context),
      trends: extendedData?.trends || (isRealData ? {} : mock.trends),
      recommendations: extendedData?.recommendations || (isRealData ? [] : mock.recommendations),
      supplierStats: extendedData?.supplierStats || (isRealData ? {} : mock.supplierStats),

      // Ensure we have deep nested defaults if baseInvoice is thin
      supplierProfile: {
        location: baseInvoice.supplierAddress || baseInvoice.supplierCity || "Sverige",
        riskLevel: (baseInvoice.trustScore || 0) < 50 ? "Hög" : "Låg",
        isNew: baseInvoice.isNewSupplier ?? false,
        tags: baseInvoice.tags || ["Verifierad"],
        ...(baseInvoice.supplierProfile || {})
      },
      // STRICT: Override Invoice Reference from Canonical source if available
      invoiceRef: baseInvoice.canonicalView?.invoiceNumber || baseInvoice.invoiceNumber || baseInvoice.invoiceRef,

      aiAnalysis: {
        summary: baseInvoice.trustConclusion?.explanation || baseInvoice.aiAnalysis?.summary || "Ingen analys tillgänglig.",
        bullets: baseInvoice.aiAnalysis?.bullets || (baseInvoice.trustConclusion?.reasonCodes?.map(c => ({ text: c, icon: "warn" })) || [])
      },
      metadata: {

        ocr: baseInvoice.canonicalView?.ocr || baseInvoice.metadata?.ocr || baseInvoice.ocr || "Saknas",

        // STRICT Invoice Number
        invoiceNo: baseInvoice.canonicalView?.invoiceNumber ??
          (baseInvoice.trustConclusion?.state === 'VERIFIED' ? "Saknas i underlag" : (baseInvoice.invoiceNumber || "Saknas")),

        customerNo: baseInvoice.customerNo || "Saknas",

        // STRICT Payment Terms
        terms: baseInvoice.canonicalView?.paymentTermsLabel ??
          (baseInvoice.trustConclusion?.state === 'VERIFIED' ? "Saknas i underlag" : (baseInvoice.terms || "30 dagar")),

        reference: baseInvoice.reference || "Saknas",
        bankType: baseInvoice.canonicalView?.bankgiro ? "Bankgiro" : (baseInvoice.canonicalView?.plusgiro ? "Plusgiro" : "Konto"),
        bankAccount: baseInvoice.canonicalView?.bankgiro || baseInvoice.canonicalView?.plusgiro || baseInvoice.canonicalView?.iban || baseInvoice.bankAccount || "Saknas"
      },
      // Expose canonical object directly for debugging or advanced views
      canonicalView: baseInvoice.canonicalView,
      guardrailOutcome: baseInvoice.analysis?.guardrailOutcome || null,
      trustConclusion: baseInvoice.trustConclusion || { state: 'UNKNOWN', confidence: 'low', explanation: 'Analysdata saknas (Legacy)', reasonCodes: [] },
      isSimulation: isRealData ? false : !!mock,
      // SPLIT-STREAM: Detect if we have Score but no Summary logic
      isAiPending: ((baseInvoice.trustScore !== null && baseInvoice.trustScore !== undefined) &&
        !(baseInvoice.aiSummary || baseInvoice.trustConclusion?.explanation || baseInvoice.aiAnalysis?.summary) &&
        baseInvoice.status !== 'failed' && baseInvoice.status !== 'analysis_failed')
    };
  }, [baseInvoice, extendedData]);

  // RISK STATE LOGIC (Backend Driven)
  const riskState = useMemo(() => {
    if (!invoice) return 'SAFE';

    // 1. Guardrail Block (Highest Priority)
    if (invoice.guardrailOutcome && !invoice.guardrailOutcome.passed) return 'BLOCKED';
    if (invoice.status === 'BLOCKED') return 'BLOCKED';

    // 2. Backend Trust Conclusion
    const state = invoice.trustConclusion?.state;
    if (state === 'UNKNOWN') return 'UNKNOWN';
    if (state === 'DEVIATION') return 'HIGH_RISK';
    if (state === 'VERIFIED') return 'SAFE';

    // Fallback?
    return 'UNKNOWN';
  }, [invoice]);

  const handleOverride = async (decision, reason) => {
    if (!invoice?.id) return;
    const toastId = toast.loading("Bearbetar...");
    try {
      await invoiceService.overrideInvoice(invoice.id, { decision, reason });
      toast.success("Uppdaterad", { id: toastId, description: decision === 'approve' ? "Fakturan har godkänts manuellt." : "Risksignal har rapporterats." });
      onUpdate?.();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Kunde inte uppdatera", { id: toastId });
    }
  };


  // POLL FOR SLOW TRACK (AI Summary)
  useEffect(() => {
    let poller;
    if (isOpen && invoice?.isAiPending) {
      poller = setInterval(() => {
        invoiceService.fetchInvoiceById(invoiceId).then(newData => {
          // If we got summary, update!
          if (newData.aiSummary || newData.trustConclusion?.explanation) {
            setBaseInvoice(prev => ({ ...prev, ...newData }));
          }
        });
      }, 2000); // Check every 2s
    }
    return () => clearInterval(poller);
  }, [isOpen, invoice?.isAiPending, invoiceId]);

  // --------------------------------------------------------------------------
  // RESILIENCE & FAILURE STATES
  // --------------------------------------------------------------------------
  const [analysisError, setAnalysisError] = useState(null);
  const [isStuck, setIsStuck] = useState(false);
  const isAnalyzing = invoice?.pipelineStage === 'analyzing' || invoice?.pipelineStage === 'parsing';
  const isFileError = invoice?.status === 'FILE_ERROR';
  const isAnalysisFailed = invoice?.status === 'analysis_failed' || invoice?.status === 'failed';

  // Stuck Detection (Safety Net)
  useEffect(() => {
    if (isAnalyzing && isOpen) {
      setIsStuck(false);
      const timer = setTimeout(() => setIsStuck(true), 30000); // 30s threshold
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, isOpen]);

  // Handle Explicit Failures (Backend Event / Status)
  useEffect(() => {
    if (isFileError) setAnalysisError({ type: 'FILE', message: "Filen kunde inte läsas. Den verkar vara tom eller skadad." });
    else if (isAnalysisFailed) setAnalysisError({ type: 'AI', message: "Analysen misslyckades. Vänligen försök igen." });
    else setAnalysisError(null);
  }, [isFileError, isAnalysisFailed]);


  if (!isOpen) return null;

  // RENDER: CRITICAL FAILURE STATES
  if (analysisError || isFileError || isAnalysisFailed) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 flex flex-col p-8 border-l-4 border-red-500"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-500" />
              {analysisError?.type === 'FILE' ? "Filfel" : "Analysfel"}
            </h2>
            <Button variant="ghost" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
              <Ban className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {analysisError?.message || "Ett oväntat fel uppstod."}
            </h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              Systemet kunde inte slutföra bearbetningen av denna faktura. Detta loggas för granskning.
            </p>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={onClose}>Stäng</Button>
              {analysisError?.type === 'FILE' ? (
                <Button>Ladda upp ny fil</Button>
              ) : (
                <Button onClick={() => invoiceService.reanalyzeInvoice(invoiceId).then(() => { setAnalysisError(null); loadInvoice(); })}>Försök igen</Button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // RENDER: ANALYZING STATE (With Stuck Detection)
  if (isAnalyzing) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          className={`fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 flex flex-col p-8 border-l-4 ${isStuck ? 'border-amber-500' : 'border-indigo-500'}`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-slate-900">
              {isStuck ? "Analysen tar tid..." : "Analyserar faktura..."}
            </h2>
            <Button variant="ghost" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>

          <div className="space-y-6">
            {/* Stuck Warning */}
            {isStuck && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm">
                <Activity className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Analysen tar längre tid än normalt.</p>
                  <p className="opacity-90 mt-1">Vi jobbar vidare i bakgrunden. Du kan stänga fönstret och återkomma senare.</p>
                </div>
              </div>
            )}

            {/* Live Checklist */}
            <div className="space-y-4">
              <CheckItem label="Identifiera leverantör" status="done" />
              <CheckItem label="Tolka belopp och datum" status="done" />
              <CheckItem label="Validera betaluppgifter" status={invoice.pipelineStage === 'analyzing' ? 'active' : 'pending'} />
              <CheckItem label="Kontrollera mot historik" status={invoice.pipelineStage === 'analyzing' ? 'pending' : 'pending'} />
              <CheckItem label="Sök efter anomalier" status="pending" />
            </div>

            {/* PDF Preview Animation */}
            <div className="mt-8 aspect-[4/5] bg-slate-100 rounded-lg border border-slate-200 relative overflow-hidden opacity-50">
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className={`w-10 h-10 ${isStuck ? 'text-amber-500' : 'text-indigo-500'} animate-pulse`} />
              </div>
            </div>

            <p className="text-center text-sm text-slate-500 mt-4">
              {isStuck ? "Fortsätter försöka..." : "Valiflow Trust Engine bearbetar dokumentet..."}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }


  const isHighRisk = (invoice?.trustScore || 100) < 50;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 transition-opacity"
          />

          {/* 2. Slide-over Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full md:w-[650px] xl:w-[750px] bg-white shadow-2xl z-50 flex flex-col font-sans"
          >
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : !invoice ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                <AlertTriangle className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium text-lg text-slate-600">Kunde inte hitta fakturan</p>
                <Button variant="outline" className="mt-4" onClick={onClose}>Stäng</Button>
              </div>
            ) : (
              <>
                {/* --- (A) HEADER SECTION --- */}
                <div className="px-8 py-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  {/* Simulation Banner */}
                  {invoice.isSimulation && (
                    <div className="bg-indigo-600 text-white text-[10px] uppercase font-bold text-center py-1 absolute top-0 left-0 right-0 z-50">
                      SIMULATION MODE — Mock Data Active
                    </div>
                  )}

                  {/* ADVISORY MODE BANNER (Exception Radar) */}
                  {advisoryContext && (
                    <div className="bg-orange-50 border-b border-orange-100 px-8 py-3 -mx-8 -mt-6 mb-6 flex items-start gap-3">
                      <ExclamationTriangleIcon className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-orange-900">
                          {advisoryContext.title}
                        </p>
                        <p className="text-sm text-orange-800 mt-0.5">
                          {advisoryContext.reason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Top Row: ID & Close */}

                  {/* Top Row: ID & Close */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">
                        {invoiceId ? `VF-${invoiceId.toString().slice(-4).padStart(4, '0')}` : 'VF-0000'}
                      </span>

                      <InvoiceTooltipInfo text={
                        riskState === 'BLOCKED' ? "Spärrad av deterministiska regler." :
                          riskState === 'HIGH_RISK' ? "Hög risk. Kräver manuell granskning." :
                            riskState === 'UNCERTAIN' ? "AI osäker. Kontrollera uppgifter." :
                              "Säker. Inga avvikelser funna."
                      }>
                        {riskState === 'BLOCKED' && (
                          <Badge variant="destructive" className="bg-red-600 text-white hover:bg-red-700 border-red-800 cursor-help shadow-sm">
                            <Ban className="w-3 h-3 mr-1" /> SPÄRRAD
                          </Badge>
                        )}
                        {riskState === 'HIGH_RISK' && (
                          <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 cursor-help">
                            <ShieldAlert className="w-3 h-3 mr-1" /> Avvikelse
                          </Badge>
                        )}
                        {riskState === 'UNKNOWN' && (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300 cursor-help">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Otillräcklig data
                          </Badge>
                        )}
                        {riskState === 'SAFE' && (
                          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 cursor-help">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Verifierad
                          </Badge>
                        )}
                      </InvoiceTooltipInfo>

                      <span className="text-[10px] text-slate-400">
                        Analys uppdaterad: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Main Header Info */}
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        {invoice.supplierName}
                        {invoice.supplierProfile.isNew && (
                          <InvoiceTooltipInfo text="Detta är en ny leverantör i systemet.">
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium border border-indigo-100 cursor-help">NY</span>
                          </InvoiceTooltipInfo>
                        )}
                      </h2>
                      <div className="flex gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {invoice.vatNumber || "Org.nr saknas"}
                        </span>
                        <span className={`flex items-center gap-1.5 ${new Date(invoice.dueDate) < new Date() ? 'text-red-500 font-medium' : ''}`}>
                          <Calendar className="w-3.5 h-3.5" />
                          Förfaller: {new Date(invoice.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="block text-2xl font-bold text-slate-900 tracking-tight">
                          {new Intl.NumberFormat('sv-SE', { style: 'currency', currency: invoice.currency || 'SEK' }).format(invoice.total || 0)}
                        </span>
                        <InvoiceMicroTrend trend={invoice.trends?.amount} />
                      </div>

                      <div className="flex items-center justify-end gap-1.5 mt-1">
                        <InvoiceTooltipInfo text="Valiflow TrustScore™ – Beräknas endast vid fullständig data.">
                          {invoice.trustScore !== null ? (
                            <span className={`text-xs font-bold cursor-help ${riskState === 'HIGH_RISK' ? 'text-red-600' :
                              'text-emerald-600'
                              }`}>
                              {invoice.trustScore}% Trust
                            </span>
                          ) : (
                            <span className="text-xs font-mono text-slate-400 cursor-help">
                              N/A
                            </span>
                          )}
                        </InvoiceTooltipInfo>
                        <div className={`w-2 h-2 rounded-full ${riskState === 'HIGH_RISK' ? 'bg-red-500 animate-pulse' :
                          riskState === 'UNKNOWN' ? 'bg-slate-300' :
                            'bg-emerald-500'
                          }`} />
                        <InvoiceMicroTrend trend={invoice.trends?.trust} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- SCROLLABLE CONTENT --- */}
                <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-slate-50/30">

                  {/* (B) LEVERANTÖRSPROFIL (Mini Card) */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow cursor-default group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-medium mb-1">Land / Säte</p>
                        <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {invoice.supplierProfile.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-medium mb-1">Fakturor (90 dgr)</p>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-800">{invoice.supplierStats?.totalInvoices || 0} st</p>
                          <InvoiceMicroTrend trend={invoice.trends?.supplier} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-medium mb-1">Riskprofil</p>
                        <InvoiceTooltipInfo text={riskState === 'HIGH_RISK' ? "Hög risk baserat på anomalier." : "Normal riskprofil."}>
                          <p className={`font-semibold cursor-help ${riskState === 'HIGH_RISK' ? 'text-red-600' :
                            riskState === 'UNCERTAIN' ? 'text-amber-600' :
                              'text-emerald-600'
                            }`}>
                            {invoice.supplierProfile.riskLevel}
                          </p>
                        </InvoiceTooltipInfo>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-medium mb-1">Status</p>
                        <div className="flex gap-1 flex-wrap">
                          {invoice.supplierProfile.tags.map(t => (
                            <InvoiceTooltipInfo key={t} text={`Status: ${t}`}>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border border-slate-100 cursor-help ${t.includes("Nytt") ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                                {t}
                              </span>
                            </InvoiceTooltipInfo>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* Supplier Context Text (STRICT) */}
                    <div className="mt-3 pt-3 border-t border-slate-50 text-xs text-slate-400">
                      {invoice.canonicalView?.supplierContext ? (
                        <>
                          Leverantören har {invoice.canonicalView.supplierContext.invoiceCount} tidigare fakturor.
                          {invoice.canonicalView.supplierContext.stabilityLabel && ` Status: ${invoice.canonicalView.supplierContext.stabilityLabel}.`}
                        </>
                      ) : (
                        "Ingen verifierad leverantörshistorik tillgänglig."
                      )}
                    </div>
                  </div>

                  {/* (C) AI-ANALYS (HERO SECTION) */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-indigo-500" />
                      AI-analys av fakturan
                    </h3>
                    <div className={`rounded-xl p-5 border ${riskState === 'HIGH_RISK' ? 'bg-red-50/50 border-red-100' :
                      riskState === 'UNCERTAIN' ? 'bg-amber-50/50 border-amber-100' :
                        'bg-indigo-50/50 border-indigo-100'
                      }`}>
                      {/* SPLIT-STREAM LOADING STATE */
                        invoice.isAiPending ? (
                          <div className="space-y-4 animate-pulse pt-2 pb-2">
                            <div className="flex gap-2 items-center text-sm font-medium text-indigo-700">
                              <div className="w-4 h-4 rounded-full border-2 border-indigo-200 border-b-indigo-600 animate-spin"></div>
                              Genererar insikter...
                            </div>
                            <div className="h-4 bg-indigo-100/50 rounded w-3/4"></div>
                            <div className="h-4 bg-indigo-100/50 rounded w-1/2"></div>
                          </div>
                        ) : (
                          <>
                            {/* Summary Text */}
                            <p className={`text-sm mb-4 font-medium leading-relaxed ${riskState === 'HIGH_RISK' ? 'text-red-900' :
                              riskState === 'UNCERTAIN' ? 'text-amber-900' :
                                'text-indigo-900'
                              }`}>
                              {invoice.aiAnalysis.summary}
                            </p>

                            {/* Bullets */}
                            <div className="space-y-3 pl-1">
                              {invoice.aiAnalysis.bullets.map((b, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm">
                                  <div className={`mt-0.5 w-5 h-5 flex items-center justify-center rounded-full shrink-0 ${b.icon === 'check' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                    {b.icon === 'check' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                                    {b.icon === 'alert' && <ShieldAlert className="w-3.5 h-3.5 text-red-600" />}
                                    {b.icon === 'warn' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                                  </div>
                                  <span className="text-slate-700">{b.text}</span>
                                </div>
                              ))}
                            </div>

                            {/* AI Context Expansion (Safe Only) */}
                            {riskState === 'SAFE' && (
                              <div className="mt-4 pt-3 border-t border-indigo-100/50">
                                <p className="text-xs text-indigo-800/70 italic leading-relaxed">
                                  {invoice.context?.contextText || "Baserat på historik och stabil betalningshistorik bedöms fakturan följa ett normalt mönster."}
                                </p>
                              </div>
                            )}
                          </>
                        )}
                    </div>

                    {/* GUARDRAIL VIOLATIONS */}
                    {riskState === 'BLOCKED' && invoice.guardrailOutcome?.blockedBy?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-red-200">
                        <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-2">
                          BLOCKERANDE REGLER (MÅSTE HANTERAS)
                        </p>
                        <div className="space-y-2">
                          {invoice.guardrailOutcome.blockedBy.map((rule, idx) => (
                            <div key={idx} className="flex items-start gap-2 bg-red-100/50 p-2 rounded text-red-900 border border-red-200 text-sm">
                              <Ban className="w-4 h-4 mt-0.5 shrink-0" />
                              <div>
                                <span className="font-mono font-bold text-xs block">{rule.ruleId}</span>
                                <span>{rule.message}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* RECOMMENDATIONS */}
                    <InvoiceAIRecommendation recommendations={invoice.recommendations} />

                  </div>

                  {/* (D) METADATA FAKTA */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      Fakturadata
                    </h3>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="grid grid-cols-2 divide-x divide-slate-100">
                        {/* Col 1 */}
                        <div className="p-4 space-y-4">
                          <div>
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Fakturanummer</label>
                            <p className="text-sm font-mono text-slate-900">
                              {invoice.invoiceRef || "Saknas"}
                              {(!invoice.invoiceRef || invoice.invoiceRef === "Saknas") && <span className="text-slate-400 text-xs ml-2 font-sans italic">– Detta påverkar inte analysen</span>}
                            </p>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">OCR-nummer</label>
                            <p className="text-sm font-mono text-slate-900 flex items-center gap-2">
                              {invoice.metadata.ocr}
                              {invoice.metadata.ocr === "Saknas" && <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-200 bg-slate-50 h-5 px-1.5 font-normal">Saknas</Badge>}
                            </p>
                            {invoice.metadata.ocr === "Saknas" && <p className="text-[10px] text-slate-400 mt-0.5">Kan försvåra automatisk matchning.</p>}
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Kundnummer</label>
                            <p className="text-sm font-mono text-slate-900">{invoice.metadata.customerNo}</p>
                          </div>
                        </div>

                        {/* Col 2 */}
                        <div className="p-4 space-y-4">
                          <div>
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Betalningsmottagare</label>
                            <p className="text-sm font-mono text-slate-900">{invoice.metadata.bankType}: {invoice.metadata.bankAccount}</p>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Betalningsvillkor</label>
                            <p className="text-sm text-slate-900">{invoice.metadata.terms}</p>
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Referens</label>
                            <p className="text-sm text-slate-900">{invoice.metadata.reference}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* (E) PDF PREVIEW */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-slate-400" />
                        Förhandsgranskning
                      </h3>
                      <Button variant="link" className="h-auto p-0 text-indigo-600 text-xs" onClick={() => setIsFullscreenPdf(true)}>
                        Visa i fullskärm
                      </Button>
                    </div>
                    <div className="aspect-[4/5] w-full bg-slate-100 rounded-lg border border-slate-200 relative overflow-hidden group">
                      {invoice.pdfUrl ? (
                        <iframe
                          src={`${invoice.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="w-full h-full pointer-events-none group-hover:pointer-events-auto transition-all"
                          title="PDF Preview"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <FileText className="w-12 h-12 mb-2 opacity-50" />
                          <p className="text-sm">Ingen PDF tillgänglig</p>
                        </div>
                      )}

                      {/* Overlay Gradient */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  <div className="h-12" /> {/* Spacer */}
                </div>

                {/* (F) ACTION FOOTER */}
                <div className="p-5 border-t border-slate-200 bg-white sticky bottom-0 z-20 flex flex-col gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
                  <div className="flex gap-3">
                    {/* Secondary Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" className="border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-200">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-200">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Primary Actions */}
                    <div className="flex-1 flex justify-end gap-3">
                      {riskState === 'HIGH_RISK' ? (
                        <>
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => handleOverride("reject", "Avvisad av användare")}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Avvisa
                          </Button>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                            onClick={() => {
                              if (window.confirm("Är du säker på att du vill tvinga igenom denna högriskfaktura? Detta kommer att loggas.")) {
                                handleOverride("approve", "Force approve by user (Override High Risk)");
                              }
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Godkänn ändå (Force)
                          </Button>
                        </>
                      ) : riskState === 'BLOCKED' ? (
                        <>
                          <Button
                            variant="ghost"
                            className="text-slate-400 cursor-not-allowed"
                            disabled
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Auto-Attest Spärrad
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                            onClick={() => handleOverride("reject", "Blocked by Guardrails")}
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Bekräfta Avslag
                          </Button>
                        </>
                      ) : riskState === 'UNKNOWN' ? (
                        <>
                          <Button
                            variant="outline"
                            className="border-slate-300 text-slate-600 hover:bg-slate-50"
                            onClick={() => handleOverride("flag", "Flagged due to missing data")}
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Rapportera saknad info
                          </Button>
                          <Button
                            className="bg-slate-800 hover:bg-slate-900 text-white shadow-lg"
                            onClick={() => {
                              if (window.confirm("Data saknas för en säker bedömning. Vill du godkänna ändå?")) {
                                handleOverride("approve", "Manual approval (Unknown state)");
                              }
                            }}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Godkänn manuellt
                          </Button>
                        </>
                      ) : riskState === 'UNCERTAIN' ? (
                        <>
                          <Button
                            variant="outline"
                            className="border-amber-200 text-amber-700 hover:bg-amber-50"
                            onClick={() => handleOverride("flag", "User flagged as risk (Uncertain)")}
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Rapportera Risk
                          </Button>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                            onClick={() => handleOverride("approve", "Manually approved uncertain invoice")}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Godkänn
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleOverride("flag", "User reported risk on safe invoice")}
                          >
                            <ShieldAlert className="w-4 h-4 mr-2" />
                            Rapportera Risk
                          </Button>
                          <Button
                            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                            onClick={() => handleOverride("approve", "Routine approval")}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Attestera & Bokför
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
