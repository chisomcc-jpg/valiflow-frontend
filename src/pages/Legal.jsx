// src/pages/Legal.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Scale, FileText, Lock, Shield } from "lucide-react";

export default function Legal() {
    return (
        <div className="min-h-screen bg-[#050C22] text-white">
            <div className="max-w-4xl mx-auto px-6 py-32">
                <header className="mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 mb-6">
                        <Scale className="h-3.5 w-3.5" />
                        <span>Uppdaterad: December 2025</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Juridisk Hub & Villkor</h1>
                    <p className="text-lg text-white/70">
                        Det kontraktuella ramverket för vårt Trust Layer. Transparens kring dataägande, ansvar och behandling.
                    </p>
                </header>

                <div className="grid gap-6 md:grid-cols-2">

                    {/* TERMS OF SERVICE */}
                    <LegalCard
                        icon={FileText}
                        title="Användarvillkor (ToS)"
                        updated="12 Dec, 2025"
                        description="Vårt Master Services Agreement (MSA) täcker nyttjanderätt, ansvarsbegränsningar (Standard vs Enterprise) och SLA."
                        items={[
                            "SaaS-avtal",
                            "SLA-definitioner (Enterprise)",
                            "Policy för tillåten användning"
                        ]}
                    />

                    {/* PRIVACY POLICY */}
                    <LegalCard
                        icon={Lock}
                        title="Integritetspolicy"
                        updated="01 Nov, 2025"
                        description="Hur vi hanterar personuppgifter på fakturor (t.ex. enskilda firmor). Vi behandlar data strikt för att utföra valideringstjänsten."
                        items={[
                            "Omfattning av datainsamling",
                            "Lista på underbiträden",
                            "Lagringspolicy (7 år)"
                        ]}
                    />

                    {/* DPA */}
                    <LegalCard
                        icon={Shield}
                        title="Personuppgiftsbiträdesavtal (DPA)"
                        updated="Dec 2025"
                        description="Vårt standard-DPA för GDPR-efterlevnad. Tillgängligt för digital signering vid onboarding."
                        items={[
                            "GDPR-efterlevnad",
                            "Överföringsmekanismer (EU/EES)",
                            "Säkerhetsåtgärder (Tekniska & Org)"
                        ]}
                    />

                </div>

                <section className="mt-16 border-t border-white/10 pt-10">
                    <h2 className="text-xl font-semibold mb-4">Compliance-frågor</h2>
                    <p className="text-white/70 mb-6">
                        För frågor till vårt Dataskyddsombud (DPO), granskningsrättigheter eller specifika riskbedömningsformulär, kontakta vårt compliance-team.
                    </p>
                    <a href="mailto:info@valiflow.se" className="text-emerald-300 hover:text-emerald-200 underline underline-offset-4">
                        info@valiflow.se
                    </a>
                </section>
            </div>
        </div>
    );
}

function LegalCard({ icon: Icon, title, updated, description, items }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.07] transition">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#071330] rounded-lg border border-white/10">
                    <Icon className="h-5 w-5 text-white/90" />
                </div>
                <span className="text-xs text-white/40 font-mono">{updated}</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-white/70 mb-6 min-h-[40px]">{description}</p>

            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="text-sm text-white/60 flex items-center gap-2">
                        <span className="h-1 w-1 bg-white/40 rounded-full" />
                        {item}
                    </li>
                ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-white/5">
                <span className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer">
                    Läs dokument →
                </span>
            </div>
        </div>
    )
}
