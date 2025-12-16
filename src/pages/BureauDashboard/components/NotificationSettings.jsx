import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { bureauSettingsService } from "@/services/bureauSettingsService";
import { NotificationChannels } from "@/components/NotificationChannels";
import { NotificationHistorySheet } from "./NotificationHistorySheet";
import { History } from "lucide-react";

export function NotificationSettings() {
    const [settings, setSettings] = useState({
        notifyHighRisk: true,
        notifySupplierChange: true,
        dailySummary: false,
        dailySummaryFrequency: "morning", // new
        notifyCompliance: true,
        channels: { email: true, app: true } // new
    });
    const [saving, setSaving] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const data = await bureauSettingsService.getNotifications();
            setSettings(prev => ({ ...prev, ...data }));
        } catch (e) { }
    }

    async function handleSave() {
        setSaving(true);
        try {
            await bureauSettingsService.updateNotifications(settings);
            toast.success("Notifieringar uppdaterade.");
        } catch (e) {
            toast.error("Kunde inte spara ändringar. Försök igen.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Notifieringar</h3>
                    <p className="text-sm text-slate-500">Styr vilka händelser som ska skickas som notiser eller e-post.</p>
                    <button
                        onClick={() => setHistoryOpen(true)}
                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-2 font-medium"
                    >
                        <History className="w-3 h-3" /> Visa senaste notifieringar
                    </button>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]">
                    {saving ? "Sparar..." : "Spara ändringar"}
                </Button>
            </div>

            <div className="space-y-8">
                {/* 1. High Risk */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-medium text-slate-800">Meddela vid hög risk hos kund</p>
                        <p className="text-xs text-slate-500">Skickar larm om antalet högriskfakturor ökar snabbt.</p>
                        <p className="text-xs text-slate-400 italic mt-1">Exempel: En kunds riskpoäng ökar från 40 → 80 inom 24 timmar.</p>
                        {settings.notifyHighRisk && (
                            <NotificationChannels
                                value={settings.channels}
                                onChange={c => setSettings({ ...settings, channels: c })}
                            />
                        )}
                    </div>
                    <Switch checked={settings.notifyHighRisk} onCheckedChange={c => setSettings({ ...settings, notifyHighRisk: c })} />
                </div>

                {/* 2. Supplier Change */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-medium text-slate-800">Meddela vid leverantörsändringar</p>
                        <p className="text-xs text-slate-500">Vid nya bankgironummer eller ändrad bolagsstatus.</p>
                    </div>
                    <Switch checked={settings.notifySupplierChange} onCheckedChange={c => setSettings({ ...settings, notifySupplierChange: c })} />
                </div>

                {/* 3. Daily Summary */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-medium text-slate-800">Daglig sammanfattning</p>
                        <p className="text-xs text-slate-500">Morgonmail med översikt över nattens händelser.</p>

                        {settings.dailySummary && (
                            <div className="mt-3 w-48">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">Hur ofta?</label>
                                <Select
                                    value={settings.dailySummaryFrequency}
                                    onValueChange={v => setSettings({ ...settings, dailySummaryFrequency: v })}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="morning">Varje morgon (Standard)</SelectItem>
                                        <SelectItem value="immediate">Direkt vid förändringar</SelectItem>
                                        <SelectItem value="high_risk">Endast vid hög risk</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <Switch checked={settings.dailySummary} onCheckedChange={c => setSettings({ ...settings, dailySummary: c })} />
                </div>

                {/* 4. Compliance */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-medium text-slate-800">Meddela vid compliance-brister</p>
                        <p className="text-xs text-slate-500">Om obligatoriska fält saknas frekvent.</p>
                    </div>
                    <Switch checked={settings.notifyCompliance} onCheckedChange={c => setSettings({ ...settings, notifyCompliance: c })} />
                </div>
            </div>

            <NotificationHistorySheet open={historyOpen} onOpenChange={setHistoryOpen} />
        </div>
    );
}
