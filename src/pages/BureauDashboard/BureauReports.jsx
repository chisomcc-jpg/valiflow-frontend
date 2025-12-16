import React, { useEffect, useState } from "react";
import {
  DocumentChartBarIcon,
  ArrowPathIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  TableCellsIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  SparklesIcon,
  PrinterIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { bureauService } from "@/services/bureauService";
import { useBureauSSE } from "@/hooks/useBureauSSE";
import { toast } from "sonner";
import { api } from "@/services/api"; // For direct downloads if needed, or via service

/* ==========================================================
   📊 Valiflow Bureau – Reports Hub
   ========================================================== */
const VF = {
  navy: "#0A1E44",
  blue: "#1E5CB3",
  blueLight: "#EAF3FE",
  text: "#1E293B",
  bg: "#F4F7FB",
  green: "#22C55E",
};

export default function BureauReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL"); // ALL, RISK, SUPPLIER, COMPLIANCE

  // Quick View State
  const [selectedReport, setSelectedReport] = useState(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  // SSE
  // Assuming agencyId is available from context or user. ignoring agencyId prop for now as hook handles it via auth context often 
  // actually hook needs agencyId. We'll pass user.companyId if we had access to auth context here.
  // For now using null which hooks might skip, or fix hook usage pattern.
  // const { bureauEvents } = useBureauSSE(null); 

  // Let's reload reports on SSE event
  /*
  useEffect(() => {
    if (bureauEvents?.type === 'report_complete') {
        toast.success("Rapport genererad!");
        loadReports();
    }
  }, [bureauEvents]);
  */

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const data = await bureauService.getReports().catch(() => []);
      setReports(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleGenerate = async (type, title) => {
    toast.info(`Beställer rapport: ${title}...`);
    try {
      await bureauService.generateReport({ type, title });
      toast.success("Rapportjobb startat. Du får en notis när den är klar.");
      // Optimistic update or wait for SSE
      setTimeout(loadReports, 1000);
    } catch (e) {
      toast.error("Kunde inte starta rapportgeneratorn.");
    }
  };

  const handleAiSummary = async (report) => {
    setAiSummaryLoading(true);
    try {
      const updated = await bureauService.generateReportSummary(report.id);
      setSelectedReport(updated);
      toast.success("AI-sammanfattning genererad.");
      // Update list too
      setReports(reports.map(r => r.id === report.id ? updated : r));
    } catch (e) {
      toast.error("Kunde inte generera AI-analys.");
    } finally {
      setAiSummaryLoading(false);
    }
  };

  // Filter logic
  const filteredReports = reports.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "ALL" || r.type.includes(activeTab); // simplified matching
    return matchSearch && matchTab;
  });

  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <DocumentChartBarIcon className="w-7 h-7 text-indigo-600" />
              Rapporter
            </h1>
            <p className="text-slate-500 mt-1">Generera, exportera och dela revisionsklara rapporter.</p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Sök rapporter..."
                className="pl-9 pr-4 py-2 border rounded-lg text-sm w-64 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <button
              onClick={loadReports}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Genererade (30d)" value={reports.length} icon={DocumentCheckIcon} color="blue" />
          <StatCard label="Avvikelser funna" value="23" icon={ExclamationTriangleIcon} color="amber" />
          <StatCard label="Högriskleverantörer" value="5" icon={ShieldCheckIcon} color="red" />
          <StatCard label="Compliance-problem" value="12" icon={TableCellsIcon} color="indigo" />
        </div>

        {/* REPORT GENERATION GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cat A: Risk */}
          <ReportCategory title="Risk & Bedrägeri" color="border-red-200 bg-red-50/50">
            <ReportOption
              title="Portfolio Risk Report"
              desc="Samlad riskanalys för alla kunder."
              onGenerate={() => handleGenerate("RISK_PORTFOLIO", "Portfolio Risk Report")}
            />
            <ReportOption
              title="Fraud & Pattern Detection"
              desc="Dubbletter, kontoändringar och mönster."
              onGenerate={() => handleGenerate("FRAUD_PATTERNS", "Fraud Detection Report")}
            />
          </ReportCategory>

          {/* Cat B: Suppliers */}
          <ReportCategory title="Leverantörsanalys" color="border-blue-200 bg-blue-50/50">
            <ReportOption
              title="Supplier Portfolio Analysis"
              desc="Identifiera riskleverantörer och kluster."
              onGenerate={() => handleGenerate("SUPPLIER_PORTFOLIO", "Supplier Intelligence Report")}
            />
            <ReportOption
              title="Integrity & AML Check"
              desc="Due diligence och sanktionslistor."
              onGenerate={() => handleGenerate("SUPPLIER_INTEGRITY", "Supplier Integrity Check")}
            />
          </ReportCategory>

          {/* Cat C: Compliance */}
          <ReportCategory title="Compliance & Revision" color="border-green-200 bg-green-50/50">
            <ReportOption
              title="ViDA Readiness Report"
              desc="Validera metadata för EU-krav."
              onGenerate={() => handleGenerate("VIDA_CHECK", "ViDA Readiness Report")}
            />
            <ReportOption
              title="Full Audit Package"
              desc="Komplett revisionspaket för bokslut."
              onGenerate={() => handleGenerate("AUDIT_FULL", "Complete Audit Package")}
            />
          </ReportCategory>
        </div>

        {/* HISTORY TABLE */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">Rapporthistorik</h3>
            <div className="flex gap-2">
              {["ALL", "RISK", "SUPPLIER", "AUDIT"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-medium px-3 py-1 rounded-full ${activeTab === tab ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white text-xs text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Rapportnamn</th>
                <th className="px-6 py-3">Typ</th>
                <th className="px-6 py-3">Skapad av</th>
                <th className="px-6 py-3">Datum</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Åtgärd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {loading ? <tr><td colSpan={6} className="p-8 text-center text-slate-500">Laddar...</td></tr> :
                filteredReports.length === 0 ? <tr><td colSpan={6} className="p-8 text-center text-slate-500">Inga rapporter hittades.</td></tr> :
                  filteredReports.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 group transition cursor-pointer" onClick={() => setSelectedReport(r)}>
                      <td className="px-6 py-3 font-medium text-slate-700">{r.title}</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          {r.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-500">{r.createdBy}</td>
                      <td className="px-6 py-3 text-slate-500">{format(new Date(r.createdAt), "d MMM HH:mm", { locale: sv })}</td>
                      <td className="px-6 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button className="text-slate-400 hover:text-indigo-600 px-2">Öppna</button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK VIEW SLIDE-OVER */}
      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-50 flex justify-end"
            onClick={() => setSelectedReport(null)}
          >
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{selectedReport.title}</h2>
                  <p className="text-sm text-slate-500">{selectedReport.type} • {format(new Date(selectedReport.createdAt), "d MMM yyyy", { locale: sv })}</p>
                </div>
                <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-600"><XMarkIcon className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <StatusBadge status={selectedReport.status} large />

                {/* Files */}
                {selectedReport.status === "COMPLETED" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-700">Filer</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                        <DocumentArrowDownIcon className="w-4 h-4 text-red-500" /> PDF
                      </button>
                      <button className="flex items-center justify-center gap-2 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium text-slate-700 transition">
                        <TableCellsIcon className="w-4 h-4 text-green-500" /> Excel
                      </button>
                    </div>
                  </div>
                )}

                {/* AI Summary */}
                <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm">
                      <SparklesIcon className="w-4 h-4" /> AI-Sammanfattning
                    </div>
                    {!selectedReport.aiSummary && (
                      <button
                        onClick={() => handleAiSummary(selectedReport)}
                        disabled={aiSummaryLoading || selectedReport.status !== "COMPLETED"}
                        className="text-xs bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 disabled:opacity-50"
                      >
                        Generera
                      </button>
                    )}
                  </div>

                  {aiSummaryLoading ? (
                    <div className="flex items-center gap-2 text-sm text-slate-500 animate-pulse">
                      <SparklesIcon className="w-4 h-4 animate-spin" /> Analyserar data...
                    </div>
                  ) : selectedReport.aiSummary ? (
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {selectedReport.aiSummary}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Ingen sammanfattning genererad ännu.</p>
                  )}
                </div>

                {/* Metadata */}
                <div className="space-y-2 text-sm text-slate-600 pt-4 border-t border-slate-100">
                  <p><strong className="text-slate-800">Skapad av:</strong> {selectedReport.createdBy}</p>
                  <p><strong className="text-slate-800">Jobb-ID:</strong> {selectedReport.id}</p>
                  <p><strong className="text-slate-800">Omfattning:</strong> Hela portföljen</p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm">
                  Dela rapport
                </button>
                <button className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-600">
                  <PrinterIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================
   🧩 Sub-components
   ========================================================== */

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    amber: "text-amber-600 bg-amber-50",
    red: "text-red-600 bg-red-50",
    indigo: "text-indigo-600 bg-indigo-50"
  };
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colors[color] || colors.blue}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function ReportCategory({ title, children, color }) {
  return (
    <div className={`rounded-xl border p-5 ${color} space-y-4`}>
      <h3 className="font-semibold text-slate-800 flex items-center gap-2">
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function ReportOption({ title, desc, onGenerate }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition group">
      <h4 className="font-medium text-slate-800 text-sm">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 mb-3">{desc}</p>
      <button
        onClick={onGenerate}
        className="w-full py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100 transition"
      >
        Generera
      </button>
    </div>
  );
}

function StatusBadge({ status, large }) {
  const styles = {
    PENDING: "bg-slate-100 text-slate-600",
    PROCESSING: "bg-blue-100 text-blue-700 animate-pulse",
    COMPLETED: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700"
  };
  const labels = {
    PENDING: "Köad",
    PROCESSING: "Genererar...",
    COMPLETED: "Klar",
    FAILED: "Misslyckades"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${styles[status] || styles.PENDING} ${large ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'}`}>
      <span className={`rounded-full bg-current ${large ? 'w-2 h-2' : 'w-1.5 h-1.5'}`} />
      {labels[status] || status}
    </span>
  );
}
