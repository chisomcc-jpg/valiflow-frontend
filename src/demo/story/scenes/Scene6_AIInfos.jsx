// src/demo/story/scenes/Scene6_AIInfos.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';

const LINES = [
    "De flesta fakturor är stabila. 6 fakturor kräver åtgärd.",
    "Två leverantörer uppvisar ökande avvikelser de senaste 30 dagarna.",
    "Rekommendation: skärp risktröskeln för nya leverantörer."
];

export default function Scene6_AIInfos() {
    const [visibleLines, setVisibleLines] = useState(0);

    useEffect(() => {
        const timer1 = setTimeout(() => setVisibleLines(1), 1000);
        const timer2 = setTimeout(() => setVisibleLines(2), 5000);
        const timer3 = setTimeout(() => setVisibleLines(3), 9000);
        return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); }
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
            <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-indigo-600" />
                    <span className="font-semibold text-slate-700">Valiflow AI Assistant</span>
                </div>

                <div className="p-8 space-y-6 min-h-[300px] bg-white">
                    {LINES.slice(0, visibleLines).map((line, i) => (
                        <motion.div
                            key={i}
                            className="flex gap-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                <SparklesIcon className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="bg-indigo-50 px-6 py-4 rounded-2xl rounded-tl-none font-medium text-slate-800 shadow-sm">
                                {/* Typewriter effect simulation (CSS steps not perfect in React without lib, simpler fade here) */}
                                {line}
                            </div>
                        </motion.div>
                    ))}

                    {visibleLines < 3 && (
                        <motion.div className="flex gap-1 ml-14">
                            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100" />
                            <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200" />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
