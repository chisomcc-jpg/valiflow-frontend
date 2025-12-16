import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { toast } from "sonner";
import {
    BuildingOfficeIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    SwatchIcon,
    CpuChipIcon,
    BellIcon,
    PuzzlePieceIcon,
    ShieldCheckIcon,
    TrashIcon,
    EnvelopeIcon,
    CheckCircleIcon,
    ClockIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

// Services & Hooks
import { api } from "@/services/api"; // Updated to use centralized api instance
import useCompanySettingsSSE from "@/hooks/useCompanySettingsSSE";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

/* ==========================================================
   🏢 MAIN COMPONENT
   Enteprise-Grade Settings Module
========================================================== */
export default function CompanySettings() {
    const [activeTab, setActiveTab] = useState("profil");
    const [company, setCompany] = useState(null);
    const [team, setTeam] = useState([]);
    const [integrations, setIntegrations] = useState(null);
    const [loading, setLoading] = useState(true);

    // Invite Modal State
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("USER");

    const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

    // 1. Initial Data Fetch
    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        try {
            setLoading(true);
            // Using Promise.allSettled to ensure partial failures don't block everything
            const [compRes, teamRes] = await Promise.allSettled([
                api.get("/company/me"),
                api.get("/admin/users"), // Assuming this returns team members for current company context
            ]);

            if (compRes.status === "fulfilled") {
                const compData = compRes.value.data;
                setCompany(compData);
                // Fetch separate integrations if not in me response
                api.get(`/company/${compData.id}/integrations`).then(r => setIntegrations(r.data)).catch(() => { });
                // Fetch notifications specific - covered by settings/me but good to sync
            }
            if (teamRes.status === "fulfilled") setTeam(teamRes.value.data);

        } catch (err) {
            console.error("Load settings error", err);
            toast.error("Kunde inte ladda företagsinställningar");
        } finally {
            setLoading(false);
        }
    };

    // 2. Realtime Updates
    useCompanySettingsSSE(company?.id, (event) => {
        console.log("SSE Event:", event);
        if (event.type === 'company_settings_updated' || event.type === 'notifications_updated') {
            // Merge updates
            setCompany(prev => ({ ...prev, ...event.data }));
            toast.success("Inställningar uppdaterade", { duration: 1500, icon: "⚡" });
        } else if (event.type === 'team_updated') {
            // Reload team strictly to be safe, or optimistically update if payload rich
            api.get("/admin/users").then(r => setTeam(r.data));
            toast.info("Team uppdaterat");
        } else if (event.type === 'integration_status_changed') {
            api.get(`/company/${company?.id}/integrations`).then(r => setIntegrations(r.data));
        }
    });

    // 3. Handlers
    const handleUpdateSettings = async (updates) => {
        if (!company?.id) return;
        // Optimistic update
        setCompany(prev => ({ ...prev, ...updates }));

        try {
            await api.patch(`/company/${company.id}/settings`, updates);
            // toast.success("Sparat"); // Silent save is often better for toggles
        } catch (err) {
            console.error(err);
            toast.error("Kunde inte spara ändringar");
            // Revert? Complex without history.
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!company?.id) return;
        if (!confirm("Är du säker på att du vill ta bort denna användare?")) return;

        try {
            await api.delete(`/company/${company.id}/team/${userId}`);
            setTeam(prev => prev.filter(u => u.id !== userId));
            toast.success("Användare borttagen");
        } catch (err) {
            console.error(err);
        }
    };

    const handleInvite = async () => {
        try {
            await api.post(`/company/${company.id}/team/invite`, { email: inviteEmail, role: inviteRole });
            toast.success("Inbjudan skickad");
            setInviteOpen(false);
            setInviteEmail("");
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800" />
        </div>
    );

    const tabs = [
        { id: "profil", label: "Profil", icon: BuildingOfficeIcon },
        { id: "team", label: "Team & Åtkomst", icon: UserGroupIcon },
        { id: "ai", label: "AI & Säkerhet", icon: ShieldCheckIcon },
        { id: "notiser", label: "Notiser", icon: BellIcon },
        { id: "integrations", label: "Integrationer", icon: PuzzlePieceIcon },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-slate-900">Företagsinställningar</h1>
                        <p className="text-xs text-slate-500 hidden sm:block">Hantera {company?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 mr-2">
                            {company?.updatedAt && <span>Senast ändrad: {new Date(company.updatedAt).toLocaleDateString()}</span>}
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {company?.type || "Standard"}
                        </Badge>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* SIDEBAR TABS (Mobile: Horizontal Scroll, Desktop: Vertical) */}
                    <nav className="lg:col-span-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 flex lg:flex-col gap-1 min-w-0">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap lg:whitespace-normal
                                ${activeTab === tab.id
                                        ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}
                            `}
                            >
                                <tab.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === tab.id ? "text-indigo-600" : "text-slate-400"}`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    {/* CONTENT AREA */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* 1. PROFILE TAB */}
                                {activeTab === 'profil' && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Företagsprofil</CardTitle>
                                            <CardDescription>Grundläggande information om ditt företag.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Företagsnamn</label>
                                                    <Input
                                                        value={company?.name || ""}
                                                        onChange={e => setCompany({ ...company, name: e.target.value })}
                                                        onBlur={e => handleUpdateSettings({ name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Org.nummer</label>
                                                    <Input
                                                        value={company?.orgNumber || ""}
                                                        disabled
                                                        className="bg-slate-50"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Adress</label>
                                                    <Input
                                                        value={company?.address || ""}
                                                        onChange={e => setCompany({ ...company, address: e.target.value })}
                                                        onBlur={e => handleUpdateSettings({ address: e.target.value })}
                                                        placeholder="Gatuadress, Postnummer Ort"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium">Telefon</label>
                                                    <Input
                                                        value={company?.phone || ""}
                                                        onChange={e => setCompany({ ...company, phone: e.target.value })}
                                                        onBlur={e => handleUpdateSettings({ phone: e.target.value })}
                                                        placeholder="+46..."
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="justify-between border-t bg-slate-50/50 p-4">
                                            <span className="text-xs text-slate-500">Ändringar sparas automatiskt.</span>
                                            <Button onClick={() => handleUpdateSettings(company)}>Spara nu</Button>
                                        </CardFooter>
                                    </Card>
                                )}

                                {/* 2. TEAM TAB */}
                                {activeTab === 'team' && (
                                    <Card>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle>Team & Behörighet</CardTitle>
                                                <CardDescription>Hantera åtkomst och roller.</CardDescription>
                                            </div>
                                            <Button onClick={() => setInviteOpen(true)} size="sm" className="gap-2">
                                                <EnvelopeIcon className="w-4 h-4" /> Bjud in
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Användare</TableHead>
                                                            <TableHead>Roll</TableHead>
                                                            <TableHead>Status</TableHead>
                                                            <TableHead className="text-right">Åtgärd</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {team.map(user => (
                                                            <TableRow key={user.id}>
                                                                <TableCell>
                                                                    <div className="font-medium text-slate-900">{user.name || "Namnlös"}</div>
                                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="secondary" className="font-mono text-xs">
                                                                        {user.role}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-200">
                                                                        Aktiv
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-slate-400 hover:text-red-600"
                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                    >
                                                                        <TrashIcon className="w-4 h-4" />
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* 3. AI & TRUST TAB */}
                                {activeTab === 'ai' && (
                                    <div className="space-y-6">
                                        {/* 1. Automation Mode */}
                                        <Card>
                                            <CardHeader>
                                                <div className="flex items-center gap-2">
                                                    <CpuChipIcon className="w-6 h-6 text-indigo-600" />
                                                    <CardTitle>Automationsnivå (AI Behavior)</CardTitle>
                                                </div>
                                                <CardDescription>Bestäm hur aggressivt Valiflows AI ska vara med att godkänna fakturor.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {[
                                                        { id: 'conservative', label: 'Konservativ', desc: 'Auto-godkänner aldrig. Allt granskas av människa.', icon: ShieldCheckIcon },
                                                        { id: 'balanced', label: 'Balanserad', desc: 'Godkänner fakturor med hög tillit (över tröskelvärde).', icon: CheckCircleIcon },
                                                        { id: 'aggressive', label: 'Aggressiv', desc: 'Godkänner allt som inte flaggats med specifik risk.', icon: CpuChipIcon },
                                                    ].map((mode) => (
                                                        <div
                                                            key={mode.id}
                                                            onClick={() => handleUpdateSettings({ aiAutomationMode: mode.id })}
                                                            className={`
                                                                cursor-pointer border-2 rounded-xl p-5 flex flex-col gap-3 transition-all relative overflow-hidden
                                                                ${company?.aiAutomationMode === mode.id
                                                                    ? "border-indigo-600 bg-indigo-50/50"
                                                                    : "border-slate-100 bg-white hover:border-indigo-200 hover:shadow-md"}
                                                            `}
                                                        >
                                                            <div className={`p-2 w-fit rounded-lg ${company?.aiAutomationMode === mode.id ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}>
                                                                <mode.icon className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <h4 className={`font-semibold ${company?.aiAutomationMode === mode.id ? "text-indigo-900" : "text-slate-900"}`}>{mode.label}</h4>
                                                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{mode.desc}</p>
                                                            </div>
                                                            {company?.aiAutomationMode === mode.id && (
                                                                <div className="absolute top-4 right-4 text-indigo-600">
                                                                    <div className="w-3 h-3 bg-indigo-600 rounded-full ring-4 ring-indigo-100"></div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 2. Sensitivity */}
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Känslighetsnivå (AI Sensitivity)</CardTitle>
                                                <CardDescription>Finjustera hur lätt AI:n ska reagera på avvikelser.</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {[
                                                        { id: 'low', label: 'Low Sensitivity', desc: 'Minimerar "falska positiva". Släpper igenom mindre avvikelser.' },
                                                        { id: 'standard', label: 'Standard', desc: 'Rekommenderad balans mellan säkerhet och effektivitet.' },
                                                        { id: 'high', label: 'High Sensitivity', desc: 'Maximal strikthet. Fångar minsta lilla avvikelse.' },
                                                    ].map((level) => (
                                                        <button
                                                            key={level.id}
                                                            onClick={() => handleUpdateSettings({ aiSensitivity: level.id })}
                                                            className={`
                                                                text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors flex items-center justify-between
                                                                ${company?.aiSensitivity === level.id
                                                                    ? "bg-slate-900 text-white border-slate-900"
                                                                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"}
                                                            `}
                                                        >
                                                            <span>{level.label}</span>
                                                            {company?.aiSensitivity === level.id && <CheckCircleIcon className="w-4 h-4 text-emerald-400" />}
                                                        </button>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-slate-500 mt-3 ml-1">
                                                    * High Sensitivity rekommenderas för nya leverantörer under "Learning Period".
                                                </p>
                                            </CardContent>
                                        </Card>

                                        {/* 3. Threshold Slider */}
                                        <Card>
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle>Auto-godkännande (Trust Score)</CardTitle>
                                                        <CardDescription>Fakturor över detta värde hanteras automatiskt.</CardDescription>
                                                    </div>
                                                    <Badge variant="outline" className="text-lg px-3 py-1 font-mono font-bold border-indigo-200 bg-indigo-50 text-indigo-700">
                                                        {Math.round((company?.autoApprovalThreshold || 0.8) * 100)}%
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="px-2">
                                                    <Slider
                                                        defaultValue={[company?.autoApprovalThreshold || 0.8]}
                                                        value={[company?.autoApprovalThreshold || 0.8]}
                                                        min={0.8}
                                                        max={1.0}
                                                        step={0.01}
                                                        onValueChange={v => setCompany(prev => ({ ...prev, autoApprovalThreshold: v[0] }))}
                                                        onValueCommit={v => handleUpdateSettings({ autoApprovalThreshold: v[0] })}
                                                        className="py-4"
                                                    />
                                                    <div className="flex justify-between text-xs text-slate-400 font-mono mt-2">
                                                        <span>80% (Standard)</span>
                                                        <span>100% (Endast Perfekta)</span>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 border rounded-lg p-4 flex gap-3 items-start">
                                                    <ExclamationTriangleIcon className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-slate-900">Prognos</p>
                                                        <p className="text-xs text-slate-600 leading-relaxed">
                                                            Vid <strong>{Math.round((company?.autoApprovalThreshold || 0.8) * 100)}%</strong> threshold hade
                                                            <span className="text-emerald-600 font-bold"> 142 </span> av dina senaste 200 fakturor auto-godkänts.
                                                            (Simulerad data baserad på historik).
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                                    <div className="space-y-0.5 max-w-lg">
                                                        <label className="text-sm font-medium">Auto-förklaringar (AI Summary)</label>
                                                        <p className="text-xs text-slate-500">Generera en kortfattad motivering för varje beslut.</p>
                                                    </div>
                                                    <Switch
                                                        checked={company?.aiSummaryEnabled ?? true}
                                                        onCheckedChange={c => handleUpdateSettings({ aiSummaryEnabled: c })}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* 4. NOTIFICATIONS TAB */}
                                {activeTab === 'notiser' && (
                                    <div className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Notisinställningar</CardTitle>
                                                <CardDescription>Bestäm hur och när du vill bli meddelad.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Primär Kanal</label>
                                                        <Select
                                                            value={company?.preferredNotificationChannel || "email"}
                                                            onValueChange={v => handleUpdateSettings({ preferredNotificationChannel: v })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Välj kanal" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="email">E-post</SelectItem>
                                                                <SelectItem value="slack">Slack (Webhook)</SelectItem>
                                                                <SelectItem value="teams">Microsoft Teams</SelectItem>
                                                                <SelectItem value="app">Mobilapp (Push)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Eskaleringsnivå</label>
                                                        <Select
                                                            value={company?.escalationLevel || "medium"}
                                                            onValueChange={v => handleUpdateSettings({ escalationLevel: v })}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Välj nivå" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="none">Diskret (Endast logg)</SelectItem>
                                                                <SelectItem value="medium">Standard</SelectItem>
                                                                <SelectItem value="strict">Aggressiv (Manager sign-off)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="mt-6 border-t pt-6">
                                                    <label className="text-sm font-medium mb-4 block">Händelser att bevaka</label>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {[
                                                            { key: 'notifyRiskAlert', label: 'Vid upptäckt risk (Flagged)' },
                                                            { key: 'notifyNewInvoice', label: 'Vid varje ny faktura' },
                                                            { key: 'notifyPaymentDeviation', label: 'Vid betalningsavvikelse' },
                                                            { key: 'notifyNewSupplier', label: 'Vid ny leverantör' },
                                                            { key: 'notifyLowConfidence', label: 'Vid låg AI-träffsäkerhet' },
                                                            { key: 'notifyDetailsChanged', label: 'Vid ändrade bankuppgifter' },
                                                        ].map(item => (
                                                            <div key={item.key} className="flex items-center space-x-2 p-3 rounded-lg border bg-slate-50/50">
                                                                <Switch
                                                                    id={item.key}
                                                                    checked={company?.[item.key] ?? false}
                                                                    onCheckedChange={(c) => handleUpdateSettings({ [item.key]: c })}
                                                                />
                                                                <label htmlFor={item.key} className="text-sm cursor-pointer select-none">
                                                                    {item.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="mt-6 border-t pt-6">
                                                    <label className="text-sm font-medium mb-4 block flex items-center gap-2">
                                                        <ClockIcon className="w-5 h-5 text-slate-500" /> Tysta Timmar (Quiet Hours)
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-xs text-slate-500">Starttid</label>
                                                            <Input
                                                                type="time"
                                                                value={company?.quietHoursStart || ""}
                                                                onChange={e => handleUpdateSettings({ quietHoursStart: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs text-slate-500">Sluttid</label>
                                                            <Input
                                                                type="time"
                                                                value={company?.quietHoursEnd || ""}
                                                                onChange={e => handleUpdateSettings({ quietHoursEnd: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* 5. INTEGRATIONS TAB */}
                                {activeTab === 'integrations' && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Ekonomisystem</CardTitle>
                                            <CardDescription>Hantera kopplingen till ERP.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-end mb-2">
                                                <Button variant="ghost" size="sm" onClick={async () => {
                                                    try {
                                                        await api.post(`/company/${company.id}/integrations/refresh`);
                                                        toast.success("Status uppdaterad");
                                                    } catch (err) { console.error(err); toast.error("Kunde inte uppdatera"); }
                                                }}>
                                                    Uppdatera status
                                                </Button>
                                            </div>

                                            {/* FORTNOX */}
                                            <div className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-xl shadow-sm border font-bold text-[#C6363C]">F</div>
                                                    <div>
                                                        <p className="font-medium text-sm">Fortnox</p>
                                                        <p className="text-xs text-slate-500">Marknadsledande bokföring.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                                    {integrations?.fortnoxConnected ? (
                                                        <>
                                                            <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                                                <CheckCircleIcon className="w-3 h-3 mr-1" /> Aktiv
                                                            </Badge>
                                                            <Button variant="ghost" size="sm" className="text-red-600 h-8 text-xs hover:bg-red-50">Koppla från</Button>
                                                        </>
                                                    ) : (
                                                        <Button size="sm">Anslut</Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* VISMA */}
                                            <div className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-xl shadow-sm border font-bold text-[#003865]">V</div>
                                                    <div>
                                                        <p className="font-medium text-sm">Visma eEkonomi</p>
                                                        <p className="text-xs text-slate-500">Smart bokföring för småföretag.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                                    {integrations?.vismaConnected ? (
                                                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                                            <CheckCircleIcon className="w-3 h-3 mr-1" /> Aktiv
                                                        </Badge>
                                                    ) : (
                                                        <Button size="sm" variant="outline">Anslut</Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* BC */}
                                            <div className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-xl shadow-sm border font-bold text-[#0078D4]">BC</div>
                                                    <div>
                                                        <p className="font-medium text-sm">Business Central</p>
                                                        <p className="text-xs text-slate-500">Microsoft Dynamics 365.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                                    {integrations?.microsoftConnected ? (
                                                        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                                            <CheckCircleIcon className="w-3 h-3 mr-1" /> Aktiv
                                                        </Badge>
                                                    ) : (
                                                        <Button size="sm" variant="outline">Anslut</Button>
                                                    )}
                                                </div>
                                            </div>

                                        </CardContent>
                                    </Card>
                                )}

                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* INVITE DIALOG */}
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Bjud in användare</DialogTitle>
                        <DialogDescription>
                            Skicka en inbjudan via e-post. Länken är giltig i 24 timmar.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">E-post</label>
                            <Input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="namn@exempel.se" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Roll</label>
                            <Select value={inviteRole} onValueChange={setInviteRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Välj roll" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="USER">Användare</SelectItem>
                                    <SelectItem value="COMPANY_ADMIN">Administratör</SelectItem>
                                    <SelectItem value="SUPER_ADMIN">Systemägare</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setInviteOpen(false)}>Avbryt</Button>
                        <Button onClick={handleInvite}>Skicka inbjudan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
