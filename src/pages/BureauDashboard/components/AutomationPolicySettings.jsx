import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { bureauSettingsService } from "@/services/bureauSettingsService";
import { TooltipInfo } from "@/components/TooltipInfo";
import { LastUpdatedBadge } from "@/components/LastUpdatedBadge";

export function AutomationPolicySettings() {
    const [settings, setSettings] = useState({
        stopOnBankgiroChange: true,
        flagMissingOrgNumber: true,
        warnMetadata: true,
        riskThreshold: 0.7
    });
    const [stats, setStats] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [data, statsData] = await Promise.all([
                bureauSettingsService.getAutomations(),
                bureauSettingsService.getAutomationStats()
            ]);
            setSettings(data);
            setStats(statsData);
        } catch (e) { }
    }

    async function handleSave() {
        setSaving(true);
        try {
            await bureauSettingsService.updateAutomations(settings);
            toast.success("Ändringar sparade.");
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
                    <h3 className="text-lg font-semibold text-slate-900">Automations-policy</h3>
                    <p className="text-sm text-slate-500">Standardregler som gäller för hela byrån om inget annat anges.</p>
                    <LastUpdatedBadge section="automations" />
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px]">
                    {saving ? "Sparar..." : "Spara ändringar"}
                </Button>
            </div>

            <div className="space-y-8">
                {/* Rule 1 */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center">
                            <p className="font-medium text-slate-800">Stoppa fakturor när bankgiro ändras</p>
                            <TooltipInfo text="Rekommenderad av FAR. Upptäcker den vanligaste fakturabedrägeriformen 2024–2025." />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Kräver manuell granskning vid ändrat betalnummer.</p>
                        {stats && (
                            <p className="text-xs text-slate-400 mt-1 font-medium italic">
                                {stats.bankgiro_changes_month} leverantörer ändrade bankgiro senaste 30 dagar.
                            </p>
                        )}
                    </div>
                    <Switch
                        checked={settings.stopOnBankgiroChange}
                        onCheckedChange={c => setSettings({ ...settings, stopOnBankgiroChange: c })}
                    />
                </div>

                {/* Rule 2 */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center">
                            <p className="font-medium text-slate-800">Flagga fakturor utan organisationsnummer</p>
                            <TooltipInfo text="Hjälper systemet att matcha mot officiella register för kreditkontroll." />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Hjälper till att hålla leverantörsregistret rent.</p>
                        {stats && (
                            <p className="text-xs text-slate-400 mt-1 font-medium italic">
                                {stats.missing_orgnr_percent}% av fakturor saknade organisationsnummer denna månad.
                            </p>
                        )}
                    </div>
                    <Switch
                        checked={settings.flagMissingOrgNumber}
                        onCheckedChange={c => setSettings({ ...settings, flagMissingOrgNumber: c })}
                    />
                </div>

                {/* Rule 3 */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center">
                            <p className="font-medium text-slate-800">Varna vid metadata-brist</p>
                            <TooltipInfo text="Varnar om fakturan saknar kritisk information som förfallodatum eller totalbelopp." />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">T.ex. saknat datum, valuta eller totalbelopp.</p>
                        {stats && (
                            <p className="text-xs text-slate-400 mt-1 font-medium italic">
                                Metadata-brist upptäcktes på {stats.metadata_issues_month} fakturor denna månad.
                            </p>
                        )}
                    </div>
                    <Switch
                        checked={settings.warnMetadata}
                        onCheckedChange={c => setSettings({ ...settings, warnMetadata: c })}
                    />
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <div className="flex justify-between mb-2">
                        <span className="font-medium text-slate-800">Risktröskel för granskning</span>
                        <span className="text-sm font-bold text-indigo-600">{Math.round(settings.riskThreshold * 100)}%</span>
                    </div>

                    <div className="px-1">
                        <Slider
                            value={[settings.riskThreshold]}
                            max={1}
                            step={0.05}
                            onValueChange={v => setSettings({ ...settings, riskThreshold: v[0] })}
                        />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-400 uppercase font-medium mt-2 px-1">
                        <span>Låg risk (0-40)</span>
                        <span>Medel (40-70)</span>
                        <span>Hög risk (70-100)</span>
                    </div>

                    <p className="text-xs text-slate-500 mt-3">
                        Fakturor med riskpoäng över denna nivå flaggas automatiskt. <span className="text-slate-400 italic">Rekommenderad nivå för revisionsbyråer: 65–75%.</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
