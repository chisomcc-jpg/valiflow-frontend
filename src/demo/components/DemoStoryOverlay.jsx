import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDemoStory } from "../context/DemoStoryContext";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function DemoStoryOverlay() {
    const { activeStep, stopStory, advance, script } = useDemoStory();
    const [targetRect, setTargetRect] = useState(null);
    const navigate = useNavigate();

    const stepData = script[activeStep];

    // Handle Next Step / Navigation
    const handleNext = () => {
        if (stepData.nextPath) {
            navigate(stepData.nextPath);
            // The Context will handle step switching based on route
        } else {
            advance(null);
        }
    };

    // Track Target Position
    useEffect(() => {
        if (!stepData?.targetSelector) {
            setTargetRect(null);
            return;
        }

        const updateRect = () => {
            const el = document.querySelector(stepData.targetSelector);
            if (el) {
                const rect = el.getBoundingClientRect();
                setTargetRect({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    bottom: rect.bottom,
                    right: rect.right
                });
            }
        };

        // Poll for element presence (it might render late)
        const interval = setInterval(updateRect, 500);
        updateRect();

        window.addEventListener("scroll", updateRect, { capture: true });
        window.addEventListener("resize", updateRect);

        return () => {
            clearInterval(interval);
            window.removeEventListener("scroll", updateRect, { capture: true });
            window.removeEventListener("resize", updateRect);
        };
    }, [activeStep, stepData]);

    if (!activeStep || !stepData) return null;

    // RENDER: CENTERED OVERLAY (ARRIVAL)
    if (stepData.position === "top-center") {
        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="fixed top-24 right-8 z-[60] w-96"
                >
                    <div className="bg-slate-900 text-white rounded-xl shadow-2xl p-6 border border-slate-700 relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

                        <button onClick={stopStory} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                            <XMarkIcon className="w-5 h-5" />
                        </button>

                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-2 text-white">{stepData.title}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed mb-6">
                                {stepData.text}
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleNext}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    {stepData.actionText} <ChevronRightIcon className="w-4 h-4" />
                                </button>
                                <button onClick={stopStory} className="text-slate-400 hover:text-white px-3 py-2 text-sm font-medium">
                                    {stepData.skipText}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        );
    }

    // RENDER: ANCHORED TOOLTIP
    if (targetRect) {
        // Calculate Position
        let style = {};
        if (stepData.position === "bottom-start") {
            style = { top: targetRect.bottom + 12, left: targetRect.left };
        } else if (stepData.position === "right-start") {
            style = { top: targetRect.top, left: targetRect.right + 12 };
        } else if (stepData.position === "top-start") {
            style = { bottom: window.innerHeight - targetRect.top + 12, left: targetRect.left };
        }

        return (
            <>
                {/* HIGHLIGHT BOX */}
                <motion.div
                    layoutId="story-highlight"
                    className="fixed z-[55] pointer-events-none border-2 border-indigo-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"
                    style={{
                        top: targetRect.top - 4,
                        left: targetRect.left - 4,
                        width: targetRect.width + 8,
                        height: targetRect.height + 8,
                        // The shadow simulates the backdrop without blocking clicks if strictly needed, 
                        // but pointer-events-none on box means clicks go through to underlying element if z-index allows.
                        // However, standard overlay usually blocks everything else. 
                        // User request: "User is ALWAYS in control", "Highlight ONE row". 
                        // We'll use a ring/box, but maybe not a full dark backdrop if "No blur" was requested?
                        // "No blur" doesn't mean no dimming. But let's stick to just the highlight box + tooltip to be safe and clean.
                        boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.2)" // Halo instead of backdrop
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />

                {/* TOOLTIP */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={style}
                    className="fixed z-[60] w-80 bg-slate-900 text-white p-5 rounded-lg shadow-xl border border-slate-700"
                >
                    <h4 className="font-bold text-base mb-1 text-indigo-400">{stepData.title}</h4>
                    <p className="text-sm text-slate-300 mb-4 leading-relaxed">{stepData.text}</p>

                    <div className="flex justify-end gap-3">
                        {stepData.id !== 'anomaly' && ( // Anomaly step expects user to CLICK the row, not "Next"
                            <button
                                onClick={() => advance(null)} // Or specific next logic
                                className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors"
                            >
                                {stepData.actionText}
                            </button>
                        )}
                        <button onClick={stopStory} className="text-xs text-slate-500 hover:text-slate-300">
                            Stäng
                        </button>
                    </div>

                    {/* Arrow */}
                    {/* Simplifying by skipping CSS arrow for now */}
                </motion.div>
            </>
        );
    }

    return null;
}
