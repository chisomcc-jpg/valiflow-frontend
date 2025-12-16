import React, { useState } from 'react';
import { ShieldCheckIcon, ExclamationTriangleIcon, BoltIcon, CheckCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { bureauOverviewService } from "@/services/bureauOverviewService"; // We will add methods here

export function GlobalFeed({ feed, onRefresh }) {
    if (!feed || feed.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <UserGroupIcon className="w-5 h-5 text-indigo-600" />
                    Byråflöde
                </h2>
                <span className="text-xs text-slate-500">
                    Insikter från hela ditt nätverk
                </span>
            </div>

            <div className="space-y-3">
                {feed.map((item, idx) => (
                    <FeedItem key={idx} item={item} onRefresh={onRefresh} />
                ))}
            </div>
        </div>
    );
}

function FeedItem({ item, onRefresh }) {
    const [loading, setLoading] = useState(false);

    const handleAction = async () => {
        setLoading(true);
        try {
            if (item.type === 'portfolio_alert' && item.data.action === 'batch_approve_all') {
                // Execute Batch Approval
                // Note: In a real app we would call a proper endpoint. 
                // For this demo, we can simulate or assume the service exists.
                // We'll trust the parent or a service call.
                await new Promise(r => setTimeout(r, 1000)); // Mock delay
                toast.success(`Godkände ${item.data.invoiceCount} fakturor över ${item.data.clientCount || 'flera'} kunder.`);
                onRefresh();
            } else if (item.type === 'safe_pattern') {
                await new Promise(r => setTimeout(r, 800));
                toast.success(`${item.data.supplierName} är nu byrå-godkänd.`);
                onRefresh();
            } else if (item.type === 'network_risk') {
                await new Promise(r => setTimeout(r, 800));
                toast.success(`Leverantören har flaggats för bevakning.`);
                onRefresh();
            }
        } catch (err) {
            toast.error("Kunde inte utföra åtgärd.");
        } finally {
            setLoading(false);
        }
    };

    const isRisk = item.severity === 'critical';
    const isSuccess = item.severity === 'success';
    const isInfo = item.severity === 'info';

    return (
        <div className={`
            relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md
            ${isRisk ? 'bg-red-50 border-red-100' : ''}
            ${isSuccess ? 'bg-emerald-50 border-emerald-100' : ''}
            ${isInfo ? 'bg-white border-slate-200' : ''}
        `}>
            <div className="flex gap-4">
                <div className={`
                    mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${isRisk ? 'bg-red-100 text-red-600' : ''}
                    ${isSuccess ? 'bg-emerald-100 text-emerald-600' : ''}
                    ${isInfo ? 'bg-indigo-100 text-indigo-600' : ''}
                `}>
                    {isRisk && <ExclamationTriangleIcon className="w-5 h-5" />}
                    {isSuccess && <ShieldCheckIcon className="w-5 h-5" />}
                    {isInfo && <BoltIcon className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                    <h3 className={`text-sm font-bold ${isRisk ? 'text-red-900' : 'text-slate-900'}`}>
                        {item.title}
                    </h3>
                    <p className={`text-sm mt-1 mb-3 ${isRisk ? 'text-red-700' : 'text-slate-600'}`}>
                        {item.message}
                    </p>

                    {/* ACTION AREA */}
                    {item.type === 'network_risk' && (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant={isRisk ? "destructive" : "secondary"}
                                className="h-8 text-xs"
                                onClick={handleAction}
                                disabled={loading}
                            >
                                {loading ? "Sparar..." : "Flagga som osäker för alla"}
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 text-xs">
                                Visa berörda kunder ({item.data.affectedCount})
                            </Button>
                        </div>
                    )}

                    {item.type === 'safe_pattern' && (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={handleAction}
                                disabled={loading}
                            >
                                {loading ? "Godkänner..." : "Byrå-godkänn"}
                            </Button>
                        </div>
                    )}

                    {item.type === 'portfolio_alert' && (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                                onClick={handleAction}
                                disabled={loading}
                            >
                                {loading ? "Jobbar..." : `Godkänn ${item.data.invoiceCount} fakturor (Batch)`}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
