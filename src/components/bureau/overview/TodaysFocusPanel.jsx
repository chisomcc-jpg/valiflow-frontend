import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircleIcon, ExclamationTriangleIcon, SparklesIcon } from "@heroicons/react/24/outline";

export function TodaysFocusPanel({ priority, feed }) {
    // 1. Extract potential focus items
    const exceptionCount = priority?.exceptionCount || 0;

    // Look for recent "Whitelist" opportunities in the feed
    const whitelistOpp = feed?.find(item => item.type === 'bureau_whitelist');

    const hasItems = exceptionCount > 0 || whitelistOpp;

    return (
        <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">
                Dagens Fokus
            </h3>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {hasItems ? (
                    <div className="divide-y divide-slate-100">
                        {/* Row 1: Critical Deviations (Priority) */}
                        {exceptionCount > 0 && (
                            <div className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors group">
                                <div className="p-2 bg-amber-50 rounded-lg shrink-0 group-hover:bg-amber-100 transition-colors">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-600/80" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">
                                        {exceptionCount === 1
                                            ? "1 faktura kräver granskning"
                                            : `${exceptionCount} fakturor kräver granskning`
                                        }
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Avvikelser mot historiskt mönster.
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => window.location.href = "/bureau/radar"}
                                    className="text-amber-700 hover:text-amber-900 hover:bg-amber-50 font-medium text-xs whitespace-nowrap"
                                >
                                    Granska
                                </Button>
                            </div>
                        )}

                        {/* Row 2: Agency Memory Opportunity (Value Add) */}
                        {whitelistOpp && (
                            <div className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors group">
                                <div className="p-2 bg-emerald-50 rounded-lg shrink-0 group-hover:bg-emerald-100 transition-colors">
                                    <SparklesIcon className="w-5 h-5 text-emerald-600/70" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">
                                        Ny möjlighet för Byråminne
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {whitelistOpp.supplierName} kan godkännas för hela byrån.
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 font-medium text-xs whitespace-nowrap"
                                >
                                    Byrå-godkänn
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Calm Empty State */
                    <div className="p-8 flex flex-col items-center justify-center text-center bg-slate-50/50">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                            <CheckCircleIcon className="w-6 h-6 text-slate-400" />
                        </div>
                        <h4 className="text-sm font-medium text-slate-900">Allt ser lugnt ut</h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                            Du behöver inte göra något just nu. Valiflow övervakar i bakgrunden.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
