import React, { useEffect, useState } from "react";

export default function AiJobsReview() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState("");

  useEffect(() => {
    setLoading(true);
    const query = selectedCustomer ? `?customerId=${selectedCustomer}` : "";
    fetch(`/api/gpt-jobs${query}`)
      .then((res) => {
        if (!res.ok) throw new Error("Nätverksfel vid hämtning av GPT-jobb");
        return res.json();
      })
      .then(setJobs)
      .catch((err) => {
        console.error("❌ GPT-jobb-fel:", err);
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }, [selectedCustomer]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-slate-800">
        AI Jobböversikt
      </h1>

      {/* Filterfält */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">
            Filtrera per kund-ID
          </label>
          <input
            type="text"
            placeholder="Ex: 123"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        {selectedCustomer && (
          <button
            onClick={() => setSelectedCustomer("")}
            className="text-sm text-emerald-700 hover:underline mt-5"
          >
            Rensa filter
          </button>
        )}
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        {loading ? (
          <p className="text-slate-500 text-sm">⏳ Hämtar GPT-jobb...</p>
        ) : jobs.length === 0 ? (
          <p className="text-slate-500 text-sm">
            Inga AI-jobb hittades för vald kund.
          </p>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-2">
              Totalt <span className="font-semibold">{jobs.length}</span> jobb
            </p>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b text-slate-600">
                  <th className="py-2">Jobb-ID</th>
                  <th className="py-2">Kund-ID</th>
                  <th className="py-2">Faktura-ID</th>
                  <th className="py-2">Modell</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Skapad</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b last:border-0 hover:bg-slate-50 transition"
                  >
                    <td className="py-2 text-slate-700 font-medium">
                      {job.id.slice(0, 10)}…
                    </td>
                    <td className="py-2 text-slate-600">
                      {job.customerId ?? "-"}
                    </td>
                    <td className="py-2 text-slate-600">
                      {job.invoiceId ?? "-"}
                    </td>
                    <td className="py-2 text-slate-600">{job.model}</td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          job.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : job.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : job.status === "active"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="py-2 text-slate-500">
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleString("sv-SE")
                        : "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
