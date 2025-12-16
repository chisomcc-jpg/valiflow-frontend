import React from "react";

export function ValidationMessage({ message }) {
    if (!message) return null;
    return (
        <p className="text-xs text-red-500 mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">
            {message}
        </p>
    );
}
