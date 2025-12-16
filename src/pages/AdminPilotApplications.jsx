import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { Check, X, Mail, Building, Users, Server, FileText } from "lucide-react";

export default function AdminPilotApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${API_URL}/api/pilot`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(res.data);
        } catch (err) {
            setError("Failed to load applications.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(
                `${API_URL}/api/pilot/${id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchApplications(); // Refresh list
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-slate-500">Laddar ansökningar...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Pilotansökningar</h1>
                    <p className="text-slate-500">
                        Hantera inkommande förfrågningar från byråpilot-gaten.
                    </p>
                </div>
                <div className="text-sm text-slate-500">
                    Totalt: {applications.length} st
                </div>
            </div>

            <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Datum</th>
                            <th className="px-6 py-4">Byrå & Kontakt</th>
                            <th className="px-6 py-4">Omfattning</th>
                            <th className="px-6 py-4">Noteringar</th>
                            <th className="px-6 py-4 text-right">Åtgärd</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {applications.map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4">
                                    <StatusBadge status={app.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {format(new Date(app.createdAt), "d MMM yyyy", { locale: sv })}
                                    <br />
                                    <span className="text-xs text-slate-400">
                                        {format(new Date(app.createdAt), "HH:mm")}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900 flex items-center gap-2">
                                        <Building className="h-4 w-4 text-slate-400" />
                                        {app.agencyName}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                        <Users className="h-3 w-3" />
                                        {app.contactName} ({app.role})
                                    </div>
                                    <div className="text-xs text-slate-400 ml-5 mt-0.5">
                                        {app.email}
                                    </div>                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200">
                                            {app.clientCount} kunder
                                        </span>
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200 flex items-center gap-1">
                                            <Server className="h-3 w-3" /> {app.erpSystem}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 max-w-xs truncate" title={app.notes}>
                                    {app.notes ? (
                                        <span className="text-slate-800 italic">"{app.notes}"</span>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        {app.status === "PENDING" && (
                                            <>
                                                <button
                                                    onClick={() => updateStatus(app.id, "CONTACTED")}
                                                    className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600 transition"
                                                    title="Markera som kontaktad"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(app.id, "REJECTED")}
                                                    className="p-1.5 rounded hover:bg-red-50 text-red-600 transition"
                                                    title="Avvisa"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                        {app.status === "CONTACTED" && (
                                            <button
                                                onClick={() => updateStatus(app.id, "APPROVED")}
                                                className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition"
                                                title="Godkänn (Skapa konto)"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                    Inga ansökningar än.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        PENDING: "bg-amber-100 text-amber-700 border-amber-200",
        CONTACTED: "bg-sky-100 text-sky-700 border-sky-200",
        APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        REJECTED: "bg-slate-100 text-slate-500 border-slate-200 line-through",
    };

    const labels = {
        PENDING: "Inväntar svar",
        CONTACTED: "Kontaktad",
        APPROVED: "Godkänd",
        REJECTED: "Avvisad",
    };

    return (
        <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || "bg-gray-100 text-gray-500"
                }`}
        >
            {labels[status] || status}
        </span>
    );
}
