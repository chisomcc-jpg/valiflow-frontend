import React, { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ServerStackIcon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function IncidentsSupport() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [criticalOnly, setCriticalOnly] = useState(false);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const query = criticalOnly ? '?criticalOnly=true' : '';
                const res = await adminService.getGroupedIncidents(query); // Must update service to accept query param
                setIncidents(res || []);
            } catch (err) {
                toast.error("Kunde inte hämta incidenter");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [criticalOnly]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Incidenter & Support</h1>
                    <p className="text-slate-500">Affärskritiska fel och driftstörningar.</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
                    <button
                        onClick={() => setCriticalOnly(false)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${!criticalOnly ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Alla
                    </button>
                    <button
                        onClick={() => setCriticalOnly(true)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${criticalOnly ? 'bg-red-50 text-red-700' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Affärskritiska
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <ul className="divide-y divide-slate-100">
                    {loading ? <div className="p-8 text-center text-slate-400">Laddar...</div> : incidents.length === 0 ? (
                        <li className="p-8 text-center text-slate-400 italic">
                            <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-emerald-200" />
                            Inga aktiva incidenter rapporterade.
                        </li>
                    ) : incidents.map((inc, i) => (
                        <li key={i} className="p-4 hover:bg-slate-50 transition flex items-start justify-between">
                            <div className="flex gap-4">
                                <div className={`p-2 rounded-lg h-fit ${inc.severity === 'high' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                                    }`}>
                                    <ExclamationTriangleIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{inc.service}</h3>
                                    <p className="text-sm text-slate-600">
                                        {inc.count} fel registrerade • Påverkar {inc.affectedCustomers} kunder
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        {inc.impact?.payment && (
                                            <Badge variant="destructive" className="text-[10px]">Påverkar Betalning</Badge>
                                        )}
                                        {inc.impact?.compliance && (
                                            <Badge variant="outline" className="text-[10px] border-amber-300 bg-amber-50 text-amber-800">Compliance Risk</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right text-xs text-slate-400">
                                <p>Senast: {new Date(inc.lastOccurrence).toLocaleTimeString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
