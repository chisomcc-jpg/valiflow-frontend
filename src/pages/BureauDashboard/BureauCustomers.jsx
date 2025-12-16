import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  EllipsisHorizontalIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import { bureauService } from "@/services/bureauService";
import { useBureauSSE } from "@/hooks/useBureauSSE";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { CustomerStatusBadge } from "./components/CustomerStatusBadge";
import { CustomerRiskBadge } from "./components/CustomerRiskBadge";
import { CustomerDetailSheet } from "./components/CustomerDetailSheet";
import { toast } from "sonner";

const VF = {
  bg: "#F4F7FB",
};

export default function BureauCustomers({ demoMode = false, demoOverrideData }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const agencyId = user?.companyId;

  // Report Demo Mode
  useEffect(() => {
    if (demoMode) console.info("Valiflow Demo-läge aktivt (ingen backend).");
  }, [demoMode]);

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);

  // SSE Integration (Disabled in Demo Mode)
  const { lastEvent } = useBureauSSE(demoMode ? null : agencyId);

  useEffect(() => {
    if (demoMode) return; // Strict Safety

    if (lastEvent) {
      if (["customer_updated", "customer_risk_updated", "invoice_import_completed"].includes(lastEvent.type)) {
        fetchCustomers(false);
        if (lastEvent.type === "customer_risk_updated") {
          toast.info(`Risknivån uppdaterades för kund.`);
        }
      }
    }
  }, [lastEvent, demoMode]);

  // Filters
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Alla");
  const [riskFilter, setRiskFilter] = useState("Alla");
  const [sortOrder, setSortOrder] = useState("risk-desc"); // Default sort by highest risk

  // Sheet State
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Initial Load
  useEffect(() => {
    // If demo mode, skip agency check
    if (demoMode) {
      fetchCustomers(true);
      return;
    }
    if (!agencyId) return;
    fetchCustomers(true);
  }, [agencyId, demoMode]);

  async function fetchCustomers(initial = false) {
    // DEMO OVERRIDE
    if (demoMode) {
      if (demoOverrideData) {
        setCustomers(demoOverrideData);
        setAiSummary({
          active: demoOverrideData.length,
          risks: demoOverrideData.filter(c => c.riskLevel === "Hög").length,
          message: "Systemet övervakar automatiskt ändrade betalningsuppgifter."
        });
      }
      setLoading(false);
      return;
    }

    try {
      if (!initial) setRefreshing(true);
      const list = await bureauService.getAgencyCustomers();
      setCustomers(list || []);

      // Mock AI Summary (simplified)
      setAiSummary({
        active: list.length,
        risks: list.filter(c => c.riskLevel === "Hög").length,
        message: "Systemet övervakar automatiskt ändrade betalningsuppgifter."
      });

    } catch (err) {
      console.error("❌ Error fetching customers:", err);
      setCustomers([]);
      toast.error("Kunde inte hämta kundlistan.");
    } finally {
      if (initial) setLoading(false);
      setTimeout(() => setRefreshing(false), 400);
    }
  }

  // Computed Stats
  const stats = useMemo(() => {
    return {
      total: customers.length,
      highRisk: customers.filter(c => c.riskLevel === "Hög").length,
      metadataIssues: Math.floor(customers.length * 0.4), // Mock for demo
      invoices30d: customers.reduce((sum, c) => sum + (c.invoiceCount30d || 0), 0)
    };
  }, [customers]);

  // Filter Logic
  const filtered = useMemo(() => {
    let result = customers.filter((c) => {
      const q = query.toLowerCase();
      const matchesQuery = !query ||
        c.name?.toLowerCase().includes(q) ||
        c.orgNumber?.includes(q);

      const matchesStatus = statusFilter === "Alla" || c.status === statusFilter;
      const matchesRisk = riskFilter === "Alla" || c.riskLevel.toLowerCase() === riskFilter.toLowerCase();

      return matchesQuery && matchesStatus && matchesRisk;
    });

    // Sorting
    if (sortOrder === "risk-desc") {
      const riskMap = { "Hög": 3, "Medel": 2, "Låg": 1 };
      result.sort((a, b) => (riskMap[b.riskLevel] || 0) - (riskMap[a.riskLevel] || 0));
    }

    return result;
  }, [customers, query, statusFilter, riskFilter, sortOrder]);

  // Actions
  const openDetail = (id) => {
    setSelectedCustomerId(id);
    setSheetOpen(true);
  };

  const handleImpersonate = async (id, name) => {
    if (demoMode) {
      toast.info("Impersonering är avstängt i demoläge.");
      return;
    }
    try {
      const res = await bureauService.impersonateAgencyCustomer(id);
      if (res.redirectPath) {
        toast.success(`Öppnar dashboard för ${name}...`);
        navigate(res.redirectPath);
      }
    } catch (e) {
      console.error(e);
      toast.error("Kunde inte öppna kundens dashboard.");
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400 animate-pulse">Laddar kunder...</div>;
  }

  return (
    <div className="min-h-screen pb-20" style={{ background: VF.bg }}>

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-20 shadow-sm" data-demo-target="customers-header">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Kundöversikt</h1>
              {demoMode && (
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wide">
                  Demo-läge
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Hantera dina kundbolag, övervaka risker och få snabb åtkomst.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => fetchCustomers(false)} disabled={refreshing} className="h-9">
              <ArrowPathIcon className={`w-3.5 h-3.5 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Uppdatera lista
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-8 space-y-8">

        {/* 1. AI BRIEFING */}
        {aiSummary && (
          <div className="bg-white border-l-4 border-l-indigo-500 border-y border-r border-slate-200 rounded-r-lg shadow-sm p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2" data-demo-target="customers-ai-summary">
            <div className="p-2 bg-indigo-50 rounded-full text-indigo-600">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-slate-900 mb-0.5">AI-sammanfattning</h3>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{aiSummary.active} kunder aktiva.</span>{" "}
                {aiSummary.risks === 0 ? "Inga risker upptäckta senaste 24h." : `${aiSummary.risks} kunder har förhöjd risk.`}{" "}
                {aiSummary.message}
              </p>
            </div>
            <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
              ✨ Daglig rapport
            </div>
          </div>
        )}

        {/* 2. KPI ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-demo-target="customers-kpi">
          <KpiCard label="Totalt antal kunder" value={stats.total} icon={UserGroupIcon} color="blue" />
          <KpiCard label="Kunder med hög risk" value={stats.highRisk} isRisk={true} icon={ShieldCheckIcon} color="red" />
          <KpiCard label="Metadata-brister" value={stats.metadataIssues} subtext="30 dagar" icon={ExclamationTriangleIcon} color="amber" />
          <KpiCard label="Avvikande fakturor" value={stats.invoices30d} subtext="30 dagar" icon={DocumentTextIcon} color="slate" />
        </div>

        {/* 3. TOOLBAR & FILTERS */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full lg:w-auto relative">
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <Input
              placeholder="Sök kund eller org.nr..."
              className="pl-9 h-10 w-full lg:w-80 bg-white border-slate-200 shadow-sm"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <select
              className="h-10 px-3 pr-8 rounded-lg border border-slate-200 text-sm font-medium bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="Alla">Alla statusar</option>
              <option value="active">Aktiv</option>
              <option value="pilot">Pilot</option>
              <option value="inactive">Inaktiv</option>
            </select>
            <select
              className="h-10 px-3 pr-8 rounded-lg border border-slate-200 text-sm font-medium bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer hover:border-indigo-300 transition-colors"
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
            >
              <option value="Alla">Alla risknivåer</option>
              <option value="Hög">Hög risk</option>
              <option value="Medel">Medel risk</option>
              <option value="Låg">Låg risk</option>
            </select>
          </div>
        </div>

        {/* 4. TABLE */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Kund</th>
                <th className="px-6 py-4">Risknivå & Trend</th>
                <th className="px-6 py-4">Status & Hälsa</th>
                <th className="px-6 py-4 text-right">Avvikelser (30d)</th>
                <th className="px-6 py-4 text-right">Åtgärd</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <UserGroupIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Inga kunder hittades</h3>
                      <p className="text-slate-500 mb-6">
                        Du har inga kunder som matchar dina filter just nu. Vill du lägga till en ny?
                      </p>
                      <Button variant="outline">Importera kunder</Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => (
                  <tr key={c.id} className="group hover:bg-slate-50 transition-colors h-20" data-demo-target={c.riskLevel === 'Hög' && idx < 3 ? "customer-row-high-risk" : undefined}>
                    <td className="px-6 py-3 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center text-sm font-bold text-slate-700">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-base">{c.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <span>{c.hasOrgNumber ? c.orgNumber : "Org.nr saknas"}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className={c.status === "active" ? "text-green-600" : "text-slate-500"}>
                              {c.status === "active" ? "Aktiv" : c.status === "pilot" ? "Pilot" : "Inaktiv"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 align-middle">
                      <div className="flex items-center gap-3">
                        <CustomerRiskBadge risk={c.riskLevel} />
                        {/* Mock Trend */}
                        <div className="flex items-center text-xs font-medium text-slate-500">
                          {c.riskLevel === "Hög" ? (
                            <span className="flex items-center text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                              <ArrowUpIcon className="w-3 h-3 mr-1" />
                              +2 sista 7d
                            </span>
                          ) : (
                            <span className="flex items-center text-slate-400">
                              <div className="w-1.5 h-0.5 bg-slate-300 mr-1.5"></div>
                              Stabil
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 align-middle">
                      <div className="flex items-center gap-2">
                        {/* Mock Metadata Status */}
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 border border-slate-100 text-xs font-medium text-slate-600" title="Metadata-status">
                          <DocumentTextIcon className="w-3.5 h-3.5" />
                          <span>OK</span>
                        </div>
                        {c.invoiceCount30d > 0 && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700">
                            <span>{c.invoiceCount30d} fakturor</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 align-middle text-right">
                      <span className={`text-base font-bold ${c.invoiceCount30d > 10 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {Math.floor(c.invoiceCount30d / 5)} {/* Making up "deviations" as subset of invoices for demo */}
                      </span>
                    </td>
                    <td className="px-6 py-3 align-middle text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleImpersonate(c.id, c.name)}
                          className="font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                        >
                          Öppna
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDetail(c.id)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          Detaljer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </main>

      <CustomerDetailSheet
        customerId={selectedCustomerId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}

function KpiCard({ label, value, subtext, isRisk, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex items-start justify-between hover:shadow-md transition-shadow cursor-default">
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold ${isRisk && value > 0 ? "text-red-600" : "text-slate-900"}`}>
            {value}
          </span>
          {subtext && <span className="text-xs text-slate-400">{subtext}</span>}
        </div>
      </div>
      <div className={`p-2 rounded-lg ${colors[color] || colors.slate}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
