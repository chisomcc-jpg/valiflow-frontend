// src/pages/Security.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  FileCheck,
  Database,
  Globe,
  Server,
  KeyRound,
} from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#050C22] text-white">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/20 blur-[32px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 blur-[32px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-32 pt-32">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
            <Shield className="h-4 w-4 text-emerald-300" />
            <span>Säkerhet</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold">
            Säkerhet & dataskydd i Valiflow
          </h1>

          <p className="text-base sm:text-lg text-white/80">
            Valiflow är byggt som ett trust layer – med säkerhet, dataskydd och
            revisionsbarhet som grund. Vår plattform följer moderna krav enligt GDPR,
            ViDA och best practice inom finansiell infrastruktur.
          </p>
        </motion.div>

        {/* SECTION: ENCRYPTION */}
        <section className="mt-16 grid sm:grid-cols-2 gap-6">
          <SecurityCard
            icon={Lock}
            title="Kryptering"
            items={[
              "AES-256 kryptering i vila",
              "TLS 1.3 för all data i transit",
              "Nyckelrotation enligt industristandard",
            ]}
          />
          <SecurityCard
            icon={KeyRound}
            title="Åtkomstkontroller"
            items={[
              "Rollbaserad åtkomst (RBAC)",
              "Tvåfaktorsautentisering (MFA)",
              "Principen om minsta privilegium",
            ]}
          />
        </section>

        {/* SECTION: LOGGING & COMPLIANCE */}
        <section className="mt-10 grid sm:grid-cols-2 gap-6">
          <SecurityCard
            icon={FileCheck}
            title="Revisionsspår"
            items={[
              "Detaljerad loggning av alla händelser",
              "Export för revisor & intern kontroll",
              "Spårbarhet per faktura, användare och leverantör",
            ]}
          />
          <SecurityCard
            icon={Database}
            title="Compliance & lagring"
            items={[
              "Dataminimering som standard",
              "All lagring inom EU",
              "Uppfyller GDPR & förberedd för ViDA",
            ]}
          />
        </section>

        {/* SECTION: INFRASTRUCTURE */}
        <section className="mt-10 grid sm:grid-cols-2 gap-6">
          <SecurityCard
            icon={Server}
            title="Infrastruktur"
            items={[
              "Containeriserad miljö med isolerade tjänster",
              "Automatiska patchar & sårbarhetsskanning",
              "Redundans & kontinuerlig övervakning",
            ]}
          />
          <SecurityCard
            icon={Globe}
            title="Data residency"
            items={[
              "All data behandlas inom EU/EES",
              "EU-baserade datacenter",
              "Full transparens för kunder & revisorer",
            ]}
          />
        </section>

        {/* SECTION: TEXT BLOCK */}
        <section className="mt-16 max-w-3xl space-y-5 text-white/80 leading-relaxed">
          <h2 className="text-2xl font-semibold text-white">Säkerhet som standard</h2>
          <p>
            Valiflow är konstruerat med säkerhet som fundament – inte som en
            efterhandslösning. Alla fakturor, leverantörsdata och användaraktiviteter
            valideras och loggas i en kontrollmiljö byggd för revision, compliance och
            riskhantering.
          </p>
          <p>
            Vi arbetar aktivt med hotmodellering, dataminimering och skydd av både
            organisationers och leverantörers känsliga uppgifter.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),_transparent_70%)] pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold mb-2">
                Vill du veta mer om säkerheten i Valiflow?
              </h3>
              <p className="text-white/75 max-w-xl mb-6">
                Vi erbjuder teknisk dokumentation, DPIA-stöd och detaljerade
                beskrivningar av vår arkitektur och logghantering.
              </p>

              <a
                href="mailto:info@valiflow.se"
                className="inline-flex items-center gap-2 rounded-full bg-white text-[#050C22] font-semibold px-6 py-3 shadow-lg hover:bg-slate-100"
              >
                Boka säkerhetsgenomgång →
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SecurityCard({ icon: Icon, title, items }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-emerald-300" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2 text-sm text-white/70">
        {items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
