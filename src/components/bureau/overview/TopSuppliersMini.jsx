import React from "react";
import { Button } from "@/components/ui/button";

export function TopSuppliersMini({ data }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">Leverantörer att bevaka</h3>
            <div className="space-y-4">
                {(!data || data.length === 0) ? (
                    <p className="text-sm text-slate-400 italic">Inga leverantörer markerade.</p>
                ) : (
                    data.map((supplier) => (
                        <div key={supplier.id} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0 group">
                            <div>
                                <p className="text-sm font-semibold text-slate-800">{supplier.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${supplier.risk === 'Hög' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {supplier.risk}
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium">{supplier.issue}</span>
                                </div>
                            </div>
                            <Button size="sm" variant="link" className="text-indigo-600 hover:text-indigo-800 h-8 px-2 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                Visa &rarr;
                            </Button>
                        </div>
                    ))
                )}
            </div>
            {(data && data.length > 0) && (
                <div className="mt-4 pt-2 border-t border-slate-50">
                    <Button variant="link" className="w-full text-xs text-slate-500 hover:text-indigo-600 h-auto p-0">
                        Visa alla riskleverantörer
                    </Button>
                </div>
            )}
        </div>
    );
}
