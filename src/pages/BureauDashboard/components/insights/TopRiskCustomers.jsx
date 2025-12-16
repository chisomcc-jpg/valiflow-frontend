
import React from "react";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

export default function TopRiskCustomers({ data }) {
    // Take top 5
    const topRisks = data ? [...data].sort((a, b) => b.score - a.score).slice(0, 5) : [];

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-800">Topplista Risk</h3>
                <button className="text-xs text-indigo-600 font-medium hover:underline">Visa alla</button>
            </div>

            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-slate-400 border-b border-slate-100">
                            <th className="font-medium pb-2 pl-1">Kund</th>
                            <th className="font-medium pb-2 text-right">Poäng</th>
                            <th className="font-medium pb-2 text-right">Trend</th>
                            <th className="font-medium pb-2 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {topRisks.map((c) => (
                            <tr key={c.customerId} className="hover:bg-slate-50 group">
                                <td className="py-2.5 pl-1 font-medium text-slate-700 truncate max-w-[100px]">{c.name}</td>
                                <td className="py-2.5 text-right">
                                    <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${c.risk === 'high' ? 'bg-red-100 text-red-700' :
                                            c.risk === 'medium' ? 'bg-amber-100 text-amber-700' : 'text-slate-600'
                                        }`}>
                                        {c.score}
                                    </span>
                                </td>
                                <td className="py-2.5 text-right flex justify-end items-center gap-1 text-slate-500">
                                    {c.trend === 'up' && <ArrowTrendingUpIcon className="w-3 h-3 text-red-500" />}
                                    {c.trend === 'down' && <ArrowTrendingDownIcon className="w-3 h-3 text-emerald-500" />}
                                    <span className="text-xs">{c.trendValue}</span>
                                </td>
                                <td className="py-2.5 text-right">
                                    <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600">
                                        <EllipsisHorizontalIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {topRisks.length === 0 && (
                            <tr><td colSpan="4" className="text-center py-4 text-slate-400">Ingen data</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
