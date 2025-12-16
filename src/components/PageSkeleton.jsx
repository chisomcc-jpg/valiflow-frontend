import React from "react";

/**
 * Valiflow PageSkeleton
 * – diskret shimmer-effekt under dataladdning
 */
export default function PageSkeleton({ cards = 6, kpis = 4 }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
      {/* KPI-sektion */}
      <div className={`grid sm:grid-cols-${kpis} gap-4`}>
        {[...Array(kpis)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-[0_2px_8px_rgba(30,92,179,0.05)] space-y-2 animate-pulse"
          >
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            <div className="h-5 bg-slate-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[...Array(cards)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 animate-pulse"
          >
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            <div className="h-3 bg-slate-200 rounded w-4/5"></div>
            <div className="pt-2">
              <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

