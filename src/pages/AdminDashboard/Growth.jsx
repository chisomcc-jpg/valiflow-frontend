import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area
} from "recharts";
import {
    Users, TrendingUp, Clock, MousePointerClick,
    AlertTriangle, Globe, ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- Components ---

const StatCard = ({ title, value, sub, icon: Icon, color }) => (
    <Card>
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold mt-1">{value}</h3>
                {sub && <p className="text-xs text-green-600 mt-1">{sub}</p>}
            </div>
            <div className={`p-3 rounded-full ${color} bg-opacity-10 text-opacity-100`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </CardContent>
    </Card>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
        <div className="p-4 bg-white rounded-full shadow-sm">
            <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No Analytics Data Yet</h3>
        <p className="mt-1 text-sm text-gray-500 text-center max-w-xs">
            Data collection has started but no sessions have been recorded in this period.
        </p>
    </div>
);

export default function GrowthAnalytics() {
    const [loading, setLoading] = useState(true);
    const [overview, setOverview] = useState(null);
    const [funnel, setFunnel] = useState([]);
    const [geo, setGeo] = useState([]);
    const [pages, setPages] = useState([]);
    const [friction, setFriction] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Assuming axios interceptor handles auth
            const [resOverview, resFunnel, resGeo, resPages, resFriction] = await Promise.all([
                axios.get('/api/superadmin/analytics/overview'),
                axios.get('/api/superadmin/analytics/funnel'),
                axios.get('/api/superadmin/analytics/geo'),
                axios.get('/api/superadmin/analytics/pages'),
                axios.get('/api/superadmin/analytics/friction'),
            ]);

            setOverview(resOverview.data);
            setFunnel(resFunnel.data);
            setGeo(resGeo.data);
            setPages(resPages.data);
            setFriction(resFriction.data);
        } catch (error) {
            console.error("Failed to load analytics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading Growth Engine...</div>;

    // Strict No-Data Check
    const hasData = overview?.totalSessions > 0;

    if (!hasData) {
        return (
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Growth Engine</h1>
                    <Button onClick={fetchData} variant="outline">Refresh</Button>
                </div>
                <EmptyState />
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Growth Engine</h1>
                    <p className="text-gray-500 mt-1">Real-time first-party analytics & conversion insights.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={fetchData} variant="outline" size="sm">Refresh Data</Button>
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200">
                        Live Production
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Sessions"
                    value={overview.totalSessions}
                    icon={TrendingUp}
                    color="bg-blue-500 text-blue-600"
                />
                <StatCard
                    title="Unique Visitors"
                    value={overview.uniqueVisitors}
                    icon={Users}
                    color="bg-purple-500 text-purple-600"
                />
                <StatCard
                    title="Avg. Duration"
                    value={`${overview.avgDurationSeconds}s`}
                    icon={Clock}
                    color="bg-amber-500 text-amber-600"
                />
                <StatCard
                    title="Bounce Rate"
                    value={`${overview.bounceRate}%`}
                    sub="Sessions < 10s"
                    icon={MousePointerClick}
                    color="bg-red-500 text-red-600"
                />
            </div>

            {/* Row 2: Funnel + Geo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Funnel */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Conversion Funnel</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={funnel} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="step" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Geo */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Top Countries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {geo.slice(0, 5).map((g, i) => (
                                <div key={g.country} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-400 font-mono text-sm">#{i + 1}</span>
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium text-gray-700">{g.country}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{ width: `${(g.sessions / overview.totalSessions) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 min-w-[3ch]">{g.sessions}</span>
                                    </div>
                                </div>
                            ))}
                            {geo.length === 0 && <div className="text-gray-500 text-sm">No location data.</div>}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Row 3: Pages + Friction */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pages */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Pages</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Path</th>
                                        <th className="px-4 py-3 text-right">Views</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pages.map((p, i) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[200px]" title={p.path}>
                                                {p.path}
                                            </td>
                                            <td className="px-4 py-3 text-right">{p.views}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Friction */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>Friction & Errors</CardTitle>
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 mt-4">
                            {friction?.topErrors?.map((err, i) => (
                                <div key={i} className="p-3 bg-red-50 border border-red-100 rounded-md flex justify-between items-start">
                                    <div className="text-sm text-red-800 break-all pr-4">
                                        {err.message}
                                    </div>
                                    <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                        {err.count}
                                    </span>
                                </div>
                            ))}
                            {(!friction?.topErrors || friction.topErrors.length === 0) && (
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    System healthy. No client-side errors recorded.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
