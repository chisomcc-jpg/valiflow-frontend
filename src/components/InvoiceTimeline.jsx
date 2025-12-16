import React from "react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { ArrowDownTrayIcon, CpuChipIcon, CheckCircleIcon, BanknotesIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const EVENT_ICONS = {
    "upload": ArrowDownTrayIcon,
    "analysis": CpuChipIcon,
    "metadata": ShieldCheckIcon,
    "bankgiro": BanknotesIcon,
    "approval": CheckCircleIcon,
    "info": CheckCircleIcon
};

function TimelineItem({ event, isLast }) {
    const Icon = EVENT_ICONS[event.type] || EVENT_ICONS["info"];

    return (
        <div className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
                <div className="absolute left-3.5 top-8 bottom-0 w-0.5 bg-slate-200" />
            )}

            <div className={`
                relative z-10 w-7 h-7 rounded-full flex items-center justify-center border shrink-0 bg-white
                ${event.type === 'analysis' ? 'border-indigo-200 text-indigo-600' : 'border-slate-200 text-slate-400'}
            `}>
                <Icon className="w-4 h-4" />
            </div>

            <div className="flex-1 pt-0.5">
                <p className="text-sm font-medium text-slate-900">{event.text}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500 font-mono">
                        {event.time ? format(new Date(event.time), "HH:mm:ss", { locale: sv }) : "--:--"}
                    </span>
                    <span className="text-xs text-slate-400">• {event.user}</span>
                </div>
            </div>
        </div>
    )
}

export default function InvoiceTimeline({ events }) {
    if (!events || events.length === 0) return (
        <div className="p-4 text-center text-xs text-slate-400 italic">Ingen historik tillgänglig.</div>
    );

    return (
        <div className="p-6">
            {events.map((event, i) => (
                <TimelineItem key={event.id || i} event={event} isLast={i === events.length - 1} />
            ))}
        </div>
    );
}
