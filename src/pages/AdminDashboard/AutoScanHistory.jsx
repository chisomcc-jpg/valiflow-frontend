import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AutoScanHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchLogs() {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/admin/auto-scan/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("❌ Failed to load AutoScan logs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  const statusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-700">
            <CheckCircleIcon className="h-4 w-4" /> Completed
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-red-100 text-red-700">
            <XCircleIcon className="h-4 w-4" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-yellow-100 text-yellow-700">
            <ArrowPathIcon className="h-4 w-4 animate-spin" /> Running
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 text-slate-500 animate-pulse">
        Loading auto-scan history…
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <ClockIcon className="h-5 w-5 text-indigo-600" />
          Auto-Scan History
        </h3>
        <button
          onClick={fetchLogs}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Refresh
        </button>
      </div>

      {logs.length === 0 ? (
        <p className="text-sm text-slate-500 italic">
          No autoscan records yet. The nightly job runs at 02:00.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Total Invoices</th>
                <th className="py-2 px-3">Flagged</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Duration</th>
                <th className="py-2 px-3">Error</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const started = new Date(log.startedAt);
                const ended = log.completedAt ? new Date(log.completedAt) : null;
                const duration =
                  started && ended
                    ? `${Math.round((ended - started) / 1000)}s`
                    : "—";
                return (
                  <tr
                    key={log.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-2 px-3 text-slate-700">
                      {started.toLocaleString()}
                    </td>
                    <td className="py-2 px-3">{log.totalInvoices ?? "—"}</td>
                    <td
                      className={`py-2 px-3 font-medium ${
                        log.flaggedInvoices > 0
                          ? "text-red-600"
                          : "text-slate-600"
                      }`}
                    >
                      {log.flaggedInvoices ?? 0}
                    </td>
                    <td className="py-2 px-3">{statusBadge(log.status)}</td>
                    <td className="py-2 px-3 text-slate-500">{duration}</td>
                    <td className="py-2 px-3 text-slate-500">
                      {log.errorMessage || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
