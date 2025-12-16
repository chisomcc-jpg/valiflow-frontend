
/**
 * CANONICAL STATUS LABELS
 * =======================
 * This file acts as the single source of truth for UI status labels.
 * It enforces the "Advisory Only" canon by mapping internal states (like BLOCKED)
 * to advisory user-facing labels (like Requires Review).
 *
 * RULE: NEVER render raw database statuses directly in the UI.
 * ALWAYS use this mapping.
 */

export const INVOICE_STATUS_LABELS = {
    // Safe / Green
    APPROVED: "Godkänd",
    PAID: "Betald",
    VERIFIED: "Verifierad",

    // Advisory / Yellow / Red
    FLAGGED: "Kräver granskning",     // Replaces "Blocked"
    BLOCKED: "Kräver granskning",     // Legacy mapping (Safety catch)
    REVIEW: "Under granskning",
    PENDING: "Väntar på analys",

    // Neutral
    DRAFT: "Utkast",
    UNKNOWN: "Okänd status"
} as const;

export const INVOICE_STATUS_COLORS = {
    APPROVED: "bg-green-100 text-green-800",
    PAID: "bg-gray-100 text-gray-800",
    VERIFIED: "bg-blue-100 text-blue-800",

    FLAGGED: "bg-amber-100 text-amber-800",
    BLOCKED: "bg-amber-100 text-amber-800", // Visual fallback
    REVIEW: "bg-yellow-100 text-yellow-800",
    PENDING: "bg-gray-100 text-gray-600",

    DRAFT: "bg-gray-50 text-gray-500",
    UNKNOWN: "bg-gray-50 text-gray-500"
} as const;

export const getStatusLabel = (status: string) => {
    const key = status?.toUpperCase();
    return INVOICE_STATUS_LABELS[key as keyof typeof INVOICE_STATUS_LABELS] || status;
};

export const getStatusColor = (status: string) => {
    const key = status?.toUpperCase();
    return INVOICE_STATUS_COLORS[key as keyof typeof INVOICE_STATUS_COLORS] || "bg-gray-100 text-gray-800";
};
