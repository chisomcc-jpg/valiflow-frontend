// src/lib/invoiceUtils.js

// Formattera SEK
export function fmtSEK(value, currency = "SEK") {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency,
  }).format(Number(value || 0));
}

// Formattera datum (svenska)
export function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString("sv-SE") : "—";
}

// ISO-datum (yyyy-mm-dd)
export function isoDate(d) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

// Trust → %
export function toPct(score) {
  if (score == null) return 0;
  const val = score <= 1 ? score * 100 : score;
  return Math.round(Math.min(100, Math.max(0, val)));
}

// Valiflow-ID generator
export function getValiflowId(invoice) {
  const raw =
    String(
      invoice.invoiceId ||
        invoice.invoiceRef ||
        invoice.externalRef ||
        invoice.originalInvoiceRef ||
        invoice.id ||
        ""
    ) || "";
  const digits = raw.replace(/[^0-9]/g, "");
  const last4 = (digits || String(invoice.id || "0")).slice(-4);
  return `VF-${last4.padStart(4, "0")}`;
}

// Original fakturareferens
export function getOriginalRef(invoice) {
  return (
    invoice.invoiceId ||
    invoice.invoiceRef ||
    invoice.externalRef ||
    invoice.originalInvoiceRef ||
    invoice.id ||
    "—"
  );
}
