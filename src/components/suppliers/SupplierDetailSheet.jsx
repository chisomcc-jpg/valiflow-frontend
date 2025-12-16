import React, { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    BanknotesIcon,
    BuildingOfficeIcon,
    ClockIcon,
    UsersIcon
} from "@heroicons/react/24/outline";
import { supplierService } from "@/services/supplierService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export function SupplierDetailSheet({ open, onOpenChange, supplierName, companyId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && supplierName && companyId) {
            loadDetails();
        }
    }, [open, supplierName, companyId]);

    const loadDetails = async () => {
        setLoading(true);
        try {
            const res = await supplierService.getSupplierDetails(companyId, supplierName);
            // Handle both legacy { data: ... } response and direct response
            setData(res && res.data ? res.data : res);
        } catch (err) {
            console.error("Failed to load supplier details", err);
        } finally {
            setLoading(false);
        }
    };

    const hasHighRisk = (data?.risk?.score || 100) < 50;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center justify-between">
                        <span className="text-xl font-bold truncate pr-4">{supplierName}</span>
                        {data && (
                            <Badge variant={hasHighRisk ? "destructive" : "outline"} className={hasHighRisk ? "bg-red-100 text-red-700" : "bg-emerald-50 text-emerald-700"}>
                                Trust: {data.risk?.score ?? data.metrics?.trustScore ?? "-"}
                            </Badge>
                        )}
                    </SheetTitle>
                    <SheetDescription>
                        {data?.customers ? "Detaljerad insikt och historik över alla kunder." : "Detaljerad insikt och transaktionshistorik."}
                    </SheetDescription>
                </SheetHeader>

                {loading ? (
                    <div className="space-y-6">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-60 w-full" />
                    </div>
                ) : data ? (
                    <div className="space-y-8">

                        {/* AGENCY VIEW: CUSTOMERS LIST */}
                        {data.customers && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    <UsersIcon className="w-4 h-4 text-slate-400" /> Kunder som använder leverantören
                                </h3>
                                <div className="bg-white border rounded-lg overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow>
                                                <TableHead>Kund</TableHead>
                                                <TableHead>Fakturor</TableHead>
                                                <TableHead>Senaste</TableHead>
                                                <TableHead className="text-right">Åtgärd</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.customers.map(c => (
                                                <TableRow key={c.id}>
                                                    <TableCell className="font-medium">{c.name}</TableCell>
                                                    <TableCell>{c.invoiceCount}</TableCell>
                                                    <TableCell className="text-xs text-slate-500">{new Date(c.lastInvoiceDate).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button size="sm" variant="ghost" className="h-6 text-xs text-indigo-600">Öppna</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}

                        {/* IDENTITET */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <BuildingOfficeIcon className="w-4 h-4 text-slate-400" /> Identitet & Betalning
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs">Org.nr / Momsnr</span>
                                    <span className="font-mono">{data.vatNumber || data.orgNumber || "Okänd"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs">IBAN / Bankgiro</span>
                                    <span className="font-mono">{data.identity?.iban || "Okänd"}</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* HISTORIK (AGENCY) or CHART (COMPANY) */}
                        {data.history && Array.isArray(data.history) && data.history.length > 0 && data.history[0].message ? (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4 text-slate-400" /> Händelselogg
                                </h3>
                                <div className="border-l-2 border-slate-200 ml-2 space-y-4">
                                    {data.history.map((h, i) => (
                                        <div key={i} className="pl-4 relative">
                                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 border border-white"></div>
                                            <p className="text-sm text-slate-900">{h.message}</p>
                                            <p className="text-xs text-slate-400">{new Date(h.timestamp).toLocaleDateString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : data.history && (
                            /* CHART FALLBACK FOR NORMAL VIEW */
                            <div className="space-y-3 h-64 w-full">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    <BanknotesIcon className="w-4 h-4 text-slate-400" /> Faktureringshistorik
                                </h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.history}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#94A3B8" />
                                        <YAxis tick={{ fontSize: 10 }} stroke="#94A3B8" />
                                        <RechartsTooltip />
                                        <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* RISKER */}
                        {(data.risks || (data.risk && data.risk.reasons)) && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-sm flex items-center gap-2 text-red-600">
                                    <ExclamationTriangleIcon className="w-4 h-4" /> Risker & Avvikelser
                                </h3>
                                <div className="space-y-2">
                                    {(data.risks || data.risk.reasons).map((r, i) => (
                                        <div key={i} className="text-xs p-2 bg-red-50 border border-red-100 rounded text-red-800 flex justify-between">
                                            <span>{r.message || r.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-500">Ingen data hittades.</div>
                )}
            </SheetContent>
        </Sheet>
    );
}

