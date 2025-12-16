// src/pages/Dashboard/Settings.jsx
import React, { useState, useEffect } from "react";
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  LinkIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  LockClosedIcon,
  ScaleIcon
} from "@heroicons/react/24/outline";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { settingsService } from "@/services/settingsService";

const VF = {
  navy: "#0A1E44",
  blue: "#1E5CB3",
  bg: "#F4F7FB",
  green: "#10B981",
  amber: "#F59E0B"
};

export default function CompanySettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("ai");

  // State
  const [settings, setSettings] = useState({
    aiReviewEnabled: true,
    aiSummaryEnabled: true,
    autoSyncEnabled: false,
    riskThreshold: 0.7,
    notifyRiskAlert: true,
    notifyNewInvoice: false,
    notifyAiReport: true,
  });

  const [automationRules, setAutomationRules] = useState([]);
  const [riskPreview, setRiskPreview] = useState(null);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sData, rData, iData] = await Promise.all([
        settingsService.getSettings(),
        settingsService.getAutomationRules(),
        settingsService.getAiInsights()
      ]);

      setSettings(sData);
      setAutomationRules(rData);
      setInsights(iData);

      // Load initial risk preview
      if (sData.riskThreshold) {
        const preview = await settingsService.getRiskPreview(sData.riskThreshold);
        setRiskPreview(preview);
      }
    } catch (err) {
      console.error("Failed to load settings", err);
      toast.error("Kunde inte hämta inställningar");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (Math.abs(settings.riskThreshold - 0.5) > 0.3) { // Example check for logic if needed
        // Could add confirmation modal logic here if desired
      }

      await Promise.all([
        settingsService.updateSettings(settings),
        settingsService.updateAutomationRules(automationRules)
      ]);

      toast.success("Ändringar sparade", {
        description: "Dina nya inställningar för AI och automation är nu aktiva."
      });
    } catch (err) {
      toast.error("Misslyckades att spara");
    } finally {
      setSaving(false);
    }
  };

  const handleRiskChange = async (val) => {
    const newVal = val[0];
    setSettings(prev => ({ ...prev, riskThreshold: newVal }));
    // Debounce this in real app
    try {
      const preview = await settingsService.getRiskPreview(newVal);
      setRiskPreview(preview);
    } catch (e) { /* ignore */ }
  };

  const toggleRule = (id) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const updateRuleThreshold = (id, val) => {
    setAutomationRules(prev => prev.map(r => r.id === id ? { ...r, threshold: Number(val) } : r));
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Laddar inställningar...</div>;

  return (
    <div className="min-h-screen pb-12" style={{ background: VF.bg }}>
      {/* HEADER */}
      <header
        className="px-8 py-6 shadow-md text-white sticky top-0 z-30"
        style={{ background: `linear-gradient(90deg, ${VF.navy} 0%, ${VF.blue} 100%)` }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Cog6ToothIcon className="w-7 h-7" />
              Företagsinställningar
            </h1>
            <p className="text-blue-100 mt-1">Styr Valiflows AI-granskning, riskprofil och automationer.</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-2 shadow-sm backdrop-blur-sm"
          >
            <ArrowPathIcon className={`w-4 h-4 ${saving ? "animate-spin" : ""}`} />
            {saving ? "Sparar..." : "Spara ändringar"}
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT COLUMN - MAIN SETTINGS */}
        <div className="lg:col-span-2 space-y-8">

          {/* 1. AI CONTROL PANEL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard
              title="AI Status"
              value={settings.aiReviewEnabled ? "Aktiv ✅" : "Pausad ⏸"}
              sub="Realtidsanalys på"
              color={settings.aiReviewEnabled ? "emerald" : "slate"}
            />
            <KpiCard
              title="Automatiseringsgrad"
              value={riskPreview ? `${Math.round((1 - riskPreview.predictedFlagRate) * 100)}%` : "-"}
              sub="Fakturor auto-godkända"
              color="blue"
            />
            <KpiCard
              title="Sparad Tid (30d)"
              value={`${insights?.timeSavedHours || 0}h`}
              sub="Genom AI-hantering"
              color="amber"
            />
          </div>

          {/* 2. AI CONFIGURATION */}
          <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">AI-konfiguration</h2>
                <p className="text-xs text-slate-500">Bestäm hur Valiflow ska analysera och presentera data.</p>
              </div>
            </div>

            <div className="space-y-6">
              <ToggleField
                label="AI-granskning av fakturor"
                desc="Valiflow analyserar fakturor automatiskt innan du ser dem. Hittar avvikelser i belopp, leverantör och bankgiro."
                checked={settings.aiReviewEnabled}
                onChange={(v) => setSettings({ ...settings, aiReviewEnabled: v })}
              />
              <ToggleField
                label="Visa AI-sammanfattningar"
                desc="Kort förklaring (Natural Language) till varför en faktura flaggades eller godkändes."
                checked={settings.aiSummaryEnabled}
                onChange={(v) => setSettings({ ...settings, aiSummaryEnabled: v })}
              />
              <ToggleField
                label="Automatisk synk vid uppladdning"
                desc="Starta analys direkt när en faktura laddas upp eller kommer till inboxen."
                checked={settings.autoSyncEnabled}
                onChange={(v) => setSettings({ ...settings, autoSyncEnabled: v })}
              />
            </div>
          </Card>

          {/* 3. RISK THRESHOLD */}
          <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <ScaleIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Riskprofil & Känslighet</h2>
                <p className="text-xs text-slate-500">Justera hur aggressivt AI ska flagga avvikelser.</p>
              </div>
            </div>

            <div className="px-2 mb-8">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Tröskelvärde: {settings.riskThreshold}</span>
                <span className="text-xs font-medium text-slate-500 px-2 py-0.5 bg-slate-100 rounded">0.0 (Alla flaggas) — 1.0 (Få flaggas)</span>
              </div>

              <Slider
                value={[settings.riskThreshold]}
                max={1.0}
                step={0.05}
                onValueChange={handleRiskChange}
                className="my-4"
              />

              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-sm text-blue-900">
                <ArrowPathIcon className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  {riskPreview ? (
                    <>
                      <p className="font-medium">Prognos:</p>
                      <p className="mt-1 opacity-90">
                        Med nuvarande nivå ({settings.riskThreshold}) flaggar AI ca <strong>{Math.round(riskPreview.predictedFlagRate * 100)}%</strong> av fakturorna.
                        Baserat på er historik skulle {riskPreview.flaggedCountLastWeek} fakturor ha flaggats senaste veckan.
                      </p>
                    </>
                  ) : "Beräknar utfall..."}
                </div>
              </div>
            </div>
          </Card>

          {/* 4. AUTOMATION RULES */}
          <Card className="p-6 bg-white border border-slate-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Automationsregler</h2>
                <p className="text-xs text-slate-500">Specifika händelser som ska hanteras automatiskt.</p>
              </div>
            </div>

            <div className="space-y-4">
              {automationRules.map(rule => (
                <div key={rule.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-sm font-medium text-slate-800">{getRuleLabel(rule.name)}</p>
                    <p className="text-xs text-slate-500">{getRuleDesc(rule.name)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {rule.threshold !== null && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Gräns (SEK)</span>
                        <input
                          type="number"
                          className="w-20 text-xs p-1.5 border rounded"
                          value={rule.threshold}
                          onChange={(e) => updateRuleThreshold(rule.id, e.target.value)}
                        />
                      </div>
                    )}
                    <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 7. SECURITY INFO */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm space-y-2">
            <LockClosedIcon className="w-6 h-6 mx-auto text-slate-400 mb-2" />
            <p>Valiflow ändrar aldrig er bokföringsdata utan godkännande.</p>
            <p>All data krypteras (AES-256) och hanteras enligt GDPR.</p>
            <div className="flex justify-center gap-4 mt-4 text-xs font-medium text-indigo-600">
              <a href="#" className="hover:underline">Säkerhetspolicy</a>
              <span>•</span>
              <a href="#" className="hover:underline">Transparensrapport</a>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - INSIGHTS */}
        <div className="space-y-6">

          {/* AI INSIGHTS CHART */}
          <Card className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <SparklesIcon className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800">AI Precision (30d)</h3>
            </div>
            <div className="h-40 w-full">
              {insights?.history ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={insights.history}>
                    <defs>
                      <linearGradient id="colorPrec" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide />
                    <YAxis domain={[0.5, 1]} hide />
                    <RechartsTooltip
                      contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="precision" stroke="#6366f1" fillOpacity={1} fill="url(#colorPrec)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : <div className="h-full w-full bg-slate-50 animate-pulse rounded" />}
            </div>
            <div className="mt-4 text-xs text-slate-500">
              <p className="flex justify-between border-b border-slate-100 pb-2 mb-2">
                <span>Medelprecision:</span>
                <span className="font-bold text-emerald-600">94.2%</span>
              </p>
              <p className="flex justify-between">
                <span>Antal beslut:</span>
                <span className="font-bold text-slate-700">1,245</span>
              </p>
            </div>
          </Card>

          {/* RECOMMENDATIONS */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5">
            <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-indigo-500" />
              Valiflow Rekommenderar
            </h3>
            <ul className="space-y-3">
              <li className="text-xs text-indigo-800 bg-white/60 p-2 rounded border border-indigo-100/50">
                <p className="font-semibold mb-0.5">Sänk risknivån till 0.6</p>
                <p className="opacity-80">Baserat på 3 falsk-positiva flaggningar förra veckan.</p>
              </li>
              <li className="text-xs text-indigo-800 bg-white/60 p-2 rounded border border-indigo-100/50">
                <p className="font-semibold mb-0.5">Aktivera autostopp för Bankgiro</p>
                <p className="opacity-80">Ni har haft 2 försök till fakturabedrägeri i år med ändrat BG.</p>
              </li>
            </ul>
          </div>

          {/* QUICK ACTIONS */}
          <Card className="p-5 bg-white border border-slate-200 shadow-sm rounded-xl">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">Hjälp & Support</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs font-normal h-8">
                <DocumentTextIcon className="w-3.5 h-3.5 mr-2" /> Dokumentation
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs font-normal h-8">
                <CheckCircleIcon className="w-3.5 h-3.5 mr-2" /> Kontakta CFO-support
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   Helper Components
------------------------------------------------------------- */

function KpiCard({ title, value, sub, color }) {
  const colors = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    slate: "text-slate-600 bg-slate-50 border-slate-100",
  };

  return (
    <Card className={`p-4 border shadow-sm rounded-xl flex flex-col justify-between ${colors[color].replace('text-', 'border-')}`}>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      <div className="mt-2 mb-1">
        <span className={`text-2xl font-bold ${colors[color].split(' ')[0]}`}>{value}</span>
      </div>
      <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
    </Card>
  )
}

function ToggleField({ label, desc, checked, onChange }) {
  return (
    <div className="flex items-start justify-between">
      <div className="mr-4">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-sm">{desc}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function getRuleLabel(name) {
  const map = {
    "stop_changed_bg": "Stoppa fakturor med ändrat Bankgiro",
    "flag_missing_org": "Flagga fakturor utan org.nummer",
    "pause_high_amount": "Pausa fakturor över beloppsgräns",
    "auto_approve_whitelist": "Auto-godkänn whitelistade leverantörer"
  };
  return map[name] || name;
}

function getRuleDesc(name) {
  const map = {
    "stop_changed_bg": "Kräver manuell godkännande om BG inte matchar historik.",
    "flag_missing_org": "Bra för att undvika bluffakturor.",
    "pause_high_amount": "Extra säkerhetskontroll för stora belopp.",
    "auto_approve_whitelist": "Snabbspår för betrodda parter."
  };
  return map[name] || "";
}
