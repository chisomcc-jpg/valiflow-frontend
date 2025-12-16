import React, { useState, useEffect, useMemo } from "react";
import { api } from "@/services/api";
import { supplierService } from "@/services/supplierService";
import { useSupplierSSE } from "@/hooks/useSupplierSSE";
import { SupplierDetailSheet } from "@/components/suppliers/SupplierDetailSheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    GlobeAltIcon,
    CubeIcon
} from "@heroicons/react/24/outline";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from 'recharts';

export default function Suppliers() {
    const [loading, setLoading] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    const [metrics, setMetrics] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [search, setSearch] = useState("");
    const [filterRisk, setFilterRisk] = useState("all"); // all, high, medium, low

    // Detail sheet
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);

    // Context (assuming /me pattern or useParams if provided, sticking to /me for simplicity as in other pages)
    const [companyId, setCompanyId] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    // SSE Hook
    useSupplierSSE(companyId, () => {
        // Refetch on update
        loadData(companyId);
        toast.info("Leverantörsdata uppdaterad");
    });

    const fetchInitialData = async () => {
        try {
            const me = await api.get("/company/me");
            const cid = me.data.id;
            setCompanyId(cid);
            await loadData(cid);
        } catch (err) {
            console.error(err);
            toast.error("Kunde inte ladda leverantörsdata");
        } finally {
            setLoading(false);
        }
    };

    const loadData = async (cid) => {
        const [listRes, metricsRes, graphRes] = await Promise.all([
            supplierService.getSuppliers(cid),
            supplierService.getSupplierMetrics(cid),
            supplierService.getSupplierGraph(cid)
        ]);
        setSuppliers(listRes.data);
        setMetrics(metricsRes.data);
        setGraphData(graphRes.data); // { nodes, edges }
    };

    const handleSupplierClick = (name) => {
        setSelectedSupplier(name);
        setSheetOpen(true);
    };

    // Filter Logic
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(s => {
            const matchesSearch = s.supplierName.toLowerCase().includes(search.toLowerCase());
            const matchesRisk = filterRisk === 'all' || s.riskLevel === filterRisk;
            return matchesSearch && matchesRisk;
        });
    }, [suppliers, search, filterRisk]);

    if (loading) {
        return <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-96" />
        </div>;
    }

    return (
        <div className="space-y-5">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                        <CubeIcon className="w-6 h-6 text-indigo-600" /> Leverantörer
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Supplier Intelligence Hub — Realtidsanalys och riskvärdering.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => loadData(companyId)} className="h-8 text-xs">
                        <ArrowPathIcon className="w-3.5 h-3.5 mr-1.5" /> Uppdatera
                    </Button>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Låg Risk (Säkra)"
                    value={metrics?.lowRiskCount}
                    icon={ShieldCheckIcon}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <MetricCard
                    title="Mellanrisk"
                    value={metrics?.mediumRiskCount}
                    icon={ExclamationTriangleIcon}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
                <MetricCard
                    title="Hög Risk"
                    value={metrics?.highRiskCount}
                    icon={ExclamationTriangleIcon}
                    color="text-red-600"
                    bgColor="bg-red-50"
                />
                <MetricCard
                    title="Nätverksrisk Index"
                    value={metrics?.networkIndex}
                    icon={GlobeAltIcon}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                    suffix="/ 100"
                />
            </div>

            {/* MAIN CONTENT */}
            <Tabs defaultValue="list" className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                    <TabsList className="h-9">
                        <TabsTrigger value="list" className="text-xs px-3">Lista</TabsTrigger>
                        <TabsTrigger value="graph" className="text-xs px-3">Nätverksgraf</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Sök leverantör..."
                                className="pl-9 h-9 text-xs"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center">
                            {/* Selector could be styled custom, standard select for now but smaller */}
                            <select
                                className="text-xs border rounded-md p-2 bg-white h-9"
                                value={filterRisk}
                                onChange={e => setFilterRisk(e.target.value)}
                            >
                                <option value="all">Alla risker</option>
                                <option value="high">Hög risk</option>
                                <option value="medium">Mellanrisk</option>
                                <option value="low">Låg risk</option>
                            </select>
                        </div>
                    </div>
                </div>

                <TabsContent value="list" className="space-y-4">
                    <Card>
                        <div className="rounded-md border-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                        <TableHead className="h-10 text-xs">Leverantör</TableHead>
                                        <TableHead className="h-10 text-xs text-center">Risk Level</TableHead>
                                        <TableHead className="h-10 text-xs">Nätverk</TableHead>
                                        <TableHead className="h-10 text-xs">Fakturor</TableHead>
                                        <TableHead className="h-10 text-xs text-right">Total Spend</TableHead>
                                        <TableHead className="h-10 text-xs">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredSuppliers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-slate-500 text-sm">
                                                Inga leverantörer hittades.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSuppliers.map((s, i) => (
                                            <TableRow
                                                key={i}
                                                className="cursor-pointer hover:bg-slate-50 transition-colors h-10"
                                                onClick={() => handleSupplierClick(s.supplierName)}
                                            >
                                                <TableCell className="py-2 text-sm font-medium text-slate-900">
                                                    {s.supplierName}
                                                </TableCell>
                                                <TableCell className="py-2 text-center">
                                                    {/* Risk Level Badge - Neutral for NEW/LOW */}
                                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${s.riskLevel === 'high' ? "bg-red-50 text-red-700 border-red-200" :
                                                        s.riskLevel === 'medium' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                            "bg-white text-slate-600 border-slate-200"
                                                        }`}>
                                                        {s.riskLevel ? s.riskLevel.toUpperCase() : "LOW"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="py-2 text-slate-500 text-xs">
                                                    {s.networkInfluence > 0 ? (
                                                        <span className="flex items-center gap-1">
                                                            <GlobeAltIcon className="w-3 h-3" /> {s.networkInfluence}
                                                        </span>
                                                    ) : "-"}
                                                </TableCell>
                                                <TableCell className="py-2 text-xs">{s.invoiceCount}</TableCell>
                                                <TableCell className="py-2 text-right font-mono text-xs">
                                                    {new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(s.totalSpendYTD)}
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    {s.status === 'NEW' && <Badge variant="secondary" className="text-[10px] h-5 bg-slate-100 text-slate-600 border-slate-200">New</Badge>}
                                                    {s.status === 'VERIFIED' && <Badge variant="outline" className="text-[10px] h-5 bg-blue-50 text-blue-700 border-blue-200 flex w-fit items-center gap-1"><ShieldCheckIcon className="w-3 h-3" /> Verified</Badge>}
                                                    {s.status === 'TRUSTED' && <Badge variant="outline" className="text-[10px] h-5 bg-emerald-50 text-emerald-700 border-emerald-200 flex w-fit items-center gap-1"><ShieldCheckIcon className="w-3 h-3" /> Trusted</Badge>}
                                                    {s.status === 'FLAGGED' && <Badge variant="outline" className="text-[10px] h-5 bg-red-50 text-red-700 border-red-200">Flagged</Badge>}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="graph">
                    <Card className="h-[600px] flex items-center justify-center relative bg-slate-50 border-dashed">
                        {graphData?.nodes?.length ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" dataKey="spend" name="Spend" unit=" kr" domain={['auto', 'auto']} tickFormatter={val => val > 1000 ? `${val / 1000}k` : val} />
                                    <YAxis type="number" dataKey="trustScore" name="Trust Score" domain={[0, 100]} />
                                    <ZAxis type="number" dataKey="influence" range={[50, 400]} name="Inflytande" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const d = payload[0].payload;
                                            return (
                                                <div className="bg-white p-2 border shadow-lg rounded text-xs">
                                                    <strong>{d.id}</strong><br />
                                                    Spend: {d.spend} kr<br />
                                                    Trust: {d.trustScore}<br />
                                                    Influence: {d.influence}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }} />
                                    <Scatter name="Leverantörer" data={graphData.nodes} fill="#4F46E5" onClick={(p) => handleSupplierClick(p.id)}>
                                        {/* Dynamic coloring via Cell is tricky in simple Scatter but we can rely on Tooltip */}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-slate-500">
                                <GlobeAltIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>Ingen nätverksdata tillgänglig än.</p>
                            </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/80 p-2 rounded text-xs text-slate-500 max-w-xs backdrop-blur">
                            <strong>Graf-vy (Beta):</strong> Visar leverantörer baserat på Spend (X), Trust (Y) och Nätverksinflytande (Storlek).
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>

            <SupplierDetailSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                supplierName={selectedSupplier}
                companyId={companyId}
            />
        </div>
    );
}

function MetricCard({ title, value, icon: Icon, color, bgColor, suffix }) {
    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-slate-500">{title}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xl font-bold text-slate-900">{value ?? "-"}</span>
                        {suffix && <span className="text-[10px] text-slate-400">{suffix}</span>}
                    </div>
                </div>
                <div className={`p-2 rounded-lg ${bgColor}`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                </div>
            </CardContent>
        </Card>
    );
}
