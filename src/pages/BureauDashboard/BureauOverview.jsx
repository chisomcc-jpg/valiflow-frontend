import React, { useEffect, useState, useCallback } from "react";
import { ArrowPathIcon, MagnifyingGlassIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/context/AuthContext";
import { bureauOverviewService } from "@/services/bureauOverviewService";
import { useBureauSSE } from "@/hooks/useBureauSSE";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import { PortfolioKpiRow } from "@/components/bureau/overview/PortfolioKpiRow";
import { TopCustomersTable } from "@/components/bureau/overview/TopCustomersTable";
import { TodaysFocusPanel } from "@/components/bureau/overview/TodaysFocusPanel";
import { TopSuppliersMini } from "@/components/bureau/overview/TopSuppliersMini";
import { PipelineActivityTimeline } from "@/components/bureau/overview/PipelineActivityTimeline";
import { MyWorkdaySnapshot } from "@/components/bureau/overview/MyWorkdaySnapshot"; // NEW LAYER
import { InviteCustomerModal } from "./components/InviteCustomerModal"; // NEW: Invite Logic
import { GlobalFeed } from "./components/GlobalFeed";

import { useNavigate } from "react-router-dom";
import { ROLES } from "@/constants/roles";

import { BureauDemoOverview } from "./BureauDemoOverview";

export default function BureauOverview({ demoMode = false, demoOverrideData }) {
    if (demoMode) {
        return <BureauDemoOverview />;
    }

    const { user } = useAuth();
    const navigate = useNavigate();
    const agencyId = user?.companyId;

    // Report Demo Mode
    useEffect(() => {
        if (demoMode) console.info("Valiflow Demo-läge aktivt (ingen backend).");
    }, [demoMode]);

    // 🔒 REDIRECT: Consultants & Juniors should not see Global Overview
    useEffect(() => {
        // DEMO OVERRIDE: Skip role check in demo mode
        if (demoMode) return;

        if (user?.role === ROLES.CONSULTANT || user?.role === ROLES.JUNIOR) {
            navigate("/bureau/customers", { replace: true });
        }
    }, [user, navigate, demoMode]);

    // Prevent flash of content (unless demo)
    if (!demoMode && (user?.role === ROLES.CONSULTANT || user?.role === ROLES.JUNIOR)) {
        return null;
    }

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Data State
    const [kpis, setKpis] = useState(null);
    const [priority, setPriority] = useState(null);
    const [health, setHealth] = useState(null);
    const [topCustomers, setTopCustomers] = useState([]);
    const [topSuppliers, setTopSuppliers] = useState([]);
    const [activity, setActivity] = useState([]);
    const [aiSummary, setAiSummary] = useState(null);

    const [feed, setFeed] = useState([]); // NEW: Global Feed
    const [inviteModalOpen, setInviteModalOpen] = useState(false); // NEW: Modal State

    // SSE Integration (Disabled in Demo Mode)
    const { lastEvent } = useBureauSSE(demoMode ? null : agencyId);

    // Fetch All Data
    const loadData = useCallback(async (isRefresh = false) => {
        // DEMO OVERRIDE
        if (demoMode) {
            if (demoOverrideData) {
                setKpis(demoOverrideData.kpis);
                setPriority(demoOverrideData.priority);
                setHealth(demoOverrideData.health);
                setActivity(demoOverrideData.activity || []);
                setAiSummary(demoOverrideData.aiSummary);
                setFeed(demoOverrideData.feed);
            }
            setLoading(false);
            return;
        }

        if (!agencyId) return;

        // 🛡️ GUARD: Only Owner/Manager allowed to fetch data
        const isAllowed = user?.role === ROLES.OWNER ||
            user?.role === ROLES.MANAGER ||
            user?.role === "AGENCY_ADMIN" ||
            user?.role === "SUPER_ADMIN";

        if (!isAllowed) {
            console.warn("BureauOverview: Role not authorized or mapped correctly", user?.role);
            setLoading(false);
            return;
        }

        if (isRefresh) setRefreshing(true);
        try {
            const [
                kpiData,
                prioData,
                healthData,
                custData,
                suppData,
                actData,
                aiData,
                feedData // NEW
            ] = await Promise.all([
                bureauOverviewService.getKPIs(),
                bureauOverviewService.getPriorityAlerts(),
                bureauOverviewService.getPortfolioHealth(),
                bureauOverviewService.getTopCustomers(),
                bureauOverviewService.getTopSuppliers(),
                bureauOverviewService.getActivity(),
                bureauOverviewService.getAiSummary(),
                bureauOverviewService.getGlobalFeed() // NEW
            ]);

            setKpis(kpiData);
            setPriority(prioData);
            setHealth(healthData);
            setTopCustomers(custData);
            setTopSuppliers(suppData);
            setActivity(actData);
            setAiSummary(aiData);
            setFeed(feedData || []); // NEW

        } catch (error) {
            console.error("Failed to load overview data", error);
            toast.error("Kunde inte hämta all data för översikten.");
        } finally {
            setLoading(false);
            if (isRefresh) setTimeout(() => setRefreshing(false), 500);
        }
    }, [agencyId, demoMode, demoOverrideData]);

    // Initial Load
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Handle SSE Updates
    useEffect(() => {
        if (demoMode) return; // Strict Safety

        if (lastEvent) {
            const relevantEvents = [
                "customer_risk_updated",
                "invoice_created",
                "invoice_import_completed",
                "supplier_risk_changed"
            ];

            if (relevantEvents.includes(lastEvent.type)) {
                console.log("⚡️ SSE Triggered Refresh:", lastEvent.type);
                loadData(false); // Silent refresh

                if (lastEvent.type === "customer_risk_updated") {
                    toast.info("En kunds risknivå har uppdaterats.");
                }
            }
        }
    }, [lastEvent, loadData, demoMode]);

    if (loading) {
        return <div className="p-12 text-center text-slate-400 animate-pulse">Laddar byråöversikt...</div>;
    }

    return (
        <div className="min-h-screen bg-[#F4F7FB] pb-12">

            {/* HEADER (Density: Decreased padding) */}
            <header className="bg-white border-b border-slate-200 px-8 py-3 sticky top-0 z-20 shadow-sm">
                <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Översikt</h1>
                            {demoMode && (
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200 uppercase tracking-wide">
                                    Demo-läge
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                            En samlad bild av dina kundbolag, risker och aktiviteter.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                            <Input
                                placeholder="Sök kund eller leverantör..."
                                className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm"
                            />
                        </div>
                        <Button variant="outline" size="sm" onClick={() => loadData(true)} disabled={refreshing} className="h-9">
                            <ArrowPathIcon className={`w-3.5 h-3.5 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                            Uppdatera
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-9 w-9">
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Exportera till PDF</DropdownMenuItem>
                                <DropdownMenuItem>Exportera till Excel</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-6 py-4 space-y-4">

                {/* 0. PERSONAL START LAYER (ANCHOR) */}
                <MyWorkdaySnapshot
                    user={user}
                    exceptionCount={priority?.exceptionCount || 0}
                    onAddCustomer={() => setInviteModalOpen(true)}
                />

                {/* 1. BACKGROUND INTELLIGENCE (Contextual Only) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 opacity-80 hover:opacity-100 transition-opacity duration-500 ease-in-out">

                    {/* Left: Feed & AI (De-emphasized) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2 mb-1 px-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></div>
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                Bakgrundsaktivitet (Byråflöde)
                            </h3>
                        </div>

                        {/* Feed Container - Reduced Visual Weight */}
                        <div className="grayscale-[0.3] hover:grayscale-0 transition-all duration-500">
                            <GlobalFeed feed={feed} onRefresh={() => loadData(false)} />
                        </div>

                        {aiSummary && (
                            <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 flex items-start gap-3">
                                <span className="text-lg opacity-60">✨</span>
                                <div>
                                    <p className="text-xs font-semibold text-slate-700 mb-0.5">Analys av bakgrundsdata</p>
                                    <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                                        {aiSummary.summary}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* KPIs moved here inside the flow to be distinct but secondary */}
                        <div className="pt-2 opacity-70 hover:opacity-100 transition-opacity">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                                Portföljstatus
                            </h3>
                            <PortfolioKpiRow data={kpis} />
                        </div>
                    </div>

                    {/* Right: Charts & Other Data (Tertiary) */}
                    <div className="space-y-6">



                        <TodaysFocusPanel priority={priority} feed={feed} />

                    </div>
                </div>

                {/* 2. TERTIARY ZONES (Tables etc) */}
                <section className="pt-4 border-t border-slate-200 mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-slate-400">
                        {/* Placeholder for future detailed tables if needed, keeping it clean for now */}
                        <p className="text-xs text-center italic w-full col-span-2">
                            Alla system är operativa.
                        </p>
                    </div>
                </section>

            </main>

            {/* MODALS */}
            <InviteCustomerModal
                isOpen={inviteModalOpen}
                onClose={() => setInviteModalOpen(false)}
                agencyId={agencyId}
                onInviteSent={() => {
                    toast.success("Inbjudan skickad!");
                    setInviteModalOpen(false);
                }}
            />
        </div >
    );
}
