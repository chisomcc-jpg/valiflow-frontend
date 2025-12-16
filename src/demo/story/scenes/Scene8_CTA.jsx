// src/demo/story/scenes/Scene8_CTA.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Scene8_CTA() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <motion.h1
                className="text-5xl md:text-7xl font-bold text-white mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                Valiflow
            </motion.h1>
            <motion.p
                className="text-2xl text-slate-300 mb-12 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Ert Trust Layer för framtidens ekonomi.
            </motion.p>

            <div className="flex gap-6">
                <Link to="/demo/overview">
                    <motion.button
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg shadow-blue-900/50 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Utforska demot själv <ArrowRightIcon className="w-5 h-5" />
                    </motion.button>
                </Link>
                <Link to="/signup">
                    <motion.button
                        className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full text-lg font-semibold backdrop-blur-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Starta gratis pilot
                    </motion.button>
                </Link>
            </div>
        </div>
    );
}
