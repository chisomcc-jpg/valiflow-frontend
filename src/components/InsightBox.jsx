import React from "react";
import { SparklesIcon, ShieldExclamationIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function InsightBox({
  title,
  subtitle,
  content,
  type = "info",
  trendData = [],
  trendLabel = "",
}) {
  const themes = {
    info: {
      bg: "from-blue-50 to-white",
      color: "text-blue-600",
      line: "#1E5CB3",
      icon: SparklesIcon,
    },
    success: {
      bg: "from-green-50 to-white",
      color: "text-green-600",
      line: "#22C55E",
      icon: ChartBarIcon,
    },
    warning: {
      bg: "from-yellow-50 to-white",
      color: "text-yellow-600",
      line: "#FACC15",
      icon: ShieldExclamationIcon,
    },
    risk: {
      bg: "from-red-50 to-white",
      color: "text-red-600",
      line: "#EF4444",
      icon: ShieldExclamationIcon,
    },
  };

  const { bg, color, line, icon: Icon } = themes[type] || themes.info;

  return (
    <div
      className={`rounded-2xl p-4 border border-slate-100 shadow-sm bg-gradient-to-br ${bg} hover:shadow-md transition-all`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Icon className={`h-6 w-6 ${color}`} />
          <div>
            <h3 className="font-semibold text-slate-800">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>
        </div>
        {trendLabel && (
          <span
            className={`text-xs font-semibold ${color} bg-white/70 border border-slate-200 rounded-full px-2 py-0.5`}
          >
            {trendLabel}
          </span>
        )}
      </div>

      <div className="mt-3 text-sm text-slate-700 font-medium">{content}</div>

      {trendData.length > 0 && (
        <div className="mt-3 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={line}
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
