// src/demo/story/StoryDirector.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PlayIcon, PauseIcon, ForwardIcon, ArrowPathIcon, XMarkIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// Shared Components
import NarratorBox from "./components/NarratorBox";
import SceneContainer from "./components/SceneContainer";

// Scenes
import Scene1_Welcome from "./scenes/Scene1_Welcome";
import Scene2_Import from "./scenes/Scene2_Import";
import Scene3_Pipeline from "./scenes/Scene3_Pipeline";
import Scene4_Flagged from "./scenes/Scene4_Flagged";
import Scene5_Graph from "./scenes/Scene5_Graph";
import Scene6_AIInfos from "./scenes/Scene6_AIInfos";
import Scene7_Summary from "./scenes/Scene7_Summary";
import Scene8_CTA from "./scenes/Scene8_CTA";

import { DemoProvider } from "../DemoContext";

// Total Duration: 56s matching 'narration.mp3'
const SCENES = [
    { id: "welcome", duration: 8.5, Component: Scene1_Welcome, label: "Intro" },       // "I Norden... kontrollager." (0-8.5s)
    { id: "import", duration: 9.5, Component: Scene2_Import, label: "Platform" },      // "Valiflow... systembyte." (8.5-18s)
    { id: "pipeline", duration: 5.0, Component: Scene3_Pipeline, label: "AI Scan" },   // "AI:n läser... dokument" (18-23s)
    { id: "flagged", duration: 8.5, Component: Scene4_Flagged, label: "Risks" },       // "Avvikelser... bokförs" (23-31.5s)
    { id: "graph", duration: 8.5, Component: Scene5_Graph, label: "Network" },         // "Med vårt... tvären" (31.5-40s)
    // Merging visual slot, scene 6 is just "hidden" technically or shares text? 
    // Text says "Och i dashboarden...". 
    // Let's use Scene 7 (Summary) visuals for this part as it matches "insikter, trender".
    // We'll skip Scene 6 (AI Text) visually or use it fast? 
    // Actually Scene 7 has KPIs. Script: "tydliga insikter".
    // Let's drop Scene 6 (Typewriter) and just go to Scene 7 for 9s.
    { id: "summary", duration: 10.0, Component: Scene7_Summary, label: "Insights" },   // "Och i dashboarden... direkt" (40-50s)
    { id: "cta", duration: 6.0, Component: Scene8_CTA, label: "Finish" },              // "Valiflow... beslut" (50-56s)
];

// TOTAL: ~56s

export default function StoryDirector() {
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false); // Start paused so valid interaction can start audio
    const [elapsed, setElapsed] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const totalDuration = useMemo(() => SCENES.reduce((acc, s) => acc + s.duration, 0), []);

    const audioRef = useRef(new Audio("/narration.mp3"));
    const requestRef = useRef();

    // --- AUDIO INIT ---
    useEffect(() => {
        // Preload
        audioRef.current.preload = "auto";
        audioRef.current.volume = 1.0;

        // Start immediately if possible (Chrome might block, but let's try)
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.log("Autoplay blocked, waiting for interaction");
                setIsPlaying(false);
            });
        }

        // Listen to audio end
        audioRef.current.onended = () => {
            setIsPlaying(false);
            // setElapsed(totalDuration); 
        };

        return () => {
            audioRef.current.pause();
            cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // --- SYNC LOOP ---
    const syncLoop = () => {
        if (!isPlaying) return;

        const currentTime = audioRef.current.currentTime;
        setElapsed(currentTime);

        if (currentTime >= totalDuration) {
            setIsPlaying(false);
        } else {
            requestRef.current = requestAnimationFrame(syncLoop);
        }
    };

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error(e));
            requestRef.current = requestAnimationFrame(syncLoop);
        } else {
            audioRef.current.pause();
            cancelAnimationFrame(requestRef.current);
        }
    }, [isPlaying]);

    // --- MUTE ---
    useEffect(() => {
        audioRef.current.muted = isMuted;
    }, [isMuted]);

    // --- SCENE RESOLUTION ---
    const currentSceneIdx = useMemo(() => {
        let accumulated = 0;
        for (let i = 0; i < SCENES.length; i++) {
            if (elapsed < accumulated + SCENES[i].duration) return i;
            accumulated += SCENES[i].duration;
        }
        return SCENES.length - 1;
    }, [elapsed]);

    const currentScene = SCENES[currentSceneIdx];
    const sceneStartTime = SCENES.slice(0, currentSceneIdx).reduce((acc, s) => acc + s.duration, 0);
    const sceneProgress = Math.min(Math.max((elapsed - sceneStartTime) / currentScene.duration, 0), 1);

    // --- CONTROLS ---
    const handleSeek = (scanIdx) => {
        const newTime = SCENES.slice(0, scanIdx).reduce((acc, s) => acc + s.duration, 0);
        setElapsed(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const handleReplay = () => {
        setElapsed(0);
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            setIsPlaying(true);
        }
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <DemoProvider>
            <div className="fixed inset-0 bg-slate-950 flex flex-col font-sans overflow-hidden">
                {/* VIEWPORT */}
                <div className="flex-1 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentScene.id}
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <SceneContainer>
                                <currentScene.Component progress={sceneProgress} globalTime={elapsed} />
                            </SceneContainer>
                        </motion.div>
                    </AnimatePresence>

                    {/* EXIT BUTTON */}
                    <button
                        onClick={() => navigate('/demo')}
                        className="absolute top-6 right-6 z-50 p-2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition"
                    >
                        <XMarkIcon className="w-8 h-8" />
                    </button>

                    {/* MUTE TOGGLE (Top Left) */}
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="absolute top-6 left-6 z-50 p-2 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition"
                    >
                        {isMuted ? <SpeakerXMarkIcon className="w-6 h-6" /> : <SpeakerWaveIcon className="w-6 h-6" />}
                    </button>

                    {/* CLICK TO START OVERLAY (If blocked) */}
                    {elapsed === 0 && !isPlaying && (
                        <div className="absolute inset-0 z-40 bg-black/60 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-full shadow-2xl group"
                            >
                                <PlayIcon className="w-16 h-16 text-white group-hover:scale-110 transition" />
                            </motion.div>
                            <p className="absolute bottom-1/3 text-white/80 font-medium animate-pulse">Klicka för att starta presentationen</p>
                        </div>
                    )}
                </div>

                {/* CONTROLS (Bottom Bar) */}
                <div className="h-24 bg-gradient-to-t from-black via-black/80 to-transparent px-8 pb-8 flex items-end justify-between z-50 pointer-events-auto">

                    <div className="flex-1 max-w-4xl mx-auto flex flex-col gap-2">
                        <NarratorBox sceneId={currentScene.id} progress={sceneProgress} />

                        <div className="flex items-center gap-4 mt-2">
                            <button
                                onClick={togglePlay}
                                className="p-2 rounded-full bg-white text-black hover:scale-105 transition shadow-lg shadow-white/20"
                            >
                                {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5 ml-0.5" />}
                            </button>

                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden flex cursor-pointer relative group">
                                {SCENES.map((scene, idx) => {
                                    const isActive = idx === currentSceneIdx;
                                    const isPast = idx < currentSceneIdx;
                                    return (
                                        <div
                                            key={scene.id}
                                            className="h-full relative border-r border-black/20 last:border-0 transition-colors hover:bg-white/20"
                                            style={{ flex: scene.duration }}
                                            onClick={() => handleSeek(idx)}
                                            title={scene.label}
                                        >
                                            {(isActive || isPast) && (
                                                <motion.div
                                                    className="h-full bg-blue-500 absolute left-0 top-0 bottom-0"
                                                    style={{
                                                        width: isPast ? "100%" : `${sceneProgress * 100}%`,
                                                        transition: isPast ? "none" : "width 0.1s linear"
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="flex gap-2">
                                <button onClick={handleReplay} className="p-2 text-white/50 hover:text-white">
                                    <ArrowPathIcon className="w-5 h-5" />
                                </button>
                                {currentSceneIdx < SCENES.length - 1 && (
                                    <button
                                        onClick={() => handleSeek(SCENES.length - 1)}
                                        className="p-2 text-white/50 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1"
                                    >
                                        SKIP <ForwardIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DemoProvider>
    );
}
