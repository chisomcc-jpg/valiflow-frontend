import React from "react";
import { Link } from "react-router-dom";
import {
  MailCheck,
  ShieldCheck,
  Network,
  FileSearch,
  ArrowRight,
  Building2,
  LineChart,
  Landmark,
  Sparkles,
} from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-[#050C22] via-[#071330] to-[#050C22]">
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-32">
        {/* HEADER */}
        <header className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>Så fungerar Valiflow</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>The Trust Layer for Finance</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Så kopplas Valiflow in – utan att ni byter system
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-white/80">
            Vi integrerar direkt mot ert ekonomisystem. ERP hanterar bokföring och
            transaktioner. Valiflow hanterar korrekthet, risk och spårbarhet innan
            något bokförs eller betalas.
          </p>
        </header>

        {/* 3-STEG */}
        <section className="mt-16 rounded-3xl border border-white/10 bg-white/5 px-6 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                Process
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-semibold">
                Från faktura till trygg betalning
              </h2>
            </div>
            <p className="max-w-md text-sm text-white/75">
              Valiflow kopplas in mellan fakturamottagning och betalning – utan
              att störa befintliga flöden.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <StepCard
              icon={MailCheck}
              step="1"
              title="Faktura tas emot"
              text="ERP, EDI, e-faktura eller e-post. Valiflow speglar flödet."
            />
            <StepCard
              icon={FileSearch}
              step="2"
              title="Kontroller & AI"
              text="Regler, policy, dubbletter, moms, risk & avvikelser."
            />
            <StepCard
              icon={ShieldCheck}
              step="3"
              title="Beslutsstöd"
              text="Tydliga flaggor, rekommendationer och spårbar logg."
            />
          </div>
        </section>

        {/* FLOW */}
        <section className="mt-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Var i processen Valiflow sitter
          </h2>
          <p className="mt-3 text-white/75 max-w-2xl mx-auto">
            Ett filter mellan fakturainbox och betalning – ett gemensamt trust layer.
          </p>

          <div className="mt-10 flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <FlowStep title="Faktura tas emot" subtitle="EDI / e-faktura / e-post" />
            <span className="text-emerald-300 text-3xl">→</span>
            <FlowStep
              title="Valiflow Trust Layer"
              subtitle="Regler · AI · Risk · Policy"
              highlight
            />
            <span className="text-emerald-300 text-3xl">→</span>
            <FlowStep
              title="ERP & betalfil"
              subtitle="Fortnox · Visma · Business Central"
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24">
          <div className="rounded-3xl border border-white/10 bg-emerald-500/10 px-6 py-10 flex flex-col gap-6 md:flex-row md:justify-between md:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Se Valiflow på ert fakturaflöde
              </h2>
              <p className="mt-2 text-white/80">
                Vi utgår från ert befintliga system och visar exakt hur trust
                layer fungerar i praktiken.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/pilot"
                className="rounded-full bg-white text-[#050C22] px-6 py-3 font-semibold text-sm hover:bg-slate-100"
              >
                Ansök om pilot
                <ArrowRight className="inline ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/product"
                className="rounded-full border border-white/60 px-5 py-2.5 text-sm hover:bg-white/10"
              >
                Läs mer
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ───────── Subcomponents ───────── */

function StepCard({ icon: Icon, step, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071330] p-5">
      <div className="flex items-center justify-between mb-3">
        <Icon className="h-4 w-4 text-emerald-300" />
        <span className="text-xs text-white/60">Steg {step}</span>
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-white/75">{text}</p>
    </div>
  );
}

function FlowStep({ title, subtitle, highlight }) {
  return (
    <div
      className={`w-full max-w-[260px] rounded-xl px-5 py-4 border ${
        highlight
          ? "bg-emerald-400 text-[#050C22] border-emerald-300"
          : "bg-[#071330] border-white/10"
      }`}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm opacity-80">{subtitle}</p>
    </div>
  );
}

