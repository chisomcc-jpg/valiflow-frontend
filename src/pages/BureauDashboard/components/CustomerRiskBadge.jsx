import React from "react";
import { Badge } from "@/components/ui/badge";

export function CustomerRiskBadge({ risk }) {
    // Normalizing risk string
    const r = (risk || "").toLowerCase();

    if (r === "hög" || r === "high") {
        return <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">Hög risk</Badge>;
    }
    if (r === "medel" || r === "medium") {
        return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200">Medel</Badge>;
    }
    if (r === "låg" || r === "low") {
        return <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">Låg</Badge>;
    }

    return <Badge variant="outline" className="text-slate-500">Okänd</Badge>;
}
