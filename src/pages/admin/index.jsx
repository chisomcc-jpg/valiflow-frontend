import React, { useEffect, useState } from "react";
import axios from "axios";
import AnalystCard from "../../components/admin/ControlRoom/AnalystCard";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminOverview() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await axios.get(`${API_URL}/api/admin/overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        toast.error("Failed to load dashboard stats");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  }
    
    async function fetchAiInsights() {
      try {
        const res = await axios.post(`${API_URL}/api/admin/ai/copilot`,
          { mode: "tactical" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAiData(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    Promise.all([fetchOverview(), fetchAiInsights()]); // Parallel fetch
}, [token]);

if (loading) return <p className="p-6">Loading overview...</p>;

return (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">📊 Admin Overview</h1>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-xl shadow text-center">
        <h2 className="text-xl font-semibold">Invoices</h2>
        <p className="text-3xl font-bold text-blue-600">
          {stats?.totalInvoices ?? 0}
        </p>
      </div>

      <div className="p-6 bg-white rounded-xl shadow text-center">
        <h2 className="text-xl font-semibold">Customers</h2>
        <p className="text-3xl font-bold text-green-600">
          {stats?.totalCustomers ?? 0}
        </p>
      </div>

      <div className="p-6 bg-white rounded-xl shadow text-center">
        <h2 className="text-xl font-semibold">Fraud Logs</h2>
        <p className="text-3xl font-bold text-red-600">
          {stats?.totalFraudLogs ?? 0}
        </p>
      </div>
    </div>
  </div>

      {/* 🧠 Control Room / AI Analyst */ }
<div className="mt-8">
  <h2 className="text-xl font-bold mb-4 text-gray-700">Kontrollrum</h2>
  <div className="h-64">
    <AnalystCard data={aiData} loading={!aiData} />
  </div>
</div>
    </div >
  );
}
