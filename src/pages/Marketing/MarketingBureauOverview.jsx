// src/pages/Marketing/MarketingBureauOverview.jsx
import React from "react";
import { PortfolioKpiRow } from "@/components/bureau/overview/PortfolioKpiRow";
import { PriorityAlerts } from "@/components/bureau/overview/PriorityAlerts";
import { PortfolioHealthChart } from "@/components/bureau/overview/PortfolioHealthChart";
import { PipelineActivityTimeline } from "@/components/bureau/overview/PipelineActivityTimeline";
import { TopCustomersTable } from "@/components/bureau/overview/TopCustomersTable";
import { TopSuppliersMini } from "@/components/bureau/overview/TopSuppliersMini";
import { marketingMockData } from "../../demo/marketingMockData";

export default function MarketingBureauOverview() {
    const { kpi, alerts, portfolioHealth, pipelineActivity, customers, suppliers } = marketingMockData;

    // Transform data to match component props if needed
    const tableCustomers = customers.slice(0, 5).map(c => ({
        id: c.id,
        name: c.name,
        orgNr: c.orgnr,
        riskScore: c.risk,
        invoiceCount: c.invoices,
        totalVolume: c.volume
    }));

    const chartData = portfolioHealth;

    return (
        <div className="space-y-8 pb-12">
            {/* Marketing Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Översikt</h1>
                <p className="text-slate-500 mt-1">
                    Realtidsdata för hela din kundportfölj.
                </p>
            </div>

            {/* KPI Stats */}
            <PortfolioKpiRow stats={kpi} />

            {/* Primary Grid Layout */}
            <div className="grid grid-cols-12 gap-8">

                {/* Left Col: Alerts & Charts */}
                <div className="col-span-12 xl:col-span-8 space-y-8">

                    {/* 1. Alerts */}
                    <section>
                        <PriorityAlerts alerts={alerts} />
                    </section>

                    {/* 2. Portfolio Health Chart */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900">Portföljhälsa</h3>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Låg risk</span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600"><span className="w-2 h-2 rounded-full bg-amber-400" /> Medel</span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600"><span className="w-2 h-2 rounded-full bg-red-500" /> Hög risk</span>
                            </div>
                        </div>
                        <div className="h-[320px] w-full">
                            {/* Passing static data directly if component supports it, otherwise mimicking via key prop forcing re-render or similar if needed. 
                   Assuming components accept data/stats prop based on standard patterns. If not, Wrapper is needed.
               */}
                            <PortfolioHealthChart data={chartData} />
                        </div>
                    </section>

                    {/* 3. Top Customers Table */}
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Högst riskexponering</h3>
                        <TopCustomersTable customers={tableCustomers} />
                    </section>

                </div>

                {/* Right Col: Timeline & Suppliers */}
                <div className="col-span-12 xl:col-span-4 space-y-8">

                    {/* Timeline */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Pipeline-aktivitet (Idag)</h3>
                        <PipelineActivityTimeline data={pipelineActivity} />
                    </section>

                    {/* Top Suppliers */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Riskleverantörer att bevaka</h3>
                        <TopSuppliersMini suppliers={suppliers} />
                    </section>

                </div>
            </div>
        </div>
    );
}
