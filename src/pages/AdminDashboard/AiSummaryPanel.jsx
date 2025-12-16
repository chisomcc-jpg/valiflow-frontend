// src/pages/SuperAdmin/SystemHealth.jsx
import React, { useState } from "react";
import axios from "axios";
import { ShieldCheckIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function SystemHealth() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleRefresh() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/system/summary-check?refresh=true`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setResult(res.data);
      toast.success(`AI refresh klar — ${res.data.updated} bolag uppdaterades`);
    } catch (err) {
      console.error(err);
      toast.error("Kunde inte uppdatera AI-sammanfattningar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <ShieldCheckIcon className="w-6 h-6 text-emerald-600" />
        System Health & AI Refresh
      </h1>
      <p className="text-slate-600">
        Kör en manuell AI-refresh för alla företag som saknar uppdaterad sammanfattning.
      </p>

      <button
        onClick={handleRefresh}
        disabled={loading}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold"
      >
        <ArrowPathIcon className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
        {loading ? "Uppdaterar..." : "Kör AI Refresh"}
      </button>

      {result && (
        <div className="mt-4 rounded-xl bg-white border p-4 shadow-sm">
          <pre className="text-xs text-slate-700 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
