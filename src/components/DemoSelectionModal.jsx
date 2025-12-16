import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BuildingOffice2Icon, BriefcaseIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function DemoSelectionModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Välj Demo-upplevelse</h2>
                            <p className="text-slate-500 text-sm mt-1">Hur vill du uppleva Valiflow?</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-8 grid md:grid-cols-2 gap-6">

                        {/* Option 1: Company */}
                        <button
                            onClick={() => { navigate('/demo/company/overview'); onClose(); }}
                            className="group flex flex-col items-start text-left p-6 rounded-xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/10 transition-all duration-200 relative overflow-hidden"
                        >
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <BuildingOffice2Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">För Företag</h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                Jag är CFO eller ekonomichef och vill automatisera fakturagranskning.
                            </p>
                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide mt-auto">Starta Demo &rarr;</span>
                        </button>

                        {/* Option 2: Bureau */}
                        <button
                            onClick={() => { navigate('/demo/bureau/overview'); onClose(); }}
                            className="group flex flex-col items-start text-left p-6 rounded-xl border-2 border-slate-100 hover:border-emerald-600 hover:bg-emerald-50/10 transition-all duration-200 relative overflow-hidden"
                        >
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <BriefcaseIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">För Redovisningsbyrå</h3>
                            <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                Jag vill övervaka, hantera och säkra risker för flera klienter samtidigt.
                            </p>
                            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide mt-auto">Starta Demo &rarr;</span>
                        </button>

                    </div>

                    <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
                        Ingen inloggning krävs. Du landar direkt i en isolerad testmiljö.
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
