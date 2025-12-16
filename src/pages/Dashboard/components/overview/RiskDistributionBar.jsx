
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function RiskDistributionBar({ data, total }) {
    if (!data || !total) return null;

    const getPercent = (val) => Math.round((val / total) * 100);

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">AI Riskbedömning</CardTitle>
                <CardDescription>Säkerhetsnivåer på analyserade fakturor.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden flex cursor-pointer hover:opacity-90 transition-opacity">
                        {/* Safe */}
                        <div style={{ width: `${getPercent(data.safe)}%` }} className="bg-emerald-500 h-full" title={`Säkra: ${data.safe}`} />
                        {/* Review */}
                        <div style={{ width: `${getPercent(data.review)}%` }} className="bg-amber-400 h-full" title={`Granskning: ${data.review}`} />
                        {/* Risk */}
                        <div style={{ width: `${getPercent(data.risk)}%` }} className="bg-red-500 h-full" title={`Hög Risk: ${data.risk}`} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs text-slate-600 hover:bg-slate-50 p-1 rounded cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                <span className="font-medium">Säkra</span>
                            </div>
                            <span>{data.safe} st ({getPercent(data.safe)}%)</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600 hover:bg-slate-50 p-1 rounded cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                <span className="font-medium">Kräver Granskning</span>
                            </div>
                            <span>{data.review} st ({getPercent(data.review)}%)</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600 hover:bg-slate-50 p-1 rounded cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <span className="font-medium">Hög Risk</span>
                            </div>
                            <span>{data.risk} st ({getPercent(data.risk)}%)</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
