import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

// EXACT COPY (SWEDISH) - DO NOT TRANSLATE
const STEPS = [
    {
        title: "Tolkar fakturainnehåll",
        subtitle: "Läser text, belopp och datum från fakturan"
    },
    {
        title: "Identifierar leverantör",
        subtitle: "Matchar organisationsnummer, bankgiro och historik"
    },
    {
        title: "Jämför mot tidigare fakturor",
        subtitle: "Analyserar avvikelser i belopp och betalningsmönster"
    },
    {
        title: "Analyserar risk",
        subtitle: "Letar efter ovanliga förändringar och kända riskmönster"
    },
    {
        title: "Sammanställer rekommendation",
        subtitle: "Prioriterar vad som kräver din uppmärksamhet"
    }
];

const SCAN_DURATION_MS = 5000;
const STEP_DURATION = SCAN_DURATION_MS / STEPS.length;

export default function DemoScanOverlay({ isOpen, onComplete }) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(0);
            return;
        }

        const startTime = Date.now();

        // Step Progress Loop
        const stepInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const nextStep = Math.min(Math.floor(elapsed / STEP_DURATION), STEPS.length - 1);

            setCurrentStep(nextStep);

            if (elapsed >= SCAN_DURATION_MS) {
                clearInterval(stepInterval);
                setTimeout(onComplete, 500); // Short pause at end
            }
        }, 100);

        return () => clearInterval(stepInterval);
    }, [isOpen, onComplete]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100"
                >
                    {/* Header */}
                    <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
                            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 leading-tight">Analyserar dokument</h3>
                            <p className="text-sm text-slate-500">Valiflow Trust Engine™</p>
                        </div>
                    </div>

                    {/* Steps Body */}
                    <div className="p-6 space-y-6">
                        {STEPS.map((step, index) => {
                            const isActive = index === currentStep;
                            const isDone = index < currentStep;

                            return (
                                <div key={index} className="flex items-start gap-4 transition-all duration-300">
                                    {/* Icon State */}
                                    <div className="mt-1 shrink-0 w-5 h-5 flex items-center justify-center">
                                        {isDone ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        ) : isActive ? (
                                            <div className="w-4 h-4 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                                        )}
                                    </div>

                                    {/* Text State */}
                                    <div className={`transition-all duration-300 ${isActive ? "opacity-100" : isDone ? "opacity-50" : "opacity-30"}`}>
                                        <h4 className={`text-sm font-bold leading-none mb-1 ${isActive ? "text-indigo-900" : "text-slate-700"}`}>
                                            {step.title}
                                        </h4>
                                        <p className="text-xs text-slate-500">
                                            {step.subtitle}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-slate-100 w-full mt-2">
                        <motion.div
                            className="h-full bg-indigo-600"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: SCAN_DURATION_MS / 1000, ease: "linear" }}
                        />
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
