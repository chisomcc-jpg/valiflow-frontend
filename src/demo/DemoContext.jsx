// src/demo/DemoContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { demoEngine } from "./demoEngine";

const DemoContext = createContext(null);

export const DemoProvider = ({ children }) => {
    const [state, setState] = useState(demoEngine.state);

    useEffect(() => {
        // Subscribe to engine updates
        const unsubscribe = demoEngine.subscribe(setState);
        return () => unsubscribe();
    }, []);

    const value = {
        ...state,
        uploadInvoice: (file) => demoEngine.uploadInvoiceSimulation(file),
        resetDemo: () => demoEngine.resetDemo(),
    };

    return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

export const useDemo = () => {
    const context = useContext(DemoContext);
    if (!context) {
        throw new Error("useDemo must be used within a DemoProvider");
    }
    return context;
};
