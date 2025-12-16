// src/hooks/useFraudSSE.js
// ---------------------------------------------------------
// 🚨 Fraud SSE – realtidsvarningar från FraudLog / TrustEngine
// ---------------------------------------------------------

import { useCallback } from "react";
import { useSSEChannel } from "./useSSEChannel";
import { toast } from "sonner";

/**
 * useFraudSSE
 *
 * Backend-förslag events:
 * { type: "fraud_alert", data: { invoiceId, message, severity } }
 * { type: "fraud_resolved", data: { investigationId, status } }
 */
export function useFraudSSE({
  enabled = true,
  companyId,
  onAlert,
  onResolved,
}) {
  const handleTyped = useCallback(
    (type, data) => {
      switch (type) {
        case "fraud_alert":
          onAlert && onAlert(data);
          if (data?.message) {
            toast.error(`Fraud alert: ${data.message}`);
          }
          break;
        case "fraud_resolved":
          onResolved && onResolved(data);
          break;
        default:
          break;
      }
    },
    [onAlert, onResolved]
  );

  useSSEChannel({
    path: "/api/fraud/stream", // 🧩 backend: tappa in FraudLog / FraudInvestigation här
    enabled,
    query: companyId ? { companyId } : undefined,
    onTyped: handleTyped,
    description: "Fraud / Risk Alerts",
  });
}
