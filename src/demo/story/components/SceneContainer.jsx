// src/demo/story/components/SceneContainer.jsx
import React from 'react';

// Common wrapper to ensure Full Screen centering or layout
export default function SceneContainer({ children }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12 overflow-hidden bg-[#0F172A]">
            <div className="relative w-full h-full max-w-[1600px] flex flex-col">
                {children}
            </div>
        </div>
    );
}
