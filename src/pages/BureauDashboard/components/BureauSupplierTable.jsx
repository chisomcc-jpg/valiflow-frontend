import React, { useEffect, useState } from "react";
import { supplierService } from "@/services/supplierService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { SupplierDetailSheet } from "@/components/suppliers/SupplierDetailSheet";

export function BureauSupplierTable({ search }) {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const list = await supplierService.listSuppliers();
            setSuppliers(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredSuppliers = suppliers.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.orgNumber.includes(search);
        if (!matchesSearch) return false;

        if (filter === "high_risk") return s.riskLevel === "high";
        if (filter === "missing_id") return s.orgNumber === "Saknas";
        // if (filter === "account_change") ... need field for that
        return true;
    });

    const getRiskBadge = (level) => {
        if (level === "high") return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Hög</Badge>;
        if (level === "medium") return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">Medel</Badge>;
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Låg</Badge>;
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700">Filtrera lista:</span>
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Alla leverantörer</SelectItem>
                            <SelectItem value="high_risk">Endast hög risk</SelectItem>
                            <SelectItem value="missing_id">Saknar org.nr</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-slate-500">
                    Visar {filteredSuppliers.length} av {suppliers.length} leverantörer
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Leverantör</TableHead>
                            <TableHead>Org.nr</TableHead>
                            <TableHead>Antal kunder</TableHead>
                            <TableHead>Antal fakturor</TableHead>
                            <TableHead>Risknivå</TableHead>
                            <TableHead>Senaste avvikelse</TableHead>
                            <TableHead className="text-right">Åtgärd</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSuppliers.map(s => (
                            <TableRow key={s.id} className="hover:bg-slate-50">
                                <TableCell className="font-medium text-slate-900">{s.name}</TableCell>
                                <TableCell>
                                    {s.orgNumber === "Saknas" ? (
                                        <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">Saknas</Badge>
                                    ) : (
                                        <span className="font-mono text-slate-600 text-xs">{s.orgNumber}</span>
                                    )}
                                </TableCell>
                                <TableCell>{s.customerCount}</TableCell>
                                <TableCell>{s.invoiceCount}</TableCell>
                                <TableCell>{getRiskBadge(s.riskLevel)}</TableCell>
                                <TableCell className="text-slate-500 text-sm">{s.lastIssue}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" onClick={() => setSelectedSupplier(s)}>Visa</Button>
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
