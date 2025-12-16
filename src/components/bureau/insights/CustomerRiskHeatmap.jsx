import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function CustomerRiskHeatmap({ data = [] }) {
    if (!data?.length) return <div className="text-sm text-slate-400">Ingen data tillgänglig.</div>;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-1">Riskkarta: Kunder</h3>
            <p className="text-xs text-slate-500 mb-4">En snabb bild av hur kundernas risknivå utvecklats senaste 30 dagarna.</p>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {data.map((customer) => {
                    let bgColor = "bg-green-100 hover:bg-green-200";
                    if (customer.risk === "medium") bgColor = "bg-amber-100 hover:bg-amber-200";
                    if (customer.risk === "high") bgColor = "bg-red-100 hover:bg-red-200";

                    return (
                        <div
                            key={customer.customerId}
                            data-tooltip-id="heatmap-tooltip"
                            data-tooltip-content={`${customer.name} - ${customer.risk === 'high' ? 'Hög risk' : customer.risk === 'medium' ? 'Förhöjd risk' : 'Låg risk'}`}
                            className={`h-10 w-full rounded-md cursor-pointer transition-colors ${bgColor}`}
                        />
                    );
                })}
            </div>
            <ReactTooltip id="heatmap-tooltip" className="z-50" />
        </div>
    );
}
