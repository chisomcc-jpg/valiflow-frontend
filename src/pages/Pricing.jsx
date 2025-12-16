// src/pages/Pricing.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Shield,
  Lock,
  Globe,
  FileCheck,
  Database,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

// Local Tooltip Component for Pricing Page (Dark Mode Optimized)
const PricingTooltip = ({ text }) => (
  <TooltipProvider>
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Info className="w-3.5 h-3.5 text-emerald-400/70 hover:text-emerald-300 cursor-default inline-block ml-1.5 align-middle transform -translate-y-[1px]" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs bg-slate-900 text-white border-slate-700 leading-relaxed p-3 shadow-xl">
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);



export default function PricingPage() {
  const [segment, setSegment] = useState("company");
  const [billingCycle, setBillingCycle] = useState("monthly");

  const computePrice = (price) => {
    if (!price || price === "Offert") return price;
    const numeric = parseInt(price.replace(/\D/g, ""), 10);
    if (Number.isNaN(numeric)) return price;
    const discounted = Math.round(numeric * 0.7);
    return billingCycle === "monthly" ? `${numeric} kr` : `${discounted} kr`;
  };

  /* ============================================================
     🟦 FÖRETAG – PLANER (CONTROL LAYER)
  ============================================================ */
  const companyPlans = [
    {
      name: "Starter",
      price: "1700 kr",
      range: "Upp till 150 fakturor/mån",
      features: [
        "Grundläggande AI-validering",
        "Kontroll av moms & dubbletter",
        "Basal leverantörskoll (Bankgiro/Plusgiro)",
        { text: "Standardlogg", tooltip: "Enkel händelselogg som visar vem som gjorde vad." },
        "Single User Access",
        "MFA-inloggning",
        "Export till Excel",
      ],
      cta: "Säkra flödet",
    },
    {
      name: "Professional",
      price: "3799 kr",
      range: "150–500 fakturor/mån",
      highlight: true,
      badge: "Rekommenderad",
      features: [
        { text: "Active Control™", tooltip: "Systemet stoppar automatiskt utbetalningar om riskscore överstiger er tröskel." },
        { text: "Deterministiska spärrlistor (Guardrails)", tooltip: "Hårda regler (t.ex. Bankgiro-matchning) som AI aldrig får gissa kring." },
        "AI-driven avvikelseanalys",
        "Historisk leverantörsprofilering",
        "3 ERP-integrationer",
        { text: "Prioriterad granskning", tooltip: "Effektivt gränssnitt för att snabbt godkänna eller avvisa riskflaggade fakturor." },
        "Utökad loggning & spårbarhet",
        "API för ekonomisystem",
      ],
      cta: "Starta kontroll",
    },
    {
      name: "Audit / Pro+",
      price: "9 900 kr",
      range: "500–1000 fakturor/mån",
      features: [
        { text: "Forensic Data Snapshots", tooltip: "Immutable (oföränderlig) lagring av exakt beslutsgrund. Håller för juridisk granskning." },
        { text: "CFO Control Dashboard", tooltip: "Realtidsvy över koncernens totala risknivå, stoppade utbetalningar och trender." },
        "ML-baserad bedrägeriprevention",
        { text: "Audit API", tooltip: "Dedikerat API för att ge revisorer och myndigheter 'Read-Only' access till spårbarhetsdata." },
        "Full koncernöversikt",
        "SLA & Dedikerad Success Manager",
        "SSO (Single Sign-On)",
        "Obegränsade integrationer",
      ],
      cta: "Kontakta oss",
    },
    {
      name: "Enterprise",
      price: "Offert",
      range: "1000+ fakturor/mån",
      features: [
        "Skräddarsydda riskmodeller",
        "On-premise / Private Cloud option",
        "Dedikerad utredare vid incidenter",
        "White-label option",
        "Fullständig API-tillgång",
        "Anpassade arbetsflöden",
        { text: "ViDA-compliance paket", tooltip: "Fullt stöd för EU:s kommande krav på VAT in the Digital Age och realtidsrapportering." },
      ],
      cta: "Boka konsultation",
    },
  ];

  /* ============================================================
     🟩 BYRÅ – PLANER (PORTFOLIO ASSURANCE)
  ============================================================ */
  const agencyPlans = [
    {
      name: "Bureau Essential",
      price: "1499 kr",
      range: "Startpaket för mindre byråer",
      features: [
        "Grundläggande riskfilter per kund",
        "Enkel byrå-dashboard",
        "Standardiserad attestprocess",
        "Export av underlag",
        "Upp till 3 användare",
        "Support via e-post",
      ],
      cta: "Bli partner",
    },
    {
      name: "Bureau Control",
      price: "4 995 kr",
      range: "För byråer med aktiv riskhantering",
      highlight: true,
      badge: "Standard för Auktorisation",
      features: [
        "Centraliserad Risk-övervakning",
        { text: "Cross-client Fraud Signals", tooltip: "Få varningar om en leverantör flaggats som bedräglig hos en annan byråkund (anonymiserat)." },
        "Automatiserade avvikelserapporter",
        { text: "Standardiserad 'Trust Process'", tooltip: "Tvingande kontrollsteg för alla konsulter, vilket säkrar byråns kvalitetsstandard." },
        "Obegränsade team-medlemmar",
        "Prioriterad support & onboarding",
        "Kundspecifika regler",
      ],
      cta: "Säkra portföljen",
    },
    {
      name: "Bureau Enterprise",
      price: "14 995 kr",
      range: "För revisionsbyråer & advisory",
      features: [
        "Full Audit & Forensic-svit",
        { text: "Integrerad Advisory-data", tooltip: "Generera rapporter som visar kundens riskprofil jämfört med branschsnitt. Säljbart underlag." },
        "White-label rapporter till kund",
        "Dedikerad Partner Manager",
        "API för revisionsverktyg",
        "Juridisk loggning (Immutable)",
        "Utbildning & certifiering",
      ],
      cta: "Kontakta partneransvarig",
    },
    {
      name: "Network Partner",
      price: "Offert",
      range: "För systemleverantörer & kedjor",
      features: [
        "Inbyggd 'Powered by Valiflow'",
        "Delad intäktsmodell",
        "Djup systemintegration",
        "Gemensam roadmap",
        "Strategisk rådgivning",
      ],
      cta: "Boka möte",
    },
  ];

  const activePlans = segment === "company" ? companyPlans : agencyPlans;

  return (
    <div className="min-h-screen bg-[#050C22] text-white pt-32 pb-24">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 blur-[120px]" />
      </div>

      {/* HEADER / HERO */}
      <header className="max-w-4xl mx-auto px-6 text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 mb-5"
        >
          <Shield className="h-4 w-4 text-emerald-300" />
          <span>Financial Integrity</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>The Control Layer</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
        >
          Ett finansiellt{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-300">
            kontroll-lager
          </span>{" "}
          för moderna bolag.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
          className="mt-5 text-base sm:text-lg text-white/80 max-w-2xl mx-auto"
        >
          Valiflow säkerställer att varje betalning är korrekt, granskad och
          fri från risk. Prissättning baserad på den trygghet vi levererar.
        </motion.p>
      </header>

      {/* SEGMENT + BILLING TOGGLES */}
      <section className="max-w-6xl mx-auto px-6 mb-10">
        {/* Segment Toggle */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-white/85">
              Visa pris för
            </p>
            <div className="inline-flex rounded-full bg-white/5 border border-white/15 backdrop-blur-xl overflow-hidden">
              <button
                onClick={() => setSegment("company")}
                className={`px-6 py-2.5 text-sm font-semibold transition ${segment === "company"
                  ? "bg-white text-[#050C22]"
                  : "text-white/70 hover:text-white"
                  }`}
              >
                Ekonomiavdelningar & bolag
              </button>
              <button
                onClick={() => setSegment("agency")}
                className={`px-6 py-2.5 text-sm font-semibold transition ${segment === "agency"
                  ? "bg-white text-[#050C22]"
                  : "text-white/70 hover:text-white"
                  }`}
              >
                Redovisnings- & revisionsbyråer
              </button>
            </div>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="space-y-1 text-left md:text-right">
            <p className="text-sm font-medium text-white/85">
              Faktureringsintervall
            </p>
            <div className="inline-flex rounded-full bg-white/5 border border-white/15 overflow-hidden">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 text-sm ${billingCycle === "monthly"
                  ? "bg-white text-[#050C22] font-semibold"
                  : "text-white/70 hover:text-white"
                  }`}
              >
                Månadsvis
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 text-sm ${billingCycle === "yearly"
                  ? "bg-white text-[#050C22] font-semibold"
                  : "text-white/70 hover:text-white"
                  }`}
              >
                Årsvis{" "}
                <span className="hidden sm:inline">(30% rabatt)</span>
              </button>
            </div>
            <p className="text-xs text-white/60">
              Priser visas per månad. Årsavtal faktureras årsvis.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-7">
          {activePlans.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
              className={`relative rounded-2xl p-6 md:p-7 border bg-white/5 backdrop-blur-xl flex flex-col ${p.highlight
                ? "border-emerald-400/60 shadow-[0_0_35px_rgba(16,185,129,0.45)]"
                : "border-white/12"
                }`}
            >
              {p.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-400 text-[#050C22] font-semibold text-xs px-4 py-1 rounded-full shadow-lg">
                  {p.badge}
                </div>
              )}

              <h3 className="text-lg md:text-xl font-semibold mb-1">
                {p.name}
              </h3>
              <p className="text-sm text-emerald-300 mb-2">{p.range}</p>

              <div className="flex items-baseline gap-1 mb-3 overflow-hidden">
                <p className="text-3xl md:text-4xl font-bold whitespace-nowrap">
                  {computePrice(p.price)}
                </p>
                {p.price !== "Offert" && (
                  <span className="text-xs text-white/60 whitespace-nowrap">/månad</span>
                )}
              </div>

              {billingCycle === "yearly" && p.price !== "Offert" && (
                <p className="text-[11px] text-emerald-300 mb-3">
                  Faktureras årsvis · ca 30% lägre än månadspris
                </p>
              )}

              <ul className="mt-4 space-y-2.5 text-sm text-white/85 flex-1">
                {p.features.map((f, idx) => {
                  const isObject = typeof f === 'object';
                  const text = isObject ? f.text : f;
                  const tooltip = isObject ? f.tooltip : null;

                  return (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-300 mt-[2px] shrink-0" />
                      <span className="leading-relaxed">
                        {text}
                        {tooltip && <PricingTooltip text={tooltip} />}
                      </span>
                    </li>
                  );
                })}
              </ul>

              {/* CTA */}
              {p.price === "Offert" ? (
                <Link
                  to="/pilot"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white text-[#050C22] py-2.5 text-sm font-semibold shadow hover:bg-slate-100 transition"
                >
                  Ansök om pilot
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  to="/pilot"
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold shadow-sm transition ${p.highlight
                    ? "bg-white text-[#050C22] hover:bg-slate-100"
                    : "bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-300 text-[#050C22] shadow-[0_0_18px_rgba(56,189,248,0.55)] hover:shadow-[0_0_25px_rgba(56,189,248,0.8)]"
                    }`}
                >
                  Ansök om byråpilot
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* “DET HÄR INGÅR ALLTID” */}
      <section className="max-w-6xl mx-auto px-6 mt-16">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 md:p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3 text-center md:text-left">
            DET HÄR INGÅR I ALLA PLANER
          </p>
          <div className="grid md:grid-cols-4 gap-5 text-sm text-white/80">
            <div>
              <p className="font-semibold mb-1">AI-validering av alla fakturor</p>
              <p className="text-white/70 text-sm">
                Riskkontroller, dubbletter, felaktig moms och leverantörsavvikelser på
                varje faktura.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Audit-ready loggar</p>
              <p className="text-white/70 text-sm">
                Spårbarhet för revision, internkontroll och kommande ViDA-krav.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">Ingen bindningstid</p>
              <p className="text-white/70 text-sm">
                Avsluta när du vill. Inga setup-avgifter, inga dolda kostnader.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1">14 dagar gratis</p>
              <p className="text-white/70 text-sm">
                Testa på ert eget fakturaflöde innan ni bestämmer er.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER-CTA FÖR BYRÅER */}
      {segment === "agency" && (
        <section className="max-w-4xl mx-auto mt-16 px-6">
          <div className="rounded-2xl border border-emerald-400/50 bg-white/5 shadow-[0_0_25px_rgba(16,185,129,0.35)] p-7 text-center">
            <h3 className="text-2xl font-bold mb-3">
              🏆 Bli Valiflow Partnerbyrå
            </h3>
            <p className="text-white/75 text-sm sm:text-base max-w-2xl mx-auto mb-6">
              Få rabatter per kundbolag, onboarding-stöd, prioriterad support och
              beta-access till nya funktioner. Bygg en skalbar ViDA- och fakturakontrolltjänst
              ovanpå alla dina kunder.
            </p>
            <Link
              to="/partner"
              className="inline-flex items-center gap-2 bg-white text-[#050C22] font-semibold px-7 py-3 rounded-full shadow-md hover:bg-slate-100 text-sm sm:text-base"
            >
              Läs mer om partnerprogrammet
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      )}

      {/* TRUST / SECURITY STRIP */}
      <section className="max-w-5xl mx-auto mt-18 px-6 mt-16">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center text-xs sm:text-sm text-white/80">
          <TrustItem icon={Shield} label="GDPR-säkert" />
          <TrustItem icon={Lock} label="AES-256-kryptering" />
          <TrustItem icon={Globe} label="EU-hosting" />
          <TrustItem icon={FileCheck} label="Full revisionslogg" />
          <TrustItem icon={Database} label="ViDA-förberett" />
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-white/85 font-medium flex items-center justify-center gap-2">
            <Search className="h-4 w-4 text-emerald-300" />
            100% transparent prissättning – inga bindningstider, inga setup-avgifter,
            inga dolda kostnader.
          </p>
        </div>
      </section>

      {/* FAQ OM PRIS */}
      <section className="max-w-4xl mx-auto mt-18 px-6 mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
          Vanliga frågor om prissättning
        </h2>
        <p className="text-white/70 text-sm sm:text-base text-center mb-6 max-w-2xl mx-auto">
          Här är svar på de vanligaste frågorna från CFO:er, ekonomichefer och
          byråpartners.
        </p>
        <div className="space-y-3">
          <FAQItem
            question="Vad händer om vi går upp eller ner i antal fakturor?"
            answer="Planerna är gjorda för typiska intervall. Om ni under flera månader konsekvent ligger över eller under ert intervall justerar vi tillsammans, utan överraskande fakturor."
          />
          <FAQItem
            question="Måste vi teckna årsavtal?"
            answer="Nej. Ni kan köra månadsvis utan bindningstid. Årsavtal ger lägre pris (ca 30%) och är vanligast för bolag som valt att lägga sitt trust layer permanent i Valiflow."
          />
          <FAQItem
            question="Vad ingår i en pilot?"
            answer="Vi kopplar ert fakturaflöde, sätter upp grundkontroller och går igenom resultat tillsammans. Ni får ett konkret beslutsunderlag innan ni bestämmer er."
          />
          <FAQItem
            question="Har ni volym- och koncernpriser?"
            answer="Ja. För större byråer eller koncerner med många bolag gör vi en offert baserat på volym, integrationsbehov och supportnivå."
          />
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="mt-20 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl border border-white/15 bg-gradient-to-r from-blue-700 to-emerald-500 px-6 py-10 md:px-10 md:py-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            Redo att lägga ett trust layer över dina fakturor?
          </h2>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl mx-auto mb-7">
            Testa Valiflow gratis i 14 dagar – koppla ditt ekonomisystem, kör riktiga
            fakturor och se hur många risker som fångas innan betalning.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/pilot"
              className="inline-flex items-center gap-2 bg-white text-[#050C22] font-semibold px-8 py-3 rounded-full text-sm sm:text-base hover:bg-slate-100 shadow-md"
            >
              Ansök om byråpilot
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/pilot"
              className="inline-flex items-center gap-2 border border-white/80 text-white font-semibold px-8 py-3 rounded-full text-sm sm:text-base hover:bg-white/10"
            >
              Starta ansökan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ───────────── Subcomponents ───────────── */

function TrustItem({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center text-white/80">
      <Icon className="h-5 w-5 text-emerald-300 mb-1" />
      <span className="text-xs sm:text-sm">{label}</span>
    </div>
  );
}

function FAQItem({ question, answer }) {
  return (
    <details className="group rounded-2xl border border-white/12 bg-white/5 p-4 text-left">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm sm:text-base text-white/90">
        <span>{question}</span>
        <span className="text-xs text-white/60 group-open:hidden">+</span>
        <span className="hidden text-xs text-white/60 group-open:inline">
          −
        </span>
      </summary>
      <p className="mt-2 text-sm text-white/75 leading-relaxed">
        {answer}
      </p>
    </details>
  );
}
