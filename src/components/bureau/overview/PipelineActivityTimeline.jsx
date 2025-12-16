import React from "react";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";

function ActivityGroup({ title, icon, items }) {
    if (!items || items.length === 0) return null;
    return (
        <div className="mb-6 last:mb-0">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                {icon} {title}
            </h4>
            <div className="space-y-4 relative border-l border-slate-200 ml-1.5 pl-4">
                {items.map((item, idx) => (
                    <div key={idx} className="relative">
                        <span className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white ${item.type === 'warning' || item.type === 'risk' ? 'bg-red-500' :
                                item.type === 'invoice' ? 'bg-blue-500' :
                                    item.type === 'supplier' ? 'bg-orange-500' : 'bg-indigo-500'
                            }`}></span>
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <p className="text-sm font-medium text-slate-800 leading-snug">{item.text}</p>
                                {item.subtext && <p className="text-xs text-slate-500 mt-0.5">{item.subtext}</p>}
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                                {format(parseISO(item.time), 'HH:mm', { locale: sv })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function PipelineActivityTimeline({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Aktivitetslogg</h3>
                <p className="text-sm text-slate-400 italic">Ingen aktivitet de senaste 24h.</p>
            </div>
        );
    }

    // Attempt to group data
    const risks = data.filter(i => ['warning', 'risk', 'alert'].includes(i.type));
    const invoices = data.filter(i => ['invoice', 'new_invoice'].includes(i.type));
    const suppliers = data.filter(i => ['supplier', 'supplier_change'].includes(i.type));
    // Catch-all for others
    const others = data.filter(i => !['warning', 'risk', 'alert', 'invoice', 'new_invoice', 'supplier', 'supplier_change'].includes(i.type));

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Händelselogg</h3>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Senaste 24h</span>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <ActivityGroup title="Riskhändelser" icon="🔥" items={risks} />
                <ActivityGroup title="Nya fakturor" icon="📄" items={invoices} />
                <ActivityGroup title="Leverantörer" icon="🔐" items={suppliers} />
                <ActivityGroup title="Övrigt" icon="🔔" items={others} />
            </div>
        </div>
    );
}
