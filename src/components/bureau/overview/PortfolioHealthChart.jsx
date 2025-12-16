import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";

export function PortfolioHealthChart({ data, insights }) {
    if (!data) return null;

    const chartData = [
        { name: "Grön (Låg risk)", value: data.green, color: "#22c55e" },
        { name: "Gul (Viss risk)", value: data.yellow, color: "#eab308" },
        { name: "Röd (Hög risk)", value: data.red, color: "#ef4444" },
    ].filter(d => d.value > 0);

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm h-full flex flex-col justify-between">
            <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">Portföljhälsa</h3>
                <p className="text-xs text-slate-500 mb-4">Överblick av riskfördelning.</p>

                <div className="flex items-center justify-center relative h-[140px] mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={65}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.15)', padding: '8px 12px' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-2xl font-bold text-slate-900 tracking-tight">{data.green + data.yellow + data.red}</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Kunder</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                    <div>
                        <span className="block text-[10px] text-slate-400 font-medium uppercase">Låg</span>
                        <span className="text-lg font-bold text-slate-700">{data.green}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] text-slate-400 font-medium uppercase">Viss</span>
                        <span className="text-lg font-bold text-slate-700">{data.yellow}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] text-slate-400 font-medium uppercase">Hög</span>
                        <span className="text-lg font-bold text-slate-700">{data.red}</span>
                    </div>
                </div>
            </div>

            {/* Insights Section */}
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2">
                {/* Insight 1: Top Risks */}
                <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-600">3 största riskkunder</span>
                    <div className="flex -space-x-1.5">
                        {insights?.topRiskCustomers?.slice(0, 3).map((c, i) => (
                            <div key={i} className="w-5 h-5 rounded-full bg-red-100 border border-white flex items-center justify-center text-[8px] font-bold text-red-700" title={c.name}>
                                {c.name.charAt(0)}
                            </div>
                        )) || <span className="text-[10px] text-slate-400">-</span>}
                    </div>
                </div>

                {/* Insight 2: Improved */}
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Förbättrad risk (7d)</span>
                    <span className="flex items-center text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded-full">
                        <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                        {insights?.improved || 0}
                    </span>
                </div>

                {/* Insight 3: Worsened */}
                <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600">Försämrad risk (7d)</span>
                    <span className="flex items-center text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded-full">
                        <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                        {insights?.worsened || 0}
                    </span>
                </div>
            </div>
        </div>
    );
}
