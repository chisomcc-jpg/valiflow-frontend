
import React from "react";
import { SparklesIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function AISummaryHero({ data }) {
    if (!data) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-start relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10"></div>

            <div className="bg-indigo-50 p-3 rounded-full shrink-0">
                <SparklesIcon className="w-6 h-6 text-indigo-600" />
            </div>

            <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                    <h2 className="font-semibold text-slate-800 text-lg">AI-analys av portföljen</h2>
                    <span className="text-xs text-slate-400 font-medium">Uppdaterad {data.updatedAt || "nyss"}</span>
                </div>

                <p className="text-slate-600 leading-relaxed max-w-3xl">
                    <span className="font-medium text-slate-900">{data.text}</span> {data.subText}
                </p>

                {data.recommendation && (
                    <div className="flex items-center gap-2 mt-3 text-sm text-indigo-700 font-medium bg-indigo-50/50 w-fit px-3 py-1.5 rounded-md border border-indigo-100/50 cursor-pointer hover:bg-indigo-50 transition">
                        <span>💡 {data.recommendation}</span>
                        <ArrowRightIcon className="w-3.5 h-3.5" />
                    </div>
                )}
            </div>
        </motion.div>
    );
}
