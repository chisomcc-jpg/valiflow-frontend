// src/demo/story/scenes/Scene2_Import.jsx
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { useDemo } from '../../DemoContext';

export default function Scene2_Import() {
    const { invoices } = useDemo();

    // Take subset for animation
    const demoInvoices = useMemo(() => invoices.slice(0, 12), [invoices]);

    return (
        <div className="flex-1 flex items-center gap-12 px-12">
            {/* LEFT: SOURCES */}
            <div className="w-1/4 space-y-8">
                {['Fortnox', 'Visma', 'Microsoft 365'].map((src, i) => (
                    <motion.div
                        key={src}
                        className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center gap-4"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 * i }}
                    >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs">
                            {src[0]}
                        </div>
                        <span className="text-white font-medium text-lg">{src}</span>
                    </motion.div>
                ))}
            </div>

            {/* CENTER: STREAM */}
            <div className="flex-1 h-96 relative flex items-center justify-center overflow-hidden">
                {/* Path lines */}
                <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

                {demoInvoices.map((inv, i) => (
                    <motion.div
                        key={inv.id}
                        className={`absolute p-3 rounded-lg shadow-lg w-48 text-xs border backdrop-blur-sm 
                        ${inv.status === 'flagged' ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-white/90 border-white/20 text-slate-800'}
                    `}
                        initial={{ x: -400, y: (i % 3 - 1) * 60, opacity: 0, scale: 0.8 }}
                        animate={{ x: 300, opacity: [0, 1, 1, 0], scale: 1 }}
                        transition={{
                            duration: 3,
                            delay: i * 0.4,
                            repeat: Infinity,
                            repeatDelay: 2
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <DocumentTextIcon className="w-4 h-4" />
                            <span className="font-bold truncate">{inv.supplierName}</span>
                        </div>
                        <div className="flex justify-between opacity-80">
                            <span>{inv.total.toLocaleString()} SEK</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* RIGHT: INBOX TARGET */}
            <div className="w-1/4 flex flex-col items-center">
                <motion.div
                    className="w-full h-64 bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-900/50 animate-pulse">
                        <DocumentTextIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-xl">Valiflow Inbox</h3>
                    <p className="text-slate-400 mt-2 text-sm">Real-time Capture</p>
                    <div className="mt-4 bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-white">
                        Processing...
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
