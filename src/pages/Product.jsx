// src/pages/Product.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  MailCheck,
  BarChart3,
  ArrowRight,
  Network,
  Lock,
  LineChart,
  Building2,
  Landmark,
} from "lucide-react";

export default function Product() {
  return (
    <div className="bg-[#050C22] text-white min-h-screen">
      {/* BACKGROUND GLOW – samma känsla som Home */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-32">
        {/* HERO */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-center"
        >
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs text-white/75">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Produkt</span>
              <span className="h-1 w-1 rounded-full bg-white/30" />
              <span>Valiflow – The Trust Layer for Finance</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold tracking-tight">
                En produkt. Ett trust layer. Flera sätt att minska risk.
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-white/80 max-w-xl">
                Valiflow lägger ett säkerhetslager ovanpå dina befintliga
                ekonomisystem. All fakturadata passerar genom samma trust layer –
                med regelbaserad validering, AI-stöd och full spårbarhet innan
                pengar rör sig.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/pilot"
                className="inline-flex items-center gap-2 rounded-full bg-white text-[#050C22] px-7 py-3 text-sm sm:text-base font-semibold shadow-lg hover:bg-slate-100 transition"
              >
                Ansök om byråpilot
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 transition"
              >
                Se prissättning
              </Link>
            </div>

            <p className="text-sm sm:text-base text-white/70 max-w-xl">
              Byggt för företag och byråer som hanterar från 100 till flera
              tusen fakturor per månad – med extra styrka för bygg, energi och
              projektintensiva verksamheter.
            </p>
          </div>

          {/* Hero "product" card */}
          <div className="relative">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-6 h-32 w-32 rounded-full bg-sky-400/25 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between text-xs text-white/75">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  Trust Layer status
                </span>
                <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-200 border border-emerald-300/40">
                  Aktivt på 4 bolag
                </span>
              </div>

              <div className="mt-4 grid gap-4 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 border border-white/10">
                  <span className="text-white/80">Fakturor senaste 30 dagar</span>
                  <span className="font-semibold text-white">1 842 st</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <KpiPill label="Flaggade fakturor" value="3.1%" tone="amber" />
                  <KpiPill label="Flaggade för granskning" value="18" tone="red" />
                  <KpiPill label="AI-träffsäkerhet" value="97.4%" tone="teal" />
                </div>
                <div className="mt-1 rounded-2xl border border-white/10 bg-[#071330] p-3">
                  <p className="mb-1 text-xs text-white/60">Exempelinsikt:</p>
                  <p className="text-sm text-white/90">
                    “Tre nya leverantörer med höga belopp saknar historik. Vi
                    rekommenderar manuell kontroll och att begränsa belopp över
                    150 000 kr.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* PILLARS */}
        <section className="mt-16 md:mt-20">
          <div className="grid gap-6 md:grid-cols-3">
            <PillarCard
              icon={ShieldCheck}
              title="Ett Trust Layer – inte bara bokföring"
              text="ERP-systemet är motorn. Valiflow är kontrollinstansen som säkerställer att inget felaktigt passerar. Du behåller Fortnox, Visma eller Business Central – men får ett extra skyddslager."
            />
            <PillarCard
              icon={Cpu}
              title="Hybrid-motor för fakturor"
              text="Kombinerar deterministiska regler (policy) med mönsteranalys (varning) för att upptäcka fel, dubbletter och misstänkta leverantörer."
            />
            <PillarCard
              icon={Network}
              title="Integrationer & flöden"
              text="Plug & play mot nordiska ekonomisystem. Inga manuella exports – data rör sig via API, SFTP eller inbox."
            />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-20 rounded-3xl border border-white/12 bg-white/5 p-6 md:p-8 backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                Hur det fungerar
              </p>
              <h2 className="mt-1 text-2xl md:text-3xl font-semibold">
                Från faktura till trygg betalning – i tre steg
              </h2>
            </div>
            <p className="max-w-md text-base text-white/80">
              Ni behöver inte ändra ert arbetssätt. Valiflow kopplas på som ett
              filter mellan fakturamottagning och betalning.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <StepCard
              icon={MailCheck}
              step="1"
              title="Fakturan tas emot"
              text="Fakturor kommer in via befintliga flöden (ERP, skanningsleverantör, e-faktura eller e-post). Valiflow speglar datan utan att störa befintligt system."
            />
            <StepCard
              icon={BarChart3}
              step="2"
              title="Automatisk Trust-check"
              text="Valiflow kontrollerar bankgiro, moms, belopp, dubbletter och historiska mönster. Om bankuppgifter ändrats eller belopp avviker, flaggas fakturan direkt."
            />
            <StepCard
              icon={ShieldCheck}
              step="3"
              title="Beslutsstöd & logg"
              text="Ekonomiavdelning/byrå får ett tydligt beslutsunderlag innan fakturan går vidare till attest, bokföring eller betalfil."
            />
          </div>
        </section>

        {/* PROCESS FLOW – VAR VALIFLOW SITTER */}
        <section className="mt-20 max-w-4xl mx-auto">
          <h2 className="mb-8 text-center text-2xl md:text-3xl font-semibold">
            Var Valiflow sitter i er process
          </h2>
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <FlowStep title="1. Faktura tas emot" subtitle="E-post / EDI / API" />
            <div className="text-emerald-300 text-3xl md:text-4xl">→</div>
            <FlowStep
              title="2. Valiflow Trust Layer"
              subtitle="AI-kontroller & risk"
              highlight
            />
            <div className="text-emerald-300 text-3xl md:text-4xl">→</div>
            <FlowStep
              title="3. ERP / betalfil"
              subtitle="Fortnox / Visma / Business Central"
            />
          </div>
        </section>

        {/* MODULES */}
        <section className="mt-20 space-y-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
                Moduler i Valiflow
              </p>
              <h2 className="mt-1 text-2xl md:text-3xl font-semibold">
                Allt du behöver i ett trust layer
              </h2>
            </div>
            <p className="max-w-md text-base text-white/80">
              Valiflow består av fyra huvudmoduler som kan aktiveras stegvis – ni
              behöver inte ta allt på en gång.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <ModuleCard
              icon={ShieldCheck}
              title="1. Trust Engine"
              bullets={[
                "Varningar vid ändrat Bankgiro/Plusgiro – stoppar fakturakapningar.",
                "Riskscore per faktura baserat på historik och regeluppsättning.",
                "Olika trösklar för olika bolag, länder eller leverantörstyper.",
              ]}
            />
            <ModuleCard
              icon={LineChart}
              title="2. Policy & kontroller"
              bullets={[
                "Översätt attestregler och policyer till faktiska kontroller.",
                "Flagga betalning automatiskt vid brott mot policy.",
                "Skapa olika regelset för projekt, bolag eller koncernnivå.",
              ]}
            />
            <ModuleCard
              icon={Cpu}
              title="3. AI & anomaly detection"
              bullets={[
                "Larmar vid avvikande belopp och plötsliga mönsterförändringar.",
                "Lär sig av historik – minskar falsklarm över tid.",
                "Kombinerar regelbaserade och AI-baserade kontroller.",
              ]}
            />
            <ModuleCard
              icon={Lock}
              title="4. Audit & spårbarhet"
              bullets={[
                "Full logg på varje faktura: vilka kontroller som körts och med vilket resultat.",
                "Export för revisor, styrelse och internkontroll.",
                "Audit trail redo inför framtida krav (ViDA m.fl.).",
              ]}
            />
          </div>
        </section>

        {/* INTEGRATIONS + SEGMENTS */}
        <section className="mt-20 grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          {/* Integrations */}
          <div className="rounded-3xl border border-white/12 bg-white/5 p-6 md:p-7 backdrop-blur-md">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
              Integrationer
            </p>
            <h2 className="mt-1 text-2xl md:text-3xl font-semibold">
              Kopplat till de system ni redan använder
            </h2>
            <p className="mt-3 text-base text-white/80">
              Vi fokuserar på nordiska ekonomisystem och miljöer där stora
              fakturaflöden möter höga krav på kontroll.
            </p>

            <div className="mt-5 grid gap-3 text-sm text-white/90 sm:grid-cols-2">
              <IntegrationPill label="Fortnox" />
              <IntegrationPill label="Visma eEkonomi /.net" />
              <IntegrationPill label="Microsoft Business Central" />
              <IntegrationPill label="Kommande: Monitor, PE" />
            </div>

            <p className="mt-4 text-sm text-white/70">
              Saknar ni något system? Vi börjar ofta med ett pilotbolag där vi
              kopplar er befintliga miljö via API eller SFTP.
            </p>
          </div>

          {/* Segments */}
          <div className="space-y-4">
            <SegmentCard
              icon={Building2}
              label="Ekonomiavdelningar"
              text="Minska personberoende och få en tydlig story till CFO och styrelse kring risknivå i leverantörsflödet."
            />
            <SegmentCard
              icon={LineChart}
              label="Redovisningsbyråer"
              text="Bygg en skalbar kvalitetskontroll ovanpå alla klientbolag och paketera nya rådgivningstjänster."
            />
            <SegmentCard
              icon={Landmark}
              label="Enterprise & koncern"
              text="Få en koncernvy på risk, policyefterlevnad och leverantörer – utan att alla bolag måste byta ERP."
            />
          </div>
        </section>

        {/* KUNDRESULTAT */}
        <section className="mt-20 max-w-5xl mx-auto">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">
              Resultat från kunder
            </p>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold">
              Mätbara förbättringar efter 30–60 dagar
            </h2>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <ResultCard metric="−67%" description="Färre manuella kontroller" />
            <ResultCard metric="+92%" description="Tidigare upptäckt av fel" />
            <ResultCard metric="100%" description="Audit-klar dokumentation" />
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="mt-20 max-w-6xl mx-auto">
          <p className="text-center text-xs font-medium uppercase tracking-[0.18em] text-white/60">
            Betrodd av nordiska bolag och byråer
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-8 opacity-80">
            <img src="/logos/aurelius.svg" className="h-8" alt="Aurelius" />
            <img src="/logos/nordvent.svg" className="h-8" alt="Nordvent" />
            <img src="/logos/scandia.svg" className="h-8" alt="Scandia" />
            <img src="/logos/byggledger.svg" className="h-8" alt="Byggledger" />
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <QuoteCard
              quote="Valiflow gav oss kontroll över leverantörer vi aldrig granskat ordentligt tidigare."
              author="Ekonomichef, Scandia AB"
            />
            <QuoteCard
              quote="Vi kapade cirka 40% av tiden på fakturakontroller första månaden."
              author="CFO, Nordvent Energi"
            />
            <QuoteCard
              quote="AI-kontrollerna plockar upp sådant våra medarbetare missade – utan att vi ändrat arbetssätt."
              author="Byråchef, Finrevision"
            />
          </div>
        </section>

        {/* DIFFERENTIATION */}
        <section className="mt-20 max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold">
              Vad gör Valiflow unikt?
            </h2>
            <p className="mt-2 text-base text-white/80">
              Det finns många verktyg som läser fakturor. Valiflow fokuserar på
              risk, trust och styrning.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <DiffPoint
              title="Nordisk riskmotor"
              text="Byggt för nordiska betalningsmönster, leverantörstyper och momslogik – inte en generisk global lösning."
            />
            <DiffPoint
              title="API-first, utan migration"
              text="Kopplas på ovanpå era befintliga system. Ingen systemflytt, ingen 'big bang'-implementation."
            />
            <DiffPoint
              title="Audit-klara loggar"
              text="Full spårbarhet av varje kontroll. Revision och internkontroll kan få underlag på minuter."
            />
            <DiffPoint
              title="Mänsklig kontroll + AI"
              text="AI varnar för risk, regler säkrar policy, människor tar beslut. Ni styr alltid vad som får gå igenom."
            />
          </div>
        </section>

        {/* BEFORE / AFTER */}
        <section className="mt-20">
          <div className="grid gap-6 md:grid-cols-2">
            <ComparisonCard
              title="Utan Valiflow"
              items={[
                "Manuella stickprov och magkänsla vid fakturakontroll.",
                "Oklart vilka kontroller som faktiskt gjorts per faktura.",
                "Svårt att visa för styrelse eller revisor hur risk hanteras.",
                "Personberoende – en nyckelperson “kan allt i huvudet”.",
              ]}
            />
            <ComparisonCard
              title="Med Valiflow"
              highlight
              items={[
                "Standardiserade kontroller på alla fakturor, varje dag.",
                "Full logg på vad som kontrollerats och resultatet.",
                "Tydliga rapporter kring risk, avvikelser och efterlevnad.",
                "Mindre personberoende – kunskapen sitter i plattformen.",
              ]}
            />
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20 max-w-4xl mx-auto">
          <h2 className="mb-6 text-center text-2xl md:text-3xl font-semibold">
            Vanliga frågor från CFO:er och byråchefer
          </h2>
          <div className="space-y-3">
            <FAQItem
              question="Måste vi byta ERP eller fakturasystem?"
              answer="Nej. Valiflow kopplas på ovanpå era befintliga system via API, SFTP eller inbox-speglade flöden. Ni fortsätter jobba i samma gränssnitt som idag."
            />
            <FAQItem
              question="Hur snabbt kan vi komma igång?"
              answer="Ofta börjar vi med ett pilotbolag där vi kopplar ert befintliga flöde och sätter upp grundkontroller. Därefter kan ni skala till fler bolag, projekt eller kunder."
            />
            <FAQItem
              question="Hur påverkar det här våra medarbetare?"
              answer="Valiflow ersätter inte ekonomer – det tar bort repetitiva kontroller och ger tydligare beslutsunderlag. Ni styr själva vilka kontroller som ska varna."
            />
            <FAQItem
              question="Hur funkar det med GDPR och regelefterlevnad?"
              answer="Plattformen är byggd med dataminimering, loggning och åtkomstkontroller. Vi kan ge teknisk dokumentation, biträdesavtal och stöd inför intern/extern revision."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/5 px-6 py-8 md:px-10 md:py-10 backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_55%)]" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
                  Nästa steg
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold">
                  Se hur Valiflow fungerar på era fakturor
                </h2>
                <p className="text-base text-white/85">
                  Vi utgår från ert nuvarande flöde och visar hur Valiflow kan
                  kopplas på ovanpå – utan att byta system. Pilotupplägg från ett
                  bolag och uppåt.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/pilot"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-[#050C22] px-5 py-2.5 text-sm font-semibold shadow-lg hover:bg-slate-100"
                >
                  Ansök om byråpilot
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/solutions"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
                >
                  Se lösningar för din verksamhet
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

function KpiPill({ label, value, tone }) {
  const toneMap = {
    teal: "bg-emerald-400/15 text-emerald-200 border-emerald-300/40",
    amber: "bg-amber-400/15 text-amber-200 border-amber-300/40",
    red: "bg-red-500/15 text-red-200 border-red-300/40",
  };
  return (
    <div
      className={`rounded-xl border px-3 py-2 text-xs sm:text-sm ${toneMap[tone] || ""}`}
    >
      <p className="text-[11px] uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}

function PillarCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-white/12 bg-white/5 p-5 md:p-6 hover:border-emerald-400/60 hover:-translate-y-0.5 transition backdrop-blur-md">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#071330] ring-1 ring-white/15">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-base md:text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm md:text-base leading-relaxed text-white/80">
        {text}
      </p>
    </div>
  );
}

function StepCard({ icon: Icon, step, title, text }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-[#071330] p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/20">
          <Icon className="h-4 w-4 text-emerald-300" />
        </div>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/70 border border-white/15">
          Steg {step}
        </span>
      </div>
      <h3 className="text-base md:text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm md:text-base leading-relaxed text-white/80">
        {text}
      </p>
    </div>
  );
}

function ModuleCard({ icon: Icon, title, bullets }) {
  return (
    <div className="h-full rounded-3xl border border-white/12 bg-white/5 p-5 md:p-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#071330] ring-1 ring-white/20">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-base md:text-lg font-semibold text-white">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2.5 text-sm md:text-base text-white/80">
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

function IntegrationPill({ label }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/90 backdrop-blur-sm">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {label}
    </div>
  );
}

function SegmentCard({ icon: Icon, label, text }) {
  return (
    <div className="rounded-3xl border border-white/12 bg-[#071330] p-5">
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/20">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <p className="text-base md:text-lg font-semibold text-white">{label}</p>
      </div>
      <p className="text-sm md:text-base leading-relaxed text-white/80">
        {text}
      </p>
    </div>
  );
}

function ComparisonCard({ title, items, highlight }) {
  return (
    <div
      className={`rounded-3xl border p-6 md:p-7 ${highlight
        ? "border-emerald-400/60 bg-emerald-400/10"
        : "border-white/12 bg-white/5"
        } backdrop-blur-md`}
    >
      <h3 className="text-base md:text-lg font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2.5 text-sm md:text-base text-white/85">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[6px] h-1 w-1 flex-none rounded-full bg-white/60" />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FlowStep({ title, subtitle, highlight }) {
  return (
    <div
      className={`w-full max-w-[240px] rounded-xl px-5 py-4 border text-center ${highlight
        ? "bg-emerald-400 text-[#050C22] border-emerald-300"
        : "bg-[#071330] border-white/12 text-white"
        }`}
    >
      <p className="text-base md:text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm md:text-base opacity-80">{subtitle}</p>
    </div>
  );
}

function ResultCard({ metric, description }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/5 p-6 text-center shadow-sm backdrop-blur-md">
      <p className="text-3xl md:text-4xl font-bold text-emerald-300">{metric}</p>
      <p className="mt-2 text-sm md:text-base text-white/80">{description}</p>
    </div>
  );
}

function QuoteCard({ quote, author }) {
  return (
    <div className="rounded-2xl border border-white/12 bg-[#071330] p-6 shadow-sm">
      <p className="text-sm md:text-base text-white/90 italic">“{quote}”</p>
      <p className="mt-3 text-sm font-medium text-white/70">— {author}</p>
    </div>
  );
}

function DiffPoint({ title, text }) {
  return (
    <div className="rounded-xl border border-white/12 bg-white/5 p-6 shadow-sm backdrop-blur-md">
      <h4 className="mb-1 text-base md:text-lg font-semibold text-white">
        {title}
      </h4>
      <p className="text-sm md:text-base text-white/80 leading-relaxed">
        {text}
      </p>
    </div>
  );
}

function FAQItem({ question, answer }) {
  return (
    <details className="group rounded-2xl border border-white/12 bg-white/5 p-4 backdrop-blur-md">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm sm:text-base text-white/90">
        <span>{question}</span>
        <span className="text-xs text-white/60 group-open:hidden">+</span>
        <span className="hidden text-xs text-white/60 group-open:inline">
          −
        </span>
      </summary>
      <p className="mt-2 text-sm md:text-base leading-relaxed text-white/80">
        {answer}
      </p>
    </details>
  );
}
