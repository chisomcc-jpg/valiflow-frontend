import React, { useState, useEffect } from "react";
import {
    ShieldCheck,
    Search,
    RefreshCw,
    FileText,
    LayoutDashboard,
    AlertTriangle,
    Database,
    History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { complianceService } from "@/services/complianceService";
import { useBureauSSE } from "@/hooks/useBureauSSE";

// Sub-components (lazy or direct import)
import { ComplianceOverview } from "./components/ComplianceOverview";
import { ComplianceCustomerTable } from "./components/ComplianceCustomerTable";
import { ComplianceFieldMatrix } from "./components/ComplianceFieldMatrix";
import { ComplianceHistoryTable } from "./components/ComplianceHistoryTable";

export default function BureauCompliance() {
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // SSE Integration
    const { bureauEvents } = useBureauSSE(1); // TODO: dynamic agencyId

    useEffect(() => {
        if (bureauEvents) {
            // If any compliance related event comes in, refresh
            // You might filter specific event types if needed
            setRefreshTrigger(prev => prev + 1);
        }
    }, [bureauEvents]);



    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleExport = () => {
        // Mock export
        alert("Rapport genereras... (Mock)");
    };

    return (
        <div className="min-h-screen bg-[#F4F7FB]">
            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <ShieldCheck className="w-7 h-7 text-indigo-600" />
                            Compliance
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Snabb överblick över hur väl byråns kunder uppfyller viktiga datapunkter för revision och rapportering.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Input
                                placeholder="Sök kund eller fält..."
                                className="pl-9 w-64 bg-white"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        </div>
                        <Button variant="outline" size="icon" onClick={handleRefresh}>
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" onClick={handleExport}>
                            <FileText className="w-4 h-4" /> Exportera rapport
                        </Button>
                    </div>
                </div>

                {/* TABS */}
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-8">
                    <TabsList className="bg-transparent space-x-6 border-b border-transparent w-full justify-start p-0 h-auto">
                        <TabsTrigger value="overview" className="group flex flex-col items-start gap-1 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 pb-2 bg-transparent">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 group-data-[state=active]:text-indigo-700">
                                <LayoutDashboard className="w-4 h-4" /> Översikt
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="customers" className="group flex flex-col items-start gap-1 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 pb-2 bg-transparent">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 group-data-[state=active]:text-indigo-700">
                                <AlertTriangle className="w-4 h-4" /> Avvikelser per kund
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="metadata" className="group flex flex-col items-start gap-1 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 pb-2 bg-transparent">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 group-data-[state=active]:text-indigo-700">
                                <Database className="w-4 h-4" /> Metadata-validering
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="history" className="group flex flex-col items-start gap-1 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 pb-2 bg-transparent">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 group-data-[state=active]:text-indigo-700">
                                <History className="w-4 h-4" /> Historik
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {/* HELPER TEXTS */}
                    <div className="mt-2 text-xs text-slate-500 pl-2">
                        {activeTab === "overview" && "Samlad bild av hur väl dina kunder uppfyller metadata- och kvalitetskrav."}
                        {activeTab === "customers" && "Se vilka kunder som har flest avvikelser och behöver åtgärdas."}
                        {activeTab === "metadata" && "Kontrollera status för specifika datapunkter tvärs över hela portföljen."}
                        {activeTab === "history" && "Logg över utförda kontroller och korrigeringar i systemet."}
                    </div>
                </Tabs>
            </header>

            {/* CONTENT AREA */}
            <main className="p-8">
                <Tabs value={activeTab}>
                    <TabsContent value="overview">
                        <ComplianceOverview refreshTrigger={refreshTrigger} />
                    </TabsContent>
                    <TabsContent value="customers">
                        <ComplianceCustomerTable refreshTrigger={refreshTrigger} search={search} />
                    </TabsContent>
                    <TabsContent value="metadata">
                        <ComplianceFieldMatrix refreshTrigger={refreshTrigger} search={search} />
                    </TabsContent>
                    <TabsContent value="history">
                        <ComplianceHistoryTable refreshTrigger={refreshTrigger} search={search} />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
