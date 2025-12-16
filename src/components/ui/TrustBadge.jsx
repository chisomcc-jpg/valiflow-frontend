import React from "react";
import { Tooltip } from "react-tooltip";

const getColors = (score) => {
  if (score === null || score === undefined) return { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" };
  if (score >= 80) return { bg: "bg-[#4ade80]/20", text: "text-emerald-800", dot: "bg-emerald-500" };
  if (score >= 50) return { bg: "bg-[#fbbf24]/20", text: "text-amber-800", dot: "bg-amber-500" };
  return { bg: "bg-[#ef4444]/20", text: "text-red-800", dot: "bg-red-500" }; // Risk < 50
};

export default function TrustBadge({ score, size = "md", flagged }) {
  if (flagged) {
    const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs';
    return (
      <span className={`inline-flex items-center rounded-full font-medium bg-red-100 text-red-800 border border-red-200 ${sizeClass}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
        Flaggad
      </span>
    );
  }

  const { bg, text, dot } = getColors(score);
  const sizeClasses = size === "lg" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";

  return (
    <>
      <span
        data-tooltip-id={`trust-${score}`}
        data-tooltip-content="AI-Trust baserat på riskanalys"
        className={`inline-flex items-center rounded-full font-medium border border-transparent transition-colors duration-300 ${bg} ${text} ${sizeClasses}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dot}`} />
        {score !== null ? `${Math.round(score)}%` : "N/A"}
      </span>
      <Tooltip id={`trust-${score}`} className="z-50 text-xs" />
    </>
  );
}
