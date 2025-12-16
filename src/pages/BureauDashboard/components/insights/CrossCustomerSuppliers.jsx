
import React from "react";
import { ExclamationCircleIcon, UsersIcon } from "@heroicons/react/24/outline";

export default function CrossCustomerSuppliers({ data }) {
    if (!data) return null;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
            <div className="mb-4">
                <h3 className="font-semibold text-slate-800">Leverantörer över flera kunder</h3>
                <p className="text-xs text-slate-500">Identifiera risker som sprider sig i portföljen.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-slate-400 border-b border-slate-100 text-xs uppercase tracking-wide">
                            <th className="font-medium pb-2 pl-2">Leverantör</th>
                            <th className="font-medium pb-2">Kunder</th>
                            <th className="font-medium pb-2">Risk</th>
                            <th className="font-medium pb-2">Avvikelse</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-50 transition cursor-pointer">
                                <td className="py-3 pl-2 font-medium text-slate-700">{s.name}</td>
                                <td className="py-3">
                                    <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full w-fit text-xs">
                                        <UsersIcon className="w-3 h-3" />
                                        <span>{s.customerCount}</span>
                                    </div>
                                </td>
                                <td className="py-3">
                                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full w-fit text-xs font-medium border ${s.risk === 'high' ? 'bg-red-50 text-red-700 border-red-100' :
                                            s.risk === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                'bg-emerald-50 text-emerald-700 border-emerald-100'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${s.risk === 'high' ? 'bg-red-500' :
                                                s.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                            }`}></div>
                                        {s.riskScore}
                                    </div>
                                </td>
                                <td className="py-3 text-slate-500">
                                    {s.deviation && s.deviation !== "-" ? (
                                        <span className="flex items-center gap-1 text-amber-600 text-xs font-medium">
                                            <ExclamationCircleIcon className="w-4 h-4" />
                                            {s.deviation}
                                        </span>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
