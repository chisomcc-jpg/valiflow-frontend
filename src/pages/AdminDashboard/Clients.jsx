import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  ShieldExclamationIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function Clients() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Alla");
  const navigate = useNavigate();

  // Main Data State
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  // KPI Real Data
  const kpis = [
    { label: "Totala företag", value: total || "-", icon: BuildingOfficeIcon, color: "bg-emerald-100 text-emerald-700" },
    // Removed fake KPIs (New, Under Review, Risk Index) as backend doesn't provide them yet.
  ];

  // Debounce search query
  const [debouncedQuery, setDebouncedQuery] = useState("");
  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Debouce Effect
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch Effect
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await adminService.getClients(page, 20, debouncedQuery);
        setClients(res.items);
        setTotal(res.total);
      } catch (e) {
        console.error("Failed to load clients");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, debouncedQuery]);

  const handleNext = () => setPage(p => p + 1);
  const handlePrev = () => setPage(p => Math.max(1, p - 1));

  // Selection Logic
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(clients.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = (action) => {
    // 🚩 DISABLED: Backend requires Impact Check, Frontend has no modal.
    alert("Åtgärd inaktiverad: Backend kräver Impact Check (ej implementerat)");
  };

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
          <h1 className="text-2xl font-semibold text-slate-800">Företag & Kunder</h1>
          <p className="text-slate-500">Överblick över alla företagskonton som hanteras av byråer i Valiflow.</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-4 bg-emerald-50 w-full p-2 rounded-lg border border-emerald-100 animate-fadeIn">
            <span className="font-semibold text-emerald-800 ml-2">{selectedIds.length} valda</span>
            <div className="h-6 w-px bg-emerald-200"></div>
            <button
              onClick={() => handleBulkAction('pause')}
              className="px-3 py-1 bg-white border border-emerald-200 text-emerald-700 rounded text-sm hover:bg-emerald-100"
            >
              Pausa konton
            </button>
            <button
              onClick={() => handleBulkAction('email')}
              className="px-3 py-1 bg-white border border-emerald-200 text-emerald-700 rounded text-sm hover:bg-emerald-100"
            >
              Skicka e-post
            </button>
            <button onClick={() => setSelectedIds([])} className="ml-auto text-sm text-emerald-600 hover:underline mr-2">Avbryt</button>
          </div>
        ) : (
          <>
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Sök på företagsnamn eller org.nr..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              {["Alla", "Aktiv", "Under granskning", "Inaktiv"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === status
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white text-slate-600 hover:bg-gray-50 border"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white border rounded-2xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition">
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

      {/* Table */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden mb-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-slate-500 text-xs uppercase tracking-wider">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={clients.length > 0 && selectedIds.length === clients.length}
                  disabled={loading}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              <th className="py-3 px-4 font-semibold">Företagsnamn</th>
              <th className="py-3 px-4 font-semibold">Org.nr</th>
              <th className="py-3 px-4 font-semibold">Byrå</th>
              <th className="py-3 px-4 font-semibold">Fakturor</th>
              <th className="py-3 px-4 font-semibold">Riskindex</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Senast aktiv</th>
              <th className="text-right py-3 px-4 font-semibold">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="py-8 text-center text-gray-500">Laddar företag...</td></tr>
            ) : clients.map((c) => (
              <tr key={c.id} className="border-b last:border-none hover:bg-gray-50 transition">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c.id)}
                    onChange={() => handleSelectOne(c.id)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
                <td className="py-3 px-4 font-medium text-slate-800">{c.name}</td>
                <td className="py-3 px-4">{c.org}</td>
                <td className="py-3 px-4 text-slate-600">{c.bureau}</td>
                <td className="py-3 px-4">{c.invoices}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getRiskColor(c.risk)}`}>
                    {c.risk.toFixed(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-medium ${c.status === "Aktiv"
                      ? "bg-emerald-50 text-emerald-700"
                      : c.status === "Under granskning"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">{c.lastActive}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => navigate(`/admin/clients/${c.id}`)}
                    className="text-emerald-600 hover:text-emerald-800 text-sm"
                  >
                    Visa
                  </button>
                </td>
              </tr>
            ))}
            {!loading && clients.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-400 text-sm">
                  Inga företag matchar sökningen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center px-2">
        <span className="text-sm text-gray-500">
          Visar sidan {page} av {Math.ceil(total / 20)} ({total} resultat)
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={handlePrev}
            className="px-3 py-1 border rounded bg-white text-sm disabled:opacity-50"
          >
            Föregående
          </button>
          <button
            disabled={page >= Math.ceil(total / 20)}
            onClick={handleNext}
            className="px-3 py-1 border rounded bg-white text-sm disabled:opacity-50"
          >
            Nästa
          </button>
        </div>
      </div>

      {/* AI Insights */}
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
          <li>🤖 4 företag har ökat risknivå senaste veckan.</li>
          <li>⚠️ 2 företag har dubblettfakturor med identiska IBAN.</li>
          <li>🏆 Mest aktivt företag: <b>Nordic Trade AB</b> (312 fakturor).</li>
          <li>🕵️ 5 företag under manuell granskning av AI-systemet.</li>
        </ul>

        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition">
            Se detaljanalys
          </button>
          <button className="px-4 py-2 bg-gray-100 text-slate-700 text-sm rounded-lg hover:bg-gray-200 transition">
            Uppdatera insikter
          </button>
        </div>
      </div>
    </div>
  );
}
