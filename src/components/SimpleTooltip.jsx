
import React from 'react';

export default function SimpleTooltip({ children, content }) {
    return (
        <div className="group relative inline-flex flex-col items-center">
            {children}
            <div className="absolute bottom-full mb-2 hidden flex-col items-center group-hover:flex z-[60] w-max max-w-xs">
                <span className="relative z-10 p-3 text-xs leading-relaxed text-white bg-slate-800 shadow-xl rounded-lg text-center font-medium">
                    {content}
                </span>
                <div className="w-3 h-3 -mt-2 rotate-45 bg-slate-800"></div>
            </div>
        </div>
    );
}
