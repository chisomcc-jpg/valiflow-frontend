import React from "react";
import { Button } from "@/components/ui/button";

export function TopCustomersTable({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
                Inga kunder med hög risk just nu.
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-slate-700">Kund</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Risknivå</th>
                        <th className="px-4 py-3 font-semibold text-slate-700 text-right">Avvikelser</th>
                        <th className="px-4 py-3 font-semibold text-slate-700 text-right hidden sm:table-cell">Fakturor (7d)</th>
                        <th className="px-4 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.map((customer) => (
                        <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-900">{customer.name}</td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded textxs font-medium ${customer.risk === 'Hög' ? 'bg-red-100 text-red-700' :
                                        customer.risk === 'Medel' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                    }`}>
                                    {customer.risk}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-right text-slate-600">{customer.issues}</td>
                            <td className="px-4 py-3 text-right text-slate-600 hidden sm:table-cell">{customer.invoices7d}</td>
                            <td className="px-4 py-3 text-right">
                                <Button size="sm" variant="outline" className="h-7 text-xs">
                                    Öppna
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
