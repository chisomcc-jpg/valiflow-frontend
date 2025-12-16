// src/pages/CompliancePage.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  FileCheck,
  AlertTriangle,
  Globe,
  CheckCircle,
} from "lucide-react";

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-[#050C22] text-white">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-32">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-6 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs text-white/80 backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
            <span>Compliance & säkerhet</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Trygghet, efterlevnad & datasäkerhet – som standard
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-white/80">
            Valiflow är byggt för att möta de högsta kraven på integritet,
            dataskydd och regelefterlevnad inom EU. Vi ser till att varje
            faktura, leverantör och betalning är korrekt, spårbar och säker.
          </p>
        </motion.header>

        {/* SECTIONS */}
        <div className="mt-20 space-y-16">
          {/* EU & REGULATION */}
          <Section
            icon={<Globe className="h-6 w-6 text-sky-300" />}
            title="Regulatorisk efterlevnad"
          >
            <p className="text-white/70 leading-relaxed">
              Vi följer relevanta EU-regler för finansiell rapportering,
              dataskydd och fakturahantering. Plattformen är byggd för
              regelefterlevnad från dag ett.
            </p>

            <ul className="mt-3 space-y-2 text-white/80">
              <li>• GDPR & Schrems II – full dataskyddskompatibilitet.</li>
              <li>• ViDA – realtidsvalidering av momsdata för ren datakvalitet.</li>
              <li>• E-faktura & PEPPOL-standarder.</li>
              <li>• Bokföringslagen – säkrad loggning och lagring.</li>
              <li>• COSO-inspirerad internkontroll för audit & risk.</li>
            </ul>
          </Section>

          {/* GDPR */}
          <Section
            icon={<Lock className="h-6 w-6 text-emerald-300" />}
            title="Dataskydd (GDPR)"
          >
            <p className="text-white/70 leading-relaxed">
              Vi hanterar ekonomidata för företag och leverantörer – men aldrig
              mer än vad syftet kräver. All hantering följer EU:s
              dataskyddsförordning och våra kunders biträdesavtal.
            </p>

            <ul className="mt-3 space-y-2 text-white/80">
              <li>• Dataminimering – endast nödvändig fakturadata lagras.</li>
              <li>• Klart definierade roller: Valiflow = biträde, kund = personuppgiftsansvarig.</li>
              <li>• Kryptering i vila: AES-256.</li>
              <li>• Kryptering i transit: TLS 1.3.</li>
              <li>• Datacenter inom EU.</li>
              <li>• Fullt signeringsbart personuppgiftsbiträdesavtal (DPA).</li>
            </ul>
          </Section>

          {/* SECURITY */}
          <Section
            icon={<ShieldCheck className="h-6 w-6 text-emerald-300" />}
            title="Säkerhetsarkitektur"
          >
            <p className="text-white/70 leading-relaxed">
              Plattformen är byggd med ett “security-first”-koncept där
              varje komponent är skyddad med moderna metoder för att förhindra
              obehörig åtkomst och dataförluster.
            </p>

            <ul className="mt-3 space-y-2 text-white/80">
              <li>• MFA & rollbaserad åtkomstkontroll (RBAC).</li>
              <li>• Rate limiting och API-skydd.</li>
              <li>• Separata körmiljöer (prod / stage / dev).</li>
              <li>• Loggning av alla systemhändelser.</li>
              <li>• Årlig penetrationstestning.</li>
              <li>• Automatiserad patchning & kontinuerlig övervakning.</li>
            </ul>
          </Section>

          {/* AUDIT */}
          <Section
            icon={<FileCheck className="h-6 w-6 text-sky-300" />}
            title="Audit & revisionsspår"
          >
            <p className="text-white/70 leading-relaxed">
              Varje faktura, varning och policykontroll loggas på detaljnivå.
              Det gör Valiflow redo för internkontroll, revisorer och
              myndighetsrapportering.
            </p>

            <ul className="mt-3 space-y-2 text-white/80">
              <li>• Omodifierbara loggar per faktura.</li>
              <li>• Export för revisor eller styrelse.</li>
              <li>• Automatiska rapporter för intern kontroll.</li>
              <li>• Loggning sparas i minst 7 år.</li>
            </ul>
          </Section>

          {/* INCIDENT HANDLING */}
          <Section
            icon={<AlertTriangle className="h-6 w-6 text-amber-300" />}
            title="Incidenthantering & drift"
          >
            <p className="text-white/70 leading-relaxed">
              Vi har en dokumenterad process för incidenter, driftstörningar
              och dataskyddsincidenter – med tydlig kommunikation och
              åtgärdsplan.
            </p>

            <ul className="mt-3 space-y-2 text-white/80">
              <li>• 24/7 övervakning av systemhälsa.</li>
              <li>• Tydlig incidentklassificering (low → critical).</li>
              <li>• Notifiering enligt GDPR (72h-regel).</li>
              <li>• Redundans & failsafe-backup av data.</li>
            </ul>
          </Section>

          {/* CERTIFICATIONS */}
          <Section
            icon={<CheckCircle className="h-6 w-6 text-emerald-300" />}
            title="Certifieringar & standarder"
          >
            <p className="text-white/70 leading-relaxed">
              Vi följer branschens bästa praxis och arbetar aktivt mot
              internationella certifieringar.
            </p>

            <ul className="mt-3 space-y-2 text-white/80">
              <li>• ISO 27001 – påbörjad certifieringsprocess.</li>
              <li>• ISAE 3402 typ 1 – planeras 2026.</li>
              <li>• SOC-liknande kontrollpunkter i utveckling.</li>
            </ul>
          </Section>
        </div>

        {/* CTA */}
        <section className="mt-24">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_55%)]" />
            <div className="relative text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl font-semibold">
                Vill ni ha en compliance-genomgång?
              </h2>
              <p className="max-w-xl mx-auto text-white/80 text-base">
                Vi går igenom GDPR, säkerhet, ViDA-krav och hur Valiflow kan
                stärka er interna kontroll – helt kostnadsfritt.
              </p>

              <a
                href="mailto:info@valiflow.se"
                className="inline-flex items-center gap-2 rounded-full bg-white text-[#050C22] font-semibold px-7 py-3 shadow hover:bg-slate-100 transition text-sm sm:text-base"
              >
                Kontakta Oss
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ============================== */
/* REUSABLE SECTION COMPONENT     */
/* ============================== */
function Section({ icon, title, children }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}
