
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function SupplierRiskTable({ data }) {
    return (
        <Card className="h-full border-red-100 bg-red-50/10">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                    Leverantörsrisker
                </CardTitle>
                <CardDescription>Leverantörer med nyliga avvikelser.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-slate-500 border-b text-xs uppercase tracking-wide">
                            <tr>
                                <th className="pb-2 font-medium">Leverantör</th>
                                <th className="pb-2 font-medium text-center">Risk</th>
                                <th className="pb-2 font-medium">Ändring</th>
                                <th className="pb-2 font-medium text-right">Fakturor</th>
                                <th className="pb-2 font-medium">Kommentar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-red-100/50">
                            {(!data || data.length === 0) ? (
                                <tr><td colSpan={5} className="py-4 text-center text-slate-400">Inga risker identifierade.</td></tr>
                            ) : (
                                data.map(sup => (
                                    <tr key={sup.id} className="hover:bg-red-50/50 transition-colors">
                                        <td className="py-3 font-medium text-slate-700">{sup.name}</td>
                                        <td className="py-3 text-center">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${sup.riskScore > 80 ? 'bg-red-100 text-red-700' :
                                                    sup.riskScore > 50 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                                }`}>
                                                {sup.riskScore}
                                            </span>
                                        </td>
                                        <td className="py-3 text-xs font-medium text-slate-600">{sup.change}</td>
                                        <td className="py-3 text-right text-xs text-slate-500">{sup.invoiceCount} st</td>
                                        <td className="py-3 text-xs italic text-slate-500">{sup.comment}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
