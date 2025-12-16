// src/hooks/useSSEChannel.js
// ---------------------------------------------------------
// 🔌 Generic SSE-hook med enkel reconnect & JSON-dekodning
// ---------------------------------------------------------

import { useEffect, useRef } from "react";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

/**
 * useSSEChannel
 *
 * @param {Object} options
 * @param {string} options.path - URL-path efter API-bas, t.ex. `/api/invoices/stream`
 * @param {boolean} [options.enabled=true] - om SSE ska vara aktiv
 * @param {Record<string, any>} [options.query] - query params som objekt
 * @param {(payload: any) => void} [options.onRaw] - får raw JSON payload
 * @param {(type: string, data: any) => void} [options.onTyped] - får payload.type + payload.data
 * @param {(err: any) => void} [options.onError] - custom error handler
 * @param {string} [options.description] - används i loggar/toasts
 */
export function useSSEChannel({
  path,
  enabled = true,
  query,
  onRaw,
  onTyped,
  onError,
  description = "SSE",
}) {
  const esRef = useRef(null);

  useEffect(() => {
    if (!enabled || !path) return;

    // Bygg full URL med query params
    const urlObj = new URL(`${API}${path}`);

    // 🔒 Auto-inject token
    const token = localStorage.getItem("token");
    if (token) {
      urlObj.searchParams.set("token", token);
    }

    if (query && typeof query === "object") {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          urlObj.searchParams.set(key, String(value));
        }
      });
    }
    const url = urlObj.toString();

    let es;
    try {
      es = new EventSource(url);
      esRef.current = es;

      es.onmessage = (ev) => {
        try {
          const payload = ev.data ? JSON.parse(ev.data) : {};
          onRaw && onRaw(payload);

          const type = payload.type || payload.event || null;
          const data = payload.data !== undefined ? payload.data : payload;
          if (type && onTyped) {
            onTyped(type, data);
          }
        } catch (e) {
          console.error(`[${description}] SSE JSON parse error:`, e);
        }
      };

      es.onerror = (err) => {
        console.warn(`[${description}] SSE Connection Failed. Closing to prevent loop.`, err);
        es.close(); // 🔥 STOP THE LOOP!
        if (onError) onError(err);
      };
    } catch (e) {
      console.error(`[${description}] SSE init error`, e);
      if (onError) onError(e);
    }

    return () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  }, [path, enabled, JSON.stringify(query)]); // query serialiseras för dep

  return null;
}
