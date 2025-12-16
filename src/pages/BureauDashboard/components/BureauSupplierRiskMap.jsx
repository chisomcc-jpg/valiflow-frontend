import React, { useEffect, useState } from "react";
import { supplierService } from "@/services/supplierService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { SupplierDetailSheet } from "@/components/suppliers/SupplierDetailSheet";
import { format } from "date-fns";

export function BureauSupplierRiskMap() {
    const [accountChanges, setAccountChanges] = useState([]);
    const [anomalies, setAnomalies] = useState([]);
    const [crossCustomer, setCrossCustomer] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [acc, anom, cross] = await Promise.all([
                supplierService.getBankAccountChanges(),
                supplierService.getAnomalies(),
                supplierService.getCrossCustomer()
            ]);
            setAccountChanges(acc);
            setAnomalies(anom);
            setCrossCustomer(cross);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    const handleOpen = (name) => {
        setSelectedSupplier({ name });
    }

    return (
        <div className="space-y-8">

            {/* SECTION 1: ACCOUNT CHANGES */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Leverantörer med ändrade betalningsuppgifter (60 dagar)</h3>
                    <p className="text-sm text-slate-500">Kontoändringar är en vanlig typ av bedrägeriförsök. Här ser du vem som bör kontrolleras extra noggrant.</p>
                </div>
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Leverantör</TableHead>
                            <TableHead>Meddelande</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead className="text-right">Åtgärd</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accountChanges.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center h-20 text-slate-500">Inga nyliga kontoändringar.</TableCell></TableRow>
                        ) : accountChanges.map(ac => (
                            <TableRow key={ac.id}>
                                <TableCell className="font-medium text-slate-900">{ac.supplierName}</TableCell>
                                <TableCell>{ac.message}</TableCell>
                                <TableCell>{format(new Date(ac.createdAt), "yyyy-MM-dd")}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" onClick={() => handleOpen(ac.supplierName)}>Visa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* SECTION 2: ANOMALIES */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Ovanligt stora eller avvikande fakturor</h3>
                    <p className="text-sm text-slate-500">Visar fakturor som avviker tydligt från leverantörens normala beteende.</p>
                </div>
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Leverantör</TableHead>
                            <TableHead>Avvikelse</TableHead>
                            <TableHead>Datum</TableHead>
                            <TableHead className="text-right">Åtgärd</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {anomalies.length === 0 ? (
                            <TableRow><TableCell colSpan={4} className="text-center h-20 text-slate-500">Inga avvikelser hittade.</TableCell></TableRow>
                        ) : anomalies.map(an => (
                            <TableRow key={an.id}>
                                <TableCell className="font-medium text-slate-900">{an.supplierName}</TableCell>
                                <TableCell>{an.riskExplanation || "Ovanligt mönster"}</TableCell>
                                <TableCell>{format(new Date(an.createdAt), "yyyy-MM-dd")}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" onClick={() => handleOpen(an.supplierName)}>Visa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* SECTION 3: CROSS CUSTOMER */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Leverantörer som används av flera kunder</h3>
                    <p className="text-sm text-slate-500">Leverantörer som förekommer i flera kundbolag kan vara extra intressanta vid granskning.</p>
                </div>
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Leverantör</TableHead>
                            <TableHead>Antal kunder</TableHead>
                            <TableHead>Totalt belopp</TableHead>
                            <TableHead>Risknivå</TableHead>
                            <TableHead className="text-right">Åtgärd</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {crossCustomer.map(cc => (
                            <TableRow key={cc.id}>
                                <TableCell className="font-medium text-slate-900">{cc.name}</TableCell>
                                <TableCell>{cc.customerCount}</TableCell>
                                <TableCell>{cc.totalAmount?.toLocaleString()} kr</TableCell>
                                <TableCell>
                                    <Badge variant={cc.riskLevel === 'high' ? 'destructive' : 'outline'}>{cc.riskLevel}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" onClick={() => handleOpen(cc.name)}>Visa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <SupplierDetailSheet
                open={!!selectedSupplier}
                onOpenChange={(open) => !open && setSelectedSupplier(null)}
                supplierName={selectedSupplier?.name}
                companyId={1}
            />
        </div>
    );
}
