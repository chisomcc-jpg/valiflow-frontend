import React from "react";
import { FileDown, FileSpreadsheet, RotateCw } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExportReports({ customers, kpis }) {
  // 📤 Exportera till PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Valiflow Byrårapport", 14, 20);
    doc.setFontSize(12);
    doc.text(`Datum: ${new Date().toLocaleDateString("sv-SE")}`, 14, 30);

    // KPI-sektion
    doc.text("📊 Nyckeltal", 14, 40);
    autoTable(doc, {
      startY: 45,
      head: [["KPI", "Värde"]],
      body: Object.entries(kpis).map(([k, v]) => [k, v]),
      theme: "striped",
      headStyles: { fillColor: [6, 182, 212] },
    });

    // Kunddata
    const nextY = doc.lastAutoTable.finalY + 15;
    doc.text("👥 Kundöversikt", 14, nextY);
    autoTable(doc, {
      startY: nextY + 5,
      head: [["Kund", "ERP", "Status", "Risk", "Flaggade", "Accuracy"]],
      body: customers.map((c) => [
        c.name,
        c.erp,
        c.status,
        c.risk,
        c.flagged,
        c.accuracy,
      ]),
      theme: "grid",
      headStyles: { fillColor: [6, 182, 212] },
    });

    doc.save(`Valiflow_ByraRapport_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // 📊 Exportera till Excel
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Kunddata
    const wsData = [
      ["Kund", "ERP", "Status", "Risk", "Flaggade", "Accuracy"],
      ...customers.map((c) => [c.name, c.erp, c.status, c.risk, c.flagged, c.accuracy]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Kunder");

    // KPI-data
    const kpiSheet = XLSX.utils.aoa_to_sheet(
      [["KPI", "Värde"], ...Object.entries(kpis)]
    );
    XLSX.utils.book_append_sheet(wb, kpiSheet, "KPI");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "ByraRapport.xlsx");
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-lg">
      <div>
        <h3 className="text-lg font-semibold text-slate-100">
          Exportera byrårapport
        </h3>
        <p className="text-slate-400 text-sm">
          Ladda ner KPI:er och kunddata som PDF eller Excel
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition"
        >
          <FileDown className="w-4 h-4" /> PDF
        </button>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition"
        >
          <FileSpreadsheet className="w-4 h-4" /> Excel
        </button>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition"
        >
          <RotateCw className="w-4 h-4" /> Uppdatera
        </button>
      </div>
    </div>
  );
}
