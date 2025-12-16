// src/utils/formatters.ts

/**
 * Format currency to SEK (sv-SE)
 */
export const formatCurrency = (amount: number | null | undefined, currency = "SEK"): string => {
    if (amount === null || amount === undefined) return "—";
    return new Intl.NumberFormat("sv-SE", { style: "currency", currency }).format(amount);
};

/**
 * Format date to Swedish short format (YYYY-MM-DD or D MMM YYYY)
 */
export const formatDate = (date: string | Date | null | undefined): string => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("sv-SE"); // YYYY-MM-DD
};

/**
 * Format percentage (0.0 - 1.0) -> "XX%"
 */
export const formatPercent = (value: number | null | undefined): string => {
    if (value === null || value === undefined) return "—";
    return `${Math.round(value * 100)}%`;
};

/**
 * Extract organization number from various sources
 * Prioritizes: invoice.supplierOrgNr > invoice.vatNumber (if not SE) > aiRawJson.orgNumber > aiRawJson.supplierOrganisationNumber > invoice.vatNumber (if SE)
 */
export const extractOrgNumber = (invoice: any): string => {
    // Check top-level propagated field first
    if (invoice?.supplierOrgNr) return invoice.supplierOrgNr;
    if (invoice?.vatNumber && !invoice.vatNumber.startsWith("SE")) return invoice.vatNumber; // If VAT number is used as OrgNr

    // Check AI JSON
    const ai = invoice?.aiRawJson || {};
    if (ai.orgNumber) return ai.orgNumber;
    if (ai.supplierOrganisationNumber) return ai.supplierOrganisationNumber;
    if (ai.organisationNumber) return ai.organisationNumber;

    // Check VAT Number (if Swedish and looks like OrgNr)
    // SE123456789001 -> 123456-7890
    if (invoice?.vatNumber && invoice.vatNumber.startsWith("SE")) {
        const raw = invoice.vatNumber.replace("SE", "").replace("01", ""); // Simple heuristic
        if (raw.length === 10) {
            return `${raw.slice(0, 6)}-${raw.slice(6)}`;
        }
    }

    return "Okänt";
};

export const extractBankgiro = (invoice: any): string => {
    const ai = invoice?.aiRawJson || {};
    if (ai.bankgiro) return ai.bankgiro;
    if (ai.bg) return ai.bg;

    // Logic to parse from OCR raw text if available could go here
    return "—";
}
