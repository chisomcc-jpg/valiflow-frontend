
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    SparklesIcon,
    LightBulbIcon,
    ChatBubbleLeftRightIcon,
    ShieldCheckIcon,
    ArrowPathIcon
} from "@heroicons/react/24/outline";
import { adminService } from "@/services/adminService";
import KpiCard from "@/components/ui/KpiCard";
import { Card } from "@/components/ui/card";

const VF = {
    navy: "#0A1E44",
    blue: "#1E5CB3",
    blueLight: "#EAF3FE",
    bg: "#F4F7FB"
};

export default function ValiflowLearns() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await adminService.getLearningStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to load learning stats", err);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    if (loading) {
        return <div className="p-8 text-slate-500">Analyserar inlärningsdata...</div>;
    }

    return (
        <div className="min-h-screen" style={{ background: VF.bg }}>
            <header
                className="px-8 py-6 shadow-sm text-white"
                style={{ background: `linear-gradient(90deg, ${VF.navy} 0%, ${VF.blue} 100%)` }}
            >
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                            <SparklesIcon className="w-6 h-6 text-yellow-300" />
                            Valiflow Learns
                        </h1>
                        <p className="text-blue-100/80 text-sm mt-1">
                            Översikt över systemets självlärande förmåga och identifierade mönster.
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-blue-200">Senaste inlärning: {new Date(stats?.lastLearningEvent || Date.now()).toLocaleTimeString()}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* KPI Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid sm:grid-cols-3 gap-4"
                >
                    <KpiCard
                        title="Identifierade Mönster"
                        value={stats?.patternsCount || 0}
                        icon={ShieldCheckIcon}
                        trend="+2 this week"
                    />
                    <KpiCard
                        title="AI Insikter"
                        value={stats?.insightsCount || 0}
                        icon={LightBulbIcon}
                    />
                    <KpiCard
                        title="Feedback Loop"
                        value={stats?.feedbackCount || 0}
                        icon={ChatBubbleLeftRightIcon}
                    />
                </motion.div>

                {/* Detailed View */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <ShieldCheckIcon className="w-5 h-5 text-indigo-600" />
                                Nyligen inlärda mönster
                            </h3>

                            {stats?.recentPatterns?.length > 0 ? (
                                <div className="space-y-4">
                                    {stats.recentPatterns.map((p, i) => (
                                        <div key={i} className="flex flex-col gap-1 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-slate-700 text-sm">
                                                    {p.supplierName || "Okänd leverantör"}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(p.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                Risk: {p.riskAvg.toFixed(1)} | Godkända: {p.approvedCount}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-slate-400 italic py-8 text-center">
                                    Inga nya mönster hittade än.
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-[#EAF3FE] border border-[#1E5CB3]/10 p-6 rounded-xl relative overflow-hidden h-full">
                            <div className="relative z-10">
                                <h3 className="font-semibold text-[#1E5CB3] text-lg mb-3">AI Copilot Analys</h3>
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    Valiflow använder feedback från handläggare för att kontinuerligt finjustera sina riskmodeller.
                                    Just nu ser vi en stabil förbättring i precisionen för bedrägeridetekanering.
                                </p>
                                <div className="flex items-center gap-2 text-sm font-medium text-[#1E5CB3]">
                                    <ArrowPathIcon className="w-4 h-4 animate-spin-slow" />
                                    Systemet lär sig aktivt
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
