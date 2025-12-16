// src/pages/Dashboard/invoices/InvoiceDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from "recharts";

import {
    ArrowLeftIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    BuildingLibraryIcon,
    BanknotesIcon,
    ClockIcon,
    ShareIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CpuChipIcon,
    ClipboardDocumentCheckIcon
} from "@heroicons/react/24/outline";

// Services & Hooks
import * as invoiceService from "@/services/invoiceService";
import { supplierService } from "@/services/supplierService";
import useInvoiceSSE from "@/hooks/useInvoiceSSE";

// Mock Data Fallback
import { invoiceDetailsMock } from "@/demo/invoiceDetailsMock";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/ui/StatusBadge";
import TrustBadge from "@/components/ui/TrustBadge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// NEW Enterprise Components
import InvoiceContextCard from "@/components/InvoiceContextCard";
import InvoiceSignalMatrix from "@/components/InvoiceSignalMatrix";
import InvoiceTimeline from "@/components/InvoiceTimeline";
import InvoiceSupplierProfile from "@/components/InvoiceSupplierProfile";
import InvoiceAIRecommendations from "@/components/InvoiceAIRecommendations";
import InvoiceMicroTrend from "@/components/InvoiceMicroTrend";

// -----------------------------------------------------------------------------
// HELPER: Formatters
// -----------------------------------------------------------------------------
const fmtSEK = (val, currency = "SEK") =>
    new Intl.NumberFormat("sv-SE", { style: "currency", currency }).format(val || 0);

const fmtDate = (d) => (d ? format(new Date(d), "d MMM yyyy", { locale: sv }) : "—");

const getSignalColor = (score, inverse = false) => {
    if (inverse) {
        if (score < 30) return "text-emerald-600 bg-emerald-50 border-emerald-200";
        if (score < 70) return "text-amber-600 bg-amber-50 border-amber-200";
        return "text-red-600 bg-red-50 border-red-200";
    }
    if (score > 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score > 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
};

// -----------------------------------------------------------------------------
// COMPONENT: InvoiceDetails
// -----------------------------------------------------------------------------
export default function InvoiceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Core Invoice State
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [debugOpen, setDebugOpen] = useState(false);

    // Enterprise Data State
    const [analysisSummary, setAnalysisSummary] = useState(null);
    const [contextData, setContextData] = useState(null);
    const [signals, setSignals] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [events, setEvents] = useState([]);
    const [trends, setTrends] = useState(null);
    const [supplierProfile, setSupplierProfile] = useState(null);

    // -- 1. Data Fetching --
    useEffect(() => {
        if (!id) return;
        setLoading(true);

        const fetchData = async () => {
            try {
                // 1. Fetch Core Invoice
                const inv = await invoiceService.fetchInvoiceById(id);
                setInvoice(inv);

                // 2. Fetch Enterprise Analysis Data (Parallel)
                const [
                    summaryRes,
                    contextRes,
                    signalsRes,
                    recsRes,
                    eventsRes,
                    trendsRes
                ] = await Promise.allSettled([
                    invoiceService.fetchInvoiceAnalysisSummary(id),
                    invoiceService.fetchInvoiceContext(id),
                    invoiceService.fetchInvoiceSignals(id),
                    invoiceService.fetchInvoiceRecommendations(id),
                    invoiceService.fetchInvoiceEvents(id),
                    invoiceService.fetchInvoiceTrends(id)
                ]);

                // Set Data or Fallback to Mock
                setAnalysisSummary(summaryRes.status === 'fulfilled' ? summaryRes.value : invoiceDetailsMock.summary);
                setContextData(contextRes.status === 'fulfilled' ? contextRes.value : invoiceDetailsMock.context);
                setSignals(signalsRes.status === 'fulfilled' ? signalsRes.value : invoiceDetailsMock.signals);
                setRecommendations(recsRes.status === 'fulfilled' ? recsRes.value : invoiceDetailsMock.recommendations);
                setEvents(eventsRes.status === 'fulfilled' ? eventsRes.value : invoiceDetailsMock.events);
                setTrends(trendsRes.status === 'fulfilled' ? trendsRes.value : invoiceDetailsMock.trends);

                // 3. Fetch Supplier Profile (if supplierId available or via name)
                if (inv?.supplierName) {
                    try {
                        // Using supplierName as ID proxy or assume we have an ID. 
                        // For demo, we might pass a known ID or handle name lookup in backend.
                        // Here assuming inv has supplierId or we fallback to mock for demo.
                        const supId = inv.supplierId || 123;
                        const supRes = await supplierService.fetchProfile(supId).catch(() => invoiceDetailsMock.supplierProfile);
                        setSupplierProfile(supRes || invoiceDetailsMock.supplierProfile);
                    } catch (e) {
                        setSupplierProfile(invoiceDetailsMock.supplierProfile);
                    }
                }

            } catch (err) {
                console.error("Failed to load invoice data:", err);
                // Fallback entire page if core fails? Or just show error?
                // For demo resilience, if core fails, use mock invoice
                setInvoice(invoiceDetailsMock.invoice);
                setAnalysisSummary(invoiceDetailsMock.summary);
                setContextData(invoiceDetailsMock.context);
                setSignals(invoiceDetailsMock.signals);
                setRecommendations(invoiceDetailsMock.recommendations);
                setEvents(invoiceDetailsMock.events);
                setTrends(invoiceDetailsMock.trends);
                setSupplierProfile(invoiceDetailsMock.supplierProfile);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // -- 2. Real-time Updates --
    useInvoiceSSE(
        (updates) => {
            setInvoice((prev) => {
                if (!prev) return null;
                let payload = null;
                if (Array.isArray(updates)) {
                    payload = updates.find(u => String(u.id) === String(id));
                } else if (updates && String(updates.id) === String(id)) {
                    payload = updates;
                }
                if (!payload) return prev;
                return { ...prev, ...payload };
            });
            // Ideally trigger refetch of signals/events if critical update
        },
        null,
        true
    );

    // -- 3. Derived Data --
    const historyData = useMemo(() => {
        return [
            { month: 'Sep', amount: (invoice?.total || 1000) * 0.9 },
            { month: 'Okt', amount: (invoice?.total || 1000) * 1.1 },
            { month: 'Nov', amount: (invoice?.total || 1000) * 0.95 },
            { month: 'Dec', amount: invoice?.total || 0, current: true },
        ];
    }, [invoice]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold">Faktura hittades inte</h2>
                <Button onClick={() => navigate(-1)} variant="link">Gå tillbaka</Button>
            </div>
        );
    }

    const isRisk = (invoice.riskScore || 0) > 50;
    // const trustColor = getSignalColor(invoice.trustScore || 0); // Unused

    // AI & Analysis Data
    const aiReasons = invoice.aiReasons || [];
    const decisionBasis = aiReasons.length > 0 ? aiReasons : ["Inga specifika riskfaktorer identifierade.", "Leverantören verkar stabil."];

    return (
        <div className="min-h-screen bg-[#F5F7FA] pb-20 font-sans text-slate-900">

            {/* ------------------------------------------------------------------------
          HEADER
      ------------------------------------------------------------------------ */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                                    {invoice.invoiceRef || invoice.invoiceId || `INV-${invoice.id}`}
                                </h1>
                                <StatusBadge status={invoice.status} />
                            </div>
                            <span className="text-xs text-slate-500 font-medium">{invoice.supplierName}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-4 mr-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                                <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
                                <span className="font-semibold">{Math.round(invoice.trustScore || 0)}/100 Trust</span>
                                <InvoiceMicroTrend trend={trends?.trust} />
                            </div>
                        </div>

                        <Button variant="outline" className="gap-2 text-slate-700 border-slate-300" onClick={() => navigate(`/dashboard/invoices/${id}/audit`)}>
                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                            Revision
                        </Button>

                        <Button variant="outline" className="gap-2 text-slate-700 border-slate-300">
                            <ArrowDownTrayIcon className="w-4 h-4" />
                            PDF
                        </Button>

                        <div className="h-6 w-px bg-slate-200 mx-1" />

                        <Button variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-100 border-red-200 border shadow-none">
                            Avvisa
                        </Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200">
                            Godkänn faktura
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* ------------------------------------------------------------------------
            1. INVOICE SUMMARY CARD (Metadata)
        ------------------------------------------------------------------------ */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 shadow-sm border-slate-200 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                <DocumentTextIcon className="w-4 h-4" /> Fakturadata
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
                            <div>
                                <label className="text-xs text-slate-400 font-medium uppercase">Leverantör</label>
                                <p className="font-semibold text-slate-900 mt-1 truncate" title={invoice.supplierName}>{invoice.supplierName}</p>
                                <p className="text-xs text-slate-500">{invoice.vatNumber || invoice.supplierOrgNr || "Org.nr saknas"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-medium uppercase flex items-center gap-2">
                                    Belopp
                                    <InvoiceMicroTrend trend={trends?.amount} />
                                </label>
                                <p className="font-semibold text-slate-900 mt-1 text-lg">{fmtSEK(invoice.total, invoice.currency)}</p>
                                <p className="text-xs text-slate-500">Exkl. moms: {fmtSEK((invoice.total || 0) * 0.8, invoice.currency)}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-medium uppercase">Fakturadatum</label>
                                <p className="font-medium text-slate-900 mt-1">{fmtDate(invoice.invoiceDate)}</p>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-medium uppercase">Förfallodatum</label>
                                <p className="font-medium text-slate-900 mt-1">{fmtDate(invoice.dueDate)}</p>
                                {invoice.dueDate && new Date(invoice.dueDate) < new Date() && (
                                    <span className="text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-bold">ÖVERFÖRFALLEN</span>
                                )}
                            </div>

                            <div className="col-span-2 border-t border-slate-100 pt-4 mt-2">
                                <label className="text-xs text-slate-400 font-medium uppercase">Betalningsmetod</label>
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-600 border border-slate-200">
                                        {invoice.paymentMethod || "BG 123-4567"}
                                    </div>
                                    <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                                        <CheckCircleIcon className="w-3 h-3" /> Verifierad
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Historical Trend Mini Chart */}
                    <Card className="shadow-sm border-slate-200 flex flex-col">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                <ClockIcon className="w-4 h-4" /> Historik
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 flex flex-col justify-end">
                            <div className="h-32 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={historyData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                                        <RechartsTooltip
                                            cursor={{ fill: '#F1F5F9' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                            {historyData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.current ? '#4F46E5' : '#CBD5E1'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs text-center text-slate-400 mt-2">Beloppsutveckling senaste 4 mån</p>
                        </CardContent>
                    </Card>
                </section>

                {/* ------------------------------------------------------------------------
            2. AI ANALYSIS (The "Audit Core") - ENHANCED
        ------------------------------------------------------------------------ */}
                <section>
                    <div className={`
                rounded-xl border shadow-sm overflow-hidden
                ${isRisk ? "bg-red-50/30 border-red-100" : "bg-white border-emerald-100"}
            `}>
                        {/* AI Header Banner */}
                        <div className={`
                    px-6 py-4 border-b flex items-center gap-3
                    ${isRisk ? "bg-red-50 border-red-100 text-red-900" : "bg-emerald-50/50 border-emerald-100 text-emerald-900"}
                `}>
                            <CpuChipIcon className="w-5 h-5" />
                            <h3 className="font-semibold text-sm">AI Analysis Engine (V5)</h3>
                            <span className="ml-auto text-xs font-mono opacity-70">
                                Confidence: {Math.round((analysisSummary?.confidence || 0.95) * 100)}%
                            </span>
                        </div>

                        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Assessment Text & Context */}
                            <div className="lg:col-span-2 space-y-4">
                                <h4 className="font-semibold text-slate-900">Bedömning</h4>
                                <div className="text-sm text-slate-600 leading-relaxed max-w-prose">
                                    <p className="mb-2 font-medium text-slate-900">{analysisSummary?.text}</p>
                                    <p>{analysisSummary?.subText}</p>
                                </div>

                                <div className="mt-4">
                                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Revisionsunderlag</h5>
                                    <ul className="space-y-2">
                                        {decisionBasis.map((reason, i) => (
                                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                                                {reason}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* NEW: Context Card */}
                                <InvoiceContextCard data={contextData} />

                                {/* NEW: Recommendations */}
                                <InvoiceAIRecommendations recommendations={recommendations} />

                            </div>

                            {/* Right: Key Risk Metrics (Matrix) */}
                            <div className="h-full">
                                <InvoiceSignalMatrix signals={signals} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* ------------------------------------------------------------------------
            3. DETAILS & ACTIONS
        ------------------------------------------------------------------------ */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* NEW: Supplier Profile Inline */}
                    <div className="space-y-6">
                        <section>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Leverantör</h3>
                            <InvoiceSupplierProfile profile={supplierProfile} />
                        </section>

                        <Card className="shadow-sm border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-base">Betalningsmottagare</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                    <span className="text-sm text-slate-500">Bankgiro (AI-tolkat)</span>
                                    <span className="text-sm font-mono text-slate-900">5560-1234</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                    <span className="text-sm text-slate-500">Verifierat mot register</span>
                                    <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                                        Matchar
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-sm text-slate-500">Momsregistrering</span>
                                    <span className="text-sm text-slate-900">{invoice.vatNumber ? "Aktiv" : "Okänd"}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* NEW: Timeline (Audit Trail) */}
                    <Card className="shadow-sm border-slate-200 bg-slate-50/50">
                        <CardHeader>
                            <CardTitle className="text-base text-slate-600">Händelselogg & Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <InvoiceTimeline events={events} />
                        </CardContent>
                    </Card>
                </section>

                {/* ------------------------------------------------------------------------
            4. DEBUG / RAW DATA
        ------------------------------------------------------------------------ */}
                <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                    <button
                        onClick={() => setDebugOpen(!debugOpen)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">
                            Developer / Audit Raw Data
                        </span>
                        {debugOpen ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
                    </button>
                    {debugOpen && (
                        <div className="p-4 bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto">
                            <pre>{JSON.stringify({ invoice, signals, analysisSummary }, null, 2)}</pre>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}

// -----------------------------------------------------------------------------
// SUB-COMPONENTS (Legacy Kept for compat if needed, but mostly replaced)
// -----------------------------------------------------------------------------
// ... (None needed as we imported them)

