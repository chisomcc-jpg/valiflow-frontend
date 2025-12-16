import React, { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
    UsersIcon,
    ArrowTrendingUpIcon,
    ExclamationCircleIcon,
    BanknotesIcon,
    ChevronRightIcon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CustomersRevenue() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await adminService.getCustomerRevenue();
                setData(res);
            } catch (err) {
                toast.error("Kunde inte hämta kunddata");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // 🚨 Action Queue Data (Operational)
    const [actionQueue, setActionQueue] = useState([]);

    useEffect(() => {
        async function fetchQueue() {
            try {
                const q = await adminService.getActionQueue();
                setActionQueue(q);
            } catch (e) {
                console.error("Failed to load action queue");
            }
        }
        fetchQueue();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Laddar intäktsanalys...</div>;

    const COLORS = ['#94a3b8', '#10b981', '#6366f1']; // Grey (Core), Emerald (Growth), Indigo (Audit Pro)

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Kunder & Intäkter</h1>
                    <p className="text-slate-500">Fördelning av planer och uppgraderingsmöjligheter.</p>
                </div>
            </div>

            {/* 🚨 Revenue Action Queue (Early Warning) */}
            <div className="bg-white border border-red-100 rounded-xl shadow-sm overflow-hidden mb-8">
                <div className="bg-red-50/50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
                    <h2 className="font-bold text-red-900 flex items-center gap-2">
                        <ExclamationCircleIcon className="w-5 h-5" />
                        Konton som kräver åtgärd
                    </h2>
                    <span className="text-xs font-bold bg-white text-red-700 px-2 py-1 rounded border border-red-100 uppercase tracking-wider">
                        {actionQueue.length} Åtgärder
                    </span>
                </div>
                <div className="divide-y divide-red-50">
                    {actionQueue.map((item) => (
                        <div key={item.id} className="p-4 flex items-center justify-between hover:bg-red-50/30 transition">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${item.severity === 'high' ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`} />
                                <div>
                                    <p className="font-semibold text-slate-900 text-sm">{item.company}</p>
                                    <p className="text-xs text-red-700 font-medium">{item.issue}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Påverkan</p>
                                    <p className="text-xs font-medium text-slate-600">{item.impact}</p>
                                </div>
                                <button className="px-3 py-1.5 bg-white border border-red-200 text-red-700 text-xs font-bold rounded hover:bg-red-50 shadow-sm flex items-center gap-1">
                                    {item.action}
                                    <ChevronRightIcon className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Plan Distribution */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="font-bold text-slate-800 mb-4">Planfördelning</h2>
                    <div className="h-64 w-full">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data?.plans}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {data?.plans?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Upgrade Risks (Strategy Layer) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-600" />
                        Uppgraderings- och riskindikatorer
                    </h2>
                    <div className="space-y-3">
                        {data?.upgradeRisks?.length === 0 ? (
                            <p className="text-slate-400 text-sm">Inga kunder nära taket just nu.</p>
                        ) : (
                            data?.upgradeRisks?.map((risk, i) => (
                                <div key={i} className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm">{risk.company}</h3>
                                            <p className="text-xs text-slate-500">{risk.plan} • {risk.usage}/{risk.limit} fakturor</p>
                                        </div>
                                        <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                                            {Math.round((risk.usage / risk.limit) * 100)}% Usage
                                        </span>
                                    </div>

                                    {/* Strategy Recommendation */}
                                    <div className="mt-3 pt-3 border-t border-emerald-100/50 flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-medium">{risk.risk}</span>
                                        <button className="text-emerald-700 font-bold hover:underline">
                                            👉 {risk.recommendation}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
