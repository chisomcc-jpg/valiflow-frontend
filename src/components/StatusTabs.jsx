import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StatusTabs({ current, onChange, stats }) {
    const tabs = [
        { id: 'all', label: 'Alla', count: stats?.all },
        { id: 'approved', label: 'Godkända', count: stats?.approved },
        { id: 'flagged', label: 'Flaggade', count: stats?.flagged },
        { id: 'pending', label: 'Behöver granskning', count: stats?.pending },
        { id: 'rejected', label: 'Avvisade', count: stats?.rejected },
    ];

    return (
        <div className="flex gap-1 p-1 bg-slate-100/50 rounded-lg border border-slate-200/50 scale-95 origin-left">
            {tabs.map((tab) => {
                const isActive = current === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`
              relative px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1.5
              ${isActive ? "text-white" : "text-slate-600 hover:text-slate-900 hover:bg-white hover:shadow-sm"}
            `}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-[#1C2A5E] rounded-md shadow-sm"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className={`relative z-10 text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
