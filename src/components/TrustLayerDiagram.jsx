// src/components/TrustLayerDiagram.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function TrustLayerDiagram() {
    return (
        <div className="w-full h-full relative font-sans text-white select-none">

            {/* Container Card */}
            <div className="
        relative rounded-3xl 
        bg-[#0a0d1b] /* Requested Dark Navy */
        border border-white/10 
        shadow-[0_18px_40px_rgba(0,0,0,0.45)]
        backdrop-blur-[14px] 
        p-6 sm:p-8
        overflow-hidden
      ">

                {/* Ambient Glows */}
                <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-blue-500/10 blur-[80px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-emerald-500/10 blur-[80px] pointer-events-none" />

                {/* --- GRID LAYOUT --- */}
                <div className="grid grid-cols-[1fr,auto,1fr] gap-6 sm:gap-8 items-stretch relative z-10">

                    {/* COLUMN 1: DINA SYSTEM (Input) */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 pl-1">
                            Dina system
                        </h3>

                        <div className="space-y-3">
                            {[
                                { name: "Fortnox", letter: "F", color: "bg-red-500" },
                                { name: "Visma.net", letter: "V", color: "bg-blue-600" },
                                { name: "Business Central", letter: "B", color: "bg-cyan-600" },
                                { name: "Monitor", letter: "M", color: "bg-indigo-600" },
                            ].map((sys, idx) => (
                                <motion.div
                                    key={sys.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                                    whileHover={{ x: 2, backgroundColor: "rgba(255,255,255,0.08)" }}
                                    className="
                    group flex items-center gap-3 
                    px-4 py-3 rounded-xl 
                    bg-white/[0.03] border border-white/[0.08]
                    transition-all duration-300
                  "
                                >
                                    <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center 
                    text-[11px] font-bold text-white shadow-lg
                    bg-gradient-to-br from-white/10 to-transparent border border-white/10
                  `}>
                                        {sys.letter}
                                    </div>
                                    <span className="text-sm text-white/80 font-medium group-hover:text-white transition-colors">
                                        {sys.name}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-[10px] text-white/30 text-center mt-2 font-medium tracking-wide">
                            API-koppling via säkra integrationer
                        </p>
                    </div>

                    {/* COLUMN 2: VALIFLOW · TRUST LAYER (Processor) */}
                    <div className="flex flex-col items-center justify-center relative px-2">
                        {/* Creating the connections visually with lines */}
                        {/* Left Lines */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[20px] w-[20px] flex flex-col justify-between h-[60%] opacity-20">
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-white" />
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-white" />
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-white" />
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent to-white" />
                        </div>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                            className="
                relative z-20
                w-[220px] flex flex-col gap-4
                rounded-2xl p-6
                text-center
                border border-white/10
                shadow-[0_20px_50px_-12px_rgba(0,255,170,0.15)]
              "
                            style={{
                                background: "linear-gradient(135deg, #233654 0%, #0a1120 100%)",
                                boxShadow: "0 0 0 1px rgba(255,255,255,0.05), 0 0 40px -10px rgba(0,255,170,0.1)"
                            }}
                        >
                            {/* Glow Border Effect */}
                            <div className="absolute inset-0 rounded-2xl border border-[#00ffaa]/10 pointer-events-none" />

                            {/* Logo / Title */}
                            <div className="flex flex-col items-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00ffaa] to-blue-500 shadow-lg shadow-[#00ffaa]/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-[#0a1120]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-base leading-tight">Valiflow</h3>
                                    <p className="text-[#00ffaa] text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ textShadow: "0 0 10px rgba(0,255,170,0.4)" }}>
                                        TRUST LAYER
                                    </p>
                                </div>
                            </div>

                            {/* Features List */}
                            <ul className="text-left space-y-2.5">
                                {[
                                    "AI validerar varje faktura i realtid.",
                                    "Upptäcker avvikelser och risk innan betalning.",
                                    "Skapar revisionsspår & compliance-logg."
                                ].map((item, i) => (
                                    <li key={i} className="text-[11px] text-white/80 leading-snug flex items-start gap-2">
                                        <span className="mt-0.5 w-1 h-1 rounded-full bg-[#00ffaa] shadow-[0_0_8px_#00ffaa]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Processing Indicator */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#050C22] border border-[#00ffaa]/30 flex items-center gap-2 shadow-lg">
                                <div className="flex gap-1">
                                    <span className="w-1 h-1 rounded-full bg-[#00ffaa] animate-bounce" style={{ animationDelay: '0s' }} />
                                    <span className="w-1 h-1 rounded-full bg-[#00ffaa] animate-bounce" style={{ animationDelay: '0.1s' }} />
                                    <span className="w-1 h-1 rounded-full bg-[#00ffaa] animate-bounce" style={{ animationDelay: '0.2s' }} />
                                </div>
                                <span className="text-[9px] font-semibold text-[#00ffaa]">PROCESSING</span>
                            </div>
                        </motion.div>

                        {/* Right Arrow */}
                        <div className="absolute right-[-14px] top-1/2 -translate-y-1/2 text-white/20">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>

                    {/* COLUMN 3: RESULTAT (Output) */}
                    <div className="flex flex-col gap-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-2 pl-1 text-right">
                            Resultat
                        </h3>

                        <div className="flex flex-col gap-3 h-full justify-center">
                            {[
                                { title: "CFO & Ekonomi", desc: "Full kontroll på risk & moms.\nFärre felbetalningar." },
                                { title: "Byråteam", desc: "Strukturerad arbetslista.\nMindre manuellt granskande." },
                                { title: "Compliance & revision", desc: "Spårbarhet för ViDA & intern kontroll." }
                            ].map((card, idx) => (
                                <motion.div
                                    key={card.title}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + (idx * 0.15), duration: 0.5 }}
                                    whileHover={{ y: -2 }}
                                    className="
                            bg-gradient-to-b from-white/[0.08] to-white/[0.02]
                            border border-white/10 hover:border-white/20
                            rounded-xl p-3.5
                            shadow-lg shadow-black/20
                            transition-all duration-300
                            cursor-default
                        "
                                >
                                    <h4 className="text-sm font-bold text-white mb-1">{card.title}</h4>
                                    <p className="text-[11px] text-white/60 leading-relaxed whitespace-pre-line">
                                        {card.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
