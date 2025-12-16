import React, { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
    ShieldCheckIcon,
    FunnelIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";

export default function TrustEngine() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const [metrics, snap] = await Promise.all([
                    adminService.getTrustMetrics(),
                    adminService.getSnapshot() // Fetch snapshot for Value Proof
                ]);
                setData({ ...metrics, ...snap.trust });
            } catch (err) {
                toast.error("Kunde inte hämta Trust-data");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-500">Laddar Trust Engine metrics...</div>;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Trust Engine</h1>
                <p className="text-slate-500">Analysera signalbrus, automation och affärsvärde.</p>
            </div>

            {/* VALUE PROOF (Phase 2) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Undvikna Risker (SEK)</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-slate-900">
                            {data?.avoidedRisksSEK
                                ? new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumSignificantDigits: 3 }).format(data.avoidedRisksSEK)
                                : '0 kr'}
                        </p>
                        <span className="text-xs font-bold text-emerald-600">↗ Senaste 7d</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Totalt fakturavärde för högriskfakturor.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Automationsgrad</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-slate-900">
                            {data?.automationRate ? `${(data.automationRate * 100).toFixed(1)}%` : '0%'}
                        </p>
                        <span className="text-xs font-bold text-blue-600">→ Stabil</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Andel fakturor som ej granskats manuellt.</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-amber-500">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Falsk Friktion (False Positives)</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-slate-900">
                            {data?.falseFriction ? `${(data.falseFriction * 100).toFixed(1)}%` : '0%'}
                        </p>
                        <span className={`text-xs font-bold ${data?.falseFriction > 0.1 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {data?.falseFriction > 0.1 ? '⚠ Hög' : 'OK'}
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Flaggade fakturor som ändå godkändes.</p>
                </div>
            </div>

            {/* Outcome Stats (Legacy) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Trusted (Godkända)</h3>
                    <p className="text-2xl font-bold text-emerald-600">{data?.outcomes?.trusted}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Flagged (Risk/Info)</h3>
                    <p className="text-2xl font-bold text-amber-500">{data?.outcomes?.flagged}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-sm font-medium text-slate-500 mb-1">Kräver granskning</h3>
                    <p className="text-2xl font-bold text-amber-600">{data?.outcomes?.requires_approval}</p>
                </div>
            </div>

            {/* Signal Noise */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <FunnelIcon className="w-5 h-5 text-indigo-600" />
                        Mest frekventa signaler
                    </h2>
                    <span className="text-xs font-mono text-slate-400">
                        Noise Ratio: {((data?.noiseRatio || 0) * 100).toFixed(1)}%
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                            <tr>
                                <th className="px-4 py-3">Signal Key</th>
                                <th className="px-4 py-3">Antal triggade</th>
                                <th className="px-4 py-3">Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.topSignals?.map((sig, i) => (
                                <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                                    <td className="px-4 py-3 font-mono font-medium text-slate-700">{sig.key}</td>
                                    <td className="px-4 py-3">{sig.count}</td>
                                    <td className="px-4 py-3">
                                        {sig.trend === 'up' && <span className="text-red-600 font-bold">↗ Ökar</span>}
                                        {sig.trend === 'down' && <span className="text-emerald-600">↘ Minskar</span>}
                                        {sig.trend === 'stable' && <span className="text-slate-400">→ Stabil</span>}
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
