// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  LineChartIcon,
  CheckCircle,
  PlayCircle,
  Users,
  FileSearch,
  Sparkles,
} from "lucide-react";
import TrustLayerDiagram from "../components/TrustLayerDiagram"; // New detailed diagram

export default function Home() {
  return (
    <div className="bg-[#050C22] text-white min-h-screen">
      {/* HERO */}
      <header className="pt-40 pb-24 px-6 text-center relative overflow-hidden bg-gradient-to-b from-[#050C22] via-[#071330] to-[#050C22]">
        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/20 blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* EYEBROW */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 mb-5"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            <span>The Trust Layer for Finance</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mx-auto"
          >
            Ett standardiserat Trust Layer
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-300">
              för hela din kundportfölj.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-6 text-base sm:text-lg text-white/80 max-w-2xl mx-auto"
          >
            Automatisera finansiell kontroll, minska byråns ansvar och paketera ViDA-compliance
            som en skalbar rådgivningstjänst.
            <br />
            <span className="block mt-4 text-white/50 text-sm font-medium">
              För byråägare, företag och ansvariga revisorer.
            </span>
          </motion.p>

          {/* HERO CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/pilot"
              className="px-8 py-4 rounded-full bg-white text-[#050C22] font-semibold shadow-lg hover:bg-slate-100 transition flex items-center gap-2 text-sm sm:text-base"
            >
              Starta byråpilot (Gratis) <ArrowRight className="h-5 w-5" />
            </Link>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                to="/demo/story"
                className="px-8 py-4 rounded-full border border-white/25 text-white/90 font-semibold hover:bg-white/10 transition flex items-center gap-2 text-sm sm:text-base"
              >
                <PlayCircle className="h-5 w-5" />
                Se hur Valiflow fungerar (60 sek)
              </Link>
            </motion.div>
          </motion.div>

          {/* TRUST STRIP */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-white/60">
            <span>🔒 GDPR & bankklassad kryptering</span>
            <span>📜 Data redo för ViDA & EU-krav</span>
            <span>🇸🇪 Utvecklat i Sverige</span>
          </div>

          {/* HERO MOCKUP: FÖRETAGSÖVERSIKT */}
          <ValiflowHeroMockup />
        </div>
      </header>

      {/* SOCIAL PROOF LOGOS */}
      <section className="py-12 px-6 bg-[#050C22] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6 text-center">
            ANVÄNDS AV REVISIONSBYRÅER OCH DERAS KUNDER INOM BYGG, ENERGI OCH INDUSTRI
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-items-center">
            {[
              { name: "Aurelius Accounting", src: "/logos/aurelius.png" },
              { name: "Finrevision Partners", src: "/logos/finrevision.png" },
              { name: "Nordvent Energy Group", src: "/logos/nordvent.png" },
              { name: "Byggledger AB", src: "/logos/byggledger.png" },
              { name: "Skandia Industrial Systems", src: "/logos/scandia.png" },
            ].map((logo) => (
              <div key={logo.name} className="flex flex-col items-center gap-2">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-10 object-contain opacity-80"
                />
                <span className="text-[11px] text-white/50 text-center">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="py-24 px-6 bg-[#050C22] border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr,1fr] gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center lg:text-left">
              Ett enhetligt arbetssätt – för alla kunder
            </h2>
            <p className="text-white/70 mb-10 text-sm sm:text-base text-center lg:text-left">
              Valiflow standardiserar kontrollflödet oavsett vilket ERP kunden använder.
              Ingen migration, bara säkrare processer och skalbar rådgivning.
            </p>

            <div className="space-y-5">
              {[
                {
                  title: "1. Anslut hela klientfloran",
                  text: "Standardiserad anslutning mot Fortnox, Visma och Business Central. En onboarding-process för alla bolag.",
                  icon: <PlugIconSmall />,
                },
                {
                  title: "2. Portfolio-Wide Audit i realtid",
                  text: "Valiflow övervakar betalströmmar över hela portföljen. AI flaggar avvikelser, momsfel och riskleverantörer.",
                  icon: <FileSearch className="h-5 w-5 text-sky-300" />,
                },
                {
                  title: "3. Leverera Advisory-Ready Insikter",
                  text: "Färdiga underlag gör att juniorkonsulter kan leverera senior rådgivning och viDA-rapporter direkt.",
                  icon: <Users className="h-5 w-5 text-emerald-300" />,
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="mt-1">{step.icon}</div>
                  <div className="text-left">
                    <p className="font-semibold text-sm sm:text-base">
                      {step.title}
                    </p>
                    <p className="text-white/70 text-xs sm:text-sm mt-1">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* HOW-IT-WORKS ILLUSTRATION: TRUST LAYER DIAGRAM */}
          <div className="hidden md:block h-full">
            <TrustLayerDiagram />
          </div>
        </div>
      </section>

      {/* VALUE SECTION / ROI */}
      <section
        id="value"
        className="py-24 px-6 bg-[#050C22] text-center border-t border-white/5"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Mätbart värde för byrå och slutkund
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto mb-10 text-sm sm:text-base">
          En mellanstor redovisningsbyrå med 100+ kunder granskar tiotusentals fakturor årligen.
          Valiflow säkerställer att varje kontroll följer samma logik, är spårbar och kan förklaras vid revision
          – oavsett vilken konsult som utförde arbetet.
        </p>

        <div className="grid sm:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { value: "100 %", label: "full audit trail i alla bolag" },
            { value: "Skalbar", label: "ViDA-tjänst utan extra timmar" },
            { value: "-60 %", label: "tid lagd på manuell kontroll" },
            { value: "Enhetlig", label: "kvalitetsnivå över hela byrån" },
          ].map((kpi, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <p className="text-2xl sm:text-3xl font-bold">{kpi.value}</p>
              <p className="text-white/70 mt-1 text-sm">{kpi.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        className="py-24 px-6 bg-[#071330] border-t border-white/10"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
            Vad säger byråledare och partners?
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto mb-10 text-center">
            Valiflow används av framsynta byråer för att stärka sin rådgivning och minimera risk.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                company: "Aurelius Accounting",
                logo: "/logos/aurelius.png",
                industry: "Redovisningsbyrå",
                quote:
                  "Vi har integrerat Valiflow för alla kundbolag. Det är inte bara en kontroll – det är en del av vårt premiumerbjudande.",
                name: "Lina Åkesson",
                role: "VD",
              },
              {
                company: "Finrevision Partners",
                logo: "/logos/finrevision.png",
                industry: "Revisionsbyrå",
                quote:
                  "Valiflow gav oss ett strukturerat trust layer och gjorde våra kunders revision tre gånger snabbare och säkrare.",
                name: "Johan Eklöf",
                role: "Partner",
              },
              {
                company: "Nordvent Energy Group",
                logo: "/logos/nordvent.png",
                industry: "Energi (Slutkund)",
                quote:
                  "Valiflow fångade felaktiga momsberäkningar som kostat oss hundratusentals kronor. Det här är vår trygga punkt.",
                name: "Anders Holm",
                role: "CFO",
              }
            ].map((t) => (
              <div
                key={t.company}
                className="rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={t.logo}
                    alt={t.company}
                    className="h-8 object-contain opacity-80"
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold">{t.company}</p>
                    <p className="text-[11px] text-white/60">{t.industry}</p>
                  </div>
                </div>
                <p className="text-sm text-white/80 italic mb-4 flex-1">
                  “{t.quote}”
                </p>
                <p className="text-xs text-white/60">
                  {t.role} • {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR BUREAUS (COMMERCIAL MODEL) */}
      <section
        id="bureaus"
        className="py-24 px-6 bg-[#071330] border-t border-white/10"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold mb-3 text-left">
              Paketera Trust som en tjänst
            </h2>
            <p className="text-white/70 text-sm sm:text-base mb-6 text-left">
              Valiflow är inte bara en kostnad för byrån – det är en intäktsström.
              Paketera ViDA-compliance och fakturakontroll som en skalbar tjänst.
            </p>
            <ul className="space-y-3 text-sm text-white/80 text-left">
              <li>• Koppla hundratals kundbolag via samma plattform.</li>
              <li>• Vitlabelade rapporter: “VAT Integrity Report – Powered by Valiflow”.</li>
              <li>• Minska brandkårsutryckningar vid revision och skatterevision.</li>
              <li>• Skapa nya intäktsströmmar utan fler timmar i tidrapporten.</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#050C22] text-sm font-semibold hover:bg-slate-100"
              >
                Boka partnersamtal <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/25 text-white/80 text-sm hover:bg-white/5"
              >
                Se byråpriser
              </Link>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
              CASE · BYRÅKUND
            </p>
            <p className="text-lg font-semibold mb-3">
              “Vi gick från ad hoc-kontroller till ett strukturerat trust layer.”
            </p>
            <p className="text-white/75 text-sm mb-4">
              En mellanstor redovisningsbyrå inom bygg hanterade över 8 000
              leverantörsfakturor per månad. Med Valiflow flyttades kontrollen från
              manuell stickprovskontroll till 100 % automatiserad validering av alla fakturor.
            </p>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <FakeKpi label="Manuell kontroll" value="-78 %" />
              <FakeKpi label="Fel hittade innan betalning" value="+34 %" />
              <FakeKpi label="Tid till revisionsunderlag" value="-60 %" />
            </div>
            <div className="mt-4 text-xs text-white/60">
              <p>CFO, byggkund via redovisningsbyrå (pilot 2025)</p>
            </div>
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section
        id="integrations"
        className="py-24 px-6 bg-[#050C22] text-center border-t border-white/10"
      >
        <h2 className="text-3xl font-bold mb-4">Integrerar med ditt ekonomisystem</h2>
        <p className="text-white/70 mb-10 text-sm sm:text-base max-w-2xl mx-auto">
          Inga nya system. Ingen utbildning. Valiflow lägger sig som ett trust layer
          ovanpå dina befintliga ERP-lösningar.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-white/80 mb-10">
          {[
            { name: "Fortnox", short: "F" },
            { name: "Visma.net", short: "V" },
            { name: "Business Central", short: "BC" },
            { name: "Microsoft 365", short: "M365" },
          ].map(({ name, short }) => (
            <div
              key={name}
              className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm text-sm font-medium"
            >
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center text-[11px] font-semibold tracking-tight">
                  {short}
                </div>
                <span className="text-white/90">{name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECURITY & COMPLIANCE */}
      <section className="py-20 px-6 bg-[#050C22] border-t border-white/10">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-1 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-3">Säkerhet & compliance först</h3>
            <p className="text-white/70 text-sm sm:text-base">
              Valiflow är byggt som ett trust layer – med full transparens, revisionbarhet
              och dataskydd som standard.
            </p>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-3 gap-6 text-sm">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="font-semibold mb-1">GDPR & dataskydd</p>
              <p className="text-white/70">
                All data hanteras inom EU med stark kryptering i transit och i vila.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="font-semibold mb-1">Revisionsspår</p>
              <p className="text-white/70">
                Varje flagga, beslut och ändring loggas för intern kontroll och extern audit.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="font-semibold mb-1">ViDA-förberett</p>
              <p className="text-white/70">
                Designat för kommande EU-krav på digital rapportering och realtidsvalidering.
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <p className="text-white/70 text-sm max-w-2xl mx-auto">
            Felaktiga leverantörsbetalningar är ett växande problem i takt med ökad automatisering.
            Valiflow ger byråer ett strukturerat beslutsunderlag som minskar risken och gör varje granskning spårbar – även när ansvar delas mellan flera konsulter.
          </p>
        </div>
      </section >

      {/* CTA FOOTER */}
      < section className="py-24 px-6 text-center bg-gradient-to-r from-blue-700 to-emerald-500 border-t border-white/10" >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Redo att lägga ett trust layer över dina fakturor?
        </h2>
        <p className="text-white/90 text-sm sm:text-lg max-w-xl mx-auto mb-8">
          Testa Valiflow gratis i 14 dagar – ingen bindningstid, ingen begränsad
          funktion. Koppla ditt ekonomisystem på några minuter.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/pilot"
            className="inline-flex items-center gap-2 bg-white text-[#050C22] font-semibold px-8 py-4 rounded-full text-sm sm:text-lg hover:bg-slate-100 shadow-md"
          >
            Starta gratis pilot <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/demo"
            className="inline-flex items-center gap-2 border border-white/80 text-white font-semibold px-8 py-4 rounded-full text-sm sm:text-lg hover:bg-white/10"
          >
            Se hur Valiflow säkrar flödet
          </Link>
        </div>
      </section >

      {/* FOOTER */}
      < footer className="bg-[#050C22] border-t border-white/10 py-8 text-center text-white/60 text-sm" >
        <p>© 2025 Valiflow AB — The Trust Layer for Finance</p>
      </footer >

    </div >
  );
}

/* --- Data & hjälpfunktioner --- */

const TESTIMONIALS = [
  {
    company: "Nordvent Energy Group",
    logo: "/logos/nordvent.png",
    industry: "Energi",
    quote:
      "Valiflow fångade felaktiga momsberäkningar som kostat oss hundratusentals kronor. Det här är vår trygga punkt innan betalning.",
    name: "Anders Holm",
    role: "CFO",
  },
  {
    company: "Byggledger AB",
    logo: "/logos/byggledger.png",
    industry: "Bygg & entreprenad",
    quote:
      "Vi sparar över 40 timmar i månaden tack vare automatiserad fakturavalidering. Våra projektledare slipper dubbelarbete.",
    name: "Sara Lind",
    role: "Ekonomiansvarig",
  },
  {
    company: "Finrevision Partners",
    logo: "/logos/finrevision.png",
    industry: "Revisionsbyrå",
    quote:
      "Valiflow gav oss ett strukturerat trust layer och gjorde våra kunders revision tre gånger snabbare.",
    name: "Johan Eklöf",
    role: "Partner",
  },
  {
    company: "Skandia Industrial Systems",
    logo: "/logos/scandia.png",
    industry: "Industriföretag",
    quote:
      "Flaggorna är klockrena. AI:n hittade en leverantörsanomali som vårt ERP totalt missade.",
    name: "Maria Ekström",
    role: "Financial Controller",
  },
  {
    company: "Aurelius Accounting",
    logo: "/logos/aurelius.png",
    industry: "Redovisningsbyrå",
    quote:
      "Vi har integrerat Valiflow för alla kundbolag. Mindre manuell kontroll, färre fel och gladare kunder.",
    name: "Lina Åkesson",
    role: "VD",
  },
];

function FakeKpi({ label, value, variant }) {
  let color =
    variant === "warn"
      ? "text-amber-300"
      : variant === "good"
        ? "text-emerald-300"
        : "text-white";
  return (
    <div className="rounded-lg bg-black/20 border border-white/10 p-2 text-left">
      <p className="text-[11px] text-white/60">{label}</p>
      <p className={`text-sm font-semibold ${color}`}>{value}</p>
    </div>
  );
}

// enkel “plug”-ikon för steg 1 i how-it-works
function PlugIconSmall() {
  return (
    <div className="h-7 w-7 rounded-full bg-blue-500/20 border border-blue-300/40 flex items-center justify-center">
      <span className="h-3 w-3 rounded-sm bg-blue-300" />
    </div>
  );
}

// HERO-MOCKUP: Företagsöversikt för CFO
function ValiflowHeroMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mt-14 max-w-5xl mx-auto text-left"
    >
      <div className="rounded-2xl bg-[#071330] border border-white/10 shadow-2xl backdrop-blur-md p-5">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4 text-xs text-white/70">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-blue-500/20 border border-blue-300/40 flex items-center justify-center text-[10px] font-semibold">
              VF
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium text-white/80">
                Valiflow · Företagsöversikt
              </span>
              <span className="hidden sm:inline-flex items-center gap-2 text-[11px] text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Trust layer active
              </span>
            </div>
          </div>
          <span className="rounded-full px-2.5 py-1 bg-emerald-400/10 text-emerald-200 border border-emerald-300/30 text-[11px]">
            Live-data · 30 dagar
          </span>
        </div>

        {/* Nav tabs */}
        <div className="flex items-center gap-4 text-[11px] mb-4">
          {["Översikt", "Fakturor", "Risk & alerts", "AI-assistent"].map(
            (tab, idx) => (
              <span
                key={tab}
                className={
                  idx === 0
                    ? "px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/90"
                    : "px-3 py-1 rounded-full text-white/50 hover:text-white/80"
                }
              >
                {tab}
              </span>
            )
          )}
        </div>

        {/* KPI row */}
        <div className="grid md:grid-cols-4 gap-4 mb-5">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-[11px] text-white/60">Totalt antal fakturor</p>
            <p className="text-lg font-semibold mt-1">523</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-[11px] text-white/60">
              Totalt fakturabelopp (30 dagar)
            </p>
            <p className="text-lg font-semibold mt-1">1,4 Mkr</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-[11px] text-white/60">Flaggade fakturor</p>
            <p className="text-lg font-semibold mt-1 text-amber-300">12</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-[11px] text-white/60">AI Riskindex (snitt)</p>
            <p className="text-lg font-semibold mt-1 text-emerald-300">3%</p>
          </div>
        </div>

        {/* AI analysis bar (utan robot-emoji) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-5 text-xs flex flex-wrap items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 border border-emerald-300/40">
            <Sparkles className="h-3 w-3 text-emerald-300" />
          </span>
          <span className="text-white/70">
            Valiflow analyserade{" "}
            <span className="font-semibold text-white">523</span> fakturor.{" "}
            <span className="text-amber-300 font-semibold">12 fakturor</span>{" "}
            flaggades för granskning.{" "}
            <span className="text-sky-300 underline decoration-dotted">
              Visa detaljer →
            </span>
          </span>
        </div>

        {/* Graph + latest flags */}
        <div className="grid md:grid-cols-[1.4fr,1fr] gap-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-600/25 via-sky-500/10 to-emerald-400/10 border border-white/10 p-4 h-40 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-white/70 mb-2">
              <span className="font-medium">
                AI Riskindex (Trust vs. Risk – 30 dagar)
              </span>
              <span className="text-white/50">per leverantör</span>
            </div>
            <div className="flex items-end gap-1 h-full">
              {[18, 32, 12, 26, 9, 22, 14, 30, 11, 24].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-full bg-sky-400/60"
                  style={{ height: `${h + 20}%`, opacity: 0.4 + i * 0.03 }}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-white/70 font-medium mb-2">
              Senaste flaggade fakturor
            </p>
            <div className="space-y-2 text-xs">
              {[
                {
                  msg: "Onormalt hög moms på projekt LEV-2031",
                  tag: "Kräver granskning",
                  tone: "amber",
                },
                {
                  msg: "Bankuppgifter avviker från historik (leverantör i Polen)",
                  tag: "Hög risk",
                  tone: "red",
                },
                {
                  msg: "Ny leverantör utan tidigare historik > 250 000 kr",
                  tag: "Manuell kontroll",
                  tone: "sky",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10"
                >
                  <span className="text-white/75 leading-snug pr-3">
                    {f.msg}
                  </span>
                  <span
                    className={`text-[11px] whitespace-nowrap ${f.tone === "red"
                      ? "text-red-300"
                      : f.tone === "sky"
                        ? "text-sky-300"
                        : "text-amber-300"
                      }`}
                  >
                    {f.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
