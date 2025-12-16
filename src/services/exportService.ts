import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helpers
const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleDateString("sv-SE") : "");
const fmtMoney = (amount: number | null, currency: string = "SEK") =>
    new Intl.NumberFormat("sv-SE", { style: "currency", currency }).format(amount || 0);

/**
 * Export Invoices to CSV
 */
export const exportInvoicesCsv = (invoices: any[]) => {
    if (!invoices.length) return;

    const headers = [
        "Valiflow-ID",
        "Leverantör",
        "Belopp",
        "Valuta",
        "Fakturadatum",
        "Förfallodatum",
        "Status",
        "AI-Trust Score",
        "AI-Risk Score",
        "AI-Sammanfattning"
    ];

    const rows = invoices.map(inv => [
        `VF-${String(inv.id).padStart(4, "0")}`,
        inv.supplierName || "Okänd",
        inv.total,
        inv.currency || "SEK",
        fmtDate(inv.invoiceDate),
        fmtDate(inv.dueDate),
        inv.status,
        inv.trustScore ?? "-",
        inv.riskScore ?? "-",
        inv.aiSummary || ""
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `fakturor_export_${new Date().toISOString().slice(0, 10)}.csv`);
};

/**
 * Export Invoices to Excel
 */
export const exportInvoicesExcel = (invoices: any[]) => {
    if (!invoices.length) return;

    const data = invoices.map(inv => ({
        "Valiflow-ID": `VF-${String(inv.id).padStart(4, "0")}`,
        "Leverantör": inv.supplierName || "Okänd",
        "Belopp": inv.total,
        "Valuta": inv.currency || "SEK",
        "Fakturadatum": fmtDate(inv.invoiceDate),
        "Förfallodatum": fmtDate(inv.dueDate),
        "Status": inv.status,
        "AI-Trust": inv.trustScore,
        "AI-Risk": inv.riskScore,
        "AI-Sammanfattning": inv.aiSummary
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fakturor");

    // Save
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `fakturor_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

/**
 * Export Audit PDF (Revisionsunderlag)
 */
export const exportAuditPdf = (invoices: any[]) => {
    const doc = new jsPDF();

    doc.text("Valiflow Revisionsunderlag", 14, 15);
    doc.setFontSize(10);
    doc.text(`Genererad: ${new Date().toLocaleString("sv-SE")}`, 14, 22);

    const head = [["ID", "Leverantör", "Belopp", "Datum", "Status", "Trust"]];
    const body = invoices.map(inv => [
        `VF-${inv.id}`,
        inv.supplierName,
        fmtMoney(inv.total, inv.currency),
        fmtDate(inv.invoiceDate),
        inv.status,
        (inv.trustScore ?? "-") + "%"
    ]);

    autoTable(doc, {
        head,
        body,
        startY: 30,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [28, 42, 94] } // Valiflow Navy
    });

    doc.save(`revisionsunderlag_${new Date().toISOString().slice(0, 10)}.pdf`);
};
