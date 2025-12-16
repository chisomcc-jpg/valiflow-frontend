import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function FirmDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🧠 Dummy firm data
  const [firm, setFirm] = useState({
    id,
    name: "EkonomiPartner AB",
    org: "559123-9987",
    users: 12,
    customers: 38,
    invoices: 2431,
    risk: 7.8,
    status: "Aktiv",
  });

  const [showModal, setShowModal] = useState(false);
  const [reviewNote, setReviewNote] = useState(null);

  const riskTrend = [
    { m: "Apr", risk: 6.2 },
    { m: "Maj", risk: 6.9 },
    { m: "Jun", risk: 7.1 },
    { m: "Jul", risk: 7.4 },
    { m: "Aug", risk: 7.6 },
    { m: "Sep", risk: 7.8 },
  ];

  const handleConfirmReview = (reason) => {
    setFirm((prev) => ({ ...prev, status: "Under granskning" }));
    setReviewNote({
      reason,
      time: new Date().toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    // ⚙️ (senare: PATCH till backend)
    // await axios.patch(`/api/firms/${firm.id}`, { status: "Under granskning", reason });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Tillbaka
        </button>
        <div className="flex gap-3">
          {firm.status !== "Under granskning" && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600"
            >
              Sätt i granskning
            </button>
          )}
          <button className="px-4 py-2 bg-gray-100 text-slate-700 text-sm rounded-lg hover:bg-gray-200">
            Exportera data
          </button>
        </div>
      </div>

      {/* Byråinfo */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">
          {firm.name}
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Org.nr {firm.org} • {firm.users} användare • {firm.customers} kunder •{" "}
          {firm.invoices} fakturor
        </p>

        <div className="flex items-center gap-2 mb-6">
          <span
            className={`px-2 py-1 text-xs rounded-lg ${
              firm.status === "Under granskning"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {firm.status}
          </span>
          <span className="px-2 py-1 text-xs rounded-lg bg-red-50 text-red-700">
            Risk {firm.risk}
          </span>
        </div>

        {reviewNote && (
          <div className="mb-4 text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-700">
            🔍 <b>Granskning initierad:</b> {reviewNote.time} <br />
            Orsak: <i>{reviewNote.reason}</i>
          </div>
        )}

        {/* Diagram + senaste fakturor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border rounded-xl p-4">
            <p className="font-medium text-slate-700 mb-2">Risktrend (6 mån)</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={riskTrend}>
                <defs>
                  <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#10b981"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="#10b981"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="m" stroke="#94a3b8" />
                <YAxis domain={[0, 10]} stroke="#94a3b8" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#10b981"
                  fill="url(#riskFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="border rounded-xl p-4">
            <p className="font-medium text-slate-700 mb-2">Senaste fakturor</p>
            <ul className="text-sm text-slate-600 space-y-2">
              <li>
                #INV-3101 – Aconto Foods – 12 450 kr –{" "}
                <span className="text-red-600">Flaggad</span>
              </li>
              <li>
                #INV-3097 – Nordtrade AB – 8 120 kr –{" "}
                <span className="text-green-600">Godkänd</span>
              </li>
              <li>
                #INV-3090 – Kopparberg Konsult – 22 980 kr –{" "}
                <span className="text-yellow-600">Under granskning</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ReviewConfirmModal
        open={showModal}
        onClose={() => setShowModal(false)}
        firm={firm}
        onConfirm={handleConfirmReview}
      />
    </div>
  );
}

/* ---------------- ReviewConfirm Modal ---------------- */
function ReviewConfirmModal({ open, onClose, firm, onConfirm }) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl border p-6 mx-4">
        <h3 className="text-lg font-semibold text-slate-800 mb-2 flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
          Sätt <span className="text-emerald-700">{firm.name}</span> i granskning
        </h3>
        <p className="text-slate-500 text-sm mb-4">
          Ange orsak till granskningen. Åtgärden loggas och pausar tillfälligt
          byråns automatiska flöden.
        </p>

        <label className="text-sm font-medium text-slate-700">Orsak</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="T.ex. hög risknivå, många flaggade fakturor..."
          rows={3}
          className="w-full mt-1 p-2 border rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500"
        />

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 text-slate-700 rounded-lg hover:bg-gray-200 transition"
          >
            Avbryt
          </button>
          <button
            onClick={() => {
              onConfirm(reason);
              onClose();
              setReason("");
            }}
            disabled={!reason.trim()}
            className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition"
          >
            Bekräfta granskning
          </button>
        </div>
      </div>
    </div>
  );
}
