// src/pages/Dashboard/AuditLog.jsx
import React, { useEffect, useState } from "react";
import {
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    FunnelIcon,
    EyeIcon,
    XMarkIcon,
    ChartBarIcon,
    CheckCircleIcon,
    CpuChipIcon,
    UserIcon,
    ClockIcon,
    ShieldExclamationIcon,
    AdjustmentsHorizontalIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Services
import { fetchAuditLogs, fetchAuditStats, fetchAuditTimeline } from "@/services/auditService";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function AuditLog() {
    const [logs, setLogs] = useState([]);
    const [timelineMode, setTimelineMode] = useState(false);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const [filters, setFilters] = useState({
        query: "",
        type: "all",
        severity: "all",
        fromDate: "",
        toDate: "",
        entityType: "all",
        action: "all"
    });

    // Load Data
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                if (timelineMode && filters.query) {
                    // In timeline mode, we assume query captures the ID or we need specific input. 
                    // For now, let's keep it simple: if specific filter set, try timeline
                    // actually simpler to just reload standard logs unless explicit timeline request
                }

                const [logsData, statsData] = await Promise.all([
                    fetchAuditLogs(filters),
                    fetchAuditStats()
                ]);
                setLogs(logsData.items || []);
                setStats(statsData);
            } catch (err) {
                console.error(err);
                toast.error("Kunde inte ladda revisionsdata");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [JSON.stringify(filters)]);

    const handleRowClick = (log) => {
        setSelectedLog(log);
        setDetailOpen(true);
    };

    const getSeverity = (action = "") => {
        if (action.includes("warning") || action.includes("fraud") || action.includes("override")) return "warning";
        if (action.includes("critical") || action.includes("alert")) return "critical";
        return "info";
    };

    const getSeverityBadge = (sev) => {
        switch (sev) {
            case "critical": return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">Kritisk</Badge>;
            case "warning": return <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">Varning</Badge>;
            default: return <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">Info</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            <ShieldExclamationIcon className="w-6 h-6 text-indigo-600" />
                            Revisionslogg
                        </h1>
                        <p className="text-sm text-slate-500">Fullständig spårbarhet för alla händelser i Valiflow.</p>
                    </div>
                    <Button variant="outline" className="gap-2 text-slate-700" onClick={() => toast.info("Export startad")}>
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        Exportera logg
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* KPI STRIP */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        title="Händelser (30 dagar)"
                        value={stats?.totalEvents30d?.toLocaleString() || "..."}
                        icon={ChartBarIcon}
                        tone="blue"
                    />
                    <KpiCard
                        title="Manuell Granskningsgrad"
                        value={stats?.manualReviewRate != null ? stats.manualReviewRate + "%" : "..."}
                        icon={CheckCircleIcon}
                        tone="emerald"
                    />
                    <KpiCard
                        title="Ändrade betaluppgifter"
                        value={stats?.paymentChanges30d?.toLocaleString() || "..."}
                        icon={ExclamationTriangleIcon}
                        tone="amber"
                    />
                    <KpiCard
                        title="AI-beslut överstyrda"
                        value={stats?.aiOverrides30d?.toLocaleString() || "..."}
                        icon={CpuChipIcon}
                        tone="purple"
                    />
                </section>

                {/* FILTERS */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Sök</label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                            <Input
                                placeholder="Sök på ID, användare eller händelse..."
                                className="pl-9"
                                value={filters.query}
                                onChange={e => setFilters({ ...filters, query: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="w-[180px]">
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Enhetstyp</label>
                        <Select value={filters.entityType} onValueChange={v => setFilters({ ...filters, entityType: v })}>
                            <SelectTrigger><SelectValue placeholder="Alla typer" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Alla typer</SelectItem>
                                <SelectItem value="invoice">Faktura</SelectItem>
                                <SelectItem value="supplier">Leverantör</SelectItem>
                                <SelectItem value="company">Företag</SelectItem>
                                <SelectItem value="user">Användare</SelectItem>
                                <SelectItem value="ai">AI</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-2">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Från</label>
                            <Input type="date" value={filters.fromDate} onChange={e => setFilters({ ...filters, fromDate: e.target.value })} className="w-[140px]" />
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <Card className="shadow-sm border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 whitespace-nowrap w-[180px]">Tidpunkt</th>
                                    <th className="px-6 py-3">Användare / System</th>
                                    <th className="px-6 py-3">Åtgärd</th>
                                    <th className="px-6 py-3">Mål</th>
                                    <th className="px-6 py-3">Sammanfattning</th>
                                    <th className="px-6 py-3 w-[100px] text-center">Nivå</th>
                                    <th className="px-6 py-3 w-[50px]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {loading ? (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">Laddar...</td></tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                                            Inga händelser hittades.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map(log => (
                                        <tr
                                            key={log.id}
                                            onClick={() => handleRowClick(log)}
                                            className="hover:bg-slate-50 cursor-pointer transition-colors group"
                                        >
                                            <td className="px-6 py-3 text-slate-500 font-mono text-xs">
                                                {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm")}
                                            </td>
                                            <td className="px-6 py-3 font-medium text-slate-700">
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="w-4 h-4 text-slate-400" />
                                                    {log.performedBy}
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-slate-600">
                                                {formatEventType(log.action)}
                                            </td>
                                            <td className="px-6 py-3 text-slate-600 font-mono text-xs">
                                                {log.targetLabel}
                                            </td>
                                            <td className="px-6 py-3 text-slate-500 max-w-[300px] truncate">
                                                {log.summary}
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                {getSeverityBadge(getSeverity(log.action))}
                                            </td>
                                            <td className="px-6 py-3 text-right text-slate-400 group-hover:text-indigo-600">
                                                <ChevronRightIcon className="w-4 h-4" />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </main>

            {/* DETAIL SLIDE-OVER */}
            <AnimatePresence>
                {detailOpen && selectedLog && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDetailOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto border-l border-slate-200"
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Händelsedetaljer</h2>
                                        <p className="text-sm text-slate-500 font-mono">ID: {selectedLog.id}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setDetailOpen(false)}>
                                        <XMarkIcon className="w-5 h-5" />
                                    </Button>
                                </div>

                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getSeverityBadge(getSeverity(selectedLog.action))}
                                        <span className="text-xs font-mono text-slate-500">{format(new Date(selectedLog.timestamp), "yyyy-MM-dd HH:mm:ss")}</span>
                                    </div>
                                    <p className="text-slate-800 font-medium">{selectedLog.summary}</p>
                                </div>

                                {/* Hash Proof */}
                                <div className="mb-6">
                                    <h4 className="text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">kryptografisk sIgnering</h4>
                                    <div className="bg-slate-900 rounded p-3 font-mono text-[10px] text-emerald-400 break-all">
                                        {selectedLog.hash}
                                    </div>
                                </div>

                                {/* JSON Metadata */}
                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <details className="group" open>
                                        <summary className="text-xs font-medium text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors list-none flex items-center justify-between">
                                            <span>METADATA (JSON)</span>
                                        </summary>
                                        <div className="mt-3 bg-slate-50 rounded-lg p-3 overflow-x-auto border border-slate-100">
                                            <pre className="text-slate-600 font-mono text-[10px] leading-relaxed">
                                                {JSON.stringify(selectedLog.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    );
}

// Helpers
function KpiCard({ title, value, icon: Icon, tone }) {
    const colors = {
        blue: "text-blue-600 bg-blue-50",
        emerald: "text-emerald-600 bg-emerald-50",
        amber: "text-amber-600 bg-amber-50",
        purple: "text-purple-600 bg-purple-50",
    };
    return (
        <Card className="shadow-sm border-slate-200">
            <CardContent className="p-5 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colors[tone]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </CardContent>
        </Card>
    );
}

function getEventColor(event) { return ""; }

function formatEventType(type) {
    if (!type) return "-";
    return type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

function ExclamationTriangleIcon({ className }) {
    return <ShieldExclamationIcon className={className} />
}
