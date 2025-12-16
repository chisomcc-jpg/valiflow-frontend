// src/demo/story/scenes/Scene1_Welcome.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function Scene1_Welcome() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            {/* Background Ambient Glow */}
            <motion.div
                className="absolute inset-0 bg-blue-500/10 blur-[120px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            />

            <motion.h1
                className="text-6xl md:text-8xl font-bold text-white tracking-tight mb-6 relative z-10"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                Valiflow
            </motion.h1>

            <motion.p
                className="text-xl md:text-2xl text-slate-300 max-w-2xl leading-relaxed relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            >
                Nordens första AI-drivna Trust Layer för leverantörsfakturor.
            </motion.p>
        </div>
    );
}
