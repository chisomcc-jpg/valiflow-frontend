import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { bureauOverviewService } from "@/services/bureauOverviewService";
import { Button } from "@/components/ui/button";
import InvoiceQuickView from "@/components/InvoiceQuickView";

export default function ExceptionRadar() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await bureauOverviewService.getActionItems();
            setItems(data || []);
        } catch (error) {
            console.error("Failed to load radar items", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = (invoiceId) => {
        setSelectedInvoiceId(invoiceId);
    };

    const handleCloseReview = () => {
        setSelectedInvoiceId(null);
        loadData(); // Refresh list after potential action
    };

    // Derived Stats
    const exceptionCount = items.length;
    // Mocking total/verified for the header as requested in spec, 
    // in real app these would come from an aggregated stats endpoint.
    const totalAnalyzed = 142;
    const verifiedCount = totalAnalyzed - exceptionCount;

    if (loading) {
        return <div className="p-12 text-center text-slate-400 animate-pulse">Laddar Radar...</div>;
    }

    // EMPTY STATE
    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#F4F7FB] p-8 flex flex-col items-center justify-center">
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircleIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Allt ser bra ut just nu</h2>
                    <p className="text-slate-600 mb-6">Inga fakturor kräver din uppmärksamhet.</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Valiflow fortsätter att övervaka i bakgrunden.</p>

                    <Button variant="outline" className="mt-8 w-full" onClick={() => navigate('/bureau')}>
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Tillbaka till Översikt
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F4F7FB]">
            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20 shadow-sm">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/bureau')} className="-ml-2 text-slate-400 hover:text-slate-700">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Button>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Exception Radar</h1>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 ml-11">
                        <span className="font-medium text-orange-600 flex items-center gap-1.5">
                            <ExclamationTriangleIcon className="w-4 h-4" />
                            {exceptionCount} fakturor kräver åtgärd idag
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>{totalAnalyzed} fakturor analyserade – {verifiedCount} verifierade automatiskt</span>
                    </div>
                </div>
            </header>

            {/* LIST VIEW */}
            <main className="max-w-4xl mx-auto px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                    {items.map((item) => (
                        <div key={item.id} className="p-5 flex items-center gap-6 hover:bg-slate-50 transition-colors group">

                            {/* 1. Supplier Name & Client Context */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-base font-semibold text-slate-900 truncate">{item.supplier}</h3>
                                </div>
                                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                                    <span>Kund: {item.clientName}</span>
                                </p>
                            </div>

                            {/* 3. Reason */}
                            <div className="flex-[2] text-sm text-slate-700 font-medium">
                                {item.reason}
                            </div>

                            {/* 4. Status Badge */}
                            <div className="shrink-0 w-32">
                                {item.status === 'unknown' || item.status === 'needs_review' ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                                        <ExclamationCircleIcon className="w-3.5 h-3.5" />
                                        Otillräcklig info
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                                        <ExclamationCircleIcon className="w-3.5 h-3.5" />
                                        Avvikelse
                                    </span>
                                )}
                            </div>

                            {/* 5. Primary Action */}
                            <div className="shrink-0">
                                <Button onClick={() => handleReview(item.id)} className="bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 shadow-sm font-semibold">
                                    Granska
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* QUICK VIEW SLIDE-OVER */}
            {selectedInvoiceId && (
                <InvoiceQuickView
                    invoiceId={selectedInvoiceId}
                    isOpen={!!selectedInvoiceId}
                    onClose={handleCloseReview}
                    onUpdate={handleCloseReview}
                    advisoryContext={{
                        title: "Valiflow rekommenderar manuell granskning.",
                        reason: items.find(i => i.id === selectedInvoiceId)?.reason || "Avvikelse upptäckt."
                    }}
                />
            )}
        </div>
    );
}
