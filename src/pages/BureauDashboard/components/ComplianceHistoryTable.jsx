import React, { useEffect, useState } from "react";
import { complianceService } from "@/services/complianceService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, CheckCircle, AlertTriangle, User } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export function ComplianceHistoryTable({ refreshTrigger, search }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [refreshTrigger]);

    const loadData = async () => {
        setLoading(true);
        try {
            const list = await complianceService.getHistory();
            setHistory(list);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = history.filter(h =>
        h.message?.toLowerCase().includes(search.toLowerCase()) ||
        h.customerId?.toLowerCase().includes(search.toLowerCase())
    );

    const getIcon = (type) => {
        if (type === "auto_correction") return <Zap className="w-4 h-4 text-amber-500" />;
        if (type === "fixed") return <CheckCircle className="w-4 h-4 text-green-500" />;
        return <AlertTriangle className="w-4 h-4 text-indigo-500" />;
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

    return (
        <div className="space-y-4">
            <div className="bg-slate-50 text-slate-600 p-4 rounded-xl text-sm border border-slate-200">
                Historiken visar alla kontroller och korrigeringar som har gjorts, både automatiskt och manuellt. Bra underlag för revision och uppföljning.
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Typ</TableHead>
                            <TableHead>Händelse</TableHead>
                            <TableHead>Kund</TableHead>
                            <TableHead>Fält</TableHead>
                            <TableHead>Användare/System</TableHead>
                            <TableHead className="text-right">Tidpunkt</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredHistory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-500">Ingen historik hittades.</TableCell>
                            </TableRow>
                        ) : filteredHistory.map((h, i) => (
                            <TableRow key={h.id || i}>
                                <TableCell>{getIcon(h.type)}</TableCell>
                                <TableCell className="font-medium text-slate-900">{h.message}</TableCell>
                                <TableCell className="text-slate-600">{h.customerId || "-"}</TableCell>
                                <TableCell className="text-slate-500 text-sm">{h.fieldKey || "-"}</TableCell>
                                <TableCell className="text-slate-500 text-sm flex items-center gap-1">
                                    <User className="w-3 h-3" /> {h.actor}
                                </TableCell>
                                <TableCell className="text-right text-slate-500 text-xs text-nowrap">
                                    {h.createdAt ? format(new Date(h.createdAt), "d MMM HH:mm", { locale: sv }) : "-"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
