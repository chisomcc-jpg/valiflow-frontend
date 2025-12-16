// src/components/KpiCard.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * 💡 KpiCard – Valiflow-stil
 * Används för KPI-sektioner (fakturavärde, AI-trust, risknivåer, osv)
 */
export default function KpiCard({ title, value, subtitle, icon, color = "#1E5CB3", alert, trend }) {
  const isElement = React.isValidElement(icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`
        rounded-xl shadow-sm bg-white p-5 relative overflow-hidden border cursor-default flex flex-col justify-between h-full
        ${alert ? "border-red-200 bg-red-50/10" : "border-slate-200"}
      `}
    >
      {/* Header Row */}
      <div className="flex justify-between items-start mb-2">
        <h3 className={`text-xs font-semibold uppercase tracking-wider ${alert ? "text-red-600" : "text-slate-500"}`}>
          {title}
        </h3>

        {/* Icon Handling */}
        {icon && (
          <div className={isElement ? "" : "opacity-20"}>
            {isElement ? icon : React.createElement(icon, { className: "h-5 w-5 text-slate-400" })}
          </div>
        )}
      </div>

      {/* Value Row */}
      <div className="flex items-baseline gap-2 mt-auto">
        <p className={`text-2xl font-bold ${alert ? "text-red-900" : "text-slate-900"}`}>
          {value}
        </p>
        {(subtitle || trend) && (
          <p className="text-xs font-medium text-slate-400">
            {trend || subtitle}
          </p>
        )}
      </div>

      {/* Alert Indicator */}
      {alert && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
      )}
    </motion.div>
  );
}
