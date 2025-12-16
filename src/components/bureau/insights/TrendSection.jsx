import React from "react";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from "recharts";

const COLORS = {
    blue: "#1E5CB3",
    sub: "#94A3B8",
    border: "#E2E8F0"
};

export default function TrendSection({ trends }) {
    const { invoiceVolume, metadataIssues, supplierActivity } = trends || {};

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart 1: Invoice Volume */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                <h3 className="font-semibold text-slate-700 text-sm mb-1">Fakturavolym</h3>
                <p className="text-xs text-slate-500 mb-4">Utveckling senaste 30 dagarna.</p>
                <div className="h-40">
                    {invoiceVolume ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={invoiceVolume}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.border} />
                                <XAxis dataKey="date" hide />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="count" stroke={COLORS.blue} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <p className="text-xs text-slate-400">Laddar...</p>}
                </div>
            </div>

            {/* Chart 2: Metadata Issues */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                <h3 className="font-semibold text-slate-700 text-sm mb-1">Metadata-brister</h3>
                <p className="text-xs text-slate-500 mb-4">Vanligaste felen just nu.</p>
                <div className="h-40">
                    {metadataIssues ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metadataIssues} layout="vertical">
                                <XAxis type="number" hide />
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.border} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="text-xs text-slate-400">Laddar...</p>}
                </div>
            </div>

            {/* Chart 3: Supplier Activity */}
            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
                <h3 className="font-semibold text-slate-700 text-sm mb-1">Leverantörsaktivitet</h3>
                <p className="text-xs text-slate-500 mb-4">Ändringar & avvikelser per dag.</p>
                <div className="h-40">
                    {supplierActivity ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={supplierActivity}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.border} />
                                <XAxis dataKey="day" tick={{ fontSize: 10, fill: COLORS.sub }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="changes" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="text-xs text-slate-400">Laddar...</p>}
                </div>
            </div>
        </div>
    );
}
