// src/demo/story/components/NarratorBox.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Script adapted to 56s audio
const SCRIPT = {
    welcome: "I Norden hanteras miljontals fakturor varje år. Fel upptäcks sent, risker missas och ekonomiteam saknar ett riktigt kontrollager.",
    import: "Valiflow förändrar det. Plattformen ligger ovanpå era befintliga system och analyserar varje faktura direkt — utan implementation eller systembyte.",
    pipeline: "AI:n läser, validerar och riskbedömer varje dokument.",
    flagged: "Avvikelser, okända leverantörer och ändrade betalningsuppgifter flaggas innan fakturan bokförs.",
    graph: "Med vårt leverantörsnätverk ser ni mönster, riskkluster och historik på tvären.",
    // We combine Scene 6+7 for this text block in logic, or just Scene 6
    summary: "Och i dashboarden får ni tydliga insikter: trender, risknivåer och rekommendationer som går att agera på direkt.",
    cta: "Valiflow är ert Trust Layer. För tryggare ekonomi, smartare kontroll och bättre beslut."
};

export default function NarratorBox({ sceneId }) {
    // Mapping for shared text (e.g. if we merged scenes) or just direct
    const text = SCRIPT[sceneId];

    return (
        <div className="h-24 md:h-20 flex items-end justify-center pointer-events-none p-4 w-full relative z-50">
            <AnimatePresence mode="wait">
                {text && (
                    <motion.div
                        key={sceneId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="bg-black/80 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 max-w-3xl text-center shadow-2xl"
                    >
                        <p className="text-white/95 text-sm md:text-lg font-medium leading-relaxed drop-shadow-md">
                            "{text}"
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
