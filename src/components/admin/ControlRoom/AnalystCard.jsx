import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * 🕵️‍♀️ AnalystCard
 * Displays AI Co-Pilot insights and Deterministic Normality checks.
 * Now fetches normality directly from the deterministic source of truth.
 */
export default function AnalystCard({ data, loading }) {
    const [normality, setNormality] = useState(null);
    const [nLoading, setNLoading] = useState(true);

    // 🔄 Fetch Deterministic Normality separate from AI
    useEffect(() => {
        async function fetchNormality() {
            try {
                const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
                // Auth header usually handled by interceptor, or we can grab token from context if needed.
                // Assuming global setup or inherited auth.
                const token = localStorage.getItem("token");
                const res = await axios.get(`${API_URL}/api/admin/normality-check`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setNormality(res.data);
            } catch (err) {
                console.error("Normality fetch failed", err);
            } finally {
                setNLoading(false);
            }
        }
        fetchNormality();
    }, []);

    if (loading || nLoading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow h-full animate-pulse">
                <div className="h-6 bg-gray-200 w-1/3 mb-4 rounded"></div>
                <div className="h-4 bg-gray-100 w-full mb-2 rounded"></div>
                <div className="h-4 bg-gray-100 w-2/3 rounded"></div>
            </div>
        );
    }

    if (!data) return null;

    // Combine AI summary with Deterministic Checks
    const isDeviation = normality?.status === "AVVIKELSE";

    return (
        <div className={`p-6 rounded-xl shadow border h-full flex flex-col ${isDeviation ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100"}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">AI Analyst</h2>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${isDeviation ? "bg-amber-200 text-amber-800" : "bg-green-100 text-green-800"}`}>
                    {normality?.status || "Starting..."}
                </div>
            </div>

            <p className="text-sm text-gray-600 mb-6 italic">
                "{data.summary}"
            </p>

            {/* Normalitetskontroll Section */}
            <div className="mt-auto">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-1 flex justify-between">
                    <span>Normalitetskontroll</span>
                    {isDeviation && <span className="text-amber-600 bg-amber-50 px-1 rounded">Silent Anomaly</span>}
                </h3>

                <div className="space-y-3">
                    {normality?.findings?.map((finding, idx) => {
                        // 🏷️ PHASE 3: Product Signal Tagging (Inference)
                        let tag = "System";
                        if (finding.messageSv.toLowerCase().includes("fakturavolym")) tag = "Beteendeförändring";
                        if (finding.messageSv.toLowerCase().includes("onboarding")) tag = "Onboarding";
                        if (finding.messageSv.toLowerCase().includes("integration")) tag = "Integration";
                        if (finding.messageSv.toLowerCase().includes("ai")) tag = "AI-avvikelse";

                        return (
                            <div key={idx} className="flex flex-col gap-1 pb-2 border-b last:border-0 border-gray-50">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700 font-medium">{finding.messageSv}</span>
                                    <span className={`h-2 w-2 rounded-full flex-shrink-0 ${finding.status === "AVVIKELSE" ? "bg-amber-500 animate-pulse" : "bg-green-500"}`}></span>
                                </div>

                                {finding.status === "AVVIKELSE" && (
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                                            #{tag}
                                        </span>
                                        {finding.metricDelta !== 0 && (
                                            <span className="text-xs text-red-600 font-medium">
                                                {finding.metricDelta > 0 ? '+' : ''}{finding.metricDelta}% volym (48h)
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {isDeviation && (
                    <div className="mt-4 p-3 bg-white/50 rounded border border-amber-200 text-xs text-amber-900">
                        <strong>Analyst Note:</strong> Inga tekniska fel rapporterade. Påverkan är isolerad till produktbeteende.
                    </div>
                )}
            </div>
        </div>
    );
}
