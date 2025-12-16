// src/pages/Dashboard/invoices/Invoices.jsx
// --------------------------------------------------------------
// Valiflow Invoices v8.0 — Enterprise CFO Dashboard
// --------------------------------------------------------------

import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as invoiceService from "@/services/invoiceService";
import { scanningService } from "@/services/scanningService";
import { exportInvoicesCsv, exportInvoicesExcel, exportAuditPdf } from "@/services/exportService";

import { toast } from "sonner";

// UI Components
import KpiCard from "@/components/ui/KpiCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming shadcn styled
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Assuming styled calendar
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// New Components
import StatusTabs from "@/components/StatusTabs";
import IntegrationPopup from "@/components/IntegrationPopup";
import AISummarySection from "./components/AISummarySection";
import HeroUploadZone from "./components/HeroUploadZone";

import ActionsDropdown from "./components/ActionsDropdown";
import SimpleTooltip from "@/components/SimpleTooltip";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

// Invoice Components
import InvoiceDropzone from "@/components/InvoiceDropzone";
import InvoiceQuickView from "@/components/InvoiceQuickView";
import AIScanLoader from "@/components/AIScanLoader";

// Realtime Hooks
import useInvoiceSSE from "@/hooks/useInvoiceSSE";
import { useCompanyKpiSSE } from "@/hooks/useCompanyKpiSSE";

// UI Badges
import StatusBadge from "@/components/ui/StatusBadge";
import TrustBadge from "@/components/ui/TrustBadge";

// Icons
import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  BellAlertIcon,
  DocumentTextIcon,
  TableCellsIcon,
  ArrowPathIcon,
  FunnelIcon as FilterListIcon,
  BuildingOffice2Icon,
  CloudIcon,
  Squares2X2Icon,
  CalendarIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationCircleIcon,
  ShieldExclamationIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

import { format } from "date-fns";
import { sv } from "date-fns/locale";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

/* ============================================================================
   NORMALIZER
============================================================================ */
function normalizeInvoice(inv) {
  if (!inv) return inv;
  const pdfUrl = inv.pdfUrl || (inv.pdfPath ? `${API}${inv.pdfPath}` : null);

  const norm = {
    ...inv,
    createdAt: inv.createdAt ? new Date(inv.createdAt) : null,
    invoiceDate: inv.invoiceDate ? new Date(inv.invoiceDate) : null,
    dueDate: inv.dueDate ? new Date(inv.dueDate) : null,
    pdfUrl,
    aiComment: inv.aiComment ?? inv.explainComment ?? null,
    aiSummary: inv.aiSummary ?? inv.summary ?? null,
    aiRecommendedAction: inv.aiRecommendedAction ?? inv.recommendedAction ?? null,
    aiReasons: Array.isArray(inv.aiReasons) ? inv.aiReasons : inv.ai?.reasons ?? [],
    aiVersion: inv.aiVersion ?? null,
    trustConclusion: inv.trustConclusion ?? null // Ensure passing through
  };

  // REAL DATA MAPPING (No Mocks)
  // Derive list view columns from TrustConclusion
  let displayRiskType = "Standard";
  let displayMetaStatus = { label: "OK", color: "bg-emerald-100 text-emerald-700", icon: "check" };

  if (norm.trustConclusion) {
    const state = norm.trustConclusion.state;
    // Risk Type Column
    if (state === 'DEVIATION') {
      displayRiskType = norm.trustConclusion.reasonCodes?.[0] || "Risk";
    } else if (state === 'UNKNOWN') {
      displayRiskType = "Otillräcklig data";
    } else {
      displayRiskType = "Verifierad";
    }

    // Metadata Column
    if (state === 'UNKNOWN') {
      displayMetaStatus = { label: "Saknar data", color: "bg-slate-100 text-slate-600", icon: "alert" };
    } else if (state === 'DEVIATION') {
      displayMetaStatus = { label: "Avvikelse", color: "bg-amber-100 text-amber-700", icon: "warn" };
    }
  } else {
    // Legacy fallback based on riskScore
    if ((norm.riskScore || 0) > 50) {
      displayRiskType = "Risk (Legacy)";
      displayMetaStatus = { label: "Risk", color: "bg-amber-100 text-amber-700", icon: "warn" };
    }
  }

  return {
    ...norm,
    mockRiskType: displayRiskType, // Keeping prop name compatibility but finding real data
    mockMetaStatus: displayMetaStatus,
    mockChange: "n/a", // Removed fake relative time
    mockDeviation: (norm.trustConclusion?.state === 'DEVIATION') ? "Avvikelse" : "-"
  };
}

/* ============================================================================
   HELPERS
============================================================================ */
const fmtSEK = (v, c = "SEK") =>
  new Intl.NumberFormat("sv-SE", { style: "currency", currency: c }).format(Number(v || 0));

const fmtDateShort = (d) =>
  d ? format(new Date(d), "d MMM yyyy", { locale: sv }) : "—";

const isoDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

const getValiflowId = (inv) => {
  const raw = String(inv.invoiceId || inv.invoiceRef || inv.externalRef || inv.id || "");
  const last = raw.replace(/\D/g, "").slice(-4) || "0000";
  return `VF-${last.padStart(4, "0")}`;
};

const getRiskColor = (inv) => {
  if (inv.flagged) return "border-l-orange-500";
  const trust = inv.trustScore ?? 100 - (inv.riskScore || 0);
  if (trust >= 80) return "border-l-emerald-500";
  if (trust >= 50) return "border-l-yellow-400";
  return "border-l-red-500";
};

/* ============================================================================
   MAIN COMPONENT
============================================================================ */
export default function Invoices() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const user = token ? JSON.parse(atob(token.split(".")[1] || "")) : {};
  const companyId = user?.companyId;

  console.log("Invoices Debug: Context", { token: !!token, user, companyId });

  // -- Core Data --
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({ all: 0, approved: 0, flagged: 0, pending: 0, rejected: 0 }); // NEW
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);

  // -- Selection & QuickView --
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // -- Integration Popups --
  const [integrationService, setIntegrationService] = useState(null); // 'fortnox' | 'visma' | 'microsoft'

  // -- Filter State --
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [minTrust, setMinTrust] = useState(Number(searchParams.get("trust")) || 0);
  const [riskLevel, setRiskLevel] = useState(searchParams.get("risk") || "");
  const [startDate, setStartDate] = useState(searchParams.get("from") ? new Date(searchParams.get("from")) : null);
  const [endDate, setEndDate] = useState(searchParams.get("to") ? new Date(searchParams.get("to")) : null);
  const [sort, setSort] = useState(searchParams.get("sort") || "-createdAt");

  // -- Scan Theatre --
  const [scanItems, setScanItems] = useState([]);

  // -- KPI Data --
  const [summaryRest, setSummaryRest] = useState(null);
  const [summaryLive, setSummaryLive] = useState(null);
  const summary = summaryLive || summaryRest;

  const [sseEnabled, setSseEnabled] = useState(true);

  // Sync Filters to URL
  useEffect(() => {
    const p = {};
    if (query) p.q = query;
    if (status && status !== 'all') p.status = status;
    if (minTrust > 0) p.trust = minTrust;
    if (riskLevel) p.risk = riskLevel;
    if (startDate) p.from = isoDate(startDate);
    if (endDate) p.to = isoDate(endDate);
    if (sort) p.sort = sort;

    setSearchParams(p, { replace: true });
  }, [query, status, minTrust, riskLevel, startDate, endDate, sort, setSearchParams]);

  /* ============================================================================
     FETCH DATA
  ============================================================================ */
  // --- Fetch Data ---
  const loadInvoices = useCallback(async () => {
    console.log("Invoices Debug: loadInvoices called", { companyId, page: 1, limit: 50 });
    if (!user?.companyId) {
      console.warn("Invoices Debug: No companyId, aborting load");
      return;
    }
    setLoading(true);
    const page = 1;
    const limit = 50;
    try {
      const [invData, summaryData] = await Promise.all([
        invoiceService.getInvoices({
          page,
          limit,
          search: query,
          status: status !== "all" ? status : undefined,
          minTrust,
          startDate: startDate ? isoDate(startDate) : undefined,
          endDate: endDate ? isoDate(endDate) : undefined,
          companyId: user.companyId,
          sort: sort // Pass sort parameter
        }),
        invoiceService.getInvoiceSummary(user.companyId),
      ]);

      console.log("Invoices Debug: Data received", {
        invCount: invData.items?.length,
        summaryData
      });

      setInvoices((invData.items || []).map(normalizeInvoice));
      // distinct total count is not returned by list endpoint, using summary data or length
      setTotalCount(summaryData?.totalCount || summaryData?.totalInvoices || 0);

      if (summaryData) {
        setSummaryRest(summaryData); // Changed from setSummary to setSummaryRest
      }
    } catch (err) {
      console.error("Invoices Debug: Failed to load invoices or summary:", err);
      toast.error("Kunde inte hämta fakturadata.");
    } finally {
      setLoading(false);
    }
  }, [companyId, token, query, status, minTrust, startDate, endDate, sort, user.companyId]);

  const reloadSummary = useCallback(async () => {
    if (!companyId) return;
    try {
      const data = await invoiceService.getInvoiceSummary(companyId);
      if (data) setSummaryRest(data); // Changed from setSummary to setSummaryRest
    } catch (err) {
      console.error("reloadSummary failed", err);
    }
  }, [companyId]);

  const loadStats = useCallback(async () => {
    // Placeholder for stats loading if needed in future
    // For now we rely on summary
  }, []);

  useEffect(() => {
    loadInvoices();
    reloadSummary();
    loadStats(); // Load explicit stats for tabs
  }, [loadInvoices, reloadSummary, loadStats]);

  /* ============================================================================
     SSE HANDLING
  ============================================================================ */
  const handleSseEvent = useCallback((event, payload) => {
    if (event === "invoice_ingested") {
      setScanItems(prev => prev.map(p => {
        const targetId = payload.invoiceId || payload.id;
        const isMatch = (p.id == targetId) || ((p.status === 'uploading' || p.status === 'analyzing') && !p.realId);
        return isMatch ? { ...p, status: 'parsing', id: targetId, realId: true } : p;
      }));
      loadStats(); // Refresh counts
    }

    if (event === "invoice_analyzed") {
      const targetId = payload.invoiceId || payload.id;
      setScanItems(prev => prev.map(item => {
        // Relaxed matching: match by ID (string/number) OR if it's the only one analyzing
        const idMatch = String(item.id) === String(targetId) || Number(item.id) === Number(targetId);

        // Fallback: if we only have one item analyzing and it has no real ID yet, assume this is it
        const singleItemFallback = !item.realId && prev.length === 1 && (item.status === 'analyzing' || item.status === 'parsing');

        if (idMatch || singleItemFallback) {
          console.log("Matched item for analysis done:", item.id, "->", targetId);
          return {
            ...item,
            status: "done",
            id: targetId, // Ensure ID is synced to final DB ID
            ...payload,
            aiSummary: payload.aiSummary || payload.summary // Handle potential field name variance
          };
        }
        return item;
      }));
      loadInvoices();
      reloadSummary();
      loadStats(); // Refresh counts on analysis complete
    }
  }, [loadInvoices, reloadSummary, loadStats]);

  useInvoiceSSE(setInvoices, null, sseEnabled, handleSseEvent);
  useCompanyKpiSSE({ enabled: sseEnabled, companyId, onSummaryUpdated: setSummaryLive });

  // Auto-close Scan Theatre REMOVED per user request
  // We now rely on manual close

  /* ============================================================================
     HANDLERS
  ============================================================================ */
  const handleFilesDropped = async (files) => {
    // Append new files to queue instead of replacing
    const newItems = files.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      name: f.name,
      status: 'queued', // Wait for user to click Analyze
      file: f // Keep file ref for upload
    }));

    setScanItems(prev => [...prev, ...newItems]);
  };

  const handleStartAnalysis = async () => {
    const queued = scanItems.filter(i => i.status === 'queued');
    if (queued.length === 0) return;

    // Update UI to uploading
    setScanItems(prev => prev.map(i => i.status === 'queued' ? { ...i, status: 'uploading' } : i));

    try {
      const filesToUpload = queued.map(i => i.file);
      const response = await scanningService.uploadInvoices(filesToUpload, companyId);
      const uploaded = response.uploaded || [];

      // Update UI with real IDs and status
      setScanItems(prev => prev.map(item => {
        // Find matching uploaded item (index based matching as simple strategy, 
        // or match by filename if we had robust mapping)
        // Here we rely on order preservation which JS usually guarantees for map
        const queueIdx = queued.findIndex(q => q.id === item.id);
        if (queueIdx !== -1 && uploaded[queueIdx]) {
          // Fix: Backend returns top-level invoiceId
          const savedId = uploaded[queueIdx].invoiceId || uploaded[queueIdx].scan?.savedInvoice?.id;

          if (!savedId) console.warn("Missing invoiceId in response", uploaded[queueIdx]);

          return { ...item, status: 'analyzing', id: savedId, realId: true };
        }
        return item;
      }));
    } catch (err) {
      console.error(err);
      toast.error("Uppladdning misslyckades");
      // Revert to queued on failure
      setScanItems(prev => prev.map(i => i.status === 'uploading' ? { ...i, status: 'error' } : i));
    }
  };

  const openQuickView = (id) => {
    setSelectedInvoiceId(id);
    setIsQuickViewOpen(true);
  };

  const handleExport = (type) => {
    if (type === 'csv') exportInvoicesCsv(invoices);
    if (type === 'excel') exportInvoicesExcel(invoices);
    if (type === 'pdf') exportAuditPdf(invoices);
  };

  const sortIcon = (field) => (
    <span className="ml-1 opacity-50 text-[10px]">{sort === field ? "▲" : sort === `-${field}` ? "▼" : ""}</span>
  );

  const cycleSort = (field) => {
    if (sort === field) setSort(`-${field}`);
    else setSort(field);
  };

  // RISK PULS LOGIC
  const kpiTotal = summary?.totalInvoices || 1;
  const kpiSafe = summary?.riskDistribution?.low || 0;
  const kpiMedium = summary?.riskDistribution?.medium || 0;
  const kpiRisky = summary?.riskDistribution?.high || 0;

  // Debug to be removed later
  if (summary) console.log("Rendering Summary:", summary);

  /* ============================================================================
     RENDER
  ============================================================================ */
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <div className="max-w-[1600px] mx-auto py-10 px-8 lg:px-12 space-y-12">



        {/* --- PART 1 & 2: KPI + RISKPULS --- */}
        {summary && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* ... KPIs ... */}
            <KpiCard
              title="TOTALT ANTAL FAKTUROR"
              value={kpiTotal.toLocaleString()}
              icon={DocumentMagnifyingGlassIcon}
            />

            {/* KPI 2: AI Trust WITH TOOLTIP */}
            <div className="relative group">
              <KpiCard
                title="GENOMSNITTLIG AI-TRUST (90 DGR)"
                value={`${summary.avgTrustScore90d || 0}%`}
                trend={summary.trustStatus || "Stabil"}
                icon={ShieldCheckIcon}
              />
              <div className="absolute top-2 right-2">
                <SimpleTooltip content="AI-Trust är ett samlat betyg på hur pålitlig leverantören och fakturan bedöms vara baserat på historik och metadata.">
                  <QuestionMarkCircleIcon className="w-4 h-4 text-slate-300 hover:text-indigo-500 transition-colors cursor-help" />
                </SimpleTooltip>
              </div>
            </div>

            <KpiCard
              title="FLAGGADE FAKTUROR"
              value={summary.flaggedInvoices?.toString() || "0"}
              alert={summary.flaggedInvoices > 0}
              icon={ShieldExclamationIcon}
            />

            <KpiCard
              title="BEHÖVER ÅTGÄRD"
              value={summary.requiresReview?.toString() || "0"}
              icon={ExclamationCircleIcon}
              trend="Inväntar besked"
            />
          </div>
        )}

        {/* --- NEW: AI SUMMARY SECTION --- */}
        <AISummarySection summary={summary} />

        {/* --- PART 2: RISK PULS REMOVED --- */}

        {/* --- PART 3: HERO HEADER & UPLOAD --- */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
          {/* Left: Title & Context */}
          <div className="xl:col-span-1 flex flex-col justify-center space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fakturaöversikt</h1>
              <p className="text-slate-500 text-base mt-2 leading-relaxed">
                Hantera inkommande fakturor, attestera betalningar och övervaka risker i realtid.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Importera från ERP</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="h-10 text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all">
                  <BuildingOffice2Icon className="w-4 h-4 mr-2 text-slate-400 group-hover:text-indigo-500" />
                  Koppla Fortnox
                </Button>
                <Button variant="outline" className="h-10 text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all">
                  <CloudIcon className="w-4 h-4 mr-2 text-slate-400 group-hover:text-indigo-500" />
                  Visma Spcs
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Hero Upload Zone */}
          <div className="xl:col-span-2">
            <HeroUploadZone
              token={token}
              onFilesSelected={handleFilesDropped}
            />
          </div>
        </div>

        {/* --- PART 4: FILTER BAR --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col xl:flex-row justify-between xl:items-center gap-4">

          {/* Left: Search + Status */}
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Sök fakturor..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9 h-10 w-full md:w-64 border-slate-200 focus:border-indigo-300 rounded-lg text-sm"
              />
            </div>

            <StatusTabs
              current={status}
              onChange={setStatus}
              stats={{
                all: summary?.totalInvoices || 0,
                approved: summary?.approvedInvoices || 12, // Mocking approved for now if missing
                flagged: summary?.flaggedInvoices || 0,
                pending: summary?.requiresReview || 0,
                rejected: summary?.rejectedInvoices || 3 // Mocking rejected for now
              }}
            />
          </div>

          {/* Right: Advanced Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {/* Trust Slider Dropped per request */}

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={`h-10 text-slate-600 border-slate-200 gap-2 ${!startDate && "text-slate-500"}`}>
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  {startDate ? format(startDate, "d MMM y") : "Välj period"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="range" selected={{ from: startDate, to: endDate }} onSelect={(r) => { setStartDate(r?.from); setEndDate(r?.to); }} numberOfMonths={2} />
              </PopoverContent>
            </Popover>

            {/* Export */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 text-slate-600 border-slate-200 gap-2">
                  <ArrowDownTrayIcon className="w-4 h-4 text-slate-400" />
                  Exportera
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport('csv')}>CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>Excel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* --- PART 5: INVOICE TABLE --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible z-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold w-10">Status</th>
                <th className="py-4 px-6 font-semibold">Valiflow-ID</th>
                <th className="py-4 px-6 font-semibold">Leverantör</th>
                <th className="py-4 px-6 font-semibold">Risktyp</th>
                <th className="py-4 px-6 font-semibold">Metadata</th>
                <th className="py-4 px-6 font-semibold hidden lg:table-cell">Senast Ändrad</th>
                <th className="py-4 px-6 font-semibold text-right">Belopp</th>
                <th className="py-4 px-6 font-semibold text-right">Åtgärder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                // Skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6" colSpan={8}><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    Inga fakturor hittades för vald period.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => { setSelectedInvoiceId(inv.id); setIsQuickViewOpen(true); }}
                    className="hover:bg-indigo-50/40 transition-colors group cursor-pointer border-b border-slate-100 last:border-0 relative z-0"
                  >
                    <td className="py-4 px-6">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">
                      {getValiflowId(inv)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800 text-sm">{inv.supplierName}</div>

                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        {inv.riskScore > 50 && <ExclamationTriangleIcon className="w-4 h-4 text-amber-500" />}
                        <span className={`text-xs font-medium ${inv.riskScore > 50 ? 'text-amber-700' : 'text-slate-600'}`}>
                          {inv.mockRiskType}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide inline-flex items-center gap-1 ${inv.mockMetaStatus?.color}`}>
                        {inv.mockMetaStatus?.label === "OK" && <ShieldCheckIcon className="w-3 h-3" />}
                        {inv.mockMetaStatus?.label}
                      </span>
                    </td>
                    <td className="py-4 px-6 hidden lg:table-cell text-xs text-slate-500">
                      {inv.mockChange}
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-slate-900 text-sm font-mono">
                      {inv.total?.toLocaleString()} {inv.currency}
                    </td>
                    <td className="py-4 px-6 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="relative z-10">
                        <ActionsDropdown
                          invoice={inv}
                          onOpen={openQuickView}
                          onFlag={(id) => toast.loading(`Flaggar faktura ${id}...`)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Scan Theatre */}
        <AnimatePresence>
          {
            scanItems.length > 0 && (
              <AIScanLoader
                items={scanItems}
                onClose={() => setScanItems([])}
                onAnalyze={handleStartAnalysis}
                onAddFiles={handleFilesDropped}
              />
            )
          }
        </AnimatePresence>

        {/* Quick View Sidebar */}
        <AnimatePresence>
          {isQuickViewOpen && selectedInvoiceId && (
            <InvoiceQuickView
              invoiceId={selectedInvoiceId} // Uses default export
              isOpen={isQuickViewOpen}      // Passed as prop
              onClose={() => {
                setIsQuickViewOpen(false);
                setSelectedInvoiceId(null);
              }}
              onUpdate={() => {
                loadInvoices();
                reloadSummary();
              }}
            />
          )
          }
        </AnimatePresence>

        {/* Integration Popup */}
        <AnimatePresence>
          {integrationService && (
            <IntegrationPopup
              service={integrationService}
              onClose={() => setIntegrationService(null)}
              onSuccess={() => {
                toast.success("Integration successful!");
                setIntegrationService(null);
                loadInvoices();
                reloadSummary();
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

