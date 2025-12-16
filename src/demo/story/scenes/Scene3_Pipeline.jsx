// src/demo/story/scenes/Scene3_Pipeline.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, BanknotesIcon, GlobeEuropeAfricaIcon, ClockIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

const STEPS = [
    { id: 'ocr', label: 'OCR & Data', icon: DocumentMagnifyingGlassIcon },
    { id: 'ident', label: 'Leverantör', icon: GlobeEuropeAfricaIcon },
    { id: 'bank', label: 'Betalning', icon: BanknotesIcon },
    { id: 'history', label: 'Historik', icon: ClockIcon },
    { id: 'risk', label: 'TrustScore', icon: ShieldCheckIcon },
];

export default function Scene3_Pipeline() {
    const [activeStep, setActiveStep] = useState(-1);
    const [analyzedCount, setAnalyzedCount] = useState(0);

    // Cycle through steps
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep(prev => (prev + 1) % STEPS.length);
            setAnalyzedCount(c => c + 1);
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-center relative">
            <h2 className="text-3xl font-bold text-white mb-12">TrustEngine Validation Pipeline</h2>

            {/* LINE */}
            <div className="absolute top-1/2 left-20 right-20 h-1 bg-slate-700 -z-10" />

            {/* STEPS */}
            <div className="flex justify-between w-full px-20 relative">
                {STEPS.map((step, idx) => {
                    const isActive = idx === activeStep;
                    const isPast = idx < activeStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-4">
                            <motion.div
                                className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 transition-colors relative z-10 bg-[#0F172A]
                                ${isActive || isPast ? 'border-emerald-500 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'border-slate-700 text-slate-600'}
                            `}
                                animate={{ scale: isActive ? 1.2 : 1 }}
                            >
                                <step.icon className="w-10 h-10" />
                            </motion.div>
                            <p className={`font-medium ${isActive || isPast ? 'text-white' : 'text-slate-600'}`}>{step.label}</p>

                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute -bottom-12 bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30"
                                >
                                    Validating...
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* COUNTER */}
            <div className="mt-24 bg-white/5 border border-white/10 px-8 py-4 rounded-xl flex items-center gap-4">
                <span className="text-slate-400 text-sm">Validations per second</span>
                <span className="text-3xl font-mono font-bold text-white">40</span>
                <div className="flex gap-1 h-4 items-end">
                    {[1, 2, 3, 4].map(i => (
                        <motion.div
                            key={i}
                            className="w-1 bg-blue-500"
                            animate={{ height: [4, 16, 8, 12] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
