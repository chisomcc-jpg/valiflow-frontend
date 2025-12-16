
import React from "react";
import { SparklesIcon, ExclamationCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function AIHeroSummary({ data }) {
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-start relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 rounded-full shrink-0 border border-indigo-100">
                <SparklesIcon className="w-6 h-6 text-indigo-600" />
            </div>

            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                    <h2 className="font-semibold text-slate-800 text-lg">{data.title || "Trust Layer Analys"}</h2>
                    <span className="text-xs text-slate-400 font-medium">Uppdaterad {data.updatedAt || "nyss"}</span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <ShieldCheckIcon className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                        <p className="text-slate-700 font-medium">{data.text}</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <ExclamationCircleIcon className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-slate-600">{data.subText}</p>
                    </div>
                </div>

                {data.alertText && (
                    <div className={`mt-2 text-sm px-3 py-2 rounded-md border font-medium inline-block ${data.alertColor || "bg-red-50 text-red-700 border-red-100"}`}>
                        {data.alertIcon || "⚠️"} {data.alertText}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
