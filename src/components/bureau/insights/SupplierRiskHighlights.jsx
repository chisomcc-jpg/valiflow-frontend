import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function SupplierRiskHighlights({ suppliers = [] }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-slate-700 mb-1">Leverantörsbevakning</h3>
            <p className="text-xs text-slate-500 mb-4">Leverantörer som påverkar flera kunder eller har tydliga riskmönster.</p>

            <div className="space-y-3">
                {suppliers.length === 0 && <p className="text-sm text-slate-400">Inga leverantörer med förhöjd risk just nu.</p>}

                {suppliers.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition">
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${s.riskLevel === 'high' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                <ExclamationTriangleIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-800 text-sm">{s.name}</p>
                                <p className="text-xs text-slate-500">{s.issue}</p>
                            </div>
                        </div>
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-800 px-3 py-1.5 bg-white border border-slate-200 rounded-md shadow-sm">
                            Visa
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
