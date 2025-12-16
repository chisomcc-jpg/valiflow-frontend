import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { demoEngine } from '../demoEngine';

export default function DemoUploadModal({ isOpen, onClose }) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        // Simulate upload with dropped files
        // In a real app we'd process e.dataTransfer.files
        demoEngine.startUploadSimulation(false);
    }, []);

    const handleExampleData = () => {
        demoEngine.startUploadSimulation(true);
    };

    const handleBrowse = () => {
        // Simulate file selection
        demoEngine.startUploadSimulation(false);
    }

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900">Ladda upp fakturor</h3>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-500 transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={handleBrowse}
                            className={`
                relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl transition-all cursor-pointer
                ${isDragging
                                    ? 'border-indigo-500 bg-indigo-50/50'
                                    : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                                }
              `}
                        >
                            <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                                <CloudArrowUpIcon className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-medium text-slate-900">
                                Klicka för att välja eller dra och släpp
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                PDF, JPG, PNG upp till 10MB
                            </p>
                        </div>

                        <div className="relative mt-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500 font-medium">Eller testa snabbt</span>
                            </div>
                        </div>

                        <button
                            onClick={handleExampleData}
                            className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded-xl transition-all font-medium group"
                        >
                            <DocumentIcon className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                            Testa med exempeldata (3 st)
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
