// src/pages/Solutions.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  Building2,
  LineChart,
  Landmark,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ArrowUp,
} from "lucide-react";

const sectionVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.35, ease: "easeOut" },
  }),
};

export default function Solutions() {
  const [showTopButton, setShowTopButton] = useState(false);
  const location = useLocation();

  // ✅ Scrolla till rätt sektion när hash ändras (/solutions#ekonomi, #byraer, #enterprise)
  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [location.hash]);

  // ✅ Visa "scroll to top" knappen när man scrollar ner
  useEffect(() => {
    const onScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050C22] text-white">
      {/* Top gradient background (matchar Home) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-72 bg-gradient-to-b from-[#050C22] via-[#071330] to-[#050C22]" />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-24 md:pt-32 scroll-smooth">
        {/* Page header */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-white/80">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <span>Solutions</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>Valiflow – The Trust Layer for Finance</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Lösningar för ekonomiavdelningar, byråer
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-300">
                och koncerner med mycket fakturaflöde.
              </span>
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-white/80">
              Valiflow lägger sig som ett trust layer ovanpå dina befintliga
              ekonomisystem. Samma plattform – olika vyer och flöden för
              ekonomiavdelningar, redovisningsbyråer och större koncerner som
              hanterar hundratals till tusentals leverantörsfakturor per månad.
            </p>
          </div>
        </motion.header>

        {/* Quick “pill” nav */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35, ease: "easeOut" }}
          className="mt-10 flex flex-wrap gap-3 text-sm"
        >
          <PillLink href="#ekonomi" label="Ekonomiavdelningar" />
          <PillLink href="#byraer" label="Redovisningsbyråer" />
          <PillLink href="#enterprise" label="Enterprise & koncern" />
        </motion.div>

        {/* “Vilka passar Valiflow?” strip – mer konkret än omsättning */}
        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 sm:px-6 sm:py-5">
          <p className="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase mb-3">
            VILKA PASSAR VALIFLOW?
          </p>
          <div className="grid gap-4 sm:grid-cols-3 text-xs sm:text-sm text-white/80">
            <SolutionFit
              title="Ekonomiavdelningar"
              text="100–5 000 leverantörsfakturor per månad och höga krav på kontroll före betalning."
            />
            <SolutionFit
              title="Redovisnings- & revisionsbyråer"
              text="Många kundbolag, återkommande revisioner och behov av standardiserade kontroller."
            />
            <SolutionFit
              title="Koncern & grupp"
              text="Flera bolag, splittrade ERP-miljöer och behov av en gemensam risk- och compliance-vy."
            />
          </div>
        </section>

        {/* Sections */}
        <div className="mt-14 space-y-16 md:space-y-20">
          {/* Ekonomi */}
          <SectionBlock
            id="ekonomi"
            icon={Building2}
            eyebrow="För ekonomiavdelningar"
            title="Ett trust layer ovanpå ditt ERP – utan migration"
            description="Valiflow kopplas mot ert befintliga ekonomisystem och validerar varje faktura innan bokföring och betalning. Fokus: färre felbetalningar, bättre revisionsspår och mindre personberoende."
            featureItems={[
              {
                title: "Fakturavalidering innan betalning",
                text: "Automatisk kontroll av ändrat Bankgiro, moms, leverantör, belopp och dubbletter innan betalfil skapas.",
              },
              {
                title: "Policyer som efterlevs automatiskt",
                text: "Attestregler, beloppsgränser och leverantörspolicyer översätts till faktiska kontroller.",
              },
              {
                title: "Audit-ready loggar",
                text: "Full revisionskedja per faktura – vilka kontroller som körts och varför något flaggats.",
              },
            ]}
            highlightTitle="Transparens mot CFO och styrelse"
            highlightBadge="Ekonomiavdelning"
            highlightBullets={[
              "Riskindex per leverantör och kategori",
              "Före/efter-analys av felbetalningar",
              "Export till revisor, internkontroll eller styrelserapporter",
            ]}
            kpi={{
              label: "Typisk effekt efter 60 dagar",
              items: [
                "−40 % manuell fakturakontroll",
                "+25 % fel upptäckta före betalning",
                "Revisionsunderlag på minuter istället för dagar",
              ],
            }}
          />

          {/* Byråer */}
          <SectionBlock
            id="byraer"
            icon={LineChart}
            eyebrow="För redovisningsbyråer"
            title="Sälj trygghet som en tjänst"
            description="Låt Valiflow bli byråns centrala kontrollmotor. Erbjud Trust Services till era kunder – automatiserad kontroll, dokumenterad spårbarhet och tydliga riskinsikter."
            featureItems={[
              {
                title: "En kontrollmotor – många klienter",
                text: "Sätt upp standardkontroller en gång och återanvänd dem på hundratals bolag.",
              },
              {
                title: "Nya intäktsströmmar",
                text: "Paketera ViDA-förberedd datavalidering, avvikelsehantering och riskrapporter som en premiumtjänst.",
              },
              {
                title: "Effektivare revision",
                text: "Strukturerade flaggor och revisionsspår minskar brandkårsutryckningar vid revision.",
              },
            ]}
            highlightTitle="Byråns trust layer-plattform"
            highlightBadge="Redovisningsbyråer"
            highlightBullets={[
              "Samlad riskvy för alla klientbolag",
              "Flaggor för onormala leverantörer och konton",
              "Vitlabelade “VAT Integrity Reports – Powered by Valiflow”",
            ]}
            kpi={{
              label: "Typisk effekt per byråteam",
              items: [
                "−50–70 % manuella stickprov",
                "Mer rådgivningstid, mindre “data-jakt”",
                "Nya advisory-tjänster utan fler timmar i tidrapporten",
              ],
            }}
          />

          {/* Enterprise */}
          <SectionBlock
            id="enterprise"
            icon={Landmark}
            eyebrow="Enterprise & koncern"
            title="Koncernperspektiv på risk, policy och leverantörer"
            description="Valiflow ger en sammanhållen vy av risk, efterlevnad och leverantörsflöden över flera bolag och ERP-miljöer – utan att ni behöver byta system."
            featureItems={[
              {
                title: "Koncernövergripande riskvy",
                text: "Se risknivåer per bolag, region eller leverantörskategori – i realtid.",
              },
              {
                title: "Standardiserade kontroller",
                text: "Gemensamma regelverk som appliceras på alla bolag, med lokala avvikelser när det behövs.",
              },
              {
                title: "Förberett för framtida krav",
                text: "Designat för ViDA, digital rapportering och ökade krav på realtidsvalidering.",
              },
            ]}
            highlightTitle="Styrning utan att bromsa verksamheten"
            highlightBadge="Enterprise"
            highlightBullets={[
              "Policykontroller utan ERP-byte",
              "Börja med ett pilotbolag och skala upp",
              "Koncern-KPI:er för risk, avvikelser och compliance",
            ]}
            kpi={{
              label: "Strategisk effekt",
              items: [
                "Mindre beroende av enskilda nyckelpersoner",
                "En datamodell för hela gruppen",
                "Bättre position inför reglering och due diligence",
              ],
            }}
          />
        </div>

        {/* Bottom CTA */}
        <ClosingCTA />

        {/* Scroll-to-top button */}
        {showTopButton && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/25 text-white shadow-xl hover:bg:white/20 transition"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}
      </main>
    </div>
  );
}

/* ------- Small components ------- */

function PillLink({ href, label }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      }}
      className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/85 shadow-sm transition hover:border-emerald-400/70 hover:text-emerald-200"
    >
      {label}
    </a>
  );
}

function SolutionFit({ title, text }) {
  return (
    <div className="text-left">
      <p className="text-sm font-semibold text-white/90 mb-1">{title}</p>
      <p className="text-xs sm:text-sm text-white/75 leading-relaxed">{text}</p>
    </div>
  );
}

/* ------- Section block component ------- */

function SectionBlock({
  id,
  icon,
  eyebrow,
  title,
  description,
  featureItems,
  highlightTitle,
  highlightBullets,
  highlightBadge,
  kpi,
}) {
  const Icon = icon;
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={sectionVariant}
      custom={id === "ekonomi" ? 0 : id === "byraer" ? 1 : 2}
      className="scroll-mt-28 space-y-6"
    >
      <SectionHeader
        icon={Icon}
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] items-start">
        <FeatureList items={featureItems} />
        <div className="space-y-4">
          <RightHighlightCard
            title={highlightTitle}
            bullets={highlightBullets}
            badge={highlightBadge}
          />
          {kpi && <KpiStrip label={kpi.label} items={kpi.items} />}
        </div>
      </div>
    </motion.section>
  );
}

/* ------- UI Components ------- */

function SectionHeader({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 ring-1 ring-white/15">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-xl sm:text-2xl md:text-3xl font-semibold">
            {title}
          </h2>
        </div>
      </div>
      <p className="max-w-xl text-sm sm:text-base text-white/75 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function FeatureList({ items }) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-[#071330] px-5 py-5 sm:px-6 sm:py-6">
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-3">
          <div className="mt-1">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-semibold text-white">
              {item.title}
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-white/75">
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function RightHighlightCard({ title, bullets, badge }) {
  return (
    <div className="h-full rounded-3xl border border-white/12 bg-white/5 px-5 py-5 sm:px-6 sm:py-6">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[11px] font-medium text-white/85">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {badge}
      </div>
      <h3 className="mt-4 text-sm sm:text-base font-semibold text-white">
        {title}
      </h3>
      <ul className="mt-3 space-y-2.5 text-xs sm:text-sm text-white/75">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[7px] h-1 w-1 flex-none rounded-full bg-emerald-300" />
            <span className="leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function KpiStrip({ label, items }) {
  return (
    <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-4 sm:px-5 sm:py-4">
      <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100 mb-2">
        {label}
      </p>
      <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-50/95">
        {items.map((i) => (
          <li key={i} className="leading-relaxed">
            • {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ClosingCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mt-18 md:mt-20"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-r from-blue-700/60 via-sky-500/50 to-emerald-500/60 px-6 py-8 md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.4),_transparent_55%)]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-sky-100/90">
              Nästa steg
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
              Se hur Valiflow fungerar på just ert fakturaflöde
            </h2>
            <p className="text-sm sm:text-base text-sky-50/95">
              Vi utgår från ert nuvarande ERP och fakturaflöde och visar hur
              Valiflow kan lägga sig som ett trust layer – utan systembyte.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/signup"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#050C22] px-6 py-3 text-sm sm:text-base font-semibold shadow-md hover:bg-slate-100"
            >
              Starta gratis test
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/demo"
              className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/5 px-5 py-3 text-sm sm:text-base font-semibold text-white hover:bg-white/10"
            >
              Se Demo
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
