// frontend/src/pages/FraudLogs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ShieldAlert,
  CheckCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Brain,
  FileSearch,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

/* ==========================================================
   ✅ Valiflow – Fraud Logs (Design System v1, svenska)
   ========================================================== */
const VF = {
  navy: "#0A1E44",
  blue: "#1E5CB3",
  teal: "#14B8A6",
  gray: "#F4F7FB",
  green: "#22C55E",
  amber: "#F59E0B",
  red: "#DC2626",
  text: "#1E293B",
};

export default function FraudLogs() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

  /* ─────────────────────────────────────────────
     Hämta loggar
  ───────────────────────────────────────────── */
  async function fetchLogs(status) {
    try {
      setLoading(true);
      const res = await axios.get(
        status && status !== "all"
          ? `${API}/fraud-logs?status=${status}`
          : `${API}/fraud-logs`
      );
      setLogs(res.data);
    } catch (err) {
      console.error("Fel vid hämtning:", err);
      toast.error("Kunde inte hämta loggar.");
    } finally {
      setLoading(false);
    }
  }

  /* ─────────────────────────────────────────────
     Uppdatera status
  ───────────────────────────────────────────── */
  async function markStatus(id, status) {
    try {
      await axios.patch(`${API}/fraud-logs/${id}`, { status });
      setLogs((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status } : l))
      );
      toast.success("Status uppdaterad.");
    } catch (err) {
      console.error("Fel vid statusuppdatering:", err);
      toast.error("Kunde inte uppdatera status.");
    }
  }

  /* ─────────────────────────────────────────────
     Skicka feedback till AI
  ───────────────────────────────────────────── */
  async function sendFeedback(log, correct) {
    try {
      await axios.post(`${API}/api/feedback`, {
        invoiceId: log.invoiceId,
        feedback: correct ? "correct" : "incorrect",
        aiDecision: log.severity,
      });
      toast.success("Tack för din feedback!");
      setExpanded(null);
    } catch {
      toast.error("Kunde inte skicka feedback.");
    }
  }

  useEffect(() => {
    fetchLogs(filter);
  }, [filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 animate-pulse">
        ⏳ Laddar AI-loggar…
      </div>
    );
  }

  /* KPI-beräkningar */
  const total = logs.length;
  const high = logs.filter((l) => l.severity === "high").length;
  const unresolved = logs.filter((l) => l.status !== "resolved").length;
  const aiAvg =
    logs.length > 0
      ? (
          (logs.reduce(
            (sum, l) => sum + (Number(l.ai_confidence) || 0.8),
            0
          ) /
            logs.length) *
          100
        ).toFixed(0)
      : 0;

  return (
    <div className="min-h-screen" style={{ background: VF.gray }}>
      {/* ───────────────────────────────
          TRUST LAYER – Header
      ─────────────────────────────── */}
      <header
        className="px-8 py-5 flex justify-between items-center"
        style={{
          background: `linear-gradient(90deg, ${VF.navy} 0%, ${VF.blue} 100%)`,
          color: "white",
        }}
      >
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-400" />
          Bedrägeriloggar
        </h1>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/10 border-none rounded-lg px-3 py-2 text-sm text-white cursor-pointer"
          >
            <option value="all">Alla</option>
            <option value="unreviewed">Ej granskade</option>
            <option value="resolved">Åtgärdade</option>
          </select>
          <button
            onClick={() => fetchLogs(filter)}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm"
          >
            <RefreshCw className="h-4 w-4" /> Uppdatera
          </button>
        </div>
      </header>

      {/* ───────────────────────────────
          EXECUTIVE LAYER – KPI-kort
      ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-4 gap-4 mt-8">
        <KpiCard title="Totalt flaggade" value={total} color={VF.blue} icon={AlertTriangle} />
        <KpiCard title="Hög risk" value={high} color={VF.red} icon={ShieldAlert} />
        <KpiCard title="Ej åtgärdade" value={unresolved} color={VF.amber} icon={Clock} />
        <KpiCard title="AI-precision" value={`${aiAvg}%`} color={VF.teal} icon={Brain} />
      </div>

      {/* ───────────────────────────────
          ANALYTICAL LAYER – Tabell
      ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mt-8 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(30,92,179,0.05)] overflow-hidden">
        <table className="w-full text-sm text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Leverantör</th>
              <th className="py-3 px-4 text-left">Meddelande</th>
              <th className="py-3 px-4 text-left">Typ</th>
              <th className="py-3 px-4 text-left">Risknivå</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Datum</th>
              <th className="py-3 px-4 text-right">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-slate-400">
                  Inga loggar tillgängliga.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr
                    onClick={() =>
                      setExpanded(expanded === log.id ? null : log.id)
                    }
                    className={`border-t hover:bg-slate-50 transition cursor-pointer ${
                      log.severity === "high"
                        ? "bg-red-50/40"
                        : log.severity === "medium"
                        ? "bg-amber-50/40"
                        : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-600">#{log.id}</td>
                    <td className="py-3 px-4 font-medium">
                      {log.supplier || "—"}
                    </td>
                    <td className="py-3 px-4">{log.message}</td>
                    <td className="py-3 px-4 text-slate-500">{log.type}</td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        log.severity === "high"
                          ? "text-red-600"
                          : log.severity === "medium"
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    >
                      {log.severity}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(log.createdAt).toLocaleString("sv-SE")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {expanded === log.id ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </td>
                  </tr>

                  {/* ───────────────────────────────
                      INSIGHT LAYER – AI-förklaring
                  ─────────────────────────────── */}
                  <AnimatePresence>
                    {expanded === log.id && (
                      <motion.tr
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-50 border-t"
                      >
                        <td colSpan="8" className="p-5">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                              <FileSearch className="w-4 h-4 text-slate-600" />
                              <h3 className="font-semibold text-slate-700">
                                AI-analys och riskbedömning
                              </h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {log.ai_reasoning ||
                                "Ingen AI-förklaring tillgänglig för denna post."}
                            </p>

                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-teal-500"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${
                                      ((log.ai_confidence || 0.8) * 100).toFixed(
                                        0
                                      )}%`,
                                  }}
                                  transition={{ duration: 1 }}
                                />
                              </div>
                              <span className="text-xs text-slate-500">
                                Confidence:{" "}
                                {((log.ai_confidence || 0.8) * 100).toFixed(0)}%
                              </span>
                            </div>

                            <div className="flex gap-3 mt-2">
                              <button
                                onClick={() => sendFeedback(log, true)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm flex items-center gap-1"
                              >
                                <CheckCircle className="h-4 w-4" /> AI hade rätt
                              </button>
                              <button
                                onClick={() => sendFeedback(log, false)}
                                className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm flex items-center gap-1"
                              >
                                <X className="h-4 w-4" /> AI hade fel
                              </button>
                              <button
                                onClick={() => markStatus(log.id, "resolved")}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm flex items-center gap-1 ml-auto"
                              >
                                Markera som åtgärdad
                              </button>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==========================================================
   Komponenter
========================================================== */
function KpiCard({ title, value, color, icon: Icon }) {
  return (
    <div
      className="p-5 rounded-2xl text-white flex flex-col justify-between shadow-[0_2px_8px_rgba(30,92,179,0.05)]"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-90">{title}</p>
        <Icon className="w-5 h-5 opacity-90" />
      </div>
      <h2 className="text-2xl font-semibold mt-2">{value}</h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const color =
    status === "resolved"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  const text = status === "resolved" ? "Åtgärdad" : "Ej granskad";
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      {text}
    </span>
  );
}
