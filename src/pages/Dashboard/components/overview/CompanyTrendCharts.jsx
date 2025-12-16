
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, LineChart, Line, AreaChart, Area } from "recharts";

const ChartWrapper = ({ title, children }) => (
    <Card className="flex-1 min-w-[300px]">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                {children}
            </ResponsiveContainer>
        </CardContent>
    </Card>
);

export default function CompanyTrendCharts({ data }) {
    if (!data) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Volume Chart */}
            <ChartWrapper title="Fakturavolym (30 dagar)">
                <BarChart data={data.volume}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ChartWrapper>

            {/* Metadata Issues Chart */}
            <ChartWrapper title="Metadatafel (Veckovis)">
                <LineChart data={data.metadata}>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="step" dataKey="value" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4, fill: '#F59E0B' }} />
                </LineChart>
            </ChartWrapper>

            {/* Risk Trend Chart */}
            <ChartWrapper title="Risktrend (YTD)">
                <AreaChart data={data.risk}>
                    <defs>
                        <linearGradient id="colorRiskCompany" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="value" stroke="#EF4444" fillOpacity={1} fill="url(#colorRiskCompany)" />
                </AreaChart>
            </ChartWrapper>
        </div>
    );
}
