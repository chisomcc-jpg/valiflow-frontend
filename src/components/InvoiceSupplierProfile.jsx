import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { BuildingOfficeIcon, UserGroupIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from "@heroicons/react/24/outline";

export default function InvoiceSupplierProfile({ profile }) {
    if (!profile) return null;

    const trendIcon = profile.riskTrend === 'increasing' ? (
        <ArrowTrendingUpIcon className="w-3 h-3 text-red-500" />
    ) : profile.riskTrend === 'decreasing' ? (
        <ArrowTrendingDownIcon className="w-3 h-3 text-emerald-500" />
    ) : (
        <MinusIcon className="w-3 h-3 text-slate-400" />
    );

    const trendText = profile.riskTrend === 'increasing' ? 'Ökande risk' : profile.riskTrend === 'decreasing' ? 'Minskande risk' : 'Stabil';
    const trendColor = profile.riskTrend === 'increasing' ? 'text-red-600 bg-red-50' : profile.riskTrend === 'decreasing' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 bg-slate-100';

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-50 rounded-md border border-slate-100 text-slate-500">
                        <BuildingOfficeIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-slate-900">{profile.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex items-center gap-1 ${trendColor}`}>
                                {trendIcon} {trendText}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Mini Chart */}
                <div className="w-24 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={profile.trendChart || []}>
                            <Area type="monotone" dataKey="score" stroke="#94A3B8" fill="#F1F5F9" strokeWidth={1.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                    <label className="text-xs text-slate-400 uppercase font-bold">Fakturor</label>
                    <p className="text-sm font-semibold text-slate-900">{profile.totalInvoices || 0} st</p>
                </div>
                <div>
                    <label className="text-xs text-slate-400 uppercase font-bold">Kunder</label>
                    <div className="flex items-center gap-1">
                        <UserGroupIcon className="w-3 h-3 text-slate-400" />
                        <p className="text-sm font-semibold text-slate-900">{profile.customerCount || 1} st</p>
                    </div>
                </div>
                <div>
                    <label className="text-xs text-slate-400 uppercase font-bold">Bankgiro</label>
                    <p className="text-sm font-medium text-slate-700">{profile.bankgiroStatus === 'stable' ? 'Oförändrat' : 'Ändrat nyligen'}</p>
                </div>
                <div>
                    <label className="text-xs text-slate-400 uppercase font-bold">Avvikelser</label>
                    <p className="text-sm font-medium text-slate-700">{profile.lastDeviation ? profile.lastDeviation : 'Inga'}</p>
                </div>
            </div>
        </div>
    );
}
