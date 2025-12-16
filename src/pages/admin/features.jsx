import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import RestrictedAction from "../../components/admin/RestrictedAction";
import ImpactCheckModal from "../../components/admin/ImpactCheckModal";

/**
 * 🧩 AdminFeatures
 * Allows Admins to enable/disable platform features (Feature Toggles)
 * Backend: GET /api/admin/features, PUT /api/admin/features/:key
 */
export default function AdminFeatures() {
  const { token } = useAuth();
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  // 💥 Blast Radius State
  const [impactModalOpen, setImpactModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { key, currentState }

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:4000" ||
    console.warn("⚠️ No API URL configured, using localhost:4000");

  // 🔹 Fetch all features on mount
  useEffect(() => {
    async function fetchFeatures() {
      try {
        const res = await axios.get(`${API_URL}/api/admin/features`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeatures(res.data);
      } catch (err) {
        console.error("Failed to fetch features:", err);
        toast.error("Failed to load features");
      } finally {
        setLoading(false);
      }
    }
    fetchFeatures();
  }, [token]);

  // 🛑 Intercept action -> Show Impact Check
  function requestToggle(key, currentState) {
    setPendingAction({ key, currentState });
    setImpactModalOpen(true);
  }

  // ✅ Executed after Impact Confirmation
  async function performToggle(impactCheckId) {
    if (!pendingAction) return;
    const { key, currentState } = pendingAction;

    try {
      const res = await axios.put(
        `${API_URL}/api/admin/features/${key}`,
        { enabled: !currentState },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-impact-token": impactCheckId
          }
        }
      );

      // ✅ Update local state instantly
      setFeatures((prev) =>
        prev.map((f) => (f.key === key ? res.data : f))
      );

      toast.success(
        `Feature "${key}" ${!currentState ? "enabled" : "disabled"}`
      );
    } catch (err) {
      console.error("Failed to update feature:", err);
      toast.error("Failed to update feature");
    } finally {
      setImpactModalOpen(false);
      setPendingAction(null);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center p-6 text-gray-500">
        <svg
          className="animate-spin h-6 w-6 mr-3 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        Loading features...
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🧩 Feature Toggles</h1>

      {features.length === 0 ? (
        <p className="text-gray-600">
          No features found. Add some in the database.
        </p>
      ) : (
        <table className="min-w-full bg-white border rounded-xl shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Feature</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.key} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{f.label || f.key}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${f.enabled ? "bg-green-600" : "bg-gray-400"
                      }`}
                  >
                    {f.enabled ? "Enabled" : "Disabled"}
                  </span>
                </td>
                <td className="p-3">
                  <RestrictedAction scope="admin:features:write" requiredRole="FOUNDER">
                    <button
                      onClick={() => requestToggle(f.key, f.enabled)}
                      className={`px-4 py-1 rounded-lg text-white transition ${f.enabled
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                      {f.enabled ? "Disable" : "Enable"}
                    </button>
                  </RestrictedAction>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* 💥 Required Impact Check */}
      <ImpactCheckModal
        isOpen={impactModalOpen}
        onClose={() => setImpactModalOpen(false)}
        onConfirm={performToggle}
        actionType="feature_toggle"
        targetId={pendingAction?.key}
        params={{ enabled: !pendingAction?.currentState }}
      />
    </div>
  );
}
