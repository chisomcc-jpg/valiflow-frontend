
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    ChevronUpIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    CheckBadgeIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import StatusBadge from "@/components/ui/StatusBadge";
import TrustBadge from "@/components/ui/TrustBadge";
import { Badge } from "@/components/ui/badge";

export default function BureauCustomerTable({ customers = [] }) {
    const [search, setSearch] = useState("");
    const [filterRisk, setFilterRisk] = useState("all"); // all, high, medium, low
    const [sortConfig, setSortConfig] = useState({ key: "flaggedCount", direction: "desc" });

    // --- Filter & Sort ---
    const filteredData = useMemo(() => {
        let items = [...customers];

        // 1. Search
        if (search) {
            const lower = search.toLowerCase();
            items = items.filter(c =>
                c.name.toLowerCase().includes(lower) ||
                c.orgNumber?.includes(lower)
            );
        }

        // 2. Filter Risk (based on avgTrust or risk flags)
        if (filterRisk !== "all") {
            items = items.filter(c => {
                if (filterRisk === "high") return c.avgTrust < 60 || c.flaggedCount > 0;
                if (filterRisk === "medium") return c.avgTrust >= 60 && c.avgTrust < 85;
                if (filterRisk === "low") return c.avgTrust >= 85;
                return true;
            });
        }

        // 3. Sort
        if (sortConfig.key) {
            items.sort((a, b) => {
                const valA = a[sortConfig.key] || 0;
                const valB = b[sortConfig.key] || 0;

                if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
                if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return items;
    }, [customers, search, filterRisk, sortConfig]);

    // --- Helpers ---
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ col }) => {
        if (sortConfig.key !== col) return <div className="w-4 h-4 ml-1 inline-block opacity-0" />;
        return sortConfig.direction === "asc" ?
            <ChevronUpIcon className="w-4 h-4 ml-1 inline-block text-blue-600" /> :
            <ChevronDownIcon className="w-4 h-4 ml-1 inline-block text-blue-600" />;
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
                <div className="relative w-full sm:w-80">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Sök företag eller org.nr..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                    <button
                        onClick={() => setFilterRisk("all")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${filterRisk === "all" ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                    >
                        Alla ({customers.length})
                    </button>
                    <button
                        onClick={() => setFilterRisk("high")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${filterRisk === "high" ? "bg-red-100 text-red-700 border-red-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                    >
                        Hög Risk / Flaggade
                    </button>
                    <button
                        onClick={() => setFilterRisk("medium")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${filterRisk === "medium" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                    >
                        Genomsnitt
                    </button>
                    <button
                        onClick={() => setFilterRisk("low")}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${filterRisk === "low" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                    >
                        Låg Risk
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => requestSort("name")}>
                                Företag <SortIcon col="name" />
                            </th>
                            <th className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100" onClick={() => requestSort("avgTrust")}>
                                Trust Score <SortIcon col="avgTrust" />
                            </th>
                            <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => requestSort("invoiceCount")}>
                                Volym (Mån) <SortIcon col="invoiceCount" />
                            </th>
                            <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100" onClick={() => requestSort("flaggedCount")}>
                                Flaggade <SortIcon col="flaggedCount" />
                            </th>
                            <th className="px-6 py-4 text-left">
                                Riskindikatorer
                            </th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Åtgärd</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredData.length > 0 ? filteredData.map((client) => (
                            <motion.tr
                                key={client.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="group hover:bg-blue-50/30 transition-colors"
                            >
                                {/* Name Loop */}
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shrink-0">
                                            {client.name.charAt(0)}
                                        </div>
                                        <div>
                                            <Link to={`/dashboard/c/${client.id}`} className="font-semibold text-slate-900 hover:text-blue-600 transition">
                                                {client.name}
                                            </Link>
                                            <div className="text-xs text-slate-500 font-mono mt-0.5">
                                                {client.orgNumber || "Ej angivet"}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                {/* Trust Score */}
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center">
                                        <TrustBadge score={client.avgTrust} size="md" />
                                    </div>
                                </td>

                                {/* Volume */}
                                <td className="px-6 py-4 text-right font-mono text-slate-600">
                                    {client.invoiceCount} st
                                </td>

                                {/* Flagged */}
                                <td className="px-6 py-4 text-right">
                                    <div className={`inline-flex items-center gap-1 font-bold ${client.flaggedCount > 0 ? "text-red-600" : "text-slate-300"}`}>
                                        {client.flaggedCount > 0 && <ExclamationTriangleIcon className="w-4 h-4" />}
                                        {client.flaggedCount}
                                    </div>
                                </td>

                                {/* Risks (Visual Bar) */}
                                <td className="px-6 py-4">
                                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden flex mx-auto sm:mx-0">
                                        <div className="bg-emerald-400 h-full" style={{ width: `${(client.riskDistribution?.safe / (client.invoiceCount || 1)) * 100}%` }} title="Safe" />
                                        <div className="bg-amber-400 h-full" style={{ width: `${(client.riskDistribution?.medium / (client.invoiceCount || 1)) * 100}%` }} title="Medium" />
                                        <div className="bg-red-500 h-full" style={{ width: `${(client.riskDistribution?.risky / (client.invoiceCount || 1)) * 100}%` }} title="Risky" />
                                    </div>
                                    {client.flaggedCount > 0 && (
                                        <div className="mt-1 text-[10px] text-red-600 font-medium">
                                            {client.aiSummary?.slice(0, 30)}...
                                        </div>
                                    )}
                                </td>

                                {/* Status */}
                                <td className="px-6 py-4 text-center">
                                    <StatusBadge status={client.status} />
                                </td>

                                {/* Action */}
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        to={`/dashboard/c/${client.id}`}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Öppna &rarr;
                                    </Link>
                                </td>
                            </motion.tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <MagnifyingGlassIcon className="w-8 h-8 opacity-20" />
                                        <p>Inga kunder matchade sökningen</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
                <span>Visar {filteredData.length} av {customers.length} kunder</span>
                {/* Future pagination here */}
            </div>
        </div>
    );
}
