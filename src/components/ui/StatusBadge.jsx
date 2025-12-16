// src/components/ui/StatusBadge.jsx
import React from "react";

export default function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();

  const map = {
    approved: {
      cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      label: "Godkänd",
    },
    rejected: {
      cls: "bg-red-50 text-red-700 border border-red-200",
      label: "Avvisad",
    },
    flagged: {
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
      label: "Flaggad",
    },
    review: {
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
      label: "Granskning",
    },
    pending: {
      cls: "bg-amber-50 text-amber-700 border border-amber-200",
      label: "Pending",
    },
    new: {
      cls: "bg-slate-50 text-slate-700 border border-slate-200",
      label: "Ny",
    },
    deleted: {
      cls: "bg-slate-100 text-slate-500 border border-slate-300",
      label: "Raderad",
    },
  };

  const meta =
    map[s] || {
      cls: "bg-slate-50 text-slate-700 border border-slate-200",
      label: status || "—",
    };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-full ${meta.cls}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {meta.label}
    </span>
  );
}
