
// src/components/WhatChangedPanel.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SparklesIcon, ArrowTrendingUpIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { getWeeklyDigest } from "@/services/summaryService";
import { LearningBadge } from "./LearningBadge";

export default function WhatChangedPanel({ companyId }) {
    const [digest, setDigest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!companyId) return;
        getWeeklyDigest(companyId)
            .then(setDigest)
            .catch(err => console.error("Digest error", err))
            .finally(() => setLoading(false));
    }, [companyId]);

    if (loading) return <div className="h-48 bg-slate-50 rounded-xl animate-pulse" />;

    const changes = digest?.changes || [];

    return (
        <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-semibold text-slate-800">What changed this week?</h3>
                    </div>
                    <LearningBadge trigger="Graph Updated" />
                </div>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    {digest?.summary || "No major anomalies detected. Valiflow has continuously monitored your supplier graph."}
                </p>

                <div className="space-y-3">
                    {changes.slice(0, 3).map((change, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 p-3 bg-slate-50/80 rounded-lg border border-slate-100"
                        >
                            <div className={`mt-0.5 p-1 rounded-full ${change.type === 'risk_increase' ? 'bg-red-100 text-red-600' :
                                    change.type === 'review_complete' ? 'bg-emerald-100 text-emerald-600' :
                                        'bg-blue-100 text-blue-600'
                                }`}>
                                {change.type === 'risk_increase' ? <ArrowTrendingUpIcon className="w-3.5 h-3.5" /> :
                                    change.type === 'review_complete' ? <ShieldCheckIcon className="w-3.5 h-3.5" /> :
                                        <SparklesIcon className="w-3.5 h-3.5" />}
                            </div>
                            <span className="text-sm text-slate-700">{change.text}</span>
                        </motion.div>
                    ))}
                </div>

                {changes.length === 0 && (
                    <div className="text-xs text-slate-400 italic mt-4">
                        Monitoring 24/7. No critical alerts.
                    </div>
                )}
            </div>
        </div>
    );
}
