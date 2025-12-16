import React, { useEffect, useState } from "react";
import { supplierService } from "@/services/supplierService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { SupplierDetailSheet } from "@/components/suppliers/SupplierDetailSheet";

export function BureauSuppliersOverview() {
    const [data, setData] = useState(null);
    const [topRisks, setTopRisks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const overview = await supplierService.getOverview();
            const risks = await supplierService.getRiskOverview();
            setData(overview);
            setTopRisks(risks);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
    if (!data) return <div className="p-8 text-center text-slate-500">Kunde inte ladda översikten.</div>;

    return (
        <div className="space-y-6">
            {/* KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <KpiCard
                    title="Totalt antal leverantörer"
                    value={data.totalSuppliers}
                    helper="Alla leverantörer som förekommer hos dina kunder."
                />
                <KpiCard
                    title="Leverantörer med hög risk"
                    value={data.highRiskSuppliers}
                    helper="Leverantörer där Valiflow har hittat tydliga riskindikatorer."
                    variant="destructive"
                />
                <KpiCard
                    title="Kontoändringar (30 dagar)"
                    value={data.recentBankAccountChanges}
                    helper="En vanlig typ av bedrägeriförsök. Viktigt att följa upp."
                />
                <KpiCard
                    title="Lev. utan org.nr"
                    value={data.missingIdSuppliers}
                    helper="Leverantörer där viktig identitetsinformation saknas."
                />
                <KpiCard
                    title="Flerkunds-leverantörer"
                    value={data.multiCustomerSuppliers}
                    helper="Leverantörer som förekommer i flera bolag samtidigt."
                />
            </div>

            {/* TOP RISKS */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Topprisker</h3>
                    <p className="text-sm text-slate-500">Visar leverantörer där Valiflow har hittat flest eller mest allvarliga avvikelser.</p>
                </div>
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Leverantör</TableHead>
                            <TableHead>Antal kunder</TableHead>
                            <TableHead>Risknivå</TableHead>
                            <TableHead>Senaste avvikelse</TableHead>
                            <TableHead className="text-right">Åtgärd</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topRisks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-slate-500">Inga högriskleverantörer hittades.</TableCell>
                            </TableRow>
                        ) : topRisks.map(sup => (
                            <TableRow key={sup.id}>
                                <TableCell className="font-medium text-slate-900">{sup.name}</TableCell>
                                <TableCell>{sup.customerCount} st</TableCell>
                                <TableCell>
                                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Hög</Badge>
                                </TableCell>
                                <TableCell className="text-slate-600 text-sm">{sup.lastIssue}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" onClick={() => setSelectedSupplier(sup)}>Visa</Button>
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
                companyId={1} // TODO: Use real agency ID or handle in service to verify context
            />
        </div>
    );
}

function KpiCard({ title, value, helper, variant = "default" }) {
    const colors = {
        default: "bg-white border-slate-200",
        destructive: "bg-red-50 border-red-200",
    };

    return (
        <Card className={`${colors[variant]} shadow-sm`}>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 truncate" title={title}>{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                {helper && <p className="text-xs text-slate-400 mt-1 line-clamp-2" title={helper}>{helper}</p>}
            </CardContent>
        </Card>
    );
}
