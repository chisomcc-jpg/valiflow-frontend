import React from "react";
import { ArrowPathIcon, DocumentDuplicateIcon, ExclamationCircleIcon, UserGroupIcon, ServerIcon } from "@heroicons/react/24/outline";

export default function IntegrationSyncInfo({ sync }) {
    if (!sync) return null;

    const StatusDot = ({ status }) => {
        let color = "bg-slate-300";
        if (status === "OK") color = "bg-emerald-500";
        if (status === "Slow") color = "bg-amber-500";
        if (status === "Error") color = "bg-red-500";

        return <div className={`w-2 h-2 rounded-full ${color}`} />;
    };

    return (
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-xs text-slate-600 space-y-2 mt-4">
            <div className="flex justify-between items-center text-slate-400 border-b border-slate-200 pb-2 mb-2">
                <span className="flex items-center gap-1.5">
                    <ArrowPathIcon className="w-3 h-3" />
                    Senaste synk
                </span>
                <span className="font-mono text-slate-600">
                    {sync.lastSync ? new Date(sync.lastSync).toLocaleString('sv-SE', {
                        dateStyle: 'short', timeStyle: 'short'
                    }) : 'Aldrig'}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                        <DocumentDuplicateIcon className="w-3 h-3" /> Nya idag
                    </span>
                    <span className="font-semibold text-slate-700">{sync.invoicesToday || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                        <ExclamationCircleIcon className="w-3 h-3 text-red-400" /> Flaggade
                    </span>
                    <span className={`font-semibold ${sync.flaggedInvoices > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                        {sync.flaggedInvoices || 0}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                        <UserGroupIcon className="w-3 h-3" /> Lev. ändringar
                    </span>
                    <span className="font-semibold text-slate-700">{sync.supplierChanges || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-500">
                        <ServerIcon className="w-3 h-3" /> Systemstatus
                    </span>
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <StatusDot status={sync.status} />
                        {sync.status}
                    </div>
                </div>
            </div>
        </div>
    );
}
