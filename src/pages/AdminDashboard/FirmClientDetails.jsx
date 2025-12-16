import React, { useMemo, useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BanknotesIcon,
  UsersIcon
} from "@heroicons/react/24/outline";

export default function FirmClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSupportMenu, setShowSupportMenu] = useState(false);
  const [opsData, setOpsData] = useState(null);

  useEffect(() => {
    async function loadOpsData() {
      try {
        const data = await adminService.getClientDetails(id);
        setOpsData(data);
      } catch (e) {
        console.error("Failed to load ops data", e);
      }
    }
    loadOpsData();
  }, [id]);

  const client = useMemo(() => {
    return opsData?.client || {
      name: "Laddar...",
      org: "-",
      bureau: "-",
      status: "-",
      risk: 0,
      users: []
    };
  }, [opsData]);

  const activitySignals = opsData?.activitySignals || {
    lastInvoice: { time: "-", status: "neutral" },
    lastLogin: { time: "-", user: "-" },
    lastError: null
  };

  const economics = opsData?.economics || {
    revenue: 0,
    aiCost: 0,
    margin: "neutral"
  };

  const handleSupportAction = async (action) => {
    const userId = client.users?.[0]?.id || client.id;
    if (!userId) {
      alert("Ingen användare hittades för detta företag.");
      return;
    }

    try {
      if (action === "reset-password") {
        await adminService.resetPassword(userId);
        alert("Återställningslänk skickad.");
      }
      if (action === "force-logout") {
        await adminService.forceLogout(userId);
        alert("Användare utloggad.");
      }
      if (action === "reset-2fa") {
        alert("Kräver IMPACT-token (Medium Support).");
      }
      if (action === "impersonate") {
        await adminService.impersonate(userId);
        alert("Shadow mode aktiverat.");
      }
    } catch (e) {
      const msg = e.response?.data?.error || "Ett fel uppstod";
      alert(`Fel: ${msg}`);
    }
    setShowSupportMenu(false);
  };

  const statusColor =
    client.status === "Aktiv"
      ? "bg-emerald-50 text-emerald-700"
      : client.status === "Under granskning"
      ? "bg-yellow-50 text-yellow-700"
      : "bg-gray-100 text-gray-500";

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-600 hover:text-slate-800 text-sm"
      >
        <ArrowLeftIcon className="w-4 h-4 mr-1" />
        Tillbaka till kunder
      </button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">{client.name}</h1>
          <p className="text-sm text-gray-500">
            Org.nr <b>{client.org}</b> • Byrå <b>{client.bureau}</b>
          </p>
          <div className="flex gap-2 mt-2">
            <span className={`px-2 py-1 rounded text-xs ${statusColor}`}>
              {client.status}
            </span>
            <span className="px-2 py-1 rounded text-xs bg-emerald-50 text-emerald-700">
              Risk {client.risk.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowSupportMenu(!showSupportMenu)}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            Supportåtgärder ▼
          </button>
          {showSupportMenu && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow w-48">
              <button onClick={() => handleSupportAction("reset-password")} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Återställ lösenord</button>
              <button onClick={() => handleSupportAction("reset-2fa")} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Återställ 2FA</button>
              <button onClick={() => handleSupportAction("force-logout")} className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Tvinga utloggning</button>
              <button onClick={() => handleSupportAction("impersonate")} className="block w-full px-4 py-2 text-left text-sm text-yellow-700 hover:bg-yellow-50">Logga in som</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded p-4 flex gap-3">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          <div>
            <div className="text-xs text-gray-500">Senaste faktura</div>
            <div className="text-sm font-semibold">{activitySignals.lastInvoice.time}</div>
          </div>
        </div>

        <div className="border rounded p-4 flex gap-3">
          <UsersIcon className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-xs text-gray-500">Senaste inloggning</div>
            <div className="text-sm font-semibold">{activitySignals.lastLogin.time}</div>
          </div>
        </div>

        <div className="border rounded p-4 flex gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
          <div>
            <div className="text-xs text-gray-500">Senaste fel</div>
            <div className="text-sm font-semibold">{activitySignals.lastError || "Inga"}</div>
          </div>
        </div>
      </div>

      <div className="border rounded p-5">
        <h3 className="font-semibold flex gap-2 items-center">
          <BanknotesIcon className="w-5 h-5" />
          Ekonomi
        </h3>
        <div className="flex gap-8 mt-3 text-sm">
          <div>MRR: <b>{economics.revenue} SEK</b></div>
          <div>AI-kostnad: <b>{economics.aiCost} SEK</b></div>
          <div>Marginal: <b>{economics.margin}</b></div>
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal client={client} onClose={() => setShowReviewModal(false)} />
      )}
    </div>
  );
}

/* Review Modal */
function ReviewModal({ onClose, client }) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold">Sätt {client.name} i granskning</h3>
          <button onClick={onClose}><XMarkIcon className="w-5 h-5" /></button>
        </div>
        <select
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="">Välj orsak</option>
          <option>AI-fel</option>
          <option>Misstänkt IBAN</option>
          <option>Manuellt stickprov</option>
        </select>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Avbryt</button>
          <button disabled={!reason} className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50">
            Bekräfta
          </button>
        </div>
      </div>
    </div>
  );
}
