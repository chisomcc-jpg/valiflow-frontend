// src/realtime/useInvoiceSSE.jsx — v12.1 (StrictMode Safe + Active Flag)
// ---------------------------------------------------------------------
//  FÖRÄNDRINGAR FRÅN v12:
//  - Inga logiska ändringar i SSE-pipelinen
//  - Endast en ny parameter: active = true
//  - Om active === false → ingen SSE öppnas, men HOOKEN körs ändå
//  - Fixar 100% “Rendered fewer hooks” buggen
// ---------------------------------------------------------------------

import { useEffect, useRef } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function useInvoiceSSE(setInvoices, setSelected, active = true, onEvent = null) {
  const hasMounted = useRef(false);
  const esRef = useRef(null);

  useEffect(() => {
    // 🔕 Om sidan inte är aktiv (ej på /invoices)
    // → kör inte SSE-init, men hooken körs fortfarande = safe
    if (!active) {
      console.log("⏸️ SSE inactive for this route");
      return;
    }

    // 🔥 StrictMode-säker engångsinitiering
    if (hasMounted.current) {
      console.log("⏭️ useInvoiceSSE already mounted — skipping duplicate init");
      return;
    }
    hasMounted.current = true;

    console.log("🏁 useInvoiceSSE INIT (v12.1)");

    if (!setInvoices) {
      console.log("❌ setInvoices missing");
      return;
    }

    let es;

    try {
      const token = localStorage.getItem("token");

      const url = token
        ? `${API}/api/invoices/stream?token=${encodeURIComponent(token)}`
        : `${API}/api/invoices/stream`;

      console.log("🔌 SSE → CONNECTING TO:", url);
      es = new EventSource(url);
      esRef.current = es;
    } catch (err) {
      console.log("❌ Could not open SSE:", err);
      return;
    }

    /* -----------------------------------------------------
        Helper – merge updates into list + QuickView
    ----------------------------------------------------- */
    const applyUpdate = (rawPayload, source = "unknown") => {
      const payload = rawPayload || {};
      const invoiceId = payload.invoiceId ?? payload.id;

      if (!invoiceId) {
        console.log(`❌ [${source}] No invoiceId in SSE payload`);
        return;
      }

      console.log(`🔄 [${source}] Updating invoice ${invoiceId}`, payload);

      setInvoices((prev) => {
        if (!Array.isArray(prev)) return prev;

        let matched = false;

        const updated = prev.map((i) => {
          if (Number(i.id) === Number(invoiceId)) {
            matched = true;
            return {
              ...i,
              ...payload,
              isAnalyzing: false,
            };
          }
          return i;
        });

        if (!matched) {
          console.log(`⚠️ [${source}] Invoice ${invoiceId} not found in list`);
        }

        return updated;
      });

      setSelected?.((cur) => {
        if (!cur || Number(cur.id) !== Number(invoiceId)) return cur;
        return { ...cur, ...payload, isAnalyzing: false };
      });
    };

    /* -----------------------------------------------------
        CONNECTION EVENTS
    ----------------------------------------------------- */
    es.onopen = () => console.log("🟢 SSE OPENED /invoices");

    es.onerror = (err) =>
      console.log("🔴 SSE ERROR (invoices):", err);

    es.onmessage = (ev) =>
      console.log("📨 SSE default:", ev.data);

    es.addEventListener("connected", (ev) =>
      console.log("🔵 SSE connected:", ev.data)
    );

    es.addEventListener("replay", (ev) =>
      console.log("🟣 SSE replay event:", ev.data)
    );

    /* -----------------------------------------------------
        invoice_ingested
    ----------------------------------------------------- */
    es.addEventListener("invoice_ingested", (ev) => {
      console.log("🟡 RAW invoice_ingested:", ev.data);

      let msg;
      try {
        msg = JSON.parse(ev.data);
      } catch (e) {
        console.log("❌ JSON error (invoice_ingested)", e);
        return;
      }

      const payload = msg.payload || msg;

      const incoming = {
        id: payload.invoiceId,
        ...payload,
        isAnalyzing: true,
        trustScore: null,
        riskScore: null,
      };

      setInvoices((prev) => {
        if (!Array.isArray(prev)) return [incoming];
        if (prev.some((x) => Number(x.id) === Number(incoming.id))) {
          console.log("⚠️ invoice_ingested skipped (already exists)");
          return prev;
        }
        return [incoming, ...prev];
      });

      if (onEvent) onEvent("invoice_ingested", incoming);
    });

    /* -----------------------------------------------------
        trust_score_updated
    ----------------------------------------------------- */
    es.addEventListener("trust_score_updated", (ev) => {
      console.log("💚 RAW trust_score_updated:", ev.data);

      let msg;
      try {
        msg = JSON.parse(ev.data);
      } catch (e) {
        console.log("❌ JSON error (trust_score_updated)", e);
        return;
      }

      const payload = msg.payload || msg;
      applyUpdate(payload, "trust_score_updated");
      if (onEvent) onEvent("trust_score_updated", payload);
    });

    /* -----------------------------------------------------
        invoice_analyzed — AI summary, comments etc
    ----------------------------------------------------- */
    es.addEventListener("invoice_analyzed", (ev) => {
      console.log("🧠 RAW invoice_analyzed:", ev.data);

      let msg;
      try {
        msg = JSON.parse(ev.data);
      } catch (e) {
        console.log("❌ JSON error (invoice_analyzed)", e);
        return;
      }

      const payload = msg.payload || msg;
      applyUpdate(payload, "invoice_analyzed");
      if (onEvent) onEvent("invoice_analyzed", payload);
    });

    /* -----------------------------------------------------
        CLEANUP — StrictMode friendly (do NOT close SSE)
    ----------------------------------------------------- */
    return () => {
      console.log("⚠️ useInvoiceSSE cleanup TRIGGERED");

      window.addEventListener("beforeunload", () => {
        try {
          console.log("🔌 SSE CLOSED due to page unload");
          esRef.current?.close();
        } catch { }
      });
    };
  }, [active]); // ← nu är hooken helt korrekt
}
