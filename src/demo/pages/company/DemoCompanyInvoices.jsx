
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ExclamationCircleIcon,
  DocumentMagnifyingGlassIcon,
  ExclamationTriangleIcon,
  BuildingOffice2Icon,
  CloudIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  SparklesIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

// Reused UI Components
import KpiCard from "@/components/ui/KpiCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import StatusTabs from "@/components/StatusTabs";
import StatusBadge from "@/components/ui/StatusBadge";
import SimpleTooltip from "@/components/SimpleTooltip";
import ActionsDropdown from "@/pages/Dashboard/invoices/components/ActionsDropdown";
import DemoInvoiceQuickView from "@/demo/components/DemoInvoiceQuickView";
import DemoScanOverlay from "@/demo/components/DemoScanOverlay";
import DemoInvoiceUnderstanding from "@/demo/components/DemoInvoiceUnderstanding";

// Mock Data
import { demoInvoices, demoInvoiceSummary } from "@/demo/mocks/demoInvoicesMock";

export default function DemoCompanyInvoices() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Story Mode State
  const [isScanning, setIsScanning] = useState(false);
  const [newScanId, setNewScanId] = useState(null);
  // const [showDemoHints, setShowDemoHints] = useState(false); // New hint state
  const [showUnderstanding, setShowUnderstanding] = useState(false); // New Understanding demo state

  // Simple Filtering for Demo
  const filteredInvoices = demoInvoices.filter(inv => {
    // Hide the "scanned" invoice initially so we can "reveal" it
    if (newScanId && inv.id === newScanId && !isQuickViewOpen) return true; // Show it if just scanned? Actually normally we hide it until scan done. 
    // Let's keep it simple: Filter logic strictly filters the *list*.

    const matchesQuery = inv.supplierName.toLowerCase().includes(query.toLowerCase()) ||
      inv.id.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || inv.status === status;
    return matchesQuery && matchesStatus;
  }).sort((a, b) => b.riskScore - a.riskScore); // VISUAL RULE: Highest risk first

  // -- STORY ACTIONS --

  const startDemoScan = (type) => {
    // Pick an interesting invoice to "discover"
    // Let's use the 'needs_review' one (ID: INV-2024-002) as the demo subject 
    const targetId = "INV-2024-002";
    setNewScanId(targetId);
    setIsScanning(true);
  };

  const handleScanComplete = () => {
    setIsScanning(false);

    // Reveal Result
    const inv = demoInvoices.find(i => i.id === newScanId);
    if (inv) {
      // Inject highlight flag for this viewing session
      setSelectedInvoice({ ...inv, highlightAI: true });
      setIsQuickViewOpen(true);
      // setShowDemoHints(true); // Enable hints after scan
      toast.success("Analys slutförd", { description: "1 avvikelser hittades." });
    }
  };

  const openQuickView = (id) => {
    const inv = demoInvoices.find(i => i.id === id);
    if (inv) {
      setSelectedInvoice(inv);
      setIsQuickViewOpen(true);
      setNewScanId(null); // Reset scan highlight if opening manually
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <div className="max-w-[1600px] mx-auto py-10 px-8 lg:px-12 space-y-12">

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <KpiCard title="TOTALT ANTAL FAKTUROR" value={demoInvoiceSummary.totalInvoices.toLocaleString()} icon={DocumentMagnifyingGlassIcon} />
          <div className="relative group">
            <KpiCard title="GENOMSNITTLIG AI-TRUST (90 DGR)" value={`${demoInvoiceSummary.avgTrustScore90d}% `} trend={demoInvoiceSummary.trustStatus} icon={ShieldCheckIcon} />
            <div className="absolute top-2 right-2">
              <SimpleTooltip content="AI-Trust är ett samlat betyg på hur pålitlig leverantören och fakturan bedöms vara."><QuestionMarkCircleIcon className="w-4 h-4 text-slate-300" /></SimpleTooltip>
            </div>
          </div>
          <KpiCard title="FLAGGADE FAKTUROR" value={demoInvoiceSummary.flaggedInvoices.toString()} alert={demoInvoiceSummary.flaggedInvoices > 0} icon={ShieldExclamationIcon} />
          <KpiCard title="BEHÖVER ÅTGÄRD" value={demoInvoiceSummary.requiresReview.toString()} icon={ExclamationCircleIcon} trend="Inväntar besked" />
        </div>

        {/* DEMO HINT: KPIs */}
        {/* DEMO HINT: KPIs - REMOVED */}

        {/* HERO HEADER: The Entry Point */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
          <div className="xl:col-span-1 flex flex-col justify-center space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fakturaöversikt (Demo)</h1>
              <p className="text-slate-500 text-base mt-2 leading-relaxed">
                Hantera inkommande fakturor, attestera betalningar och övervaka risker i realtid.
              </p>
            </div>
          </div>

          {/* TWO ENTRY PATHS */}
          <div className="xl:col-span-2">
            <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-indigo-300 hover:bg-slate-50/80 relative">

              <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
                {/* Method A: Upload (Real AI Embedded) */}
                <div className="flex-1 w-full max-w-sm">
                  <DemoInvoiceUnderstanding embedded={true} />
                </div>

                <div className="h-full w-px bg-slate-200 hidden md:block min-h-[200px]" />

                {/* Method B: Example (Simulated) */}
                <div className="flex-1 flex flex-col items-center gap-4 group cursor-pointer pt-6 md:pt-0" onClick={() => startDemoScan('example')}>
                  <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <DocumentTextIcon className="w-8 h-8 text-slate-500 group-hover:text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Testa Valiflow scan med mock data</h3>
                    <p className="text-sm text-slate-500 mt-1">Se en validering av standardfaktura</p>
                  </div>
                  <Button variant="outline" className="mt-2 text-slate-600 border-slate-200 hover:bg-slate-50">Ladda exempeldata</Button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* FILTER BAR w/ Hint */}
        <div className="space-y-2">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col xl:flex-row justify-between xl:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <Input type="search" placeholder="Sök fakturor..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9 h-10 w-full md:w-64 border-slate-200 rounded-lg text-sm" />
              </div>
              <StatusTabs current={status} onChange={setStatus} stats={{ all: demoInvoiceSummary.totalInvoices, approved: 120, flagged: demoInvoiceSummary.flaggedInvoices, pending: demoInvoiceSummary.requiresReview, rejected: 5 }} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-10 text-slate-600 border-slate-200 gap-2"><CalendarIcon className="w-4 h-4 text-slate-400" /> Välj period</Button>
              <Button variant="outline" className="h-10 text-slate-600 border-slate-200 gap-2"><ArrowDownTrayIcon className="w-4 h-4 text-slate-400" /> Exportera</Button>
            </div>
          </div>

          {/* INLINE HINT */}
          {demoInvoiceSummary.flaggedInvoices > 0 && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-100 max-w-fit animate-in fade-in slide-in-from-top-1">
              <span className="font-bold">Tips:</span> Valiflow prioriterar de {demoInvoiceSummary.flaggedInvoices} fakturor som kräver din uppmärksamhet.
            </div>
          )}
        </div>

        {/* INVOICE TABLE */}
        <div className="space-y-2">
          {/* DEMO HINT: Table */}
          {/* DEMO HINT: Table - REMOVED */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible z-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6 font-medium text-slate-400 w-10">Status</th>
                  <th className="py-4 px-6 font-medium text-slate-400">ID</th>
                  <th className="py-4 px-6 font-medium text-slate-600">Leverantör</th>
                  <th className="py-4 px-6 font-medium text-slate-600">Riskbedömning</th>
                  <th className="py-4 px-6 font-medium text-slate-400">Info</th>
                  <th className="py-4 px-6 font-medium text-slate-400 hidden lg:table-cell">Förfallodatum</th>
                  <th className="py-4 px-6 font-medium text-slate-900 text-right">Belopp</th>
                  <th className="py-4 px-6 font-medium text-slate-400 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => openQuickView(inv.id)}
                    data-story-target={`invoice-row-${inv.id}`}
                    className={`group cursor-pointer border-b border-slate-100 last:border-0 transition-all duration-300 ${
                      // Highlight logic
                      inv.id === newScanId && !isScanning ? "bg-indigo-50/50 hover:bg-indigo-50" : "hover:bg-slate-50"
                      } `}
                  >
                    {/* Status: Muted if confirmed, focused if needs review */}
                    <td className={`py-4 px-6 transition-opacity ${inv.riskScore < 50 ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0' : ''}`}>
                      <StatusBadge status={inv.status} />
                    </td>

                    <td className="py-4 px-6 font-mono text-xs text-slate-300">{inv.id}</td>

                    <td className="py-4 px-6">
                      <div className={`text-sm ${inv.riskScore > 50 ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                        {inv.supplierName}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        {inv.riskScore > 50 ? (
                          <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-100/50">
                            <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{inv.mockRiskType}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Låg risk</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {/* Metadata: Only show if it ADDS value. Don't repeat "Risk" if we already showed it. */}
                      {inv.riskScore > 50 ? (
                        <span className="text-xs font-medium text-slate-500">{inv.mockChange}</span>
                      ) : (
                        <div className="flex items-center gap-1 opacity-40">
                          <ShieldCheckIcon className="w-3 h-3 text-slate-400" />
                          <span className="text-[10px] uppercase font-bold text-slate-400">Verifierad</span>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 hidden lg:table-cell text-xs text-slate-400">
                      {inv.dueDate}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <span className={`text-sm font-mono block ${inv.riskScore > 50 ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                        {inv.total.toLocaleString()} {inv.currency}
                      </span>
                    </td>

                    <td className="py-4 px-6 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <ActionsDropdown invoice={inv} onOpen={openQuickView} onFlag={() => toast.success("Faktura flaggad (Demo)")} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- DEMO COMPONENTS --- */}

          {/* 1. SCAN OVERLAY */}
          <DemoScanOverlay
            isOpen={isScanning}
            onComplete={handleScanComplete}
          />

          {/* 2. DEMO QUICK VIEW */}
          <DemoInvoiceQuickView
            isOpen={isQuickViewOpen}
            onClose={() => setIsQuickViewOpen(false)}
            demoInvoice={selectedInvoice}
          />

        </div>
      </div>
    </div>
  );
}

