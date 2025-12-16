import React from "react";
import { Badge } from "@/components/ui/badge";

export function CustomerStatusBadge({ status }) {
    if (status === "pilot") {
        return <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200">Pilot</Badge>;
    }
    if (status === "active" || status === "active_paid") {
        return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">Aktiv</Badge>;
    }
    if (status === "inactive" || status === "churned") {
        return <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">Inaktiv</Badge>;
    }
    return <Badge variant="outline" className="text-slate-500">{status}</Badge>;
}
