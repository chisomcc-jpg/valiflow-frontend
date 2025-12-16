import React from "react";
import { CheckCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function InvoiceContextCard({ data }) {
    if (!data) return null;

    return (
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mt-6">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Kontext & Historik
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1 bg-emerald-100 text-emerald-600 rounded-full">
                        <CheckCircleIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">Historisk matchning</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {data.historicalMatchCount} tidigare fakturor från denna leverantör.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1 bg-blue-100 text-blue-600 rounded-full">
                        <ShieldCheckIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">Beloppsanalys</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {data.amountDeviation || "Inom normalt intervall"}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1 bg-violet-100 text-violet-600 rounded-full">
                        <ShieldCheckIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">AI Säkerhet</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {data.aiConfidence}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1 bg-slate-200 text-slate-600 rounded-full">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-900">Leverantörsstabilitet</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {data.supplierStability}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
