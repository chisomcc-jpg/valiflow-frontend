import React from "react";
import clsx from "clsx";
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

export default function IntegrationStatusBadge({ status, connected }) {
    if (!connected) {
        return (
            <div className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-slate-200">
                <PlusCircleIcon className="w-4 h-4 text-slate-400" />
                Ej ansluten
            </div>
        );
    }

    switch (status) {
        case 'active':
            return (
                <div className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-emerald-100 shadow-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Aktiv
                </div>
            );
        case 'error':
            return (
                <div className="bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-red-100 shadow-sm animate-pulse">
                    <XCircleIcon className="w-4 h-4 text-red-500" />
                    Fel vid synk
                </div>
            );
        case 'setup_required':
        default:
            return (
                <div className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-amber-100 shadow-sm">
                    <ExclamationTriangleIcon className="w-4 h-4 text-amber-500" />
                    Kräver konfiguration
                </div>
            );
    }
}
