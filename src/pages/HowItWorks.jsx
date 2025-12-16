// src/pages/HowItWorks.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-[#050C22] text-white">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-32">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>Så fungerar Valiflow</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>The Trust Layer for Finance</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Så kopplas Valiflow in – utan att ni byter system
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-white/80">
            Vi integrerar direkt mot ert ekonomisystem. ERP-system hanterar bokföring och transaktioner.
            Valiflow hanterar korrekthet, risk och spårbarhet innan något bokförs eller betalas.
            All fakturadata passerar genom samma säkerhetslager.
          </p>
        </motion.header>

        {/* 3-STEGSPROCESS */}
        <section className="mt-16 rounded-3xl border border-white/10 bg-white/5 px-6 py-8 sm:px-8 sm:py-10 backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                Process
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-semibold">
                Från faktura till trygg betalning – i tre steg
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-white/75">
              Ni behåller era nuvarande flöden. Vi kopplas på mellan
              fakturamottagning och betalning, och kontrollerar allt innan
              fakturan släpps igenom.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <StepCard
              icon={MailCheck}
              step="1"
              title="Fakturan tas emot"
              text="Fakturor kommer in som idag – via ERP, skanningsleverantör, e-faktura, EDI eller e-post. Valiflow speglar datan via integrationer utan att störa befintligt arbetssätt."
            />
            <StepCard
              icon={FileSearch}
              step="2"
              title="Kontroller & AI-validering"
              text="Varje faktura körs genom regelbaserade kontroller och AI-modeller: verifiering av Bankgiro, moms, belopp, leverantör, dubbletter och mönsteravvikelser."
            />
            <StepCard
              icon={ShieldCheck}
              step="3"
              title="Beslutsstöd & spårbarhet"
              text="Ekonomiteam och byråer får en tydlig lista med flaggor, rekommendationer och underlag. Allt loggas per faktura – redo för attest, bokföring, betalfil och revision."
            />
          </div>
        </section>

        {/* VAR VALIFLOW SITTER I FLODET */}
        <section className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center">
            Var i processen Valiflow sitter
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/75 text-center max-w-2xl mx-auto">
            Tänk Valiflow som ett filter mellan den värld där fakturor skapas –
            och den värld där pengar rör sig. Allt passerar genom samma trust layer.
          </p>

          <div className="mt-10 flex flex-col items-center justify-between gap-6 md:flex-row">
            <FlowStep
              title="1. Faktura tas emot"
              subtitle="E-post / EDI / Skanning / E-faktura / API"
            />
            <div className="text-emerald-300 text-3xl md:text-4xl">→</div>
            <FlowStep
              title="2. Valiflow Trust Layer"
              subtitle="Regelkontroller, AI, risk & policy"
              highlight
            />
            <div className="text-emerald-300 text-3xl md:text-4xl">→</div>
            <FlowStep
              title="3. ERP & betalfil"
              subtitle="Fortnox / Visma / Business Central m.fl."
            />
          </div>
        </section>

        {/* ROLLER & VYER */}
        <section className="mt-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                Roller och vyer
              </p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-semibold">
                Samma sanningskälla – olika vyer för olika roller
              </h2>
            </div>
            <p className="max-w-md text-sm sm:text-base text-white/75">
              CFO, ekonomiavdelning och byrå ser samma underliggande data –
              men i vyer anpassade för styrning, operativ uppföljning och revision.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <RoleCard
              icon={Building2}
              label="Ekonomiavdelning"
              bullets={[
                "Arbetslista med flaggade fakturor.",
                "Snabb översikt per leverantör och projekt.",
                "Tydliga motiveringar till varje flagga.",
              ]}
            />
            <RoleCard
              icon={LineChart}
              label="Redovisningsbyrå"
              bullets={[
                "Översikt per kundbolag och byråportfölj.",
                "Standardiserade kontroller för alla klienter.",
                "Rapporter som kan paketeras som rådgivning.",
              ]}
            />
            <RoleCard
              icon={Landmark}
              label="CFO & koncern"
              bullets={[
                "Risknivå per bolag, kategori och leverantör.",
                "Policyefterlevnad över flera bolag.",
                "Underlag till styrelse, revisor och bank.",
              ]}
            />
          </div>
        </section>

        {/* TEKNISKT: ARKITEKTUR & INTEGRATIONER */}
        <section className="mt-20 grid gap-8 lg:grid-cols-[1.4fr_minmax(0,1fr)]">
          <div className="rounded-3xl border border-white/10 bg-[#071330] p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
              <Network className="h-5 w-5 text-sky-300" />
              <h2 className="text-xl font-semibold">Teknisk överblick</h2>
            </div>
            <p className="text-white/75 text-sm sm:text-base leading-relaxed">
              Valiflow byggs API-first och integreras med de ekonomisystem ni redan
              använder. Vi speglar fakturaflödet, kör kontroller och skickar vidare
              resultatet – utan att ni behöver byta plattform.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 text-sm">
              <TechItem
                title="Integrationer"
                points={[
                  "Direktkoppling mot Fortnox, Visma och Business Central.",
                  "Stöd för SFTP, API och inbox-speglade flöden.",
                  "Pilotupplägg med ett bolag – skala därefter.",
                ]}
              />
              <TechItem
                title="Kontroller & AI"
                points={[
                  "Regelbaserade kontroller – moms, dubbletter, policy.",
                  "AI-modeller för mönster, nya leverantörer och avvikelser.",
                  "Riskscore per faktura och leverantör.",
                ]}
              />
              <TechItem
                title="Security & access"
                points={[
                  "Rollbaserad åtkomst och separata miljöer.",
                  "Full loggning av alla händelser.",
                  "Byggt för GDPR & ViDA-krav.",
                ]}
              />
              <TechItem
                title="Audit & rapporter"
                points={[
                  "Export till Excel, BI eller revisionsunderlag.",
                  "Standardrapporter för intern kontroll.",
                  "Dokumenterad beslutslogg per faktura.",
                ]}
              />
            </div>
          </div>

          {/* MINI-MOCKUP / HÖGERKORT */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6 backdrop-blur-md">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60 mb-3">
              Exempelscenario
            </p>
            <h3 className="text-sm sm:text-base font-semibold mb-3">
              Byggbolag med 2 500 leverantörsfakturor/månad
            </h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>• Valiflow kopplas in mellan fakturainbox och ERP.</li>
              <li>• 100% av fakturorna kontrolleras automatiskt.</li>
              <li>• 3–5% flaggas för vidare granskning.</li>
              <li>• CFO får en månadsrapport med risk, moms och avvikelser.</li>
            </ul>
            <div className="mt-4 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-xs sm:text-sm">
              <p className="font-semibold text-emerald-200 mb-1">
                Typisk effekt efter 30–60 dagar:
              </p>
              <p className="text-white/80">
                Färre felbetalningar, mindre manuell kontroll och ett tydligt
                revisionsunderlag – utan att byta ERP eller ändra arbetssätt.
              </p>
            </div>
          </div>
        </section>

        {/* BEFORE / AFTER */}
        <section className="mt-20">
          <div className="grid gap-6 md:grid-cols-2">
            <ComparisonCard
              title="Utan Valiflow"
              items={[
                "Manuella stickprov, olika Excel-listor och personberoende.",
                "Oklart vilka kontroller som faktiskt gjorts per faktura.",
                "Svårt att visa styrelse och revisor hur risk hanteras.",
                "Fler sena upptäckter – ofta först vid revision.",
              ]}
            />
            <ComparisonCard
              title="Med Valiflow"
              highlight
              items={[
                "Standardiserade kontroller på alla fakturor, varje dag.",
                "Full logg per faktura – vad som kontrollerats och resultat.",
                "Tydliga rapporter kring risk, avvikelser och efterlevnad.",
                "Färre felbetalningar och mindre tid på manuella kontroller.",
              ]}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-24">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/60 via-sky-500/50 to-emerald-500/60 px-6 py-9 sm:px-10 sm:py-11">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.7),_transparent_55%)]" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                  Nästa steg
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold">
                  Se hur ert fakturaflöde ser ut med Valiflow påkopplat
                </h2>
                <p className="text-sm sm:text-base text-white/90">
                  Vi utgår från ert befintliga flöde och visar hur trust layer,
                  kontroller och AI-insikter fungerar på riktiga fakturor.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/pilot"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-[#050C22] font-semibold px-6 py-3 text-sm sm:text-base shadow-md hover:bg-slate-100 transition"
                >
                  Ansök om byråpilot
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 rounded-full border border-white/70 text-white font-medium px-5 py-2.5 text-sm sm:text-base hover:bg-white/10 transition"
                >
                  Läs mer om produkten
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ───────────── Subcomponents ───────────── */

function StepCard({ icon: Icon, step, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#071330] p-5 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black/30 border border-white/10">
          <Icon className="h-4 w-4 text-emerald-300" />
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/70">
          Steg {step}
        </span>
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/75">{text}</p>
    </div>
  );
}

function FlowStep({ title, subtitle, highlight }) {
  return (
    <div
      className={`w-full max-w-[260px] rounded-xl px-5 py-4 border text-center ${highlight
        ? "bg-emerald-400 text-[#050C22] border-emerald-300"
        : "bg-[#071330] border-white/10 text-white"
        }`}
    >
      <p className="text-sm sm:text-base font-semibold">{title}</p>
      <p
        className={`mt-1 text-xs sm:text-sm ${highlight ? "text-[#050C22]/80" : "text-white/75"
          }`}
      >
        {subtitle}
      </p>
    </div>
  );
}

function RoleCard({ icon: Icon, label, bullets }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#071330] p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-black/30 border border-white/10">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <p className="text-base font-semibold text-white">{label}</p>
      </div>
      <ul className="space-y-2 text-sm text-white/80">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[6px] h-1 w-1 flex-none rounded-full bg-emerald-300" />
            <span className="leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TechItem({ title, points }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#050C22] p-4">
      <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
      <ul className="space-y-1.5 text-xs sm:text-sm text-white/80">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[6px] h-1 w-1 flex-none rounded-full bg-sky-300" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ComparisonCard({ title, items, highlight }) {
  return (
    <div
      className={`rounded-3xl border p-6 sm:p-7 ${highlight
        ? "border-emerald-400/70 bg-emerald-400/10"
        : "border-white/10 bg-[#071330]"
        }`}
    >
      <h3 className="text-base sm:text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-sm text-white/80">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[6px] h-1 w-1 flex-none rounded-full bg-white/50" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
