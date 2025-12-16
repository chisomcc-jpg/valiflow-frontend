import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, ExternalLink, Download, CheckCircle } from "lucide-react";
import { complianceService } from "@/services/complianceService";

export function CustomerComplianceSheet({ customer, open, onOpenChange }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && customer) {
            loadDetails();
        } else {
            setDetails(null);
        }
    }, [open, customer]);

    const loadDetails = async () => {
        setLoading(true);
        try {
            const data = await complianceService.getCustomerDetails(customer.customerId);
            setDetails(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!customer) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-xl">{customer.name}</SheetTitle>
                        <Badge className={`${customer.score >= 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            Score: {customer.score}%
                        </Badge>
                    </div>
                    <SheetDescription>
                        Här ser du vilka avvikelser vi har hittat för det här bolaget.
                    </SheetDescription>
                </SheetHeader>

                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
                ) : details ? (
                    <div className="space-y-8">
                        {/* DEVIATIONS LIST */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Avvikelser</h3>
                            <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200">
                                {details.deviations.length === 0 ? (
                                    <div className="p-4 text-center text-slate-500 text-sm">Inga avvikelser hittades.</div>
                                ) : details.deviations.map((dev, i) => (
                                    <div key={i} className="p-3 flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">{dev.field}</p>
                                            <p className="text-xs text-slate-500">{dev.description}</p>
                                        </div>
                                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100">
                                            {dev.count} fel
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AFFECTED INVOICES */}
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Påverkade Fakturor</h3>
                            <ScrollArea className="h-[300px] rounded-md border border-slate-200 p-0">
                                <div className="divide-y divide-slate-100">
                                    {details.invoices.map((inv, i) => (
                                        <div key={i} className="p-3 hover:bg-slate-50 flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-medium bg-slate-100 px-1 py-0.5 rounded">{inv.invoiceNumber}</span>
                                                    <span className="text-xs text-slate-400">{inv.date}</span>
                                                </div>
                                                <p className="text-xs text-red-600 mt-1">{inv.issue}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-sm font-medium text-slate-900">{inv.amount?.toLocaleString()} kr</span>
                                                <Button variant="link" size="sm" className="h-auto p-0 text-xs text-indigo-600">Öppna</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        <Separator />

                        <div className="flex justify-between">
                            <Button variant="outline" className="gap-2">
                                <Download className="w-4 h-4" /> Exportera avvikelser
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                <CheckCircle className="w-4 h-4" /> Markera som åtgärdat
                            </Button>
                        </div>

                    </div>
                ) : (
                    <div className="text-center text-slate-500">Ingen data tillgänglig.</div>
                )}
            </SheetContent>
        </Sheet>
    );
}
