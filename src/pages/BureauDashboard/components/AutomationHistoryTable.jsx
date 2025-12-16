import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

const SEVERITY_COLORS = {
    info: "bg-blue-100 text-blue-800",
    warning: "bg-amber-100 text-amber-800",
    critical: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800"
};

const RESULT_LABELS = {
    success: "Lyckades",
    failed: "Misslyckades",
    skipped: "Hoppades över"
};

export function AutomationHistoryTable({ history = [] }) {
    if (history.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                <p className="text-slate-500">Ingen historik än.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                    <TableRow>
                        <TableHead>Tidpunkt</TableHead>
                        <TableHead>Händelse</TableHead>
                        <TableHead>Regel / Kund</TableHead>
                        <TableHead>Resultat</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history.map(log => (
                        <TableRow key={log.id} className="hover:bg-slate-50">
                            <TableCell className="text-slate-500 text-xs">
                                {format(new Date(log.createdAt), "d MMM HH:mm", { locale: sv })}
                            </TableCell>
                            <TableCell>
                                <span className="text-sm font-medium text-slate-800">{log.message}</span>
                            </TableCell>
                            <TableCell className="text-xs text-slate-500">
                                <div>Regel: {log.ruleId ? log.ruleId.substring(0, 8) + "..." : "-"}</div>
                                <div>Kund ID: {log.customerId || "-"}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="font-normal">
                                    {RESULT_LABELS[log.result] || log.result}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={`${SEVERITY_COLORS[log.severity] || "bg-slate-100 text-slate-800"} border-0`}>
                                    {log.severity === "critical" ? "Kritisk" : log.severity === "warning" ? "Varning" : "Info"}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
