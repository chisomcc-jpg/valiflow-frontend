// src/demo/story/components/OverlayHighlight.jsx
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Highlights a specific area of the screen by dimming the rest (optionally)
 * or simply adding a glowing border around the target.
 */
export default function OverlayHighlight({ children, isActive, label }) {
    if (!isActive) return children;

    return (
        <div className="relative z-20">
            <motion.div
                layoutId="highlight-box"
                className="absolute -inset-4 rounded-xl border-2 border-blue-500/50 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.2)] pointer-events-none"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
            />
            {label && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 left-0 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg"
                >
                    {label}
                </motion.div>
            )}
            {children}
        </div>
    );
}
