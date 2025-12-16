// src/pages/AdminDashboard/Invoices.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DocumentTextIcon,
  ShieldExclamationIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

export default function InvoicesAdmin() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Alla");
  const navigate = useNavigate();

  const kpis = [
    {
      label: "Totala fakturor",
      value: 12841,
      color: "bg-emerald-100 text-emerald-700",
      icon: DocumentTextIcon,
    },
    {
      label: "Flaggade fakturor",
      value: 423,
      color: "bg-yellow-100 text-yellow-700",
      icon: ShieldExclamationIcon,
    },
    {
      label: "Under granskning",
      value: 118,
      color: "bg-orange-100 text-orange-700",
      icon: FunnelIcon,
    },
    {
      label: "Hög risk (AI ≥7)",
      value: 54,
      color: "bg-red-100 text-red-700",
      icon: ArrowTrendingUpIcon,
    },
  ];

  const invoices = [
    {
      id: "#INV-3094",
      bureau: "EkonomiPartner AB",
      company: "FinTechify AB",
      amount: "12 430 kr",
      date: "2025-10-22",
      risk: 7.8,
      aiStatus: "IBAN mismatch, VAT check fail",
      status: "Flaggad",
    },
    {
      id: "#INV-3091",
      bureau: "Balance Consulting",
      company: "Nordic Trade AB",
      amount: "9 980 kr",
      date: "2025-10-21",
      risk: 5.6,
      aiStatus: "Amount anomaly",
      status: "Under granskning",
    },
    {
      id: "#INV-3088",
      bureau: "FinVision AB",
      company: "Svea Tools AB",
      amount: "3 420 kr",
      date: "2025-10-20",
      risk: 2.3,
      aiStatus: "OK",
      status: "Godkänd",
    },
    {
      id: "#INV-3085",
      bureau: "Nordic Revision AB",
      company: "AB Lumos",
      amount: "18 210 kr",
      date: "2025-10-19",
      risk: 8.9,
      aiStatus: "Duplicate IBAN, Unusual pattern",
      status: "Flaggad",
    },
  ];

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchQuery =
        inv.id.toLowerCase().includes(query.toLowerCase()) ||
        inv.company.toLowerCase().includes(query.toLowerCase()) ||
        inv.bureau.toLowerCase().includes(query.toLowerCase());
      const matchFilter = filter === "Alla" || inv.status === filter;
      return matchQuery && matchFilter;
    });
  }, [query, filter]);

  const getRiskColor = (risk) => {
    if (risk >= 7) return "bg-red-50 text-red-700";
    if (risk >= 4) return "bg-yellow-50 text-yellow-700";
    return "bg-emerald-50 text-emerald-700";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Fakturor (Global överblick)
          </h1>
          <p className="text-slate-500">
            Se alla fakturor som hanteras inom Valiflow, oavsett byrå eller kund.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-2 top-2.5" />
            <input
              type="text"
              placeholder="Sök faktura, företag, byrå..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 pr-3 py-2 border rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option>Alla</option>
            <option>Godkänd</option>
            <option>Under granskning</option>
            <option>Flaggad</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-white border rounded-2xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition"
          >
            <div>
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">
                {kpi.value.toLocaleString()}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color}`}
            >
              <kpi.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Invoice Table */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="text-left py-3 px-4">Faktura-ID</th>
              <th className="text-left py-3 px-4">Byrå</th>
              <th className="text-left py-3 px-4">Företag</th>
              <th className="text-left py-3 px-4">Belopp</th>
              <th className="text-left py-3 px-4">Datum</th>
              <th className="text-left py-3 px-4">Risk</th>
              <th className="text-left py-3 px-4">AI-status</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Åtgärd</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr
                key={inv.id}
                className={`border-b last:border-none hover:bg-gray-50 transition ${
                  inv.risk >= 7
                    ? "bg-red-50/30"
                    : inv.risk >= 4
                    ? "bg-yellow-50/30"
                    : ""
                }`}
              >
                <td className="py-3 px-4 font-medium text-slate-800">
                  {inv.id}
                </td>
                <td className="py-3 px-4">{inv.bureau}</td>
                <td className="py-3 px-4">{inv.company}</td>
                <td className="py-3 px-4">{inv.amount}</td>
                <td className="py-3 px-4 text-slate-500">{inv.date}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${getRiskColor(
                      inv.risk
                    )}`}
                    title={`Regelträffar: ${inv.aiStatus}`}
                  >
                    {inv.risk.toFixed(1)}
                  </span>
                </td>
                <td
                  className="py-3 px-4 text-slate-700"
                  title={inv.aiStatus}
                >
                  {inv.aiStatus.length > 25
                    ? inv.aiStatus.slice(0, 25) + "..."
                    : inv.aiStatus}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      inv.status === "Godkänd"
                        ? "bg-emerald-50 text-emerald-700"
                        : inv.status === "Under granskning"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() =>
                      navigate(`/admin/invoices/${inv.id.replace("#", "")}`)
                    }
                    className="text-emerald-600 hover:text-emerald-800 text-sm"
                  >
                    Visa
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="py-6 text-center text-gray-400 text-sm"
                >
                  Inga fakturor matchar sökningen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* AI Insight Panel */}
      <div className="bg-gradient-to-br from-gray-50 to-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-600" />
            AI-observationer & riskinsikter
          </h2>
          <span className="text-xs text-slate-500">
            Uppdaterad{" "}
            {new Date().toLocaleTimeString("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <ul className="text-sm text-slate-600 space-y-2">
          <li>🤖 54 fakturor har triggats av regel <b>Duplicate IBAN</b>.</li>
          <li>
            ⚠️ Högsta andel flaggningar: <b>Balance Consulting</b> (7.1%).
          </li>
          <li>💹 Genomsnittlig risknivå har ökat 9% senaste veckan.</li>
          <li>
            🧩 Företag med flest AI-varningar: <b>FinTechify AB</b>.
          </li>
        </ul>

        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition">
            Se AI-rapport
          </button>
          <button className="px-4 py-2 bg-gray-100 text-slate-700 text-sm rounded-lg hover:bg-gray-200 transition">
            Uppdatera insikter
          </button>
        </div>
      </div>
    </div>
  );
}
