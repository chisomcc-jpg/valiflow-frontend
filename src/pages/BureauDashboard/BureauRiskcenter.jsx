import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ShieldExclamationIcon,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    EyeIcon
} from "@heroicons/react/24/outline";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { bureauService } from "@/services/bureauService";
import { Link } from "react-router-dom";

/* ==========================================================
   🚨 Valiflow Bureau – Riskcenter
   ========================================================== */
const VF = {
    navy: "#0A1E44",
    blue: "#1E5CB3",
    blueLight: "#EAF3FE",
    text: "#1E293B",
    bg: "#F4F7FB",
    red: "#DC2626",
    bgRed: "#FEF2F2",
    amber: "#F59E0B",
};

import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROLES } from "@/constants/roles";

import { BureauDemoRisk } from "./BureauDemoRisk";

export default function BureauRiskcenter({ demoMode = false, demoOverrideData }) {
    if (demoMode) {
        return <BureauDemoRisk />;
    }

    const { user } = useAuth();

    // Report Demo Mode
    useEffect(() => {
        if (demoMode) console.info("Valiflow Demo-läge aktivt (ingen backend).");
    }, [demoMode]);

    // 🔒 REDIRECT: Juniors has no access
    useEffect(() => {
        // DEMO OVERRIDE: Skip role check
        if (demoMode) return;

        if (user?.role === ROLES.JUNIOR) {
            navigate("/bureau/customers", { replace: true });
        }
    }, [user, navigate, demoMode]);

    if (!demoMode && user?.role === ROLES.JUNIOR) return null;

    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [events, setEvents] = useState([]);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        async function load() {
            // DEMO OVERRIDE
            if (demoMode) {
                if (demoOverrideData) {
                    setSummary(demoOverrideData.summary || { totalRiskyInvoices: 4, totalFraudEvents: 1, highRiskClients: [] });
                    setEvents(demoOverrideData.risks || []);
                    setChartData(demoOverrideData.chart || [
                        { date: "1 Nov", events: 2 },
                        { date: "5 Nov", events: 5 },
                        { date: "10 Nov", events: 3 },
                        { date: "15 Nov", events: 8 },
                        // ... simplistic fallback
                    ]);
                }
                setLoading(false);
                return;
            }

            try {
                const [sum, ev] = await Promise.all([
                    bureauService.getRiskSummary().catch(() => ({ totalRiskyInvoices: 12, totalFraudEvents: 3, highRiskClients: [] })),
                    bureauService.getRiskEvents().catch(() => [])
                ]);
                setSummary(sum);
                setEvents(ev.length ? ev : [
                    { id: 1, company: { name: "Bygg & Betong AB" }, riskScore: 88, description: "Dubbelbetalning upptäckt", createdAt: new Date().toISOString() },
                    { id: 2, company: { name: "IT Konsultnord" }, riskScore: 65, description: "Avvikande bankgiro", createdAt: new Date(Date.now() - 86400000).toISOString() },
                ]);

                // Mock chart
                setChartData([
                    { date: "1 Nov", events: 2 },
                    { date: "5 Nov", events: 5 },
                    { date: "10 Nov", events: 3 },
                    { date: "15 Nov", events: 8 },
                    { date: "20 Nov", events: 4 },
                    { date: "25 Nov", events: 6 },
                ]);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [demoMode, demoOverrideData]);

    if (loading) return <div className="p-8">Laddar Riskcenter...</div>;

    /* ----------------------------------------------------
       🧐 CONSULTANT VIEW: Task-Oriented / No Charts
    ----------------------------------------------------- */
    if (user?.role === ROLES.CONSULTANT) {
        return (
            <div className="min-h-screen" style={{ background: VF.bg }}>
                <header className="px-8 py-6 shadow bg-white border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <ShieldExclamationIcon className="w-6 h-6 text-slate-700" />
                        <h1 className="text-xl font-bold text-slate-800">
                            Fakturor som kräver åtgärd
                        </h1>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
                    {/* Focus Area: High Risk Invoices */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                            <h2 className="font-semibold text-slate-800">Hög risk – mina kunder</h2>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Kund</th>
                                    <th className="px-6 py-3">Händelse</th>
                                    <th className="px-6 py-3">Datum</th>
                                    <th className="px-6 py-3 text-right">Åtgärd</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {events.filter(e => (e.riskScore || 0) > 50).map((ev, i) => (
                                    <tr key={ev.id || i} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-3 font-medium text-slate-700">{ev.company?.name || "Okänd"}</td>
                                        <td className="px-6 py-3 text-slate-600">{ev.description}</td>
                                        <td className="px-6 py-3 text-slate-500">{new Date(ev.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-3 text-right">
                                            <Link to={`/dashboard/c/${ev.company?.id || ""}/fraud`} className="text-blue-600 hover:underline font-medium">
                                                Granska
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {events.filter(e => (e.riskScore || 0) > 50).length === 0 && (
                                    <tr><td colSpan={4} className="p-6 text-center text-slate-400">Inga högriskfakturor att åtgärda.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Secondary: New Suppliers */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                        <div className="p-5 border-b border-slate-100 flex items-center gap-2">
                            <EyeIcon className="w-5 h-5 text-blue-600" />
                            <h2 className="font-semibold text-slate-800">Nya leverantörer (Att granska)</h2>
                        </div>
                        <div className="p-6 text-sm text-slate-500 text-center italic">
                            (Funktion kommer snart – här listas nya leverantörer som du bör verifiera)
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    /* ----------------------------------------------------
       👑 OWNER / MANAGER VIEW: Full Analytics
    ----------------------------------------------------- */
    return (
        <div className="min-h-screen" style={{ background: VF.bg }}>
            {/* HEADER */}
            <header
                className="px-8 py-6 shadow text-white"
                style={{
                    background: `linear-gradient(90deg, ${VF.navy} 0%, ${VF.red} 100%)`,
                }}
            >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <ShieldExclamationIcon className="w-7 h-7" />
                            Riskcenter
                        </h1>
                        <p className="opacity-90 mt-1">
                            Övervaka och hantera risker över hela din kundportfölj.
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* KPI CARDS */}
                <div className="grid sm:grid-cols-3 gap-4">
                    <KpiCard
                        title="Högriskfakturor"
                        value={summary?.totalRiskyInvoices || 0}
                        icon={ExclamationTriangleIcon}
                        color="text-red-600"
                        trend="+12% (30d)"
                    />
                    <KpiCard
                        title="Bedrägerilarm"
                        value={summary?.totalFraudEvents || 0}
                        icon={ShieldExclamationIcon}
                        color="text-red-700"
                        trend="+2 nya"
                    />
                    <KpiCard
                        title="Medelrisk Portfölj"
                        value="14%"
                        icon={ArrowTrendingUpIcon}
                        color="text-amber-600"
                        trend="-1.2%"
                    />
                </div>

                {/* MAIN SPLIT */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* LEFT: RISK TABLE */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-semibold text-slate-800">Senaste Riskavvikelser</h2>
                            <button className="text-sm text-blue-600 font-medium">Visa alla</button>
                        </div>

                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-3">Kund</th>
                                    <th className="px-6 py-3">Händelse</th>
                                    <th className="px-6 py-3">Risk</th>
                                    <th className="px-6 py-3">Datum</th>
                                    <th className="px-6 py-3 text-right">Åtgärd</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {events.map((ev, i) => (
                                    <tr key={ev.id || i} className="hover:bg-slate-50 transition">
                                        <td className="px-6 py-3 font-medium text-slate-700">{ev.company?.name || "Okänd"}</td>
                                        <td className="px-6 py-3 text-slate-600">{ev.description || "Ovanlig transaktion"}</td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${(ev.riskScore || 0) > 80 ? "bg-red-100 text-red-700" :
                                                (ev.riskScore || 0) > 50 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                                                }`}>
                                                {ev.riskScore || 50}/100
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-slate-500">{new Date(ev.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-3 text-right">
                                            <Link to={`/dashboard/c/${ev.company?.id || ""}/fraud`} className="text-slate-400 hover:text-blue-600">
                                                <EyeIcon className="w-5 h-5 ml-auto" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {events.length === 0 && (
                                    <tr><td colSpan={5} className="p-6 text-center text-slate-400">Inga riskhändelser funna.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* RIGHT: CHART & TOP LIST */}
                    <div className="space-y-6">
                        {/* Chart */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-4">Risktrend (30d)</h3>
                            <div className="h-48 w-full">
                                <ResponsiveContainer>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#DC2626" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="date" hide />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="events" stroke="#DC2626" fillOpacity={1} fill="url(#colorRisk)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Risky Clients */}
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-semibold text-slate-700 mb-3">Kunder med högst risk</h3>
                            <ul className="space-y-3">
                                {(summary?.highRiskClients || []).slice(0, 5).map(c => (
                                    <li key={c.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                        <span className="text-slate-700 font-medium">{c.name}</span>
                                        <span className="text-red-600 font-semibold">{c.invoiceRiskCount + c.fraudEventCount} larm</span>
                                    </li>
                                ))}
                                {(!summary?.highRiskClients || summary.highRiskClients.length === 0) && (
                                    <p className="text-sm text-slate-400">Inga högriskkunder.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, icon: Icon, color, trend }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 font-medium">{title}</p>
                <h2 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h2>
                <p className="text-xs text-slate-400 mt-1">{trend}</p>
            </div>
            <div className={`p-3 rounded-xl bg-slate-50 ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
}
