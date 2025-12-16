
import React from "react";
import { Tooltip, ResponsiveContainer, Treemap } from "recharts";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from "@heroicons/react/24/outline";

const RiskItem = (props) => {
    const { root, depth, x, y, width, height, index, name, risk, score, trend, trendValue } = props;

    const getColor = (r) => {
        if (r === 'high') return "#FEE2E2"; // red-100
        if (r === 'medium') return "#FEF3C7"; // amber-100
        return "#ECFDF5"; // emerald-50
    };

    const getTextColor = (r) => {
        if (r === 'high') return "#B91C1C";
        if (r === 'medium') return "#B45309";
        return "#047857";
    };

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: getColor(risk),
                    stroke: "#fff",
                    strokeWidth: 2,
                }}
            />
            {width > 50 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill={getTextColor(risk)}
                    fontSize={12}
                    fontWeight="500"
                    dy={-6}
                >
                    {name.split(" ")[0]}
                </text>
            )}
            {width > 50 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill={getTextColor(risk)}
                    fontSize={10}
                    dy={10}
                    opacity={0.8}
                >
                    Risk: {score}
                </text>
            )}
        </g>
    );
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg text-sm z-50">
                <p className="font-semibold text-slate-800">{data.name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${data.risk === 'high' ? 'bg-red-100 text-red-700' :
                            data.risk === 'medium' ? 'bg-amber-100 text-amber-700' :
                                'bg-emerald-100 text-emerald-700'
                        }`}>
                        Riskpoäng: {data.score}
                    </span>
                    <span className="flex items-center text-xs text-slate-500 gap-1">
                        {data.trend === 'up' && <ArrowTrendingUpIcon className="w-3 h-3 text-red-500" />}
                        {data.trend === 'down' && <ArrowTrendingDownIcon className="w-3 h-3 text-emerald-500" />}
                        {data.trend === 'stable' && <MinusIcon className="w-3 h-3 text-slate-400" />}
                        {data.trendValue}
                    </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Klicka för detaljer</p>
            </div>
        );
    }
    return null;
};

export default function RiskHeatmap({ data }) {
    if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-slate-400 border border-dashed rounded-lg">Ingen data tillgänglig</div>;

    // Transform flat list to hierarchy if needed, but Treemap takes array too
    // For simple look we just map data to a children format Recharts likes sometimes or flat
    // Recharts Treemap expects nested data usually
    const chartData = [
        {
            name: 'Root',
            children: data
        }
    ];

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
            <div className="mb-4">
                <h3 className="font-semibold text-slate-800">Kundrisker (Heatmap)</h3>
                <p className="text-xs text-slate-500">Visualisering baserad på 30 dagars riskaktivitet.</p>
            </div>

            <div className="flex-1 w-full min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={data}
                        dataKey="score"
                        aspectRatio={4 / 3}
                        stroke="#fff"
                        content={<RiskItem />}
                    >
                        <Tooltip content={<CustomTooltip />} />
                    </Treemap>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
