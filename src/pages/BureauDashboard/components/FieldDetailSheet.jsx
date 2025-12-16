import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Download } from "lucide-react";
import { complianceService } from "@/services/complianceService";

export function FieldDetailSheet({ field, open, onOpenChange }) {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && field) {
            loadDetails();
        } else {
            setDetails(null);
        }
    }, [open, field]);

    const loadDetails = async () => {
        setLoading(true);
        try {
            const data = await complianceService.getFieldDetails(field.fieldKey);
            setDetails(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (!field) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-xl flex items-center gap-2">
                        {field.label}
                        <Badge variant="outline" className="font-normal text-xs">{field.fieldKey}</Badge>
                    </SheetTitle>
                    <SheetDescription>
                        {field.description} Det här fältet ska alltid vara ifyllt för att uppfylla grundläggande krav.
                    </SheetDescription>
                </SheetHeader>

                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
                ) : details ? (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Kunder med brister</h3>
                            <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-200">
                                {details.customers.map((c, i) => (
                                    <div key={i} className="p-3 flex justify-between items-center hover:bg-slate-100 transition-colors">
                                        <span className="text-sm font-medium text-slate-800">{c.name}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-slate-500">{c.invoices} fakturor</span>
                                            <Button size="sm" variant="ghost" className="h-6 text-xs px-2 text-indigo-600">Visa</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Exempel på fakturor</h3>
                            <ScrollArea className="h-[250px] rounded-md border border-slate-200 p-0">
                                <div className="divide-y divide-slate-100">
                                    {details.invoices.map((inv, i) => (
                                        <div key={i} className="p-3 hover:bg-slate-50">
                                            <div className="flex justify-between">
                                                <span className="font-mono text-xs font-medium bg-slate-100 px-1 py-0.5 rounded">{inv.invoiceNumber}</span>
                                                <span className="text-xs text-slate-400">{inv.date}</span>
                                            </div>
                                            <div className="mt-1 flex justify-between">
                                                <span className="text-xs text-slate-600">{inv.customer}</span>
                                                <span className="text-xs text-red-500 italic">{inv.issue}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="w-full gap-2">
                                <Download className="w-4 h-4" /> Exportera PDF
                            </Button>
                            <Button variant="outline" className="w-full gap-2">
                                <Download className="w-4 h-4" /> Exportera CSV
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
