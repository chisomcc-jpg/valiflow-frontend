import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Papa from "papaparse";

export async function exportAsPDF(elementId: string, filename = "report.pdf"): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    alert("❌ Could not find report element");
    return;
  }

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, width, height);
  pdf.save(filename);
}

export function exportAsCSV<T extends Record<string, unknown>>(data: T[], filename = "report.csv"): void {
  if (!data || data.length === 0) {
    alert("No data to export");
    return;
  }
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export async function shareReport(url: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(url);
    alert("✅ Report link copied to clipboard!");
  } catch {
    alert("❌ Could not copy link");
  }
}
