
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChevronDownIcon, ChevronUpIcon, ExclamationTriangleIcon, LightBulbIcon } from "@heroicons/react/24/outline";

const RecommendationParams = ({ type }) => {
    if (type === 'fraud') return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
    if (type === 'risk') return <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />;
    return <LightBulbIcon className="w-5 h-5 text-blue-600" />;
}

export default function AIRecommendations({ data }) {
    const [open, setOpen] = useState(true);

    if (!data || data.length === 0) return null;

    return (
        <Card>
            <CardHeader className="py-3 flex flex-row items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setOpen(!open)}>
                <CardTitle className="text-base flex items-center gap-2">
                    <LightBulbIcon className="w-5 h-5 text-indigo-600" />
                    AI-rekommendationer
                </CardTitle>
                {open ? <ChevronUpIcon className="w-4 h-4 text-slate-400" /> : <ChevronDownIcon className="w-4 h-4 text-slate-400" />}
            </CardHeader>
            {open && (
                <CardContent className="pt-0">
                    <div className="space-y-3 mt-2">
                        {data.map(rec => (
                            <div key={rec.id} className={`p-3 rounded-lg border flex gap-3 ${rec.priority === 'high' ? 'bg-red-50 border-red-100' :
                                    rec.priority === 'medium' ? 'bg-amber-50 border-amber-100' :
                                        'bg-blue-50 border-blue-100'
                                }`}>
                                <div className="mt-0.5 shrink-0">
                                    <RecommendationParams type={rec.type} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={`text-xs font-bold uppercase tracking-wide ${rec.priority === 'high' ? 'text-red-700' :
                                                rec.priority === 'medium' ? 'text-amber-700' :
                                                    'text-blue-700'
                                            }`}>
                                            {rec.priority === 'high' ? 'Hög Prioritet' : rec.priority === 'medium' ? 'Varning' : 'Info'}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-800">{rec.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
