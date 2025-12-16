import React, { useEffect, useState } from "react";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { BeakerIcon } from "@heroicons/react/24/outline";

// Helper since this is technically "Feature Toggles" but adminService doesn't wrap raw specialized toggle logic yet
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function FeaturesExperiments() {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeatures();
    }, []);

    async function loadFeatures() {
        try {
            const res = await axios.get(`${API_URL}/api/admin/features`, { withCredentials: true });
            setFeatures(res.data);
        } catch (err) {
            toast.error("Kunde inte hämta feature toggles");
        } finally {
            setLoading(false);
        }
    }

    async function toggleFeature(key, currentState) {
        try {
            // 🚩 DISABLED: Backend Impact Check Enforcement 403
            alert("Ändring nekad: Backend kräver Impact Check (ej implementerat)");
            return;
            /*
            // Optimistic UI
            const newData = features.map(f => f.key === key ? { ...f, enabled: !currentState } : f);
            setFeatures(newData);

            await axios.put(`${API_URL}/api/admin/features/${key}`, { enabled: !currentState }, { withCredentials: true });
            toast.success(`Uppdaterade ${key}`);
            */
        } catch (err) {
            toast.error("Misslyckades att uppdatera feature");
            loadFeatures(); // Revert
        }
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Laddar features...</div>;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Funktioner & Experiment</h1>
                <p className="text-slate-500">Feature flags och utrullning.</p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b text-xs text-slate-500 uppercase">
                        <tr>
                            <th className="px-6 py-4">Feature Key</th>
                            <th className="px-6 py-4">Beskrivning</th>
                            <th className="px-6 py-4">Kostnad / Risk</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {features.map((feat) => (
                            <tr key={feat.key} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono font-medium text-slate-700 flex items-center gap-2">
                                    <BeakerIcon className="w-4 h-4 text-slate-400" />
                                    {feat.key}
                                </td>
                                <td className="px-6 py-4 text-slate-600">{feat.description || "-"}</td>
                                <td className="px-6 py-4">
                                    {/* Governance Indicator (Mock for now, would come from backend) */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-slate-500">
                                            Low Usage • High Cost
                                        </span>
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-red-600">
                                            Åtgärd: Gata
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={feat.enabled}
                                            onCheckedChange={() => toggleFeature(feat.key, feat.enabled)}
                                        />
                                        <span className={`text-xs font-bold ${feat.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                                            {feat.enabled ? "ACTIVE" : "OFF"}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
