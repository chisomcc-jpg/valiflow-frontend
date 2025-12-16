import React, { useState } from "react";
import {
    Truck,
    Search,
    Filter,
    Download,
    LayoutDashboard,
    List,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BureauSuppliersOverview } from "./components/BureauSuppliersOverview";
import { BureauSupplierTable } from "./components/BureauSupplierTable";
import { BureauSupplierRiskMap } from "./components/BureauSupplierRiskMap";

export default function BureauSuppliers() {
    const [activeTab, setActiveTab] = useState("overview");
    const [search, setSearch] = useState("");

    const handleExport = () => {
        alert("Export startad (Mock)");
    };

    return (
        <div className="min-h-screen bg-[#F4F7FB]">
            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Truck className="w-7 h-7 text-indigo-600" />
                            Leverantörer
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Här ser du alla leverantörer som förekommer hos dina kunder – samt risker, ändrade betaluppgifter och brister i information.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Input
                                placeholder="Sök leverantör..."
                                className="pl-9 w-64 bg-white"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="w-4 h-4" />
                        </Button>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" onClick={handleExport}>
                            <Download className="w-4 h-4" /> Exportera (CSV)
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
                        <TabsTrigger value="list" className="group flex flex-col items-start gap-1 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 pb-2 bg-transparent">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 group-data-[state=active]:text-indigo-700">
                                <List className="w-4 h-4" /> Leverantörslista
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="risk" className="group flex flex-col items-start gap-1 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 pb-2 bg-transparent">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 group-data-[state=active]:text-indigo-700">
                                <AlertTriangle className="w-4 h-4" /> Riskkartläggning
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {/* HELPER TEXTS */}
                    <div className="mt-2 text-xs text-slate-500 pl-2">
                        {activeTab === "overview" && "En snabb bild av leverantörslandskapet och var riskerna finns."}
                        {activeTab === "list" && "Lista på alla leverantörer hos dina kunder, med risknivå och avvikelser."}
                        {activeTab === "risk" && "Fokuserar på leverantörer med hög risk, kontoändringar och ovanliga mönster."}
                    </div>
                </Tabs>
            </header>

            {/* CONTENT AREA */}
            <main className="p-8">
                <Tabs value={activeTab}>
                    <TabsContent value="overview">
                        <BureauSuppliersOverview />
                    </TabsContent>
                    <TabsContent value="list">
                        <BureauSupplierTable search={search} />
                    </TabsContent>
                    <TabsContent value="risk">
                        <BureauSupplierRiskMap />
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
