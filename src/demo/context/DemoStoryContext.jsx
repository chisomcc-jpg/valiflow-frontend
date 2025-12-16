import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { STORY_SCRIPT } from "../story/storyScript";

const DemoStoryContext = createContext(null);

export function DemoStoryProvider({ children }) {
    const [activeStep, setActiveStep] = useState(null); // 'arrival', 'anomaly', etc.
    const [dismissed, setDismissed] = useState(false);
    const location = useLocation();

    // Reset flow on full reload? Or persist? For demo, reset is fine, or simple session storage.
    // For now, simple state.

    // FLOW LOGIC
    useEffect(() => {
        if (dismissed) return;

        const path = location.pathname;

        // 1. ARRIVAL (Overview)
        if (path.includes("/overview") && !path.includes("/bureau") && !activeStep) {
            setActiveStep("arrival");
        }

        // 2. ANOMALY (Invoices)
        if (path.includes("/invoices")) {
            // Only show if we moved past arrival
            setActiveStep("anomaly");
        }

        // Bureau paths - Handled by DemoWalkthrough.jsx now
        // if (path.includes("/bureau/overview") && !activeStep) {
        //     setActiveStep("arrival");
        // }

    }, [location, dismissed]);

    const advance = (nextStep) => {
        setActiveStep(nextStep);
    };

    const stopStory = () => {
        setDismissed(true);
        setActiveStep(null);
    };

    return (
        <DemoStoryContext.Provider value={{ activeStep, advance, stopStory, script: STORY_SCRIPT }}>
            {children}
        </DemoStoryContext.Provider>
    );
}

export const useDemoStory = () => useContext(DemoStoryContext);
