import React from "react";
import {
    UsersIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
    BuildingStorefrontIcon,
    CircleStackIcon,
    ArrowUpIcon,
    ArrowDownIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

function KpiCard({ title, value, label, icon: Icon, colorClass, trend, actionLabel }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full relative overflow-hidden group">
            {/* Subtle top gradient line */}
            <div className={`absolute top-0 left-0 right-0 h-1 ${colorClass.bg.replace('bg-', 'bg-gradient-to-r from-white via-')} to-white opacity-50`}></div>

            <div>
                <div className="flex justify-between items-start mb-2">
                    <div className={`p-2 rounded-lg ${colorClass.bg} bg-opacity-50`}>
                        <Icon className={`w-4 h-4 ${colorClass.text}`} />
                    </div>
                    {trend && (
                        <div className={`flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full ${trend.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {trend.isPositive ? <ArrowUpIcon className="w-2.5 h-2.5 mr-1" /> : <ArrowDownIcon className="w-2.5 h-2.5 mr-1" />}
                            {trend.value}
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">{title}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{label}</p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Åtgärd</span>
                <Button variant="link" size="sm" className={`h-auto p-0 text-[10px] font-semibold ${colorClass.text} hover:opacity-80`}>
                    {actionLabel || "Visa detaljer"} &rarr;
                </Button>
            </div>
        </div>
    );
}

export function PortfolioKpiRow({ data }) {
    if (!data) return <div className="grid grid-cols-2 lg:grid-cols-5 gap-4"><div className="h-32 bg-slate-100 animate-pulse rounded-xl col-span-5" /></div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <KpiCard
                title="Totalt antal kunder"
                value={data.totalCustomers}
                label="Alla kundbolag i portföljen."
                icon={UsersIcon}
                colorClass={{ bg: "bg-blue-100", text: "text-blue-600" }}
                trend={{ isPositive: true, value: "12% 30 dgr" }}
                actionLabel="Visa kundlista"
            />
            <KpiCard
                title="Hög risk"
                value={data.highRiskCustomers}
                label="Avvikelser eller risklev."
                icon={ExclamationTriangleIcon}
                colorClass={{ bg: "bg-red-100", text: "text-red-600" }}
                trend={{ isPositive: false, value: "2 idag" }} // Negative trend meaning "Bad thing went up" or similar, context dependent. Let's assume logic handled elsewhere or static for now.
                actionLabel="Visa riskkunder"
            />
            <KpiCard
                title="Fakturor (Avvikelser)"
                value={data.recentInvoiceIssues}
                label="Senaste 7 dagarna."
                icon={DocumentTextIcon}
                colorClass={{ bg: "bg-amber-100", text: "text-amber-600" }}
                trend={{ isPositive: false, value: "5 nya" }}
                actionLabel="Granska alla"
            />
            <KpiCard
                title="Riskleverantörer"
                value={data.criticalSuppliers}
                label="Hög risk / Ändrade uppg."
                icon={BuildingStorefrontIcon}
                colorClass={{ bg: "bg-orange-100", text: "text-orange-600" }}
                trend={{ isPositive: true, value: "-1 st" }} // Less is good? 
                actionLabel="Visa leverantörer"
            />
            <KpiCard
                title="Metadata-brister"
                value={data.metadataIssues30d}
                label="Sie-filer & Perioder."
                icon={CircleStackIcon}
                colorClass={{ bg: "bg-purple-100", text: "text-purple-600" }}
                actionLabel="Åtgärda brister"
            />
        </div>
    );
}
