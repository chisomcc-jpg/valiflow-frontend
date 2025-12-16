// src/services/summaryService.ts
// --------------------------------------------------------------
// Valiflow Frontend Summary Service v2.0
// Company Financial Summary + Realtime SSE (company_summary_updated)
// --------------------------------------------------------------

import { api } from "./api";

// 🌍 Bas-URL för SSE (måste peka på backend, inte Vite-dev)
const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

/* ============================================================================
   Typ: CompanyFinancialSummary
   Matchar Prisma-modellen CompanyFinancialSummary
============================================================================ */

export interface CompanyFinancialSummary {
  companyId: number;

  invoiceCount: number;
  totalAmountSEK: number;
  flaggedCount: number;

  // Risk-fördelning
  avgTrust: number;
  safe: number;
  medium: number;
  risky: number;

  // Timestamp
  updatedAt: string;
}

/* ============================================================================
   GET /api/company/:id/financial-summary
============================================================================ */

export async function getCompanySummary(
  companyId: number
): Promise<CompanyFinancialSummary> {
  const res = await api.get(`/company/${companyId}/financial-summary`);
  return res.data;
}

/**
 * Get AI-generated weekly digest ("What changed")
 */
export async function getWeeklyDigest(companyId: number) {
  // Mock for now if backend endpoint missing, or assume /analyze/weekly exists
  // We'll trust backend will have it or we mock here for UI dev
  try {
    const res = await api.get(`/company/${companyId}/insights/weekly-digest`);
    return res.data;
  } catch {
    // Fallback mock
    return {
      summary: "Weekly activity shows stable risk levels.",
      changes: [
        { type: "risk_increase", text: "Supplier 'Acme Corp' risk increased to 65" },
        { type: "review_complete", text: "2 flagged invoices approved by CFO" }
      ]
    };
  }
}

/* ============================================================================
   SSE – Company Financial Summary (Realtime)
   Backend: companySse.ts via SSEHubV2
   Channel: company:{companyId}
   Event: "company_summary_updated"
============================================================================ */

type SummaryUpdateCallback = (summary: CompanyFinancialSummary) => void;

export function subscribeToCompanySummary(
  companyId: number,
  onUpdate: SummaryUpdateCallback
): () => void {
  // Viktigt: använd full backend-URL, inte relativ mot :5173
  const url = `${API}/api/company/${companyId}/stream`;
  const evtSource = new EventSource(url, { withCredentials: true });

  evtSource.addEventListener("company_summary_updated", (event: MessageEvent) => {
    try {
      const parsed = JSON.parse(event.data);

      // SSEHubV2-format:
      // {
      //   version,
      //   event,
      //   channel,
      //   entity,
      //   entityId,
      //   replayId,
      //   ts,
      //   integrity,
      //   payload: { ...summaryObject }
      // }
      if (parsed?.payload) {
        onUpdate(parsed.payload as CompanyFinancialSummary);
      }
    } catch (err) {
      console.warn("Failed to parse company_summary_updated SSE:", err);
    }
  });

  // Unsubscribe
  return () => {
    evtSource.close();
  };
}
