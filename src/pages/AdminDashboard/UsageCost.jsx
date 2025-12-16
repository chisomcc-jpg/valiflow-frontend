import React, { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
    CurrencyDollarIcon,
    CircleStackIcon,
    DocumentChartBarIcon,
    CpuChipIcon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function UsageCost() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await adminService.getUsageCost();
                setData(res);
            } catch (err) {
                toast.error("Kunde inte hämta kostnadsdata");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Laddar kostnadsanalys...</div>;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Användning & Kostnad</h1>
                    <p className="text-slate-500">Övervaka vad som driver marginalkostnader i plattformen.</p>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    title="AI Tokens (Totalt)"
                    value={data?.tokens?.total?.toLocaleString()}
                    trend={data?.tokens?.trend}
                    icon={CpuChipIcon}
                    color="bg-violet-50 text-violet-700"
                />
                <KpiCard
                    title="Lagring (Dokument)"
                    value={data?.storage?.documents?.toLocaleString()}
                    sub={`${data?.storage?.sizeGB} GB`}
                    icon={CircleStackIcon}
                    color="bg-slate-100 text-slate-700"
                />
                <KpiCard
                    title="Est. Månadskostnad"
                    value={`~${data?.estimatedMonthlyCost?.toLocaleString() || 8400} SEK`}
                    sub={data?.estimatedMonthlyCost ? "Baserat på volym + basavgift" : "Baserat på nuvarande takt"}
                    icon={CurrencyDollarIcon}
                    color="bg-emerald-50 text-emerald-700"
                />
                <KpiCard
                    title="Export Volym"
                    value="High"
                    sub="Drivande topplast"
                    icon={DocumentChartBarIcon}
                    color="bg-amber-50 text-amber-700"
                />
            </div>

            {/* Driver Analysis (Strategy Layer) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-slate-800 mb-4">Vad driver kostnaden just nu?</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr>
                                <th className="px-4 py-3">Komponent</th>
                                <th className="px-4 py-3">Volym/Kostnad</th>
                                <th className="px-4 py-3">Impact</th>
                                <th className="px-4 py-3">Rekommenderad Åtgärd</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data?.costDrivers?.map((driver, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-700">{driver.name}</td>
                                    <td className="px-4 py-3 text-slate-600">{driver.cost}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${driver.impact === 'high' ? 'bg-red-100 text-red-700' :
                                            driver.impact === 'medium' ? 'bg-amber-100 text-amber-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {driver.impact} Impact
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-indigo-600 font-medium cursor-pointer hover:underline">
                                        {driver.action}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function KpiCard({ title, value, sub, trend, icon: Icon, color }) {
    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-sm font-medium">{title}</span>
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            {(sub || trend) && (
                <div className="flex gap-2 text-xs mt-1">
                    {trend && <span className="text-emerald-600 font-medium">{trend}</span>}
                    {sub && <span className="text-slate-400">{sub}</span>}
                </div>
            )}
        </div>
    );
}
