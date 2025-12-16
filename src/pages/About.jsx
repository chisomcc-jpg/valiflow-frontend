// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Target,
  Building2,
  Lightbulb,
  CheckCircle,
  Lock,
  RefreshCcw,
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-[#050C22] text-white">
      {/* BACKGROUND GLOW */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/20 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-32 pt-32">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
            <span>Om Valiflow</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Vi bygger Nordens trust layer för finance
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-white/80 max-w-2xl">
            Valiflow är byggt för ekonomiteam, redovisningsbyråer och koncerner som
            vill säkra risk, efterlevnad och fakturaflöden – utan att byta ut sina
            befintliga ekonomisystem.
          </p>
        </motion.header>

        {/* MISSION */}
        <section className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-emerald-300" />
            <h2 className="text-xl font-semibold">Vår mission</h2>
          </div>

          <p className="text-lg text-white/85">
            Att göra finansiell automation pålitlig som standard.
          </p>
          <p className="text-white/70 leading-relaxed">
            Varje faktura, betalning och leverantörstransaktion ska kunna verifieras —
            automatiskt, i realtid och innan pengar rör sig.
          </p>
          <p className="text-white/70 leading-relaxed">
            Med Valiflow skapas en ny nivå av förtroende i ekonomiflöden – där varje
            transaktion är korrekt, compliant och skyddad mot bedrägerier.
          </p>
        </section>

        {/* VILKA VI ÄR */}
        <section className="mt-14 rounded-3xl border border-white/10 bg-[#071330] p-6 sm:p-8 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-sky-300" />
            <h2 className="text-xl font-semibold">Vilka vi är</h2>
          </div>

          <p className="text-white/70 leading-relaxed">
            Valiflow är ett svenskt fintech-bolag som bygger det intelligenta
            förtroendelagret för finansdata.
          </p>
          <p className="text-white/70 leading-relaxed">
            Vi integrerar med system som Visma.net, Fortnox och Business Central och säkerställer att
            all data är korrekt, compliant och granskbar innan betalningar utförs.
          </p>
          <p className="text-white/70 leading-relaxed">
            Vår AI-motor kombinerar deterministisk logik med schema-inlärning — en teknik
            som förstår hur ekonomisystem strukturerar data.
          </p>
          <p className="text-white/70 leading-relaxed">
            Resultatet är plug-and-play validering för Norden och EU.
          </p>
        </section>

        {/* VARFÖR VI FINNS */}
        <section className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-300" />
            <h2 className="text-xl font-semibold">Varför vi finns</h2>
          </div>

          <p className="text-white/70 leading-relaxed">
            Finansbranschen står inför tre stora utmaningar:
          </p>

          <ul className="space-y-2 text-white/80 text-base">
            <li>• Nya EU-regler (ViDA) kräver realtidskontroll av moms och rapportering.</li>
            <li>• ERP-system är fragmenterade och använder olika datalogik.</li>
            <li>• Fel och bedrägerier ökar – men kontrollerna är fortfarande manuella.</li>
          </ul>

          <p className="text-white/70 leading-relaxed mt-4">
            Valiflow blir mellanlagret som ser till att allt stämmer innan det bokförs,
            betalas eller granskas.
          </p>
          <p className="text-white/70 leading-relaxed">
            Kort sagt: vi gör automatiserad ekonomi till något man kan lita på.
          </p>
        </section>

        {/* VISION */}
        <section className="mt-14 rounded-3xl border border-white/10 bg-[#071330] p-6 sm:p-8 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-6 w-6 text-sky-300" />
            <h2 className="text-xl font-semibold">Vår vision</h2>
          </div>

          <p className="text-lg text-white/85">
            Att etablera en europeisk standard för finansiell integritet och transparens.
          </p>

          <p className="text-white/70 leading-relaxed">
            Där varje transaktion är verifierbar, spårbar och trygg.
            Förtroende ska vara inbyggt — inte något man behöver dubbelkolla.
          </p>

          <p className="text-white/70 leading-relaxed">
            Med Valiflow blir compliance osynlig, riskerna minimala och tilliten självklar.
          </p>
        </section>



        {/* KÄRNVÄRDEN – utan emojis */}
        <section className="mt-14 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md space-y-6">
          <h2 className="text-xl font-semibold">Kärnvärden</h2>

          <ul className="grid gap-5 sm:grid-cols-2 text-white/85 text-base">
            <li className="rounded-xl bg-[#071330] border border-white/10 p-4 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle className="h-4 w-4 text-emerald-300" />
                Transparens
              </div>
              <p className="text-white/70">Varje validering ska gå att förklara.</p>
            </li>

            <li className="rounded-xl bg-[#071330] border border-white/10 p-4 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <RefreshCcw className="h-4 w-4 text-emerald-300" />
                Tillförlitlighet
              </div>
              <p className="text-white/70">Våra integrationer fungerar — alltid.</p>
            </li>

            <li className="rounded-xl bg-[#071330] border border-white/10 p-4 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <Lock className="h-4 w-4 text-emerald-300" />
                Förtroende
              </div>
              <p className="text-white/70">Byggt i Sverige, för hela Europa.</p>
            </li>

            <li className="rounded-xl bg-[#071330] border border-white/10 p-4 space-y-1">
              <div className="flex items-center gap-2 font-semibold">
                <Lightbulb className="h-4 w-4 text-emerald-300" />
                Innovation
              </div>
              <p className="text-white/70">Vi gör det svåra möjligt – automatiserat.</p>
            </li>
          </ul>
        </section>

        {/* CTA – Mjuk, professionell */}
        <section className="mt-16 rounded-3xl border border-white/10 bg-white/5 px-6 py-10 sm:px-10 backdrop-blur-md">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-300">
              Nästa steg
            </p>
            <h2 className="text-2xl font-semibold">
              Utforska hur Valiflow kan stärka er kontroll
            </h2>
            <p className="text-white/75 text-base">
              Se våra lösningar för ekonomiavdelningar, byråer och koncerner – eller boka
              en genomgång där vi visar hur trust layer-principerna fungerar i praktiken.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/solutions"
              className="inline-flex items-center gap-2 bg-white text-[#050C22] font-semibold px-6 py-3 rounded-full text-sm shadow hover:bg-slate-100"
            >
              Se lösningar
            </a>
            <a
              href="/demo"
              className="inline-flex items-center gap-2 border border-white/40 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/10"
            >
              Se Demo
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}


