// src/pages/TrustEngine.jsx
import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    BrainCircuit,
    Lock,
    FileSearch,
    AlertTriangle,
    Scale,
    CheckCircle2,
} from "lucide-react";

export default function TrustEngine() {
    return (
        <div className="min-h-screen bg-[#050C22] text-white">
            {/* BACKGROUND GLOW */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[32px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-400/05 blur-[32px]" />
            </div>

            <main className="relative z-10 mx-auto max-w-5xl px-6 pt-32 pb-32">
                {/* HEADER */}
                <motion.header
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-3xl space-y-6"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur-sm">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                        <span>Metodik & Kontrollramverk</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                        Valiflow Trust Engine
                    </h1>
                    <p className="text-lg leading-relaxed text-white/80 max-w-2xl">
                        Detta är Valiflows operationella doktrin. Den definierar hur vi validerar finansiell data,
                        skiljer på deterministiska regler och AI-signaler, och säkerställer mänskligt mandat över varje betalning.
                    </p>
                </motion.header>

                {/* 1. PURPOSE */}
                <section className="mt-20 grid gap-8 md:grid-cols-[1fr_1.5fr]">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white">Syfte & Omfattning</h2>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Valiflow är inte ett ERP, en OCR-motor eller en betalväxel.
                            Valiflow är ett <strong className="text-white">Kontrollager (Control Layer)</strong>.
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white/80 leading-relaxed">
                        <p className="mb-4">
                            Vår enda funktion är att validera integriteten i finansiella transaktioner innan de slutförs.
                            Vi opererar enligt en "Default-Deny"-arkitektur: om en transaktion inte kan verifieras mot
                            etablerade kontroller, flaggas den för granskning. Den godkänns aldrig i tysthet.
                        </p>
                        <p>
                            Vi agerar grindvakt mellan fakturamottagning och betalning, och säkerställer efterlevnad
                            av både intern policy och externa regelverk.
                        </p>
                    </div>
                </section>

                {/* 2. DETERMINISTIC VS AI */}
                <section className="mt-20">
                    <div className="mb-8 max-w-2xl">
                        <h2 className="text-2xl font-semibold text-white mb-2">Deterministiska vs. Sannolikhetsbaserade Kontroller</h2>
                        <p className="text-white/70">
                            Vi separerar strikt "Hårda Regler" (Logik) från "Risksignaler" (AI).
                            <br />
                            <span className="text-emerald-300 font-medium">Doktrin: "AI varnar. Regler skyddar."</span>
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <ControlCard
                            icon={Lock}
                            title="Kategori A: Preventiva Kontroller"
                            subtitle="(Hårda Policyregler / Regler)"
                            description="Deterministisk logik där utfallet är binärt (Sant/Falskt). Dessa kontroller stoppar fysiskt en betalfil från att skapas utan en explicit manuell åtgärd."
                            examples={[
                                "Sanktionslistor (EU/OFAC)",
                                "Ändrat Bankgiro utan godkännande",
                                "Duplikat på faktura-ID / OCR-drift",
                                "Ogiltigt IBAN/BIC format (checksum)",
                            ]}
                            color="emerald"
                        />
                        <ControlCard
                            icon={BrainCircuit}
                            title="Kategori B: Detektiva Kontroller"
                            subtitle="(Riskflaggor / AI)"
                            description="Sannolikhetsbaserade signaler där en AI-modell identifierar en avvikelse. Dessa stoppar INTE betalningar per automatik, men utlöser ett 'Varningsläge' som kräver mänsklig granskning."
                            examples={[
                                "Avvikande belopp",
                                "Ny leverantör (textanalys)",
                                "Fakturadatum-anomali",
                                "Mönsteravvikelse från branschsnitt",
                            ]}
                            color="sky"
                        />
                    </div>
                </section>

                {/* 3. HUMAN SOVEREIGNTY */}
                <section className="mt-20 rounded-3xl border border-white/10 bg-[#071330] p-8">
                    <div className="flex items-start gap-4">
                        <Scale className="h-8 w-8 text-amber-300 shrink-0" />
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white">Mänsklig Suveränitet & Override</h2>
                            <p className="text-white/80 leading-relaxed max-w-3xl">
                                Valiflow är ett system för beslutsstöd, inte en autonom beslutsfattare.
                                Det slutgiltiga mandatet ligger alltid hos ekonomichefen eller CFO.
                            </p>
                            <ul className="grid sm:grid-cols-2 gap-4 text-sm text-white/70 mt-2">
                                <li className="flex gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-300" />
                                    Varje varning kan hanteras av en behörig människa.
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-300" />
                                    Alla manuella godkännanden loggas med obligatorisk motivering.
                                </li>
                                <li className="flex gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-amber-300" />
                                    Vi avvisar aldrig en betalning permanent utan notifiering.
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 4. AUDIT & RECONSTRUCTION */}
                <section className="mt-20 grid gap-8 md:grid-cols-[1fr_1fr]">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <FileSearch className="h-6 w-6 text-white" />
                            <h2 className="text-xl font-semibold text-white">Spårbarhet & Rekonstruktion</h2>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">
                            För ett Trust Layer är spårbarhet själva produkten. Vi säkerställer att varje beslut
                            kan rekonstrueras forensiskt upp till 7 år senare.
                        </p>
                    </div>
                    <div className="space-y-4 text-sm text-white/80">
                        <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                            <p className="font-semibold text-white mb-1">State Preservation</p>
                            <p>Vi loggar <em>exakt</em> den indata och <em>exakt</em> den regelversion som var aktiv vid valideringsögonblicket.</p>
                        </div>
                        <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                            <p className="font-semibold text-white mb-1">Beslutslogg</p>
                            <p>Vem godkände? När? Baserat på vilken varning? Vi sparar "Varför", inte bara "Vad".</p>
                        </div>
                    </div>
                </section>

                {/* 5. DEFAULT DENY */}
                <section className="mt-20 border-t border-white/10 pt-10">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="h-6 w-6 text-white/50" />
                        <div>
                            <h3 className="text-lg font-semibold text-white">Safe Failure-filosofi</h3>
                            <p className="mt-2 text-sm text-white/70 max-w-2xl leading-relaxed">
                                Om en extern datakälla (t.ex. Bankgirots API, Sanktionslistor) inte går att nå,
                                går Valiflow in i ett <span className="text-white font-medium">Varningsläge</span>.
                                Vi antar aldrig att "Tystnad = Godkännande". Ofullständig data behandlas som en risk.
                            </p>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}

function ControlCard({ icon: Icon, title, subtitle, description, examples, color }) {
    const isEmerald = color === "emerald";
    return (
        <div className={`rounded-xl border p-6 ${isEmerald ? "border-emerald-500/30 bg-emerald-950/20" : "border-sky-500/30 bg-sky-950/20"}`}>
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${isEmerald ? "bg-emerald-500/20 text-emerald-300" : "bg-sky-500/20 text-sky-300"}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className={`text-xs uppercase tracking-wider font-medium ${isEmerald ? "text-emerald-400" : "text-sky-400"}`}>{subtitle}</p>
                </div>
            </div>
            <p className="text-sm text-white/70 mb-6 leading-relaxed min-h-[60px]">
                {description}
            </p>
            <div>
                <p className="text-xs font-semibold text-white/50 uppercase mb-2">Exempel</p>
                <ul className="space-y-2">
                    {examples.map((ex, i) => (
                        <li key={i} className="flex gap-2 text-sm text-white/80">
                            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${isEmerald ? "bg-emerald-500" : "bg-sky-500"}`} />
                            <span className="leading-snug">{ex}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
