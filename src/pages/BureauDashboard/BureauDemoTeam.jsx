
import React, { useState } from "react";
import {
    Users as UsersIcon,
    ShieldCheck as ShieldCheckIcon,
    Key as KeyIcon,
    Clock as ClockIcon,
    Plus as PlusIcon,
    Search as MagnifyingGlassIcon,
    MoreHorizontal,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BureauDemoTeam() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialTab = searchParams.get("tab") || "team";
    const [activeTab, setActiveTab] = useState(initialTab);

    // Update activeTab if URL changes (for walkthrough navigation)
    React.useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab) setActiveTab(tab);
    }, [location.search]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* 1. HEADER: Governance Framing */}
            <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-20 shadow-sm" data-demo-target="team-header">
                <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <ShieldCheckIcon className="w-7 h-7 text-indigo-600" />
                            Kontroll över ansvar, behörigheter och spårbarhet
                        </h1>
                        <p className="text-slate-500 mt-1 font-medium">
                            Säkerställ att rätt personer gör rätt saker – med full insyn i efterhand.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <Input
                                placeholder="Sök användare eller roll..."
                                className="pl-9 w-64 bg-slate-50 border-slate-200"
                            />
                            <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        </div>
                        {activeTab === "team" && (
                            <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2 shadow-sm">
                                <PlusIcon className="w-4 h-4" /> Bjud in
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-8 py-8">

                {/* 2. TABS: Responsibility Framing */}
                <Tabs defaultValue="team" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-transparent space-x-8 border-b border-transparent w-full justify-start p-0 h-auto mb-8">
                        <TabsTrigger value="team" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none px-2 pb-4 text-slate-500 font-medium bg-transparent text-base">
                            <UsersIcon className="w-4 h-4 mr-2" />
                            <span className="flex flex-col items-start text-sm">
                                <span className="font-semibold">Team</span>
                                <span className="text-[10px] font-normal opacity-80 uppercase tracking-wide">Vem gör vad</span>
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="roles" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none px-2 pb-4 text-slate-500 font-medium bg-transparent text-base">
                            <ShieldCheckIcon className="w-4 h-4 mr-2" />
                            <span className="flex flex-col items-start text-sm">
                                <span className="font-semibold">Roller & Behörigheter</span>
                                <span className="text-[10px] font-normal opacity-80 uppercase tracking-wide">Vem får göra vad</span>
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="access" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none px-2 pb-4 text-slate-500 font-medium bg-transparent text-base">
                            <KeyIcon className="w-4 h-4 mr-2" />
                            <span className="flex flex-col items-start text-sm">
                                <span className="font-semibold">Kundtillgångar</span>
                                <span className="text-[10px] font-normal opacity-80 uppercase tracking-wide">Vilka kunder påverkas</span>
                            </span>
                        </TabsTrigger>
                        <TabsTrigger value="audit" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=active]:shadow-none rounded-none px-2 pb-4 text-slate-500 font-medium bg-transparent text-base">
                            <ClockIcon className="w-4 h-4 mr-2" />
                            <span className="flex flex-col items-start text-sm">
                                <span className="font-semibold">Aktivitetslogg</span>
                                <span className="text-[10px] font-normal opacity-80 uppercase tracking-wide">Vad hände</span>
                            </span>
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB 1: TEAM - ACCOUNTABILITY VIEW */}
                    <TabsContent value="team" className="space-y-4" data-demo-target="team-table">
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                            <p className="text-sm text-slate-500 font-medium">Alla åtgärder i Valiflow utförs av identifierade användare med tilldelad roll.</p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                    <TableRow>
                                        <TableHead>Användare</TableHead>
                                        <TableHead>Roll</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Senast Aktiv</TableHead>
                                        <TableHead className="text-right">Åtgärd</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* Row 1 */}
                                    <TableRow className="hover:bg-slate-50 transition group cursor-pointer">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">A</div>
                                                <div>
                                                    <p className="font-medium text-slate-900">Anna Andersson</p>
                                                    <p className="text-xs text-slate-500">anna.andersson@byran.se</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                                                Byråägare
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                Aktiv
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">Idag, 09:12</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-600">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {/* Row 2 */}
                                    <TableRow className="hover:bg-slate-50 transition group cursor-pointer">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">E</div>
                                                <div>
                                                    <p className="font-medium text-slate-900">Erik Eriksson</p>
                                                    <p className="text-xs text-slate-500">erik.eriksson@byran.se</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                                                Redovisningskonsult
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                Aktiv
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">Igår, 14:30</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-600">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {/* Row 3 */}
                                    <TableRow className="hover:bg-slate-50 transition group cursor-pointer">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center font-bold text-sm">K</div>
                                                <div>
                                                    <p className="font-medium text-slate-900">Karin Karlsson</p>
                                                    <p className="text-xs text-slate-500">karin.karlsson@byran.se</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex px-2.5 py-1 rounded bg-slate-50 text-slate-400 text-xs font-medium border border-slate-100 border-dashed">
                                                Roll ej tilldelad ännu
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                                Inbjuden
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-sm italic">Väntar på accept</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-600">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* TAB 2: ROLES & PERMISSIONS - GOVERNANCE VIEW */}
                    <TabsContent value="roles" className="mt-6" data-demo-target="roles-view">
                        <div className="flex items-center gap-2 mb-6 px-1">
                            <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                            <p className="text-sm text-slate-500 font-medium">Roller definierar vilken typ av ansvar en användare kan ha i systemet.</p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Roles List */}
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 font-semibold text-slate-700">
                                    Standardroller
                                </div>
                                <div className="divide-y divide-slate-100">
                                    <div className="p-4 hover:bg-slate-50 transition cursor-pointer flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Byråägare (Admin)</h4>
                                            <p className="text-xs text-slate-500 mt-1">Fullständig åtkomst till alla klienter och inställningar.</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-xs opacity-0 group-hover:opacity-100 transition">Detaljer</Button>
                                    </div>
                                    <div className="p-4 hover:bg-slate-50 transition cursor-pointer flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Manager</h4>
                                            <p className="text-xs text-slate-500 mt-1">Kan bjuda in konsulter och hantera tilldelade klienter.</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-xs opacity-0 group-hover:opacity-100 transition">Detaljer</Button>
                                    </div>
                                    <div className="p-4 hover:bg-slate-50 transition cursor-pointer flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Redovisningskonsult</h4>
                                            <p className="text-xs text-slate-500 mt-1">Hanterar bokföring och kvalitetssäkring för sina kunder.</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-xs opacity-0 group-hover:opacity-100 transition">Detaljer</Button>
                                    </div>
                                </div>
                            </div>

                            {/* Permission Matrix */}
                            <div className="space-y-4">
                                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none"></div>
                                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                        <ShieldCheckIcon className="w-5 h-5 text-indigo-600" />
                                        Behörighetsmatris (Global)
                                    </h3>
                                    <p className="text-sm text-slate-500 mb-6">
                                        Alla behörigheter tillämpas konsekvent över hela byrån.
                                    </p>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <span className="font-medium text-slate-700">Attestera betalningar</span>
                                            <div className="flex gap-2">
                                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Ägare</span>
                                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Manager</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <span className="font-medium text-slate-700">Godkänna avvikelser</span>
                                            <div className="flex gap-2">
                                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Ägare</span>
                                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Konsult</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-100 opacity-60">
                                            <span className="font-medium text-slate-700">Systeminställningar</span>
                                            <div className="flex gap-2">
                                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Ägare</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 3: CLIENT ACCESS - RISK CONTAINMENT */}
                    <TabsContent value="access" className="space-y-4">
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                            <p className="text-sm text-slate-500 font-medium">Kundtillgångar styr vilka bolag en användare kan se och agera på.</p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                    <TableRow>
                                        <TableHead>Kundbolag</TableHead>
                                        <TableHead>Antal Användare</TableHead>
                                        <TableHead>Behöriga</TableHead>
                                        <TableHead className="text-right">Åtgärd</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium text-slate-900">Exempelkund AB</TableCell>
                                        <TableCell className="text-slate-600">2 st</TableCell>
                                        <TableCell>
                                            <div className="flex -space-x-2">
                                                <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-700" title="Anna Andersson">A</div>
                                                <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-700" title="Erik Eriksson">E</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" className="text-slate-600">Hantera</Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium text-slate-900">Bygg & Betong AB</TableCell>
                                        <TableCell className="text-slate-600">1 st</TableCell>
                                        <TableCell>
                                            <div className="flex -space-x-2">
                                                <div className="w-7 h-7 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-700" title="Anna Andersson">A</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm" className="text-slate-600">Hantera</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    {/* TAB 4: AUDIT LOG - SPINE */}
                    <TabsContent value="audit" className="space-y-4" data-demo-target="audit-log">
                        <div className="flex items-center gap-2 mb-4 px-1">
                            <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
                            <p className="text-sm text-slate-500 font-medium">Alla viktiga händelser loggas automatiskt och kan följas i efterhand.</p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                    <TableRow>
                                        <TableHead>Händelse</TableHead>
                                        <TableHead>Användare</TableHead>
                                        <TableHead>Enhet</TableHead>
                                        <TableHead>Resultat</TableHead>
                                        <TableHead className="text-right">Tid</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="hover:bg-slate-50 transition border-l-2 border-l-transparent hover:border-l-indigo-500">
                                        <TableCell className="font-medium text-slate-800">Godkände avvikelse</TableCell>
                                        <TableCell className="text-slate-600 text-sm">Anna Andersson</TableCell>
                                        <TableCell className="text-slate-500 text-sm">Faktura #1092</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">
                                                SUCCESS
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right text-slate-400 text-xs font-mono">15 Dec 11:42</TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-slate-50 transition border-l-2 border-l-transparent hover:border-l-indigo-500">
                                        <TableCell className="font-medium text-slate-800">Ändrade behörighet</TableCell>
                                        <TableCell className="text-slate-600 text-sm">Anna Andersson</TableCell>
                                        <TableCell className="text-slate-500 text-sm">Erik Eriksson</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700">
                                                SUCCESS
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right text-slate-400 text-xs font-mono">15 Dec 09:15</TableCell>
                                    </TableRow>
                                    <TableRow className="hover:bg-slate-50 transition border-l-2 border-l-transparent hover:border-l-red-500">
                                        <TableCell className="font-medium text-slate-800">Misslyckad inloggning</TableCell>
                                        <TableCell className="text-slate-600 text-sm">n/a</TableCell>
                                        <TableCell className="text-slate-500 text-sm">IP: 192.168.1.1</TableCell>
                                        <TableCell>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">
                                                FAILURE
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right text-slate-400 text-xs font-mono">14 Dec 22:01</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                </Tabs>
            </div>

            {/* 7. TRUST TRIGGER: Bottom of page */}
            <section className="max-w-6xl mx-auto mt-16 pb-12 text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium opacity-80">
                    Alla användaråtgärder och behörighetsändringar är spårbara och kan revideras i efterhand.
                </p>
            </section>

        </div>
    );
}
