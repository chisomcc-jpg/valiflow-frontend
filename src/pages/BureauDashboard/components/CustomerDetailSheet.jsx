import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bureauService } from "@/services/bureauService";
import { ArrowRightIcon, ArrowTopRightOnSquareIcon, ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { CustomerStatusBadge } from "./CustomerStatusBadge";
import { CustomerRiskBadge } from "./CustomerRiskBadge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function CustomerDetailSheet({ customerId, open, onOpenChange }) {
    const [details, setDetails] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [impersonating, setImpersonating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (open && customerId) {
            loadData();
        } else {
            setDetails(null);
            setSummary(null);
        }
    }, [open, customerId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [d, s] = await Promise.all([
                bureauService.getAgencyCustomerQuickview(customerId),
                bureauService.getAgencyCustomerSummary(customerId).catch(() => null)
            ]);
            setDetails(d);
            setSummary(s);
        } catch (e) {
            console.error(e);
            toast.error("Kunde inte ladda kundinformation.");
        } finally {
            setLoading(false);
        }
    };

    const handleImpersonate = async () => {
        setImpersonating(true);
        try {
            const res = await bureauService.impersonateAgencyCustomer(customerId);
            if (res.redirectPath) {
                // Here we would ideally store the token in context/localStorage
                // For now, we assume the backend session handling or token cookie logic works
                // But typically: auth.setImpersonation(res.impersonationToken)

                toast.success(`Öppnar dashboard för ${details.name}...`);

                // Navigate to the dashboard
                // Force a small delay or context update if needed
                navigate(res.redirectPath);
            }
        } catch (e) {
            console.error(e);
            toast.error("Kunde inte öppna kundens dashboard.");
            setImpersonating(false);
        }
    };

    if (!customerId) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto bg-slate-50 p-0 border-l border-slate-200">
                {/* HERO HEADER */}
                <div className="bg-white px-6 py-6 border-b border-slate-200">
                    <SheetHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <SheetTitle className="text-xl text-slate-900 font-bold flex items-center gap-2">
                                    {details ? details.name : "Laddar..."}
                                </SheetTitle>
                                {details && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant="outline" className="font-mono text-xs text-slate-500 font-normal bg-slate-50">
                                            {details.orgNumber || "Org.nr saknas"}
                                        </Badge>
                                        <CustomerStatusBadge status={details.status} />
                                    </div>
                                )}
                            </div>
                            {details && <CustomerRiskBadge risk={details.riskLevel} />}
                        </div>
                        <SheetDescription className="mt-2 text-slate-500">
                            Här ser du en snabb bild av hur kunden mår just nu.
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <div className="p-6 space-y-6">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        </div>
                    ) : details ? (
                        <>
                            {/* SNABBINFO GRID */}
                            <div className="grid grid-cols-2 gap-4">
                                <InfoCard label="Fakturor (30d)" value={details.invoiceCount30d} />
                                <InfoCard label="Leverantörer" value={details.supplierCount} />
                                <InfoCard label="Avvikelser" value={details.anomaliesCount} warning={details.anomaliesCount > 0} />
                                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Senast uppdaterad</p>
                                    <p className="text-sm font-semibold text-slate-900">
                                        {details.lastActivityAt ? new Date(details.lastActivityAt).toLocaleDateString("sv-SE") : "-"}
                                    </p>
                                </div>
                            </div>

                            {/* KVALITET & RISK */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                                    <ExclamationTriangleIcon className="w-4 h-4 text-slate-400" />
                                    Kvalitet & Risk
                                </h3>
                                <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                                    {details.riskIssues && details.riskIssues.length > 0 ? (
                                        details.riskIssues.map((issue, i) => (
                                            <div key={i} className="p-3 flex items-start gap-3">
                                                <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${issue.count > 0 ? "bg-red-500" : "bg-green-500"}`} />
                                                <div>
                                                    <p className="text-sm text-slate-700">
                                                        <span className="font-semibold text-slate-900 mr-1">{issue.count}</span>
                                                        {issue.label}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-sm text-slate-500 flex items-center gap-2">
                                            <CheckCircleIcon className="w-5 h-5 text-green-500" /> Inga noterade risker.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* AI SAFETY SUMMARY */}
                            {summary && (
                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-slate-700">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">AI-Sammanfattning</span>
                                    </div>
                                    <p className="leading-relaxed">
                                        {summary.summary}
                                    </p>
                                </div>
                            )}

                            {/* ACTIONS */}
                            <div className="pt-4 space-y-3">
                                <Button
                                    className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                                    onClick={handleImpersonate}
                                    disabled={impersonating}
                                >
                                    {impersonating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Byter till kundvy...
                                        </>
                                    ) : (
                                        <>
                                            Öppna kundens dashboard
                                            <ArrowRightIcon className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </Button>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="w-full text-slate-600 border-slate-300">
                                        Öppna fakturor
                                    </Button>
                                    <Button variant="outline" className="w-full text-slate-600 border-slate-300">
                                        Visa leverantörer
                                    </Button>
                                </div>
                            </div>

                        </>
                    ) : (
                        <div className="text-center text-slate-500">Ingen data kunde laddas.</div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

function InfoCard({ label, value, warning }) {
    return (
        <div className={`p-3 rounded-lg border shadow-sm ${warning ? "bg-red-50 border-red-200" : "bg-white border-slate-200"}`}>
            <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${warning ? "text-red-600" : "text-slate-500"}`}>{label}</p>
            <p className={`text-xl font-bold ${warning ? "text-red-700" : "text-slate-900"}`}>{value}</p>
        </div>
    );
}
