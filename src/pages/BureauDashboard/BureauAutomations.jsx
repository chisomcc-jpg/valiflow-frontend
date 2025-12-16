import React, { useEffect, useState } from "react";
import {
    BoltIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    ArrowPathIcon,
    ClockIcon,
    ListBulletIcon,
    CubeIcon
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

import { automationService } from "@/services/automationService";
import { RuleEditorSheet } from "./components/RuleEditorSheet";
import { RuleGroupEditorSheet } from "./components/RuleGroupEditorSheet";
import { AutomationHistoryTable } from "./components/AutomationHistoryTable";
import { useBureauSSE } from "@/hooks/useBureauSSE";

export default function BureauAutomations() {
    const [activeTab, setActiveTab] = useState("rules");
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    // Data
    const [rules, setRules] = useState([]);
    const [groups, setGroups] = useState([]);
    const [history, setHistory] = useState([]);

    // Sheets
    const [showRuleSheet, setShowRuleSheet] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);

    const [showGroupSheet, setShowGroupSheet] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    // SSE
    const { bureauEvents } = useBureauSSE(1); // TODO: get real agencyId

    useEffect(() => {
        if (bureauEvents) {
            // Refresh data on updates
            // Optimized: only refresh relevant tab
            loadAll();
        }
    }, [bureauEvents]);

    useEffect(() => {
        loadAll();
    }, []);

    async function loadAll() {
        setLoading(true);
        await Promise.all([
            loadRules(),
            loadGroups(),
            loadHistory()
        ]);
        setLoading(false);
    }

    async function loadRules() {
        const data = await automationService.getRules().catch(() => []);
        setRules(data);
    }
    async function loadGroups() {
        const data = await automationService.getRuleGroups().catch(() => []);
        setGroups(data);
    }
    async function loadHistory() {
        const data = await automationService.getHistory().catch(() => []);
        setHistory(data);
    }

    // Helpers
    const filteredRules = rules.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

    // Handlers
    const handleEditRule = (rule) => {
        setSelectedRule(rule);
        setShowRuleSheet(true);
    };
    const handleEditGroup = (group) => {
        setSelectedGroup(group);
        setShowGroupSheet(true);
    };

    return (
        <div className="min-h-screen bg-[#F4F7FB]">
            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <BoltIcon className="w-7 h-7 text-indigo-600" />
                            Automationscenter
                        </h1>
                        <p className="text-slate-500 mt-1">Här kan du skapa enkla regler som hjälper byrån att fånga fel och risker automatiskt.</p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Input
                                placeholder="Sök regler..."
                                className="pl-9 w-64 bg-white"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        </div>
                        <Button variant="outline" size="icon" onClick={loadAll}>
                            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>

                        {activeTab === "rules" && (
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" onClick={() => { setSelectedRule(null); setShowRuleSheet(true); }}>
                                <PlusIcon className="w-4 h-4" /> Ny regel
                            </Button>
                        )}
                        {activeTab === "groups" && (
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" onClick={() => { setSelectedGroup(null); setShowGroupSheet(true); }}>
                                <PlusIcon className="w-4 h-4" /> Ny regelgrupp
                            </Button>
                        )}
                    </div>
                </div>

                {/* TABS */}
                <Tabs defaultValue="rules" value={activeTab} onValueChange={setActiveTab} className="mt-8">
                    <TabsList className="bg-transparent space-x-6 border-b border-transparent w-full justify-start p-0 h-auto">
                        <TabsTrigger value="rules" className="group flex flex-col items-start gap-1 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 pb-2 bg-transparent">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 group-data-[state=active]:text-indigo-700">
                                <ListBulletIcon className="w-4 h-4" /> Regler
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="groups" className="group flex flex-col items-start gap-1 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 pb-2 bg-transparent">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 group-data-[state=active]:text-indigo-700">
                                <CubeIcon className="w-4 h-4" /> Regelgrupper
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="history" className="group flex flex-col items-start gap-1 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-2 pb-2 bg-transparent">
                            <span className="flex items-center gap-2 text-sm font-medium text-slate-700 group-data-[state=active]:text-indigo-700">
                                <ClockIcon className="w-4 h-4" /> Historik
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {/* SUB-HEADER TEXTS */}
                    <div className="mt-2 text-xs text-slate-500 pl-2">
                        {activeTab === "rules" && "Enskilda automatiska kontroller som körs på fakturor, leverantörer och risker."}
                        {activeTab === "groups" && "Samla flera regler i paket som kan aktiveras för en eller flera kunder samtidigt."}
                        {activeTab === "history" && "En logg över alla automatiska åtgärder som har körts."}
                    </div>

                    {/* TAB CONTENT: RULES */}
                    <TabsContent value="rules" className="mt-6">
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                    <TableRow>
                                        <TableHead>Regel</TableHead>
                                        <TableHead>Trigger</TableHead>
                                        <TableHead>Åtgärd</TableHead>
                                        <TableHead>Gäller för</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Åtgärd</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRules.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center p-6 text-slate-500">
                                                    <BoltIcon className="w-12 h-12 text-slate-200 mb-4" />
                                                    <h3 className="text-lg font-medium text-slate-800">Inga regler än</h3>
                                                    <p className="max-w-sm mb-6">Skapa din första automationsregel för att spara tid och minska risker.</p>
                                                    <Button onClick={() => setShowRuleSheet(true)} className="bg-indigo-600 hover:bg-indigo-700">
                                                        <PlusIcon className="w-4 h-4 mr-2" /> Skapa regel
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredRules.map(rule => (
                                        <TableRow key={rule.id} className="hover:bg-slate-50">
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-slate-900">{rule.name}</p>
                                                    <p className="text-xs text-slate-500">{rule.description || "Ingen beskrivning"}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-normal bg-slate-50">
                                                    {rule.trigger}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">
                                                {rule.action?.type || "Ingen åtgärd"}
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-600">
                                                {rule.scope?.type === "all" ? "Alla kunder" : `${(rule.scope?.customerIds || []).length} kunder`}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Switch checked={rule.status === "active"} disabled />
                                                    <span className={`text-xs font-medium ${rule.status === "active" ? "text-green-700" : "text-slate-500"}`}>
                                                        {rule.status === "active" ? "Aktiv" : "Avstängd"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditRule(rule)}>Redigera</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600" onClick={() => {
                                                            if (confirm("Ta bort regel?")) automationService.deleteRule(rule.id).then(loadRules);
                                                        }}>Ta bort</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* TAB CONTENT: GROUPS */}
                    <TabsContent value="groups" className="mt-6">
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                    <TableRow>
                                        <TableHead>Grupp</TableHead>
                                        <TableHead>Regler</TableHead>
                                        <TableHead>Används av</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Åtgärd</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredGroups.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center p-6 text-slate-500">
                                                    <CubeIcon className="w-12 h-12 text-slate-200 mb-4" />
                                                    <h3 className="text-lg font-medium text-slate-800">Inga regelgrupper</h3>
                                                    <p className="max-w-sm mb-6">Samla regler i grupper för att enkelt applicera dem på flera kunder.</p>
                                                    <Button onClick={() => setShowGroupSheet(true)} variant="outline">
                                                        <PlusIcon className="w-4 h-4 mr-2" /> Skapa grupp
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredGroups.map(group => (
                                        <TableRow key={group.id} className="hover:bg-slate-50">
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-slate-900">{group.name}</p>
                                                    <p className="text-xs text-slate-500">{group.description}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>{(group.ruleIds || []).length} st</TableCell>
                                            <TableCell>
                                                {group.scope?.type === "all" ? "Alla kunder" : "Specifika kunder"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={group.status === "active" ? "default" : "secondary"}>
                                                    {group.status === "active" ? "Aktiv" : "Inaktiv"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm" onClick={() => handleEditGroup(group)}>Redigera</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* TAB CONTENT: HISTORY */}
                    <TabsContent value="history" className="mt-6">
                        <AutomationHistoryTable history={history} />
                    </TabsContent>

                </Tabs>
            </header>

            {/* SHEETS */}
            <RuleEditorSheet
                open={showRuleSheet}
                onOpenChange={(o) => { if (!o) setShowRuleSheet(false); }}
                rule={selectedRule}
                onSuccess={() => { setShowRuleSheet(false); loadRules(); }}
            />
            <RuleGroupEditorSheet
                open={showGroupSheet}
                onOpenChange={(o) => { if (!o) setShowGroupSheet(false); }}
                group={selectedGroup}
                rules={rules} // Pass available rules
                onSuccess={() => { setShowGroupSheet(false); loadGroups(); }}
            />
        </div>
    );
}
