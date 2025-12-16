
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "@heroicons/react/24/outline";
import TrustBadge from "@/components/ui/TrustBadge";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import { useNavigate } from "react-router-dom";

export default function TopInvoicesTable({ data }) {
    const navigate = useNavigate();

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="space-y-1">
                    <CardTitle className="text-base">Viktiga Fakturor</CardTitle>
                    <CardDescription>Transaktioner som kräver din uppmärksamhet.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/invoices')} className="text-xs">
                    Visa alla
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-slate-500 border-b text-xs uppercase tracking-wide">
                            <tr>
                                <th className="pb-2 font-medium">Leverantör</th>
                                <th className="pb-2 font-medium text-right">Belopp</th>
                                <th className="pb-2 font-medium text-center">Trust</th>
                                <th className="pb-2 font-medium">Status</th>
                                <th className="pb-2 font-medium">Orsak</th>
                                <th className="pb-2"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {(!data || data.length === 0) ? (
                                <tr><td colSpan={6} className="py-4 text-center text-slate-400">Inga fakturor att visa.</td></tr>
                            ) : (
                                data.map(inv => (
                                    <tr key={inv.id} className="hover:bg-slate-50 group cursor-pointer" onClick={() => navigate(`/dashboard/invoices/${inv.id}`)}>
                                        <td className="py-3 font-medium text-slate-700">{inv.supplier}</td>
                                        <td className="py-3 text-right tabular-nums">{inv.amount?.toLocaleString('sv-SE')} kr</td>
                                        <td className="py-3 text-center"><TrustBadge score={inv.trustScore} /></td>
                                        <td className="py-3"><InvoiceStatusBadge status={inv.status} /></td>
                                        <td className="py-3 text-xs text-slate-500">{inv.reason}</td>
                                        <td className="py-3 text-right">
                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                                <EyeIcon className="w-4 h-4 text-slate-400" />
                                            </Button>
                                        </td>
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
