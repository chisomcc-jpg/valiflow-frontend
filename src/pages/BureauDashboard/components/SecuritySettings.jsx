import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { bureauSettingsService } from "@/services/bureauSettingsService";

export function SecuritySettings() {
    const [settings, setSettings] = useState({
        mfaEnabled: false,
        sessionTimeout: 60,
        allowedDomains: ""
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const data = await bureauSettingsService.getSecurity();
            setSettings(data);
        } catch (e) { }
    }

    async function handleSave() {
        setSaving(true);
        try {
            await bureauSettingsService.updateSecurity(settings);
            toast.success("Säkerhetsinställningar uppdaterade");
        } catch (e) {
            toast.error("Kunde inte spara");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Säkerhet</h3>
                    <p className="text-sm text-slate-500">Ställ in säkerhetsnivån för byrån och begränsa åtkomst.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white">Spara ändringar</Button>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-800">Kräv MFA (2FA)</p>
                        <p className="text-xs text-slate-500">Alla användare måste använda tvåfaktorsautentisering.</p>
                    </div>
                    <Switch checked={settings.mfaEnabled} onCheckedChange={c => setSettings({ ...settings, mfaEnabled: c })} />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Session timeout (minuter)</label>
                    <Input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={e => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                        className="max-w-[150px]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tillåtna domäner (kommaseparerad lista)</label>
                    <Input
                        value={settings.allowedDomains}
                        onChange={e => setSettings({ ...settings, allowedDomains: e.target.value })}
                        placeholder="t.ex. valiflow.com, byran.se"
                    />
                    <p className="text-xs text-slate-500 mt-1">Lämna tomt för att tillåta alla.</p>
                </div>
            </div>
        </div>
    );
}
