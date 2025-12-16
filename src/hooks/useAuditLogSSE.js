// src/hooks/useAuditLogSSE.js
// ---------------------------------------------------------
// 📜 Audit SSE – realtidsuppdateringar av AuditTrail/AuditLog
// ---------------------------------------------------------

import { useCallback } from "react";
import { useSSEChannel } from "./useSSEChannel";

/**
 * useAuditLogSSE
 *
 * Backend-förslag:
 * { type: "audit_event", data: { id, entityType, action, performedBy, timestamp, metadata } }
 */
export function useAuditLogSSE({
  enabled = true,
  companyId,
  onEvent,
}) {
  const handleTyped = useCallback(
    (type, data) => {
      if (type === "audit_event") {
        onEvent && onEvent(data);
      }
    },
    [onEvent]
  );

  useSSEChannel({
    path: "/api/audit/stream", // 🧩 backend: koppla mot AuditTrail
    enabled,
    query: companyId ? { companyId } : undefined,
    onTyped: handleTyped,
    description: "Audit-logg (realtid)",
  });
}
