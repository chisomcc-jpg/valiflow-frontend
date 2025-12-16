// src/hooks/useCompanyKpiSSE.js
// ---------------------------------------------------------
// 📊 Company KPI SSE – company dashboard i realtid
// ---------------------------------------------------------

import { useCallback } from "react";
import { useSSEChannel } from "./useSSEChannel";

/**
 * useCompanyKpiSSE
 *
 * Backend-förslag:
 * { type: "company_kpi_update", data: { companyId, totalInvoices, flagged, avgTrust, ... } }
 * { type: "company_risk_distribution", data: { low, medium, high } }
 * { type: "company_summary_updated", data: { ...CompanySummary } }
 */
export function useCompanyKpiSSE({
  enabled = true,
  companyId,
  onKpiUpdate,
  onRiskDistribution,
  onSummaryUpdated,
}) {
  const handleTyped = useCallback(
    (type, data) => {
      switch (type) {
        case "company_kpi_update":
          onKpiUpdate && onKpiUpdate(data);
          break;
        case "company_risk_distribution":
          onRiskDistribution && onRiskDistribution(data);
          break;
        case "company_summary_updated":
          onSummaryUpdated && onSummaryUpdated(data);
          break;
        default:
          break;
      }
    },
    [onKpiUpdate, onRiskDistribution, onSummaryUpdated]
  );

  useSSEChannel({
    path: `/api/company/${companyId}/stream`, // 🧩 backend: companySse.ts
    enabled: enabled && !!companyId,
    onTyped: handleTyped,
    description: "Bolags-KPI (realtid)",
  });
}
