
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowPathIcon, DocumentTextIcon, ExclamationTriangleIcon, BoltIcon, ShieldCheckIcon, PuzzlePieceIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { overviewService } from "@/services/overviewService";
import { companyOverviewMock } from "@/demo/companyOverviewMock";

// New Components
import AIHeroSummary from "./components/overview/AIHeroSummary";
import RiskDistributionBar from "./components/overview/RiskDistributionBar";
import TopInvoicesTable from "./components/overview/TopInvoicesTable";
import SupplierRiskTable from "./components/overview/SupplierRiskTable";
import CompanyTrendCharts from "./components/overview/CompanyTrendCharts";
import AIRecommendations from "./components/overview/AIRecommendations";
import ActivityFeed from "./components/overview/ActivityFeed";

export default function Overview({ demoOverrideData }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Use local state for data to ensure immediate render
  const [data, setData] = useState(null);

  const loadData = async (silent = false) => {
    // DEMO OVERRIDE: If data is passed via props, use it immediately
    if (demoOverrideData) {
      setData(demoOverrideData);
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);
    try {
      // Removed artificial 600ms delay for instant feel

      const res = await overviewService.getOverview(1); // Hardcoded companyId 1 for now

      // If we got data, update state
      if (res) {
        setData(res);
        if (!silent) toast.success("Översikt uppdaterad");
      }

    } catch (err) {
      console.error("Failed to load overview", err);
      // Only show toast error if manual refresh
      if (!silent) toast.error("Kunde inte ladda översikt.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // POLLING: Refresh every 10s if we have no invoices or just to keep fresh
    // This solves the "user waits for sync" issue
    const interval = setInterval(() => {
      loadData(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // SKELETON LOADING STATE (Instant Feedback)
  if (loading && !data) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto pb-12 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-10 w-1/3 bg-slate-200 rounded-lg"></div>

        {/* Hero Skeleton */}
        <div className="h-48 w-full bg-slate-200 rounded-xl"></div>

        {/* KPI Row Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
          ))}
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-slate-200 rounded-xl"></div>
            <div className="h-96 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="space-y-6">
            <div className="h-80 bg-slate-200 rounded-xl"></div>
            <div className="h-64 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY STATE / ONBOARDING ("The Ghost Town Fix")
  // If no data, or total invoices is 0, show the Connect ERP CTA
  const isEmpty = !data || (data.kpis && data.kpis.totalInvoicesYTD === 0);

  if (isEmpty) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-12 overflow-hidden relative">
          {/* Decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
              <PuzzlePieceIcon className="w-10 h-10" />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              Koppla ert affärssystem
            </h1>
            <p className="text-lg text-slate-500 max-w-lg mx-auto mb-8 leading-relaxed">
              För att Valiflow ska kunna analysera era fakturor och hitta risker behöver vi läsa in data från ert ERP.
            </p>

            <Button
              size="lg"
              onClick={() => navigate("/dashboard/integrations")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg shadow-lg shadow-indigo-200"
            >
              <PuzzlePieceIcon className="w-5 h-5 mr-2" />
              Gå till Integrationer
              <ArrowRightIcon className="w-5 h-5 ml-2 opacity-70" />
            </Button>

            <p className="mt-8 text-sm text-slate-400">
              Stöder Fortnox, Visma, Business Central och fler.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
            {data.overviewTitle || "Trust Layer Översikt"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {data.overviewDescription || "CFO-dashboard för realtidsanalys av fakturaflöden och risker."}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => loadData(false)}>
            <ArrowPathIcon className="w-3.5 h-3.5 mr-1.5" /> Uppdatera
          </Button>
        </div>
      </div>

      {/* 1. AI HERO SUMMARY */}
      <section>
        <AIHeroSummary data={data.summary} />
      </section>

      {/* 2. KPI ROW */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.kpis && (
          <>
            <KpiCard
              title="Totala Fakturor (Månad)"
              value={data.kpis.totalInvoicesMonth}
              sub={`YTD: ${data.kpis.totalInvoicesYTD}`}
              icon={DocumentTextIcon} color="bg-blue-50 text-blue-700"
            />
            <KpiCard
              title="Kräver Åtgärd"
              value={data.kpis.requiresAttention}
              icon={ExclamationTriangleIcon} color={data.kpis.requiresAttention > 0 ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-500"}
            />
            <KpiCard
              title="AI Automatiskt Godkända"
              value={data.kpis.autoApproved}
              icon={BoltIcon} color="bg-emerald-50 text-emerald-700"
            />
            <KpiCard
              title="Riskfynd (30 dagar)"
              value={data.kpis.riskFindings}
              icon={ShieldCheckIcon} color={data.kpis.riskFindings > 0 ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}
            />
          </>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN (2/3) */}
        <div className="lg:col-span-2 space-y-6">

          {/* 3. RISK DISTRIBUTION */}
          <section className="h-[200px]">
            <RiskDistributionBar data={data.riskDistribution} total={data.kpis?.totalInvoicesYTD} />
          </section>

          {/* 4. TOP INVOICES */}
          <section>
            <TopInvoicesTable data={data.topInvoices} />
          </section>

          {/* 5. SUPPLIER RISK */}
          <section>
            <SupplierRiskTable data={data.suppliers} />
          </section>

          {/* 6. TREND CHARTS */}
          <section>
            <CompanyTrendCharts data={data.trends} />
          </section>

        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="space-y-6">

          {/* 7. RECOMMENDATIONS */}
          <section>
            <AIRecommendations data={data.recommendations} />
          </section>

          {/* 8. ACTIVITY FEED */}
          <section>
            <ActivityFeed data={data.events} />
          </section>

        </div>
      </div>

    </div>
  );
}

function KpiCard({ title, value, sub, icon: Icon, color }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
}
