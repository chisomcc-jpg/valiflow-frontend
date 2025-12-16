// src/demo/story/scenes/Scene7_Summary.jsx
import React from 'react';
import { motion } from 'framer-motion';
import OverlayHighlight from '../components/OverlayHighlight';
import { DocumentMagnifyingGlassIcon, ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

const KPIS = [
    { label: "Totala fakturor", val: "46", icon: DocumentMagnifyingGlassIcon, color: "blue" },
    { label: "Kräver åtgärd", val: "6", icon: ShieldExclamationIcon, color: "red", highlight: true },
    { label: "AI Trust Score", val: "94%", icon: ShieldCheckIcon, color: "emerald" },
];

export default function Scene7_Summary() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center w-full px-12">
            <h2 className="text-3xl font-bold text-white mb-12">Total Överblick & Compliance</h2>

            <div className="grid grid-cols-3 gap-8 w-full max-w-5xl">
                {KPIS.map((kpi, i) => (
                    <OverlayHighlight key={i} isActive={kpi.highlight} label={kpi.highlight ? "Action Needed" : ""}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-white rounded-xl p-8 flex flex-col items-center text-center shadow-lg"
                        >
                            <div className={`p-4 rounded-full bg-${kpi.color}-50 mb-4`}>
                                <kpi.icon className={`w-8 h-8 text-${kpi.color}-600`} />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-1">{kpi.val}</div>
                            <div className="text-slate-500 font-medium">{kpi.label}</div>
                        </motion.div>
                    </OverlayHighlight>
                ))}
            </div>

            {/* Compliance Badge */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2, type: "spring" }}
                className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full flex items-center gap-4"
            >
                <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />
                <span className="text-white font-medium">ViDA Metadata & CSRD Ready</span>
            </motion.div>
        </div>
    );
}
