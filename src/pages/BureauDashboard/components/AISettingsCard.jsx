import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { bureauSettingsService } from "@/services/bureauSettingsService";

export function AISettingsCard() {
    const [settings, setSettings] = useState({
        tone: "neutral",
        detailLevel: "medium",
        riskTolerance: 50,
        actionFirst: true,
        conciseSummary: false
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const data = await bureauSettingsService.getAI();
            setSettings(data);
        } catch (e) { }
    }

    async function handleSave() {
        setSaving(true);
        try {
            await bureauSettingsService.updateAI(settings);
            toast.success("AI-inställningar uppdaterade");
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
                    <h3 className="text-lg font-semibold text-slate-900">AI-inställningar</h3>
                    <p className="text-sm text-slate-500">Styr hur Valiflow presenterar analyser, riskbedömningar och rekommendationer.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 text-white">Spara ändringar</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Ton</label>
                        <Select value={settings.tone} onValueChange={v => setSettings({ ...settings, tone: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="formal">Formell</SelectItem>
                                <SelectItem value="neutral">Neutral</SelectItem>
                                <SelectItem value="consultative">Konsultativ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Detaljnivå</label>
                        <Select value={settings.detailLevel} onValueChange={v => setSettings({ ...settings, detailLevel: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Låg (Endast slutsatser)</SelectItem>
                                <SelectItem value="medium">Medel</SelectItem>
                                <SelectItem value="high">Hög (Fullständiga loggar)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between mb-2">
                            <span className="font-medium text-slate-800">Risk-tolerans</span>
                            <span className="text-sm text-slate-500">{settings.riskTolerance}%</span>
                        </div>
                        <Slider
                            value={[settings.riskTolerance]}
                            max={100}
                            step={1}
                            onValueChange={v => setSettings({ ...settings, riskTolerance: v[0] })}
                        />
                        <p className="text-xs text-slate-500 mt-2">Lägre tolerans ger fler varningar.</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">Visa först åtgärder, sedan analys</span>
                        <Switch checked={settings.actionFirst} onCheckedChange={c => setSettings({ ...settings, actionFirst: c })} />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">Sammanfattningar ska vara korta</span>
                        <Switch checked={settings.conciseSummary} onCheckedChange={c => setSettings({ ...settings, conciseSummary: c })} />
                    </div>
                </div>
            </div>
        </div>
    );
}
