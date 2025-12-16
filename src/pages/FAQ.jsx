import React, { useState } from "react";
import { ChevronDown, ChevronUp, ShieldQuestion, Scale, Lock, Server } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#050C22] text-white">
      {/* HEADER */}
      <header className="text-center pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.15),_transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur-sm mb-6">
            <ShieldQuestion className="h-3.5 w-3.5 text-emerald-300" />
            <span>Risk, Ansvar & Drift</span>
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl mb-6">Vanliga frågor</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            Transparenta svar om hur Valiflow hanterar risk, ansvar och driftstörningar.
            Hittar du inte ditt svar här, vänligen kontakta vårt compliance-team.
          </p>
        </div>
      </header>

      {/* FAQ SECTIONS */}
      <div className="max-w-3xl mx-auto px-6 pb-32 space-y-16">

        {/* SECTION: RISK & LIABILITY */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-semibold">Risk & Ansvar</h2>
          </div>
          <FAQItem
            question="Vad händer om Valiflow flaggar en faktura felaktigt (False Positive)?"
            answer="Safe failure är vår prioritet. Om Valiflow flaggar en legitim faktura hamnar den i ett 'Varningsläge'. Den raderas aldrig. En mänsklig operatör (Ekonomichef/CFO) kan granska flaggan, se orsaken (t.ex. 'Nytt Bankgiro') och godkänna fakturan med ett klick. Detta godkännande loggas för revisionsändamål."
          />
          <FAQItem
            question="Vem har det slutgiltiga ansvaret för att godkänna betalningar?"
            answer="Det har ni. Valiflow är ett beslutsstöd, inte en firmatecknare. Vi agerar som en grindvakt som validerar dataintegriteten, men själva sändningen av betalfiler till banken är alltid en handling som utförs av er behöriga personal i ert ERP- eller banksystem."
          />
          <FAQItem
            question="Vad är Valiflows ansvar om ett bedrägeriförsök missas?"
            answer="Valiflow tillhandahåller ett kontrollager baserat på 'Best Effort' utifrån de regler och den data som finns tillgänglig vid behandlingstillfället. Även om vi avsevärt minskar risken, agerar vi inte som en försäkringsgivare för bedrägeriförluster. Vårt ansvar regleras i vårt tjänsteavtal (MSA) och är begränsat till nivåer som är standard för SaaS-industrin."
          />
        </div>

        {/* SECTION: OPERATIONS & LOGIC */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Server className="h-5 w-5 text-sky-400" />
            <h2 className="text-xl font-semibold">Systemlogik & Drift</h2>
          </div>
          <FAQItem
            question="Godkänner Valiflow någonsin betalningar automatiskt?"
            answer="Nej. Valiflow verifierar fakturor mot era regler (t.ex. inköpsordermatchning, leverantörslista). Om en faktura passerar alla kontroller markeras den som 'Validerad'. Den betalas aldrig automatiskt av Valiflow. Betalningsexekveringen ligger kvar i ert ERP-flöde."
          />
          <FAQItem
            question="Vad händer om externa datakällor (t.ex. Bankgirot) ligger nere?"
            answer="Vi arbetar enligt en 'Default-Deny'-arkitektur. Om vi inte kan verifiera en leverantörs bankuppgifter för att det externa registret inte går att nå, flaggas fakturan med varningen 'Verifiering misslyckades: Datakälla ej tillgänglig'. Vi antar aldrig att data är korrekt bara för att vi inte kan kontrollera den."
          />
          <FAQItem
            question="Är det 'AI' som tar beslut om mina pengar?"
            answer="Nej. Vi skiljer strikt på 'Regler' och 'AI'. Beslut om att blockera (stoppa betalning) tas av deterministiska regler (Kategori A-kontroller). AI-modeller används endast för detektion och varningsflaggor (Kategori B-kontroller). Ett neuralt nätverk stoppar aldrig ensamt en betalning utan att en regelöverträdelse identifierats."
          />
        </div>

        {/* SECTION: DATA & AUDIT */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-semibold">Data, Revision & Integritet</h2>
          </div>
          <FAQItem
            question="Kan beslut granskas i efterhand?"
            answer="Ja. Varje valideringshändelse fångar en 'Forensisk Snapshot' av regelverket och dataläget vid just den millisekunden. Ni kan återskapa vilket beslut som helst från de senaste 7 åren för att se exakt varför en faktura flaggades eller validerades."
          />
          <FAQItem
            question="Vem äger datan?"
            answer="Det gör ni. Valiflow agerar som Personuppgiftsbiträde (Data Processor). Vi säljer, delar eller aggregerar inte er finansiella data till tredje part. Ni kan begära en fullständig export eller radering av er data när som helst, med förbehåll för lagkrav om arkivering."
          />
        </div>

        {/* FOOTER LINK */}
        <div className="mt-12 text-center pt-10 border-t border-white/10">
          <p className="text-white/60 text-sm">
            Behöver ni detaljerade policydokument? Besök vår <Link to="/legal" className="text-emerald-400 hover:underline">Juridiska Hub</Link>.
          </p>
        </div>

      </div>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/10 rounded-xl bg-white/5 p-5 shadow-sm backdrop-blur-sm transition hover:bg-white/[0.07]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left font-medium text-white/90"
      >
        <span>{question}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-emerald-400/80" />
        ) : (
          <ChevronDown className="h-5 w-5 text-emerald-400/80" />
        )}
      </button>
      {open && (
        <div className="mt-3 text-sm text-white/70 leading-relaxed pr-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {answer}
        </div>
      )}
    </div>
  );
}
