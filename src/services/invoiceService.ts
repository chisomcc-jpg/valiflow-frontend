// --------------------------------------------------------------
// Valiflow Frontend Invoice Service v2.0
// FULLY synced with backend invoiceRoutes.ts (Dec 2025)
// --------------------------------------------------------------

import { api } from "./api";
import type { AxiosResponse } from "axios";

/* ============================================================
   Typer (FE-anpassade)
============================================================ */

export type InvoiceStatus =
  | "new"
  | "approved"
  | "rejected"
  | "pending"
  | string;

export interface TrustConclusion {
  state: "VERIFIED" | "DEVIATION" | "UNKNOWN";
  confidence: "high" | "medium" | "low";
  reasonCodes: string[];
  explanation: string;
}

export interface InvoiceListItem {
  id: number;
  invoiceId: string | null;
  // ...
  createdAt: string;
  updatedAt: string;

  companyId: number | null;
  customerName: string | null;
  customerEmail: string | null;

  supplierName: string | null;
  supplierFull: string | null;
  vatNumber: string | null;

  total: number | null;
  currency: string | null;

  invoiceDate: string | null;
  dueDate: string | null;

  status: InvoiceStatus;
  flagged: boolean;
  flagReason: string | null;

  trustConclusion?: TrustConclusion; // <--- The Source of Truth

  trustScore: number | null;
  riskScore: number | null;
  riskTier: string | null;
  aiConfidence: number | null;
  aiVersion: string | null;
  lastAnalyzedAt?: string | null;

  trustFactors?: any;
  aiComment: string | null;
  aiSummary: string | null;
  aiReasons: string[];
  aiRecommendedAction: string | null;

  documentQuality?: number | null;

  pdfPath?: string | null;
  pdfUrl: string | null;

  reviewLevel: string | null;
  isAnalyzing: boolean;
}

export interface InvoiceListResponse {
  items: InvoiceListItem[];
  nextCursor: string | null;
}

export interface InvoiceDetail extends InvoiceListItem { }

export interface AuditLogItem {
  id: number;
  entityType: string;
  entityId: number;
  action: string;
  performedBy: string | null;
  timestamp: string;
  metadata?: any;
}

export interface AuditLogResponse {
  items: AuditLogItem[];
}

export interface LedgerTimelineRow {
  id: number;
  invoiceId: number;
  version: number;
  createdAt: string;
  trustScore: number | null;
  riskScore: number | null;
  factors?: any;
  metadata?: any;
}

export interface LedgerTimelineResponse {
  items: LedgerTimelineRow[];
}

/* ============================================================
   Query params – fakturalista
============================================================ */

export interface InvoiceQuery {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: string;
  flagged?: boolean;
  minRisk?: number;
  maxRisk?: number;
  minTotal?: number;
  maxTotal?: number;
  customer?: string;
  customerEmail?: string;
  from?: string;
  to?: string;
  sort?: string;
}

/* ============================================================
   Helpers
============================================================ */

const BASE_PATH = "/invoices";

/* ============================================================
   LISTA & HÄMTA FAKTUROR
============================================================ */

// ... types ...

export async function fetchInvoiceStats() {
  const response = await api.get(`${BASE_PATH}/stats`);
  return response.data;
}

export async function fetchInvoices(
  params: InvoiceQuery = {}
): Promise<InvoiceListResponse> {
  const response = await api.get(BASE_PATH, {
    params: {
      ...params,
      flagged:
        typeof params.flagged === "boolean"
          ? String(params.flagged)
          : undefined,
    },
  });
  return response.data;
}

export async function fetchInvoiceById(
  invoiceId: number
): Promise<InvoiceDetail> {
  const response = await api.get(`${BASE_PATH}/${invoiceId}`);
  const data = response.data;

  // Normalize PDF URL similarly to how Invoices.jsx does it
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const pdfUrl = data.pdfUrl || (data.pdfPath ? `${API_URL}${data.pdfPath}` : null);

  return { ...data, pdfUrl };
}

/* ============================================================
   AUDIT-LOGG & AUDIT-EXPORT (FIXADE ENDPOINTS)
============================================================ */

// ❗ Backend: /api/invoices/:id/audit-log
export async function fetchInvoiceAudit(
  invoiceId: number
): Promise<AuditLogResponse> {
  const response = await api.get(`${BASE_PATH}/${invoiceId}/audit-log`);
  return response.data;
}

// ❗ Backend: /api/invoices/:id/audit-log/explorer
export async function fetchInvoiceAuditExplorer(invoiceId: number) {
  const response = await api.get(
    `${BASE_PATH}/${invoiceId}/audit-log/explorer`
  );
  return response.data;
}

// ❗ Backend: /api/invoices/:id/audit-log/export
export async function exportAuditReport(invoiceId: number): Promise<Blob> {
  const response = await api.get(
    `${BASE_PATH}/${invoiceId}/audit-log/export`,
    {
      responseType: "blob",
    }
  );
  return response.data;
}

/* ============================================================
   TRUST LEDGER v2
============================================================ */

export async function fetchTrustLedger(invoiceId: number) {
  const response = await api.get(`${BASE_PATH}/${invoiceId}/ledger`);
  return response.data;
}

export async function fetchTrustLedgerTimeline(invoiceId: number) {
  const response = await api.get(
    `${BASE_PATH}/${invoiceId}/ledger/timeline`
  );
  return response.data;
}

export async function verifyTrustLedger(invoiceId: number) {
  const response = await api.get(
    `${BASE_PATH}/${invoiceId}/ledger/verify`
  );
  return response.data;
}

export async function diffTrustLedger(
  invoiceId: number,
  v1: number,
  v2: number
) {
  const response = await api.get(`${BASE_PATH}/${invoiceId}/ledger/diff`, {
    params: { v1, v2 },
  });
  return response.data;
}

/* ============================================================
   ACTIONS: APPROVE / REJECT / FLAG / UNFLAG / OVERRIDE
============================================================ */

export async function approveInvoice(invoiceId: number) {
  const response = await api.put(`${BASE_PATH}/${invoiceId}/approve`);
  return response.data;
}

export interface OverridePayload {
  decision: "approve" | "reject" | "flag";
  reason?: string;
}

export async function overrideInvoice(
  invoiceId: number,
  payload: OverridePayload
) {
  const response = await api.post(
    `${BASE_PATH}/${invoiceId}/override`,
    payload
  );
  return response.data;
}

export async function rejectInvoice(invoiceId: number, reason?: string) {
  const response = await api.put(`${BASE_PATH}/${invoiceId}/reject`, {
    reason,
  });
  return response.data;
}

export async function flagInvoice(invoiceId: number, reason?: string) {
  const response = await api.patch(`${BASE_PATH}/${invoiceId}/flag`, {
    reason,
  });
  return response.data;
}

export async function unflagInvoice(invoiceId: number) {
  const response = await api.patch(`${BASE_PATH}/${invoiceId}/unflag`);
  return response.data;
}

/* ============================================================
   FRAUD INVESTIGATIONS
============================================================ */

export async function listFraudInvestigationsForInvoice(invoiceId: number) {
  const response = await api.get(
    `${BASE_PATH}/${invoiceId}/investigations`
  );
  return response.data;
}

export async function createFraudInvestigationForInvoice(
  invoiceId: number,
  payload: any
) {
  const response = await api.post(
    `${BASE_PATH}/${invoiceId}/investigations`,
    payload
  );
  return response.data;
}

export async function updateFraudInvestigation(
  investigationId: number,
  update: any
) {
  const response = await api.patch(
    `${BASE_PATH}/investigations/${investigationId}`,
    update
  );
  return response.data;
}

/* ============================================================
   ANALYS & FEEDBACK
============================================================ */

export async function analyzeInvoice(invoiceId: number) {
  const response = await api.post(`${BASE_PATH}/${invoiceId}/analyze`);
  return response.data;
}

export async function reanalyzeInvoice(invoiceId: number) {
  return analyzeInvoice(invoiceId);
}

export async function sendInvoiceFeedback(invoiceId: number, verdict: any) {
  const response = await api.post(
    `${BASE_PATH}/${invoiceId}/feedback`,
    { verdict }
  );
  return response.data;
}

/* ============================================================
   ENTERPRISE TRUST LAYER (Dec 2025)
   ============================================================ */

export async function fetchInvoiceAnalysisSummary(id: number) {
  const response = await api.get(`${BASE_PATH}/${id}/analysis/summary`);
  return response.data;
}

export async function fetchInvoiceContext(id: number) {
  const response = await api.get(`${BASE_PATH}/${id}/analysis/context`);
  return response.data;
}

export async function fetchInvoiceSignals(id: number) {
  const response = await api.get(`${BASE_PATH}/${id}/analysis/signals`);
  return response.data;
}

export async function fetchInvoiceTrends(id: number) {
  const response = await api.get(`${BASE_PATH}/${id}/analysis/trends`);
  return response.data;
}

export async function fetchInvoiceRecommendations(id: number) {
  const response = await api.get(`${BASE_PATH}/${id}/recommendations`);
  return response.data;
}

export async function fetchInvoiceEvents(id: number) {
  const response = await api.get(`${BASE_PATH}/${id}/events`);
  return response.data;
}


/* ============================================================
   SCAN / RESCAN / DELETE
============================================================ */

export async function scanInvoice(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`${BASE_PATH}/scan`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
}

export async function rescanInvoice(invoiceId: number) {
  const response = await api.post(`${BASE_PATH}/${invoiceId}/rescan`);
  return response.data;
}

export async function deleteInvoice(invoiceId: number) {
  const response = await api.delete(`${BASE_PATH}/${invoiceId}`);
  return response.data;
}

// ============================================================
// COMPATIBILITY ALIASES & NEW METHODS (Dec 2025)
// ============================================================

export const getInvoices = fetchInvoices;

export async function getInvoiceSummary(companyId: number) {
  const response = await api.get(`/company/${companyId}/invoices/summary`);
  return response.data;
}
