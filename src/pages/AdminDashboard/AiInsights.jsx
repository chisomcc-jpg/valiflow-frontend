import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CpuChipIcon,
  ClockIcon,
  ChartBarIcon,
  EyeIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AiInsights() {
  const [logs, setLogs] = useState([]);
  const [trends, setTrends] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  async function fetchInsights() {
    try {
      const token = localStorage.getItem("token");
      const [insightsRes, trendsRes] = await Promise.all([
        axios.get(`${API_URL}/api/ai/insights`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/api/ai/trends`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setLogs(insightsRes.data);
      setTrends(trendsRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Kunde inte hämta AI-loggar");
    }
  }

  async function handleRefresh() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admin/system/summary-check?refresh=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`AI Refresh klar – ${res.data.updated} företag uppdaterade`);
      await fetchInsights();
    } catch (err) {
      toast.error("AI Refresh misslyckades");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
            <CpuChipIcon className="w-6 h-6 text-emerald-600" />
            AI-Analys & Loggar
          </h1>
          <p className="text-slate-500">
            Översikt över senaste AI-insikter, trender och analyser.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Uppdaterar..." : "Kör AI-Refresh"}
        </button>
      </div>

      {/* Trendgraf */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-emerald-600" />
          Risknivå & AI-konfidens över tid
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="avgRisk"
              stroke="#ef4444"
              name="Risknivå"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="avgConfidence"
              stroke="#10b981"
              name="AI-konfidens"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Loggar */}
      <div className="bg-white border rounded-2xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-emerald-600" />
            Senaste AI-loggar
          </h2>
          <span className="text-sm text-slate-500">{logs.length} poster</span>
        </div>

        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-start justify-between p-5 hover:bg-slate-50 cursor-pointer transition"
              onClick={() => setSelected(log)}
            >
              <div>
                <p className="text-sm text-slate-700 font-medium">
                  {log.company?.name ?? "Okänt bolag"}
                </p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {log.summary}
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                {new Date(log.generatedAt).toLocaleString("sv-SE", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal för detaljerad insikt */}
      {selected && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
            <h3 className="font-semibold text-slate-800 text-lg mb-2">
              {selected.company?.name}
            </h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
              {selected.summary}
            </p>
            <div className="mt-4 border-t pt-3 text-xs text-slate-500">
              <p>
                Genererad:{" "}
                {new Date(selected.generatedAt).toLocaleString("sv-SE")}
              </p>
              {selected.meta && (
                <pre className="mt-2 bg-slate-50 p-2 rounded-lg overflow-auto max-h-40">
                  {JSON.stringify(selected.meta, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
