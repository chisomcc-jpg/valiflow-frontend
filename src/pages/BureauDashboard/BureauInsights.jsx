// src/pages/BureauDashboard/BureauInsights.jsx
import React, { useEffect, useState } from "react";
import { ArrowPathIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { bureauInsightsService } from "@/services/bureauInsightsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// New Components
import AISummaryHero from "./components/insights/AISummaryHero";
import RiskHeatmap from "./components/insights/RiskHeatmap";
import RiskDistribution from "./components/insights/RiskDistribution";
import TopRiskCustomers from "./components/insights/TopRiskCustomers";
import CrossCustomerSuppliers from "./components/insights/CrossCustomerSuppliers";
import SupplierRiskTrend from "./components/insights/SupplierRiskTrend";
import SupplierActivity from "./components/insights/SupplierActivity";
import PortfolioRiskTrend from "./components/insights/PortfolioRiskTrend";
import AIRecommendations from "./components/insights/AIRecommendations";
import TrendSection from "@/components/bureau/insights/TrendSection"; // Reuse for metadata

export default function BureauInsights() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState({
    summary: null,
    riskHeatmap: [],
    riskDistribution: [],
    customerRisk: [], // for top list
    supplierCross: [],
    supplierTrend: [],
    supplierActivity: [],
    portfolioTrend: [],
    recommendations: [],
    metadataIssues: []
  });

  const fetchData = async () => {
    setRefreshing(true);
    try {
      // Parallel fetch for speed
      const [
        summary,
        riskHeatmap,
        riskDistribution,
        supplierCross,
        supplierActivity,
        trends,
        portfolioTrend,
        recommendations
      ] = await Promise.all([
        bureauInsightsService.getAiSummary(),
        bureauInsightsService.getCustomerRisk(),
        bureauInsightsService.getRiskDistribution(),
        bureauInsightsService.getSupplierCross(),
        bureauInsightsService.getSupplierActivity(),
        bureauInsightsService.getTrends(),
        bureauInsightsService.getPortfolioRiskTrend(),
        bureauInsightsService.getRecommendations()
      ]);

      setData({
        summary,
        riskHeatmap,
        riskDistribution,
        customerRisk: riskHeatmap, // Reuse heatmap data for top list logic
        supplierCross,
        supplierTrend: trends?.supplierRiskTrend || [], // Fallback if missing in trends response
        supplierActivity,
        portfolioTrend,
        recommendations,
        metadataIssues: trends?.metadataIssues || []
      });
    } catch (err) {
      console.error("Failed to load insights", err);
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SSE Integration
  // In a real scenario, useBureauSSE would likely be improved to handle event types specifically
  // For now, we listen to generic bureau events and refresh.
  // Assuming a hook like useBureauSSE exists or we simulate it.
  // const { lastMessage } = useBureauSSE(); 
  // useEffect(() => { if (lastMessage) fetchData(); }, [lastMessage]);

  useEffect(() => {
    // Simulation of SSE for demo since hooks might not be fully wired in this context
    const interval = setInterval(() => {
      // 5% chance to simulate a live update
      if (Math.random() > 0.95) {
        // Trigger refresh silently
        fetchData();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-slate-400 animate-pulse">Laddar insikter...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-12">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analys & Insikter</h1>
            <p className="text-slate-500 mt-1">
              AI-analys av hela din portfölj – risker, trender och rekommendationer på ett ställe.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Sök insikter..."
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
              />
            </div>
            <Button variant="outline" onClick={fetchData} disabled={refreshing}>
              <ArrowPathIcon className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Uppdatera
            </Button>
            <Button variant="outline" size="icon">
              <ArrowDownTrayIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-[1600px] mx-auto px-8 py-8 space-y-8">

        {/* 1. AI Summary Hero */}
        <section>
          <AISummaryHero data={data.summary} />
        </section>

        {/* 2. Risk Section */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4 px-1">Kundrisker</h2>
          <div className="grid lg:grid-cols-12 gap-6 h-auto lg:h-[350px]">
            <div className="lg:col-span-6 h-[350px] lg:h-auto">
              <RiskHeatmap data={data.riskHeatmap} />
            </div>
            <div className="lg:col-span-3 h-[350px] lg:h-auto">
              <RiskDistribution data={data.riskDistribution} />
            </div>
            <div className="lg:col-span-3 h-[350px] lg:h-auto">
              <TopRiskCustomers data={data.riskHeatmap} />
            </div>
          </div>
        </section>

        {/* 3. Supplier Intelligence */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4 px-1">Leverantörsintelligens</h2>
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 h-[400px]">
              <CrossCustomerSuppliers data={data.supplierCross} />
            </div>
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="h-[200px]">
                <SupplierRiskTrend data={data.supplierTrend} />
              </div>
              <div className="h-[176px]">
                <SupplierActivity data={data.supplierActivity} />
              </div>
            </div>
          </div>
        </section>

        {/* 4. Portfolio Trends */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4 px-1">Portföljtrender</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-[300px]">
              <PortfolioRiskTrend data={data.portfolioTrend} />
            </div>
            <div className="h-[300px] bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              {/* Reusing existing TrendSection logic just for Metadata/Volume part if needed, or keeping it custom here */}
              {/* For now simplified to metadata issues since we have new components for everything else */}
              <h3 className="font-semibold text-slate-800 mb-4">Metadata-kvalitet</h3>
              <TrendSection trends={{ metadataIssues: data.metadataIssues }} />
            </div>
          </div>
        </section>

        {/* 5. AI Recommendations */}
        <section>
          <AIRecommendations data={data.recommendations} />
        </section>

      </main>
    </div>
  );
}
