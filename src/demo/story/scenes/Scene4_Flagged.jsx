// src/demo/story/scenes/Scene4_Flagged.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useDemo } from '../../DemoContext';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import OverlayHighlight from '../components/OverlayHighlight';

export default function Scene4_Flagged() {
    const { invoices } = useDemo();
    // Filter only flagged or risky
    const flagged = invoices.filter(i => i.status === 'flagged').slice(0, 4);

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-12">
            <h2 className="text-3xl font-bold text-white mb-8">Risk Detection</h2>

            <div className="w-full max-w-4xl grid grid-cols-1 gap-4">
                {flagged.map((inv, i) => (
                    <OverlayHighlight key={inv.id} isActive={true} label="Risk Upptäckt">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.3 }}
                            className="bg-white rounded-xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden"
                        >
                            {/* Red Left Border */}
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500" />

                            <div className="flex items-center gap-4 pl-4">
                                <div className="p-3 bg-red-50 rounded-full">
                                    <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{inv.supplierName}</h3>
                                    <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">{inv.flagReason || "Misstänkt beteende"}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-lg font-bold text-slate-900">{inv.total.toLocaleString()} SEK</div>
                                <div className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded inline-block mt-1">
                                    TrustScore: {inv.trustScore}
                                </div>
                            </div>

                            {/* Tooltip Simulation */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.3 + 0.5 }}
                                className="absolute top-2 right-1/3 bg-slate-900 text-white text-xs px-3 py-2 rounded shadow-xl max-w-[200px]"
                            >
                                {inv.aiSummary}
                                <div className="absolute bottom-[-4px] left-4 w-2 h-2 bg-slate-900 rotate-45" />
                            </motion.div>
                        </motion.div>
                    </OverlayHighlight>
                ))}
            </div>
        </div>
    );
}
