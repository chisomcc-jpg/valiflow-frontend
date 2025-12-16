
// src/components/LearningBadge.jsx
import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function LearningBadge({ className, trigger }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-medium text-indigo-700 w-fit",
                className
            )}
        >
            <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
            <span>Valiflow is learning</span>
            {trigger && <span className="text-indigo-400 mx-1">•</span>}
            {trigger && <span className="opacity-80 font-normal">{trigger}</span>}
        </motion.div>
    );
}
