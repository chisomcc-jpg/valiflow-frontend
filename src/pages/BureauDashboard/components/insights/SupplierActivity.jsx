
import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from "recharts";

export default function SupplierActivity({ data }) {
    if (!data) return null;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
            <h3 className="font-semibold text-slate-800 mb-1">Aktivitetslogg</h3>
            <p className="text-xs text-slate-500 mb-4">Ändringar per dag (Bank, Adress m.m).</p>

            <div className="flex-1 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: '#F1F5F9' }}
                            content={({ payload, label }) => {
                                if (payload && payload.length) {
                                    return (
                                        <div className="bg-white p-2 border border-slate-100 shadow-md rounded text-xs">
                                            <p className="font-semibold mb-1">{label}</p>
                                            <p>{payload[0].value} ändringar</p>
                                            <p className="text-slate-400 italic">Mest: {payload[0].payload.label}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="changes" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.changes > 5 ? "#F59E0B" : "#1E5CB3"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
