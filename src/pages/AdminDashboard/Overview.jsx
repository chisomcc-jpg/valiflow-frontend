import React, { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import {
  CurrencyDollarIcon,
  ShieldExclamationIcon,
  ServerStackIcon,
  UsersIcon,
  SparklesIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Overview() {
  const [snapshot, setSnapshot] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [snap, recs] = await Promise.all([
        adminService.getSnapshot(),
        adminService.getRecommendations()
      ]);
      setSnapshot(snap);
      setRecommendations(recs);
    } catch (err) {
      toast.error("Kunde inte hämta översikt");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAction = async (id, action) => {
    try {
      await adminService.handleRecommendation(id, action);
      if (action === 'dismiss') toast.success("Rekommendation avfärdad");
      else toast.success("Åtgärd markerad som hanterad");

      // Refresh
      loadData();
    } catch (e) {
      toast.error("Kunde inte spara åtgärd");
    }
  };

  const runAiCopilot = async (mode = 'tactical') => {
    try {
      const analysis = await adminService.getAiCopilot("general", mode);
      setAiAnalysis(analysis);
      toast.success(mode === 'strategic' ? "Strategisk analys klar" : "AI-analys klar");
    } catch (e) {
      toast.error("AI-analys misslyckades");
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Laddar kontrollrummet...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Kontrollrum
          </h1>
          <p className="text-slate-500 text-sm">
            Senast uppdaterad: {new Date(snapshot?.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Uppdatera
          </Button>
        </div>
      </div>

      {/* 1. Executive Action Layer (Recommendations) */}
      <section>
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Dagens rekommenderade åtgärder</h2>
        <div className="grid grid-cols-1 gap-4">
          {recommendations.length > 0 ? recommendations.map((rec) => (
            <div key={rec.id} className={`p-5 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${rec.severity === 'high' ? 'bg-red-50 border-red-100' :
                rec.severity === 'medium' ? 'bg-amber-50 border-amber-100' :
                  'bg-white border-slate-200'
              }`}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${rec.severity === 'high' ? 'bg-red-200 text-red-800' :
                      rec.severity === 'medium' ? 'bg-amber-200 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                    {rec.severity === 'high' ? 'Kritisk' : rec.severity === 'medium' ? 'Bör åtgärdas' : 'Info'}
                  </span>
                  {rec.impact && <span className="text-xs text-slate-500 font-medium uppercase">Påverkar: {rec.impact}</span>}
                </div>
                <p className="text-slate-800 font-bold">{rec.message}</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                {rec.id !== 'all-good' && (
                  <>
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800" onClick={() => handleAction(rec.id, 'dismiss')}>
                      Avfärda
                    </Button>
                    <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 cursor-pointer" onClick={() => handleAction(rec.id, 'handled')}>
                      {rec.action || "Hantera"}
                    </Button>
                  </>
                )}
                {rec.id === 'all-good' && (
                  <span className="text-sm text-emerald-600 font-bold flex items-center gap-1">
                    ✅ Allt ser bra ut
                  </span>
                )}
              </div>
            </div>
          )) : (
            <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-100 text-center text-emerald-800">
              Inga kritiska åtgärder krävs just nu. Systemet är stabilt.
            </div>
          )}
        </div>
      </section>

      {/* 2. Primary KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          label="Systemstatus"
          value={snapshot?.system?.status === 'healthy' ? 'Stabil' : snapshot?.system?.status === 'degraded' ? 'Störd' : 'Nere'}
          color={snapshot?.system?.status === 'healthy' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}
          icon={ServerStackIcon}
        />
        <KpiCard
          label="Undvikna Risker (SEK)"
          value={snapshot?.trust?.avoidedRisksSEK ? new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumSignificantDigits: 3 }).format(snapshot.trust.avoidedRisksSEK) : '0 kr'}
          sub={`${snapshot?.trust?.highRiskVolume} stoppade fakturor`}
          color="bg-amber-50 text-amber-700"
          icon={ShieldExclamationIcon}
        />
        <KpiCard
          label="Aktiva Bolag"
          value={snapshot?.business?.activeCompanies}
          sub={`${snapshot?.business?.plans?.GROWTH || 0} Growth / ${snapshot?.business?.plans?.AUDIT_PRO || 0} Pro`}
          color="bg-blue-50 text-blue-700"
          icon={UsersIcon}
        />
        <KpiCard
          label="Automationsgrad"
          value={snapshot?.trust?.automationRate ? `${(snapshot.trust.automationRate * 100).toFixed(1)}%` : '0%'}
          sub="Direkt godkända"
          color="bg-violet-50 text-violet-700"
          icon={CurrencyDollarIcon}
        />
      </section>

      {/* 3. AI Co-Pilot (Analyst) */}
      <section className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Glow fx */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <SparklesIcon className="w-6 h-6 text-indigo-300" />
              Valiflow AI Analyst
            </h2>
            <p className="text-indigo-200 text-sm mt-1">Automatisk analys av system, risk och intäkter.</p>
          </div>
          {!aiAnalysis && (
            <div className="flex gap-2">
              <Button onClick={() => runAiCopilot('tactical')} variant="secondary" size="sm" className="font-bold">
                Exekutiv Analys
              </Button>
              <Button onClick={() => runAiCopilot('strategic')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold" size="sm">
                Produktionsstrategi
              </Button>
            </div>
          )}
        </div>

        {aiAnalysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">Sammanfattning</h3>
              <p className="text-lg leading-relaxed font-light text-white mb-6">
                {aiAnalysis.summary}
              </p>

              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-3">Identifierade Risker</h3>
              <ul className="space-y-2 mb-6">
                {aiAnalysis.risks.map((r, i) => (
                  <li key={i} className="flex gap-3 text-sm text-indigo-100 bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-amber-400">⚠️</span> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-3">Möjligheter & Nästa Steg</h3>
              <ul className="space-y-2 mb-6">
                {aiAnalysis.opportunities.map((o, i) => (
                  <li key={i} className="flex gap-3 text-sm text-indigo-100 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                    <span className="text-emerald-400">💡</span> {o}
                  </li>
                ))}
              </ul>
              <div className="bg-indigo-800/50 p-4 rounded-xl border border-indigo-700">
                <h4 className="font-bold text-sm mb-2 text-white">Rekommenderad åtgärd</h4>
                <ul className="list-disc list-inside text-sm text-indigo-200 space-y-1">
                  {aiAnalysis.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function KpiCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
}
