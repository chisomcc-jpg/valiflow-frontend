import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, ShieldCheckIcon, LockClosedIcon } from "@heroicons/react/24/outline";

export default function IntegrationPermissions({ permissions }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!permissions) return null;

    return (
        <div className="mt-4 pt-4 border-t border-slate-100">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
                <span className="flex items-center gap-1.5">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-indigo-500" />
                    Behörigheter & Åtkomst
                </span>
                {isOpen ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />}
            </button>

            {isOpen && (
                <div className="mt-3 space-y-3 text-xs animate-in fade-in slide-in-from-top-1 duration-200">
                    {/* ACCESS LIST */}
                    <div className="space-y-1.5">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Valiflow får åtkomst till</div>

                        {permissions.canReadInvoices && (
                            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                Läsa leverantörsfakturor
                            </div>
                        )}
                        {permissions.canAccessSuppliers && (
                            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                Läsa leverantörsregister
                            </div>
                        )}
                        {permissions.canWriteInvoices && (
                            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                                <span className="w-1 h-1 rounded-full bg-amber-500" />
                                Bokföra fakturor (Write)
                            </div>
                        )}
                    </div>

                    {/* NO ACCESS LIST */}
                    <div className="space-y-1.5">
                        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Begränsningar</div>
                        {permissions.notes?.map((note, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                <LockClosedIcon className="w-3 h-3 text-slate-400" />
                                {note}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
