
import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const VF = {
    navy: "#0A1E44",
    blue: "#1E5CB3",
    blueLight: "#EAF3FE",
    text: "#1E293B",
    sub: "#64748B",
    bg: "#F4F7FB",
    border: "#E2E8F0",
    success: "#10B981", // Emerald-500
    warning: "#F59E0B", // Amber-500
    danger: "#EF4444",  // Red-500
};

export default function RiskDistributionChart({ safe = 0, medium = 0, risky = 0 }) {
    const data = [
        { name: "Trygga", value: safe, color: VF.success },
        { name: "Medium", value: medium, color: VF.warning },
        { name: "Risk", value: risky, color: VF.danger },
    ];

    // Filter out zero values to avoid empty segments or weird rendering
    const activeData = data.filter((d) => d.value > 0);

    if (activeData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[250px] text-slate-400">
                <p>Ingen data tillgänglig</p>
            </div>
        );
    }

    const total = safe + medium + risky;
    const riskPercentage = total > 0 ? ((risky / total) * 100).toFixed(1) : 0;

    return (
        <div className="relative">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={activeData}
                        dataKey="value"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        stroke="none"
                    >
                        {activeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            background: VF.navy,
                            color: "white",
                            borderRadius: "6px",
                            border: "none",
                            fontSize: "12px",
                        }}
                        itemStyle={{ color: "white" }}
                    />
                </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <p className="text-sm text-slate-500">Risk</p>
                <p className="text-xl font-bold text-slate-800">{riskPercentage}%</p>
            </div>
        </div>
    );
}
