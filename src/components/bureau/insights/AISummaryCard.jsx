import React from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function AISummaryCard({ text }) {
    if (!text) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#EAF3FE] border border-[#1E5CB3]/10 p-5 rounded-xl flex items-start gap-3"
        >
            <SparklesIcon className="w-6 h-6 text-[#1E5CB3] mt-0.5 shrink-0" />
            <div>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">{text}</p>
                <p className="text-xs text-slate-500 mt-1">
                    Uppdaterad {new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
                </p>
            </div>
        </motion.div>
    );
}
