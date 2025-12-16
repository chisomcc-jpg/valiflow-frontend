
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import StatusBadge from "@/components/ui/StatusBadge";
import TrustBadge from "@/components/ui/TrustBadge";

export default function CustomerLeaderboard({ customers = [] }) {
    const [sortConfig, setSortConfig] = useState({ key: "flaggedCount", direction: "desc" });

    const sortedData = useMemo(() => {
        let sortableItems = [...customers];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [customers, sortConfig]);

    const requestSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (name) => {
        if (sortConfig.key !== name) return <div className="w-4 h-4 ml-1 inline-block" />;
        return sortConfig.direction === "ascending" ? (
            <ChevronUpIcon className="w-4 h-4 ml-1 inline-block" />
        ) : (
            <ChevronDownIcon className="w-4 h-4 ml-1 inline-block" />
        );
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700">Kundlista</h3>
                <span className="text-xs text-slate-400">{customers.length} kunder</span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="bg-[#F8FAFC] text-xs uppercase font-medium text-slate-500">
                        <tr>
                            <th className="px-5 py-3 cursor-pointer hover:bg-slate-100" onClick={() => requestSort("name")}>
                                Företag {getSortIcon("name")}
                            </th>
                            <th className="px-5 py-3 text-right cursor-pointer hover:bg-slate-100" onClick={() => requestSort("invoiceCount")}>
                                Fakturor {getSortIcon("invoiceCount")}
                            </th>
                            <th className="px-5 py-3 text-right cursor-pointer hover:bg-slate-100" onClick={() => requestSort("flaggedCount")}>
                                Flaggade {getSortIcon("flaggedCount")}
                            </th>
                            <th className="px-5 py-3 text-center cursor-pointer hover:bg-slate-100" onClick={() => requestSort("avgTrust")}>
                                Snitt-Trust {getSortIcon("avgTrust")}
                            </th>
                            <th className="px-5 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sortedData.length > 0 ? sortedData.slice(0, 10).map((company) => (
                            <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-3 font-medium text-slate-900">
                                    <Link to={`/dashboard/c/${company.id}`} className="hover:text-[#1E5CB3]">
                                        {company.name}
                                    </Link>
                                    <div className="text-xs text-slate-400 font-normal">{company.orgNumber || "–"}</div>
                                </td>
                                <td className="px-5 py-3 text-right">{company.invoiceCount}</td>
                                <td className="px-5 py-3 text-right">
                                    {company.flaggedCount > 0 ? (
                                        <span className="text-red-600 font-bold">{company.flaggedCount}</span>
                                    ) : (
                                        <span className="text-slate-400">0</span>
                                    )}
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <div className="inline-block">
                                        <TrustBadge score={company.avgTrust} />
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center">
                                    <StatusBadge status={company.flaggedCount > 5 ? "review_needed" : "active"} />
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-5 py-8 text-center text-slate-400">
                                    Inga kunder att visa
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {sortedData.length > 10 && (
                <div className="px-5 py-3 border-t border-slate-100 text-center">
                    <button className="text-sm text-[#1E5CB3] hover:underline">Visa alla kunder</button>
                </div>
            )}
        </div>
    );
}
