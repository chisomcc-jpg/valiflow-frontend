
import React, { useState, useEffect } from "react";
import { useFraudSSE } from "@/hooks/useFraudSSE";
import { ExclamationTriangleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export default function FraudFeed({ companyId }) {
    const [alerts, setAlerts] = useState([]);

    useFraudSSE({
        companyId,
        onAlert: (alert) => {
            // Prepend new alert
            setAlerts((prev) => [
                { id: Date.now(), ...alert, createdAt: new Date() },
                ...prev
            ].slice(0, 5)); // Keep max 5
        }
    });

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                    <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                    Risk- & Fraud-händelser
                </h3>
                <div className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">
                    LIVE
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
                {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-slate-400 text-sm">
                        <ShieldCheckIcon className="w-8 h-8 opacity-20 mb-2" />
                        Inga nya varningar
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {alerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm"
                            >
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-slate-800">
                                        {mapAlertType(alert.type || alert.event)}
                                    </span>
                                    <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                                        {formatTime(alert.createdAt || alert.ts)}
                                    </span>
                                </div>
                                <p className="text-slate-600 mt-1 text-xs">
                                    {alert.message || "Misstänkt aktivitet detekterad."}
                                </p>
                                {alert.payload?.supplierName && (
                                    <p className="text-xs text-[#1E5CB3] mt-1 font-medium">
                                        {alert.payload.supplierName}
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

function mapAlertType(type) {
    switch (type) {
        case "duplicate_detected": return "Duplikat upptäckt";
        case "supplier_anomaly": return "Leverantörsanomali";
        case "fraud_pattern_detected": return "Bedrägerimönster";
        case "trust_drop": return "Plötsligt tillitstapp";
        case "network_risk": return "Nätverksrisk";
        default: return "Säkerhetsvarning";
    }
}

function formatTime(dateInput) {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    return date.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
}
