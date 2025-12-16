// src/services/auditService.ts
import { api } from "./api";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface AuditLogItem {
  id: number;
  entityType: string;
  entityId: string;
  action: string;
  performedBy: string;
  metadata?: any;
  timestamp: string;
  hash: string;
  previousHash?: string;
  invoiceId?: number;
  companyId?: number;
  supplierName?: string;
  targetLabel?: string; // Derived field from backend
  summary?: string;     // Derived field from backend
}

export interface AuditStats {
  totalEvents30d: number;
  highRiskEvents30d: number;
  paymentChanges30d: number;
  aiOverrides30d: number;
  manualReviewRate: number;
}

// ------------------------------------------------------------------
// API Methods
// ------------------------------------------------------------------

/**
 * Fetch paginated audit logs with filters.
 */
export async function fetchAuditLogs(filters: Record<string, string> = {}): Promise<{ items: AuditLogItem[], total: number, totalPages: number }> {
  const params = new URLSearchParams(filters).toString();
  const res = await api.get(`/audit/trails?${params}`);
  return res.data;
}

/**
 * Fetch detailed audit log by ID (typically just getting the row derived from list or separate call if needed)
 * Since we fetched full objects in list, we might not strictly need this unless we want extra verification data.
 */
export async function fetchAuditLogById(id: number): Promise<AuditLogItem> {
  // Current backend setup might not have specific ID endpoint, 
  // but for now we can rely on list or add specific ID endpoint if needed.
  // Given the task, we can assume we pass the object, but let's keep a placeholder or implement specific fetch if backend supports.
  // Actually, backend routes list /trails, let's just stick to that or use timeline for focused view.
  throw new Error("Method not fully implemented on backend - use list view or timeline.");
}

/**
 * Fetch audit stats for KPI strip.
 */
export async function fetchAuditStats(): Promise<AuditStats> {
  const res = await api.get("/audit/stats");
  return res.data;
}

/**
 * Fetch chronological timeline for a specific entity
 */
export async function fetchAuditTimeline(entityType: string, entityId: string): Promise<AuditLogItem[]> {
  const res = await api.get(`/audit/timeline/${entityType}/${entityId}`);
  return res.data.items;
}

// ------------------------------------------------------------------
// MOCK GENERATORS
// ------------------------------------------------------------------

function generateMockLogs(count: number) {
  const items: AuditLogItem[] = [];
  const actions = ["InvoiceApproved", "TrustScoreUpdated", "PaymentDetailsChanged", "UserRoleUpdated", "SystemConfigChanged"];
  const sevs = ["info", "warning", "critical"];

  for (let i = 0; i < count; i++) {
    const action = actions[Math.floor(Math.random() * actions.length)];
    const severity = action.includes("Payment") || action.includes("Config") ? "warning" : "info";

    items.push({
      id: `log-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      userId: "u-1",
      userName: "Anna Revisor",
      userRole: "Auditor",
      actionType: action,
      targetType: "Invoice",
      targetId: "100" + i,
      targetLabel: `INV-2025-${100 + i}`,
      summary: getSummary(action),
      severity: severity as any
    });
  }
  return { items: items.sort((a, b) => b.timestamp.localeCompare(a.timestamp)), total: 500 };
}

function getSummary(action: string) {
  switch (action) {
    case "InvoiceApproved": return "Godkände faktura efter granskning.";
    case "TrustScoreUpdated": return "AI uppdaterade förtroendepoäng baserat på ny data.";
    case "PaymentDetailsChanged": return "Ändrade Bankgiro från 5555-5555 till 1234-1234.";
    case "UserRoleUpdated": return "Uppgraderade användare till Admin.";
    default: return "Systemhändelse loggad.";
  }
}

function generateMockLogDetail(id: string): AuditLogItem {
  return {
    id,
    timestamp: new Date().toISOString(),
    userId: "u-1",
    userName: "Anna Revisor",
    userRole: "Auditor",
    actionType: "PaymentDetailsChanged",
    targetType: "Supplier",
    targetId: "s-123",
    targetLabel: "Office Supplies AB",
    summary: "Ändrade bankgiro manuellt efter telefonkontakt.",
    severity: "warning",
    ipAddress: "192.168.1.45",
    metadata: { session_id: "sess-abc-123", browser: "Chrome 120" },
    diff: [
      { field: "payment_bg", before: "5555-0000", after: "5560-1234" },
      { field: "validation_status", before: "Pending", after: "Verified" }
    ]
  };
}
