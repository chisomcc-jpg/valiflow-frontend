import React, { useEffect, useState } from "react";
import { complianceService } from "@/services/complianceService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { CustomerComplianceSheet } from "./CustomerComplianceSheet";
import { format } from "date-fns";

export function ComplianceCustomerTable({ refreshTrigger, search }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [filter, setFilter] = useState("all"); // all, critical, warning

    useEffect(() => {
        loadData();
    }, [refreshTrigger]);

    const loadData = async () => {
        setLoading(true);
        try {
            const list = await complianceService.getByCustomer();
            setCustomers(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;

        if (filter === "critical") return c.score < 50;
        if (filter === "warning") return c.score >= 50 && c.score < 80;
        return true;
    });

    const getScoreBadge = (score) => {
        if (score >= 80) return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">{score}% - Bra</Badge>;
        if (score >= 50) return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">{score}% - Varning</Badge>;
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{score}% - Kritisk</Badge>;
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700">Filtrera lista:</span>
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Alla kunder</SelectItem>
                            <SelectItem value="critical">Endast kritiska</SelectItem>
                            <SelectItem value="warning">Endast varningar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-slate-500">
                    Visar {filteredCustomers.length} av {customers.length} kunder
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Kund</TableHead>
                            <TableHead>Compliance Score</TableHead>
                            <TableHead>Saknade Fält</TableHead>
                            <TableHead>Påverkade Fakturor</TableHead>
                            <TableHead>Senast Granskad</TableHead>
                            <TableHead className="text-right">Åtgärd</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCustomers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-500">Inga kunder matchar filtret.</TableCell>
                            </TableRow>
                        ) : filteredCustomers.map(c => (
                            <TableRow key={c.customerId}>
                                <TableCell className="font-medium text-slate-900">{c.name}</TableCell>
                                <TableCell>{getScoreBadge(c.score)}</TableCell>
                                <TableCell>{c.missingFieldsCount} avvikelser</TableCell>
                                <TableCell>{c.impactedInvoices} st</TableCell>
                                <TableCell className="text-slate-500 text-xs">
                                    {c.lastCheckedAt ? format(new Date(c.lastCheckedAt), "d MMM HH:mm") : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline" onClick={() => setSelectedCustomer(c)}>Visa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <CustomerComplianceSheet
                customer={selectedCustomer}
                open={!!selectedCustomer}
                onOpenChange={(open) => !open && setSelectedCustomer(null)}
            />
        </div>
    );
}
