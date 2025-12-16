// src/pages/Dashboard/FraudOverview.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import {
  ShieldExclamationIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ClockIcon,
  TableCellsIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

// Services & Hooks
import * as fraudService from "@/services/fraudService";
import * as invoiceService from "@/services/invoiceService";
import { useFraudSSE } from "@/hooks/useFraudSSE";
import useInvoiceSSE from "@/hooks/useInvoiceSSE";
import { useCompanyKpiSSE } from "@/hooks/useCompanyKpiSSE";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import StatusBadge from "@/components/ui/StatusBadge"; // Reuse if available

// -----------------------------------------------------------------------------
// HELPER: Formatters
// -----------------------------------------------------------------------------
const fmtDate = (d) => new Date(d).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

// -----------------------------------------------------------------------------
// COMPONENT: FraudOverview
// -----------------------------------------------------------------------------
export default function FraudOverview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [highRiskInvoices, setHighRiskInvoices] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [debugOpen, setDebugOpen] = useState(false);

  // Filters
  const [dateRange, setDateRange] = useState("30d");
  const [riskFilter, setRiskFilter] = useState("all");

  // -- 1. Initial Data Fetch --
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [s, e, p, t, i] = await Promise.all([
          fraudService.getFraudOverview(),
          fraudService.getRecentFraudEvents(),
          fraudService.getFraudPatterns(),
          fraudService.getRiskTimeline(),
          invoiceService.fetchInvoices({ minRisk: 60, limit: 10 }) // Fetch real high risk invoices
        ]);

        setStats(s);
        setRecentEvents(e);
        setPatterns(p);
        setTimelineData(t);
        setHighRiskInvoices(i.items || []); // Assuming typical list response
      } catch (err) {
        console.error("Failed to load fraud data", err);
        toast.error("Kunde inte ladda bedrägeridata");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [dateRange]);

  // -- 2. SSE Subscriptions --
  useFraudSSE((event) => {
    // Add new event to top of feed
    setRecentEvents(prev => [event, ...prev].slice(0, 50));
    // Update stats lightly (or refetch)
    if (event.severity === 'high') {
      setStats(prev => prev ? ({ ...prev, highRiskCount: prev.highRiskCount + 1 }) : prev);
    }
    toast("Ny säkerhetshändelse mottagen", { description: event.message });
  });

  useInvoiceSSE((update) => {
    // If a high risk invoice is analyzed, add to table
    const risk = update.riskScore || update.trustScore ? 100 - update.trustScore : 0;
    if (risk > 60) {
      setHighRiskInvoices(prev => {
        const exists = prev.find(i => i.id === update.id || i.invoiceId === update.invoiceId);
        if (exists) return prev.map(i => i.id === exists.id ? { ...i, ...update } : i);
        return [update, ...prev];
      });
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
          <p className="text-sm text-slate-500 font-medium">Laddar TrustEngine™ Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">

      {/* 1. HEADER BAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldExclamationIcon className="w-6 h-6 text-indigo-600" />
              Bedrägeriöversikt
            </h1>
            <p className="text-sm text-slate-500">Realtidsinsikter från Valiflow TrustEngine™ V5</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className="text-sm border-slate-200 rounded-md py-1.5 pl-3 pr-8 focus:ring-indigo-500 font-medium text-slate-600 bg-slate-50"
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
            >
              <option value="7d">Senaste 7 dagarna</option>
              <option value="30d">Senaste 30 dagarna</option>
              <option value="90d">Detta kvartal</option>
            </select>

            <Button variant="outline" className="gap-2 text-slate-700">
              <ArrowDownTrayIcon className="w-4 h-4" />
              Exportera
            </Button>
            <Button variant="ghost" className="text-slate-500 hover:text-indigo-600">
              Visa riskregler
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* 2. KPI GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Hög-risk fakturor"
            value={stats?.highRiskCount || 0}
            subtitle="Senaste 30 dagarna"
            icon={ExclamationTriangleIcon}
            color="red"
          />
          <KpiCard
            title="Avvikande leverantörer"
            value={stats?.anomalousSuppliers || 0}
            subtitle="Beteendeförändringar"
            icon={GlobeAltIcon}
            color="amber"
          />
          <KpiCard
            title="Betalningsändringar"
            value={stats?.paymentChanges || 0}
            subtitle="Bankgiro/IBAN-byten"
            icon={BanknotesIcon}
            color="indigo"
          />
          <KpiCard
            title="Aktiva mönster"
            value={stats?.activePatterns || 0}
            subtitle="Identifierade vektorer"
            icon={ChartBarIcon}
            color="emerald"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN (2/3) */}
          <div className="lg:col-span-2 space-y-8">

            {/* 4. HIGH RISK INVOICES TABLE */}
            <Card className="shadow-sm border-slate-200 overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <TableCellsIcon className="w-4 h-4" /> Riskfakturor (Action Required)
                  </CardTitle>
                  <Button variant="link" size="sm" className="h-auto p-0 text-indigo-600">Visa alla</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-3">Faktura</th>
                        <th className="px-4 py-3">Leverantör</th>
                        <th className="px-4 py-3 text-right">Belopp</th>
                        <th className="px-4 py-3 text-center">Risk Score</th>
                        <th className="px-4 py-3">Signal</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {highRiskInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">
                            Inga högriskfakturor hittades. Bra jobbat!
                          </td>
                        </tr>
                      ) : highRiskInvoices.map(inv => {
                        const risk = inv.riskScore ?? (inv.trustScore ? 100 - inv.trustScore : 0);
                        const isHigh = risk > 70;
                        return (
                          <tr key={inv.id} className={`hover:bg-slate-50 transition-colors ${isHigh ? "bg-red-50/30" : ""}`}>
                            <td className="px-4 py-3 font-medium text-slate-900">
                              {inv.invoiceRef || `INV-${inv.id}`}
                            </td>
                            <td className="px-4 py-3 text-slate-600">{inv.supplierName}</td>
                            <td className="px-4 py-3 text-right tabular-nums">{inv.total?.toLocaleString()} {inv.currency}</td>
                            <td className="px-4 py-3 text-center">
                              <Badge variant="outline" className={isHigh ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}>
                                {Math.round(risk)}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-[150px]">
                              {inv.aiSummary || "Anomali upptäckt"}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/invoices/${inv.id}`)}>
                                <EyeIcon className="w-4 h-4 text-slate-400 hover:text-indigo-600" />
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 5. PAYMENT CHANGE DETECTION (Side-by-side) */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <BanknotesIcon className="w-4 h-4" /> Detekterade Betalningsändringar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 relative">
                    <div className="absolute top-3 right-3 text-red-600">
                      <ExclamationTriangleIcon className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-semibold text-red-900 mb-1">Mottagen Faktura (NU)</h4>
                    <p className="text-xs text-red-700 mb-4">Leverantör: Office Supplies AB</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-red-700/70">Bankgiro:</span>
                        <span className="font-mono font-medium text-red-900 bg-red-100 px-1 rounded">5560-9999</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-700/70">Momsnr:</span>
                        <span className="font-mono text-red-900">SE556012345601</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 relative opacity-60">
                    <h4 className="text-sm font-semibold text-emerald-900 mb-1">Historiskt (KÄNT)</h4>
                    <p className="text-xs text-emerald-700 mb-4">Senast godkänd: 2025-11-15</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-emerald-700/70">Bankgiro:</span>
                        <span className="font-mono font-medium text-emerald-900">5560-1234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-emerald-700/70">Momsnr:</span>
                        <span className="font-mono text-emerald-900">SE556012345601</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-500 text-center italic">Exempelvisning av aktiv detektering</p>
              </CardContent>
            </Card>

            {/* 8. COMPANY RISK TIMELINE */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" /> Risktrend (90 Dagar)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="riskScore" stroke="#ef4444" fillOpacity={1} fill="url(#riskGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT COLUMN (1/3) */}
          <div className="space-y-8">

            {/* 3. LIVE FRAUD FEED */}
            <Card className="shadow-sm border-slate-200 flex flex-col h-[500px]">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Live Feed
                  </CardTitle>
                  <span className="text-[10px] text-slate-400 font-mono">SSE: CONNECTED</span>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto">
                <div className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {recentEvents.map((evt) => (
                      <motion.div
                        key={evt.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${evt.severity === 'high' ? 'bg-red-500' :
                            evt.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                          <div>
                            <p className="text-sm font-medium text-slate-900 leading-snug">{evt.message}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] font-mono text-slate-400">{fmtDate(evt.timestamp)}</span>
                              {evt.invoiceId && (
                                <Badge variant="secondary" className="text-[10px] h-4 px-1">
                                  Inv #{evt.invoiceId}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* 7. PATTERN LIBRARY */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Detekterade Mönster
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {patterns.map(p => (
                  <div key={p.id} className="p-3 border border-slate-100 rounded-lg bg-white hover:border-indigo-200 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600">{p.name}</h5>
                      <Badge variant="outline" className="text-[10px]">{p.affectedCount} fall</Badge>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">{p.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 6. SUPPLIER RISK PANEL (Simplified) */}
            <Card className="shadow-sm border-slate-200 bg-slate-900 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <GlobeAltIcon className="w-4 h-4" /> Nätverksanalys
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-3xl font-light">4.2%</p>
                    <p className="text-xs text-slate-400">Exponering mot svartlistade noder</p>
                  </div>
                  <div className="h-10 w-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[{ v: 10 }, { v: 15 }, { v: 30 }, { v: 25 }, { v: 40 }, { v: 35 }, { v: 42 }]}>
                        <Line type="monotone" dataKey="v" stroke="#f43f5e" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Bad Neighbor Score</span>
                    <span className="text-amber-400 font-mono">MEDIUM</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Cross-company Signal</span>
                    <span className="text-emerald-400 font-mono">STABLE</span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* 9. RAW LOGS */}
        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
          <button
            onClick={() => setDebugOpen(!debugOpen)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold">
              Audit Log / Raw Signals
            </span>
            {debugOpen ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
          </button>
          {debugOpen && (
            <div className="p-4 bg-slate-900 text-slate-300 font-mono text-xs overflow-x-auto max-h-64 overflow-y-auto">
              <pre>{JSON.stringify({ stats, patterns, recentEvents }, null, 2)}</pre>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

// -----------------------------------------------------------------------------
// SUB-COMPONENTS
// -----------------------------------------------------------------------------

function KpiCard({ title, value, subtitle, icon: Icon, color }) {
  const colorStyles = {
    red: "text-red-600 bg-red-50",
    amber: "text-amber-600 bg-amber-50",
    indigo: "text-indigo-600 bg-indigo-50",
    emerald: "text-emerald-600 bg-emerald-50",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className={`p-3 rounded-lg ${colorStyles[color] || colorStyles.indigo}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  )
}
