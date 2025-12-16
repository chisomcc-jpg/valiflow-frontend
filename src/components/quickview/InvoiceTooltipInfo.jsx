
import React from 'react';
import SimpleTooltip from '@/components/SimpleTooltip';

export default function InvoiceTooltipInfo({ children, text }) {
    if (!text) return children;

    return (
        <SimpleTooltip content={text}>
            <span className="cursor-help border-b border-dotted border-slate-300 hover:border-slate-400 transition-colors">
                {children}
            </span>
        </SimpleTooltip>
    );
}
