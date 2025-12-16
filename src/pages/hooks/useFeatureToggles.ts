// frontend/src/hooks/useFeatureToggles.ts
import { useEffect, useState } from "react";
import axios from "axios";

export interface FeatureToggle {
  key: string;
  label?: string | null;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 🧠 useFeatureToggles Hook
 * Fetches feature toggles from backend and listens for live updates (SSE)
 */
export function useFeatureToggles() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    let es: EventSource | null = null;
    let closed = false;

    async function loadInitial() {
      try {
        const res = await axios.get<FeatureToggle[]>(`${API_URL}/api/admin/features`);
        const mapped: Record<string, boolean> = {};
        res.data.forEach((t) => (mapped[t.key] = t.enabled));
        if (!closed) setToggles(mapped);
      } catch (err) {
        console.error("❌ Failed to fetch toggles:", err);
      } finally {
        if (!closed) setLoading(false);
      }
    }

    // Initial fetch
    loadInitial();

    // Connect to SSE stream
    const url = `${API_URL}/api/features/stream`;
    es = new EventSource(url);

    es.addEventListener("init", (event) => {
      const map = JSON.parse((event as MessageEvent).data);
      setToggles(map);
      setLoading(false);
    });

    es.addEventListener("feature_update", (event) => {
      const { key, enabled } = JSON.parse((event as MessageEvent).data);
      setToggles((prev) => ({ ...prev, [key]: enabled }));
    });

    es.onerror = () => {
      // SSE auto-reconnects; optional logging
    };

    return () => {
      closed = true;
      es?.close();
    };
  }, [API_URL]);

  return { toggles, loading };
}
