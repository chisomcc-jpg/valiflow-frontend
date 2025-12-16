
import React from 'react';
import { Badge } from "@/components/ui/badge";

export default function InvoiceStatusBadge({ status }) {
    if (status === 'flagged') {
        return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-none">Flagged</Badge>;
    }
    if (status === 'pending') {
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
    }
    return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">OK</Badge>;
}
