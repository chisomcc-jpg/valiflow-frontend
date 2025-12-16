import React, { useState, useMemo } from "react";
import {
  BuildingOfficeIcon,
  UserGroupIcon,
  ShieldExclamationIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Firms() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Alla");
  const navigate = useNavigate();

  const kpis = [
    { label: "Totala byråer", value: 28, icon: BuildingOfficeIcon, color: "bg-emerald-100 text-emerald-700" },
    { label: "Aktiva byråer", value: 24, icon: UserGroupIcon, color: "bg-blue-100 text-blue-700" },
    { label: "Under granskning", value: 3, icon: ShieldExclamationIcon, color: "bg-yellow-100 text-yellow-700" },
    { label: "Totala kunder (alla byråer)", value: 312, icon: ChartBarIcon, color: "bg-cyan-100 text-cyan-700" },
  ];

  const firms = [
    { id: 1, name: "EkonomiPartner AB", org: "559123-9987", users: 12, customers: 38, invoices: 2431, risk: 7.8, status: "Aktiv" },
    { id: 2, name: "Nordic Revision AB", org: "556998-1122", users: 8, customers: 22, invoices: 1145, risk: 5.4, status: "Aktiv" },
    { id: 3, name: "Balance Consulting AB", org: "559441-0021", users: 5, customers: 14, invoices: 882, risk: 2.1, status: "Under granskning" },
    { id: 4, name: "FinVision AB", org: "559909-4411", users: 4, customers: 8, invoices: 420, risk: 1.2, status: "Inaktiv" },
  ];

  const filteredFirms = useMemo(() => {
    return firms.filter((firm) => {
      const matchQuery =
        firm.name.toLowerCase().includes(query.toLowerCase()) ||
        firm.org.includes(query);
      const matchFilter = filter === "Alla" || firm.status === filter;
      return matchQuery && matchFilter;
    });
  }, [query, filter]);

  const getRiskColor = (risk) => {
    if (risk >= 7) return "text-red-600 bg-red-50";
    if (risk >= 4) return "text-orange-600 bg-orange-50";
    return "text-emerald-600 bg-emerald-50";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Byråer på Valiflow</h1>
          <p className="text-slate-500">Hantera, analysera och övervaka alla registrerade byråer i systemet.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-2 top-2.5" />
            <input
              type="text"
              placeholder="Sök byrå..."
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
            <option>Aktiv</option>
            <option>Under granskning</option>
            <option>Inaktiv</option>
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
              <p className="text-2xl font-semibold text-slate-800 mt-1">{kpi.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Firms Table */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="text-left py-3 px-4">Byrå</th>
              <th className="text-left py-3 px-4">Org.nr</th>
              <th className="text-left py-3 px-4">Användare</th>
              <th className="text-left py-3 px-4">Kunder</th>
              <th className="text-left py-3 px-4">Fakturor</th>
              <th className="text-left py-3 px-4">Risk</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {filteredFirms.map((firm) => (
              <tr
                key={firm.id}
                className="border-b last:border-none hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate(`/admin/firms/${firm.id}`)}
              >
                <td className="py-3 px-4 font-medium text-slate-800">{firm.name}</td>
                <td className="py-3 px-4">{firm.org}</td>
                <td className="py-3 px-4">{firm.users}</td>
                <td className="py-3 px-4">{firm.customers}</td>
                <td className="py-3 px-4">{firm.invoices.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getRiskColor(firm.risk)}`}>
                    {firm.risk.toFixed(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      firm.status === "Aktiv"
                        ? "bg-emerald-50 text-emerald-700"
                        : firm.status === "Under granskning"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {firm.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-emerald-600">Visa</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Insight Panel */}
      <div className="bg-gradient-to-br from-gray-50 to-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-600" />
            AI-observationer & insikter
          </h2>
          <span className="text-xs text-slate-500">
            Uppdaterad {new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        <ul className="text-sm text-slate-600 space-y-2">
          <li>🤖 3 byråer har över 10% flaggade fakturor senaste veckan.</li>
          <li>⚠️ Regel <b>VAT mismatch</b> triggas ofta hos <b>Nordic Revision</b>.</li>
          <li>🏆 Mest aktiva byrå just nu: <b>EkonomiPartner AB</b> (2 431 fakturor).</li>
          <li>📈 Tillväxten i nya kunder är stabil (+12% denna månad).</li>
        </ul>
      </div>
    </div>
  );
}
