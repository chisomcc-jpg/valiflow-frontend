// src/demo/story/scenes/Scene5_Graph.jsx
import React from 'react';
import { motion } from 'framer-motion';

// Mock nodes for visual effect
const NODES = [
    { x: 50, y: 50, color: '#10b981', size: 20 }, // Central strong
    { x: 45, y: 40, color: '#10b981', size: 10 },
    { x: 55, y: 60, color: '#ef4444', size: 15, pulse: true }, // Risk
    { x: 60, y: 55, color: '#ef4444', size: 10 },
    { x: 30, y: 50, color: '#f59e0b', size: 12 },
    { x: 70, y: 40, color: '#10b981', size: 12 },
    { x: 40, y: 70, color: '#10b981', size: 14 },
    { x: 58, y: 65, color: '#ef4444', size: 8 },
];

export default function Scene5_Graph() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-white mb-8">Nätverksanalys</h2>

            <div className="relative w-[600px] h-[400px] bg-slate-900/50 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                {/* Grid */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                {/* Connections (SVG) */}
                <svg className="absolute inset-0 w-full h-full">
                    <motion.path
                        d="M 330 240 L 270 200"
                        stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }}
                    />
                    <motion.path
                        d="M 300 200 L 330 240"
                        stroke="#ef4444" strokeWidth="1"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }}
                    />
                    <motion.path
                        d="M 300 200 L 270 160"
                        stroke="#334155" strokeWidth="1"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }}
                    />
                </svg>

                {/* Nodes */}
                {NODES.map((node, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full shadow-lg border-2 border-white/20"
                        style={{
                            left: `${node.x}%`,
                            top: `${node.y}%`,
                            width: node.size * 2,
                            height: node.size * 2,
                            backgroundColor: node.color
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                    >
                        {node.pulse && (
                            <motion.div
                                className="absolute -inset-4 rounded-full border border-red-500/50"
                                animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        )}
                    </motion.div>
                ))}

                {/* Label */}
                <motion.div
                    className="absolute top-[60%] left-[58%] bg-red-900/80 text-white text-[10px] px-2 py-1 rounded border border-red-500/50 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                >
                    Riskkluster upptäckt
                </motion.div>
            </div>
        </div>
    );
}
