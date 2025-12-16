import React, { useEffect, useState } from "react";
import { complianceService } from "@/services/complianceService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { FieldDetailSheet } from "./FieldDetailSheet";

export function ComplianceFieldMatrix({ refreshTrigger, search }) {
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedField, setSelectedField] = useState(null);

    useEffect(() => {
        loadData();
    }, [refreshTrigger]);

    const loadData = async () => {
        setLoading(true);
        try {
            const list = await complianceService.getFieldMatrix();
            setFields(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredFields = fields.filter(f => f.label.toLowerCase().includes(search.toLowerCase()));

    const getStatusBadge = (status) => {
        if (status === "ok") return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Bra</Badge>;
        if (status === "warning") return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"><AlertTriangle className="w-3 h-3 mr-1" /> Viss brist</Badge>;
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200"><AlertCircle className="w-3 h-3 mr-1" /> Kritisk</Badge>;
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    return (
        <div className="space-y-4">
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100">
                Den här listan visar vilka datapunkter som måste vara korrekta för att uppfylla kvalitets- och rapporteringskrav. Klicka på ett fält för att se vilka kunder och fakturor som saknar information.
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Metadatafält</TableHead>
                            <TableHead>Beskrivning</TableHead>
                            <TableHead>Kunder med brister</TableHead>
                            <TableHead>Påverkade Fakturor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Åtgärd</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFields.map(f => (
                            <TableRow key={f.fieldKey}>
                                <TableCell className="font-medium text-slate-900">{f.label}</TableCell>
                                <TableCell className="text-slate-500 text-sm">{f.description}</TableCell>
                                <TableCell>{f.customersWithIssues} st</TableCell>
                                <TableCell>{f.impactedInvoices} st</TableCell>
                                <TableCell>{getStatusBadge(f.status)}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" onClick={() => setSelectedField(f)}>Visa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <FieldDetailSheet
                field={selectedField}
                open={!!selectedField}
                onOpenChange={(open) => !open && setSelectedField(null)}
            />
        </div>
    );
}
