import { useEffect, useState } from "react";

export default function FortnoxConnect() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("fortnox") === "connected") {
      setConnected(true);
      url.searchParams.delete("fortnox");
      window.history.replaceState({}, "", url.pathname);
    }
  }, []);

  const handleConnect = () => {
    window.location.href = `${API}/auth/fortnox/start`; // ✅ correct route
  };

  return (
    <div className="mb-4">
      {!connected ? (
        <button
          onClick={handleConnect}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          🔗 Koppla Fortnox
        </button>
      ) : (
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
          ✅ Ansluten till Fortnox
        </span>
      )}
    </div>
  );
}
