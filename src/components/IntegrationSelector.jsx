import { useEffect, useState } from "react";

export default function IntegrationSelector({ onSelect }) {
  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    fetch(`${API}/api/features`)
      .then((r) => r.json())
      .then((data) => setFeatures(data))
      .catch(() => setFeatures([]));
  }, []);

  const available = features.filter((f) => f.enabled);

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {available.map((f) => (
        <button
          key={f.key}
          onClick={() => onSelect(f.key)}
          className="px-4 py-2 rounded-lg border hover:bg-slate-50 transition"
        >
          {f.label}
        </button>
      ))}

      <button
        onClick={() => onSelect("manual")}
        className="px-4 py-2 rounded-lg border border-green-500 text-green-600 hover:bg-green-50"
      >
        📄 Ladda upp manuellt
      </button>
    </div>
  );
}
