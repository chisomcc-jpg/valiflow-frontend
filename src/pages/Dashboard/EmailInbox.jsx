import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "@/services/api";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import {
    InboxArrowDownIcon,
    EnvelopeIcon,
    ArrowPathIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ClipboardDocumentIcon,
    ServerStackIcon,
    ShieldCheckIcon,
    TrashIcon,
    ArchiveBoxIcon,
    EnvelopeOpenIcon
} from "@heroicons/react/24/outline";

export default function EmailInbox() {
    const [loading, setLoading] = useState(true);
    const [inboxSettings, setInboxSettings] = useState(null);
    const [logs, setLogs] = useState([]);

    // IMAP Form State
    const [imapConfig, setImapConfig] = useState({
        server: "",
        port: 993,
        user: "",
        password: "",
        ssl: true
    });
    const [testingConnection, setTestingConnection] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Get settings (company id from context or simply 'me' if API supports it, 
            // but here we likely need company ID. Assuming path params or context. 
            // For now, let's assume we can get it from /company/me or similar, 
            // but let's stick to the pattern used in CompanySettings. 
            // We will assume the API needs ID. 
            // Since wrapping components usually provide context, 
            // we'll fetch /company/me first to get ID.
            const meRes = await api.get("/company/me");
            const companyId = meRes.data.id;

            const [settingsRes, logsRes] = await Promise.all([
                api.get(`/company/${companyId}/email-inbox`),
                api.get(`/company/${companyId}/email-inbox/log`)
            ]);

            setInboxSettings({ ...settingsRes.data, id: companyId }); // Store ID for updates
            setLogs(logsRes.data);
        } catch (err) {
            console.error(err);
            toast.error("Kunde inte ladda e-postinställningar");
        } finally {
            setLoading(false);
        }
    };

    const handleCopyAddress = () => {
        if (inboxSettings?.emailInboxAddress) {
            navigator.clipboard.writeText(inboxSettings.emailInboxAddress);
            toast.success("Adress kopierad till urklipp");
        }
    };

    const handleResetAddress = async () => {
        if (!confirm("Detta kommer att inaktivera den gamla adressen. Är du säker?")) return;
        try {
            const res = await api.post(`/company/${inboxSettings.id}/email-inbox/reset`);
            setInboxSettings(prev => ({ ...prev, emailInboxAddress: res.data.emailInboxAddress }));
            toast.success("Ny adress genererad");
        } catch (err) {
            console.error(err);
            toast.error("Misslyckades med att återställa adress");
        }
    };

    const handleImapTest = async () => {
        setTestingConnection(true);
        try {
            await api.post(`/company/${inboxSettings.id}/email-integration/imap/test`, imapConfig);
            toast.success("Anslutning lyckades!");
        } catch (err) {
            console.error(err);
            toast.error("Kunde inte ansluta till servern");
        } finally {
            setTestingConnection(false);
        }
    };

    const handleSaveImap = async () => {
        try {
            await api.post(`/company/${inboxSettings.id}/email-integration/imap`, imapConfig);
            toast.success("IMAP-konfiguration sparad");
            // Refresh settings to show active state
            const res = await api.get(`/company/${inboxSettings.id}/email-inbox`);
            setInboxSettings(prev => ({ ...prev, ...res.data }));
        } catch (err) {
            console.error(err);
            toast.error("Kunde inte spara konfiguration");
        }
    };

    const getMicrosoftAuthUrl = async () => {
        try {
            const res = await api.get(`/company/${inboxSettings.id}/email-integration/microsoft/auth-url`);
            // Redirect to stub URL
            const width = 600;
            const height = 600;
            const left = window.screen.width / 2 - width / 2;
            const top = window.screen.height / 2 - height / 2;

            // Open popup
            const popup = window.open(res.data.url, "Microsoft Auth", `width=${width},height=${height},top=${top},left=${left}`);

            // Poll for closure (Since it's a stub, we might need a way to trigger callback manually in dev)
            // In real app, the popup would redirect to our callback which closes it and sends message.
            // For now, let's just simulate success after a "popup" delay
            setTimeout(async () => {
                // Simulate callback hit
                await api.post(`/company/${inboxSettings.id}/email-integration/microsoft/callback`);
                toast.success("Microsoft Outlook ansluten!");
                popup.close();
                fetchData();
            }, 2000);

        } catch (err) {
            console.error(err);
            toast.error("Kunde inte starta autentisering");
        }
    };

    if (loading) {
        return (
            <div className="p-8 space-y-6">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                    <InboxArrowDownIcon className="w-8 h-8 text-indigo-600" />
                    Företagets Fakturainkorg (E-post)
                </h1>
                <p className="text-slate-500 mt-2 max-w-2xl">
                    Styr hur Valiflow tar emot leverantörsfakturor via e-post. Koppla din egen brevlåda eller använd din unika Valiflow-adress.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN - CONFIG */}
                <div className="lg:col-span-2 space-y-8">

                    {/* SECTION A: VALIFLOW MAILBOX */}
                    <Card className="border-indigo-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Valiflow Inkorg</CardTitle>
                                    <CardDescription>Din dedikerade e-postadress för fakturamottagning.</CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                    {inboxSettings?.emailInboxStatus === 'active' ? 'Aktiv' : 'Inaktiv'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-4">
                                <code className="text-sm font-mono text-slate-700 break-all">
                                    {inboxSettings?.emailInboxAddress || "Laddar..."}
                                </code>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Button variant="outline" size="sm" onClick={handleCopyAddress} className="gap-2">
                                        <ClipboardDocumentIcon className="w-4 h-4" /> Kopiera
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={handleResetAddress} title="Generera ny adress">
                                        <ArrowPathIcon className="w-4 h-4 text-slate-400" />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 flex items-start gap-2">
                                <ExclamationCircleIcon className="w-4 h-4 text-slate-400 mt-0.5" />
                                Alla fakturor (PDF, PNG, XML) som skickas till denna adress tolkas automatiskt av vår AI.
                            </p>
                        </CardContent>
                    </Card>

                    {/* SECTION B: EXTENSION MAILBOXES */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Externa Konton</CardTitle>
                            <CardDescription>Koppla företagets befintliga fakturabrevlåda.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="microsoft" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 mb-6">
                                    <TabsTrigger value="microsoft">Microsoft 365</TabsTrigger>
                                    <TabsTrigger value="gmail">Google Gmail</TabsTrigger>
                                    <TabsTrigger value="imap">IMAP (Manuell)</TabsTrigger>
                                </TabsList>

                                {/* MICROSOFT */}
                                <TabsContent value="microsoft" className="space-y-4">
                                    <div className="bg-slate-50 p-6 rounded-lg border text-center space-y-4">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                                            <svg className="w-6 h-6" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg"><path d="M11.4 0H1v11.4h10.4V0zM22 0H11.6v11.4H22V0zM11.4 11.6H1V23h10.4V11.6zM22 11.6H11.6V23H22V11.6z" fill="#f25022" /><path d="M11.4 0H1v11.4h10.4V0z" fill="#f25022" /><path d="M22 0H11.6v11.4H22V0z" fill="#7fba00" /><path d="M11.4 11.6H1V23h10.4V11.6z" fill="#00a4ef" /><path d="M22 11.6H11.6V23H22V11.6z" fill="#ffb900" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-slate-900">Microsoft Outlook / 365</h3>
                                            <p className="text-sm text-slate-500 mt-1">Säker koppling via Microsoft Graph API.</p>
                                        </div>
                                        <Button onClick={getMicrosoftAuthUrl} className="w-full sm:w-auto bg-[#2F2F2F] hover:bg-black text-white">
                                            Koppla med Microsoft
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* GMAIL */}
                                <TabsContent value="gmail" className="space-y-4">
                                    <div className="bg-slate-50 p-6 rounded-lg border text-center space-y-4">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-red-500 font-bold text-xl">
                                            G
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-slate-900">Google Gmail</h3>
                                            <p className="text-sm text-slate-500 mt-1">Säker koppling via Google Workspace.</p>
                                        </div>
                                        <Button variant="outline" className="w-full sm:w-auto" disabled>
                                            Kommer snart
                                        </Button>
                                    </div>
                                </TabsContent>

                                {/* IMAP */}
                                <TabsContent value="imap" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">IMAP Server</label>
                                            <Input
                                                placeholder="imap.example.com"
                                                value={imapConfig.server}
                                                onChange={e => setImapConfig({ ...imapConfig, server: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Port</label>
                                            <Input
                                                placeholder="993"
                                                value={imapConfig.port}
                                                onChange={e => setImapConfig({ ...imapConfig, port: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Användarnamn</label>
                                            <Input
                                                placeholder="user@example.com"
                                                value={imapConfig.user}
                                                onChange={e => setImapConfig({ ...imapConfig, user: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Lösenord</label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={imapConfig.password}
                                                onChange={e => setImapConfig({ ...imapConfig, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={imapConfig.ssl}
                                                onCheckedChange={c => setImapConfig({ ...imapConfig, ssl: c })}
                                            />
                                            <span className="text-sm">Använd SSL/TLS</span>
                                        </div>
                                        <div className="space-x-2">
                                            <Button variant="ghost" onClick={handleImapTest} disabled={testingConnection}>
                                                {testingConnection ? "Testar..." : "Testa anslutning"}
                                            </Button>
                                            <Button onClick={handleSaveImap}>Spara</Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* SECTION C: INBOX LOG */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Inkommande Logg</CardTitle>
                            <CardDescription>De 20 senaste händelserna.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tid</TableHead>
                                            <TableHead>Avsändare</TableHead>
                                            <TableHead>Ämne / Fil</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                                                    Inga mail mottagna ännu.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            logs.map(log => (
                                                <TableRow key={log.id}>
                                                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                                                        {new Date(log.receivedAt).toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="font-medium text-sm">
                                                        {log.sender}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm">{log.subject}</div>
                                                        {log.attachmentName && (
                                                            <div className="text-xs text-slate-400 flex items-center gap-1">
                                                                <ClipboardDocumentIcon className="w-3 h-3" /> {log.attachmentName}
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {log.status === 'imported' && (
                                                            <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">Importerad</Badge>
                                                        )}
                                                        {log.status === 'blocked' && (
                                                            <Badge variant="outline" className="text-red-700 bg-red-50 border-red-200">Blockerad</Badge>
                                                        )}
                                                        {log.status === 'error' && (
                                                            <Badge variant="outline" className="text-amber-700 bg-amber-50 border-amber-200">Fel</Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* RIGHT COLUMN - ADVANCED SETTINGS */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Filter & Regler</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tillåtna format</label>
                                <div className="flex flex-wrap gap-2">
                                    {['PDF', 'XML', 'TIFF', 'PNG', 'JPG'].map(fmt => (
                                        <Badge key={fmt} variant="secondary" className="cursor-pointer hover:bg-slate-200">
                                            {fmt}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-slate-700">Importera endast bilagor</label>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="text-sm text-slate-700">Kräv "Faktura" i ämnesrad</label>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Avancerat</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <ArchiveBoxIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div className="space-y-1">
                                    <label className="text-sm font-medium block">Arkivera efter import</label>
                                    <p className="text-xs text-slate-500">Flytta mailet till 'Archive' mappen.</p>
                                </div>
                                <Switch className="ml-auto" defaultChecked />
                            </div>
                            <div className="flex items-start gap-3">
                                <EnvelopeOpenIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div className="space-y-1">
                                    <label className="text-sm font-medium block">Markera som läst</label>
                                    <p className="text-xs text-slate-500">I den externa inkorgen.</p>
                                </div>
                                <Switch className="ml-auto" defaultChecked />
                            </div>
                            <div className="flex items-start gap-3">
                                <TrashIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div className="space-y-1">
                                    <label className="text-sm font-medium block text-red-600">Radera original</label>
                                    <p className="text-xs text-slate-500">Ta bort mailet permanent.</p>
                                </div>
                                <Switch className="ml-auto" />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-indigo-900 rounded-lg p-4 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheckIcon className="w-6 h-6 text-indigo-300" />
                            <h4 className="font-bold text-sm">Säkerhetstips</h4>
                        </div>
                        <p className="text-xs text-indigo-200 leading-relaxed">
                            Vi rekommenderar att du vitlistar <strong>invoices.valiflow.ai</strong> i din brandvägg om du vidarebefordrar mail automatiskt.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
