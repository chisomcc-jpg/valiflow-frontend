import React from "react";

function MetricRow({ label, val, inverse, tooltip }) {
    // Normalize 0-1 or 0-100
    let displayVal = val;
    let colorClass = "bg-slate-200";
    let pctValue = 0;

    if (typeof val === 'number') {
        pctValue = val <= 1 ? val * 100 : val;
        displayVal = Math.round(pctValue) + "%";

        // Color logic
        if (inverse) { // Lower is better
            colorClass = pctValue < 20 ? "bg-emerald-500" : pctValue < 60 ? "bg-amber-400" : "bg-red-500";
        } else { // Higher is better
            colorClass = pctValue > 80 ? "bg-emerald-500" : pctValue > 50 ? "bg-amber-400" : "bg-red-500";
        }
    } else {
        displayVal = "N/A";
    }

    return (
        <div className="group relative flex items-center justify-between text-sm py-1">
            <span className="text-slate-600 cursor-help border-b border-dotted border-slate-300">
                {label}
            </span>
            {/* Simple Tooltip on Hover */}
            <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                {tooltip || `Analys av ${label.toLowerCase()}`}
            </div>

            <div className="flex items-center gap-3">
                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${colorClass}`}
                        style={{ width: pctValue + "%" }}
                    />
                </div>
                <span className="font-mono text-slate-900 w-8 text-right text-xs font-semibold">{displayVal}</span>
            </div>
        </div>
    )
}

export default function InvoiceSignalMatrix({ signals }) {
    if (!signals) return null;

    return (
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 h-full">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2 flex justify-between">
                Signaler & Riskmatris
                <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-500">v5.2</span>
            </h4>
            <div className="space-y-3">
                <MetricRow
                    label="Document Quality"
                    val={signals.documentQuality}
                    tooltip="Kvalitet på OCR och layoutanalys."
                />
                <MetricRow
                    label="Supplier Integrity"
                    val={signals.supplierIntegrity}
                    tooltip="Leverantörens historiska pålitlighet."
                />
                <MetricRow
                    label="Financial Risk"
                    val={signals.financialRisk}
                    inverse
                    tooltip="Finansiell risk baserat på rating och historik."
                />
                <MetricRow
                    label="Network Influence"
                    val={signals.networkInfluence}
                    tooltip="Leverantörens kopplingar i nätverket."
                />
                <MetricRow
                    label="Anomaly Score"
                    val={signals.anomalyScore}
                    inverse
                    tooltip="Avvikelse från normalt mönster."
                />
            </div>
        </div>
    );
}
