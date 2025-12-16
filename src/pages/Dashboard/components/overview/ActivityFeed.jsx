
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DocumentTextIcon, BanknotesIcon, ExclamationTriangleIcon, BoltIcon } from "@heroicons/react/24/outline";

const EventIcon = ({ type }) => {
    switch (type) {
        case 'invoice_created': return <DocumentTextIcon className="w-4 h-4" />;
        case 'bankgiro_change': return <BanknotesIcon className="w-4 h-4" />;
        case 'pattern_match': return <ExclamationTriangleIcon className="w-4 h-4" />;
        case 'invoice_approved': return <BoltIcon className="w-4 h-4" />;
        default: return <DocumentTextIcon className="w-4 h-4" />;
    }
}

const getSeverityStyles = (type) => {
    if (type === 'bankgiro_change' || type === 'pattern_match') {
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
    return 'bg-slate-50 text-slate-500 border-slate-100';
}

export default function ActivityFeed({ data }) {
    if (!data) return null;

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Händelselogg</CardTitle>
            </CardHeader>
            <CardContent className="px-0 py-0">
                <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                    {data.map(event => (
                        <div key={event.id} className="p-4 flex gap-3 hover:bg-slate-50/50 transition-colors">
                            <div className={`mt-0.5 p-2 rounded-full border shrink-0 h-fit ${getSeverityStyles(event.type)}`}>
                                <EventIcon type={event.type} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                                <p className="text-xs text-slate-500">{event.desc}</p>
                                <p className="text-[10px] text-slate-400 mt-1">
                                    {new Date(event.date).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })} • {new Date(event.date).toLocaleDateString('sv-SE')}
                                </p>
                            </div>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="p-8 text-center text-slate-400 text-sm">Inga händelser ännu.</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
