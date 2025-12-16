// src/components/AIScanLoader.jsx
import React, { useEffect, useState, useRef } from "react";
// REMOVED framer-motion to fix "Expected static flag was missing" crash
import {
  ShieldCheckIcon,
  DocumentMagnifyingGlassIcon,
  BuildingOfficeIcon,
  ScaleIcon,
  CpuChipIcon,
  CheckBadgeIcon,
  XMarkIcon,
  SparklesIcon,
  CloudArrowUpIcon,
  PlayIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

/**
 * Valiflow Scan Theatre 2.0
 * Premium Audit-Grade UI for Invoice Analysis
 * (Stability Fix: Removed Framer Motion)
 */

const PIPELINE_STEPS = [
  { id: 1, label: "Kontrollerar dokumentets integritet", icon: DocumentMagnifyingGlassIcon },
  { id: 2, label: "Extraherar data (OCR + AI-tolkning)", icon: CpuChipIcon },
  { id: 3, label: "Verifierar leverantör och affärsidentitet", icon: BuildingOfficeIcon },
  { id: 4, label: "Söker efter dubbletter och avvikelser", icon: ScaleIcon },
  { id: 5, label: "Beräknar risk- och trust-poäng (V5-motorn)", icon: ShieldCheckIcon },
  { id: 6, label: "Slutförd analys", icon: CheckBadgeIcon },
];

export default function AIScanLoader({ items = [], onClose, onAnalyze, onAddFiles }) {
  if (!items || items.length === 0) return null;

  // Derived states
  const queuedCount = items.filter(i => i.status === 'queued').length;
  const analyzingCount = items.filter(i => i.status === 'analyzing' || i.status === 'parsing' || i.status === 'uploading').length;
  const doneCount = items.filter(i => i.status === 'done' || !!i.aiSummary).length;
  const allDone = items.length > 0 && items.every(i => i.status === 'done' || !!i.aiSummary);
  const hasQueued = queuedCount > 0;

  // Track progress per item ID
  const [progressState, setProgressState] = useState({});
  const fileInputRef = useRef(null);

  // Ref for items to access inside persistent interval
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressState((prev) => {
        const next = { ...prev };
        let changed = false;

        // Use ref to avoid resetting interval on item updates
        itemsRef.current.forEach((item) => {
          const currentStep = prev[item.id] || 0;

          if (item.status === 'queued') {
            // Keep at 0
            if (currentStep !== 0) {
              next[item.id] = 0;
              changed = true;
            }
          } else if (item.status === "done") {
            if (currentStep < PIPELINE_STEPS.length - 1) {
              next[item.id] = PIPELINE_STEPS.length - 1;
              changed = true;
            }
          } else if (item.status === "analyzing" || item.status === "parsing" || item.status === "uploading") {
            if (currentStep < 4) {
              // Faster animation: 40% chance per 300ms catch
              if (Math.random() > 0.6) {
                next[item.id] = currentStep + 1;
                changed = true;
              }
            }
          }
        });

        return changed ? next : prev;
      });
    }, 300); // Faster tick rate (was 800)

    return () => clearInterval(interval);
  }, []); // Empty dependency = persistent interval

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (onAddFiles) onAddFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md transition-opacity duration-300">
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 transform transition-all duration-300 scale-100 opacity-100"
      >
        {/* HEADER */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#06b6d4] flex items-center justify-center shadow-lg shadow-cyan-200">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Valiflow Scan
              </h2>
            </div>
            <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
              {allDone
                ? "Analysen är klar. Valiflow har granskat samtliga fakturor."
                : "Ladda upp och analysera fakturor med Valiflow TrustEngine™ V5."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Add Files Button (Visible unless analyzing) */}
            {!allDone && (analyzingCount === 0) && (
              <>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 border-slate-200 text-slate-600 hover:bg-white"
                >
                  <PlusIcon className="w-4 h-4" />
                  Lägg till fler
                </Button>
              </>
            )}

            {/* Analyze Button (If queued) */}
            {hasQueued && analyzingCount === 0 && (
              <Button
                onClick={onAnalyze}
                className="bg-[#06b6d4] hover:bg-[#0891b2] text-white gap-2 shadow-sm shadow-cyan-200"
              >
                <PlayIcon className="w-4 h-4" />
                Analysera ({queuedCount})
              </Button>
            )}

            {/* Close Button (Always visible now, main way to exit) */}
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="p-8 overflow-y-auto bg-slate-50/30 flex-1 min-h-[400px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <AuditCard
                key={item.id}
                item={item}
                currentStep={progressState[item.id] || 0}
              />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium tracking-wide uppercase">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
            Valiflow TrustEngine™ V5 — Audit Grade Verification
          </div>

          {/* Explicit "Done" Action */}
          {allDone && (
            <Button onClick={onClose} variant="ghost" className="text-slate-500 hover:text-slate-800 text-sm">
              Stäng fönster
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const AuditCard = React.forwardRef(({ item, currentStep }, ref) => {
  const isDone = item.status === "done" || !!item.aiSummary;
  const isQueued = item.status === "queued";
  const isTrustHigh = (item.trustScore ?? 0) >= 80;

  return (
    <div
      ref={ref}
      className={`
        relative p-6 rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col gap-6 transition-all duration-300
        ${isDone
          ? "border-emerald-100 ring-1 ring-emerald-50 bg-emerald-50/10"
          : isQueued
            ? "border-slate-200 border-dashed bg-slate-50/50"
            : "border-slate-200"}
      `}
    >
      {/* Top Details */}
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className={`
             w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors
             ${isDone
              ? "bg-emerald-100 border-emerald-200 text-emerald-600"
              : isQueued
                ? "bg-white border-slate-200 text-slate-400"
                : "bg-white border-slate-100 text-slate-400"}
          `}>
            {isDone ? <CheckBadgeIcon className="w-6 h-6" /> : <DocumentMagnifyingGlassIcon className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 truncate max-w-[200px]" title={item.name}>
              {item.name}
            </h3>
            <p className="text-sm text-slate-500">
              {item.realId ? `ID: VF-${item.id}` : isQueued ? "Väntar på start..." : "Laddar upp..."}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {isDone ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckBadgeIcon className="w-3.5 h-3.5" />
            Klar
          </span>
        ) : isQueued ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <CloudArrowUpIcon className="w-3.5 h-3.5" />
            Köad
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-50 text-cyan-700 border border-cyan-100 animate-pulse">
            <CpuChipIcon className="w-3.5 h-3.5" />
            Analyserar
          </span>
        )}
      </div>

      {/* Done State: Success View */}
      {isDone ? (
        <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="mb-3 relative">
            <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <CheckBadgeIcon className="w-16 h-16 text-emerald-500 relative z-10" />
          </div>
          <h4 className="text-lg font-semibold text-slate-900">Analys färdig</h4>
          <p className="text-sm text-slate-500 max-w-[250px] mt-1 mb-4">
            {item.aiSummary || "Fakturan har analyserats och verifierats av Valiflow TrustEngine™ V5."}
          </p>

          <div className="flex gap-2">
            <Badge label={`Trust Score: ${Math.round(item.trustScore ?? 0)}`} green={isTrustHigh} />
            <Badge label="Verifierad" green />
          </div>
        </div>
      ) : (
        /* Progress Pipeline */
        !isQueued && (
          <div className="space-y-3 relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />

            {PIPELINE_STEPS.map((step, idx) => {
              // Only show up to step 5 (index 4) so we don't show "Slutförd analys" as a step
              // We want to replace it entirely when done.
              if (step.id === 6) return null;

              const isActive = idx === currentStep;
              const isCompleted = idx < currentStep;

              return (
                <div key={step.id} className="relative flex items-center gap-3">
                  {/* Dot Indicator */}
                  <div className={`
                    relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${isCompleted || isActive ?
                      "bg-[#06b6d4] border-[#06b6d4] text-white"
                      : "bg-white border-slate-200 text-transparent"}
                 `}>
                    {isCompleted ? (
                      <CheckBadgeIcon className="w-3.5 h-3.5" />
                    ) : isActive ? (
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    ) : null}
                  </div>

                  {/* Text */}
                  <span className={`
                   text-xs font-medium transition-colors duration-300
                   ${isActive ? "text-slate-900" : isCompleted ? "text-slate-500" : "text-slate-300"}
                 `}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Done Footer moved inside the main view above to center it better, or keep here?
          Let's assume the user wants minimal view, but we can keep footer empty or just decorative
       */}
    </div>
  );
});

function Badge({ label, green }) {
  return (
    <span className={`
      inline-flex items-center px-2 py-1 rounded bg-slate-50 border border-slate-200 text-[10px] font-medium text-slate-600
      ${green ? "bg-emerald-50/50 border-emerald-100 text-emerald-700" : ""}
    `}>
      {green && <CheckBadgeIcon className="w-3 h-3 mr-1" />}
      {label}
    </span>
  )
}
