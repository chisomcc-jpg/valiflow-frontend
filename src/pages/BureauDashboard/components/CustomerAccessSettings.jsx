import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { bureauSettingsService } from "@/services/bureauSettingsService";
import { useBureauSSE } from "@/hooks/useBureauSSE";

export function CustomerAccessSettings() {
    const [users, setUsers] = useState([]);

    // SSE Refresh
    const { bureauEvents } = useBureauSSE(1);
    useEffect(() => {
        if (bureauEvents?.type === "access_update") loadData();
    }, [bureauEvents]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const list = await bureauSettingsService.getAccessList();
            setUsers(list);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Kundbehörigheter</h3>
                <p className="text-sm text-slate-500">Styr vilka kunder varje medarbetare har åtkomst till.</p>
            </div>

            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead>Medarbetare</TableHead>
                        <TableHead>Roll</TableHead>
                        <TableHead>Antal kunder</TableHead>
                        <TableHead className="text-right">Åtgärd</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(u => (
                        <TableRow key={u.userId}>
                            <TableCell className="font-medium">{u.name}</TableCell>
                            <TableCell>{u.role}</TableCell>
                            <TableCell>{u.accessCount}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="outline" size="sm">Hantera access</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
