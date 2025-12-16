import React, { useEffect, useState } from "react";
import { complianceService } from "@/services/complianceService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Loader2 } from "lucide-react";

export function ComplianceOverview({ refreshTrigger }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [refreshTrigger]);

    const loadData = async () => {
        setLoading(true);
        try {
            const overview = await complianceService.getOverview();
            setData(overview);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
    if (!data) return <div className="p-8 text-center text-slate-500">Kunde inte ladda översikten.</div>;

    return (
        <div className="space-y-6">
            {/* KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <KpiCard
                    title="Kunder med full metadata"
                    value={data.fullMetadataCustomers}
                    helper="Antal kunder som har alla obligatoriska fält ifyllda."
                />
                <KpiCard
                    title="Kritiska brister"
                    value={data.criticalIssueCustomers}
                    helper="Kunder där saknade uppgifter kan påverka revision."
                    variant="warning"
                />
                <KpiCard
                    title="Fakturor saknar fält (30d)"
                    value={data.invoicesWithMissingFields30d}
                    helper="Antal fakturor som saknar viktig info senaste 30 dagarna."
                />
                <KpiCard
                    title="Lev. med brister"
                    value={data.suppliersWithIssues}
                    helper="Leverantörer som saknar t.ex. bankgiro eller adress."
                />
                <KpiCard
                    title="ESRS/CSRD-klara"
                    value={`${Math.round(data.esrsReadyShare * 100)}%`}
                    helper="Andel transaktioner som uppfyller hållbarhetskrav."
                    variant="success"
                />
            </div>

            {/* CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Vanligaste avvikelser just nu</CardTitle>
                        <CardDescription>Hjälper dig se vilka typer av brister som förekommer oftast.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.deviationChart} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Fördelning av compliance-nivå</CardTitle>
                        <CardDescription>Ger en snabb känsla för hur portföljen mår totalt.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.complianceLevels}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.complianceLevels.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function KpiCard({ title, value, helper, variant = "default" }) {
    const colors = {
        default: "bg-white border-slate-200",
        warning: "bg-amber-50 border-amber-200",
        success: "bg-green-50 border-green-200"
    };

    return (
        <Card className={`${colors[variant]} shadow-sm`}>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 truncate" title={title}>{title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                {helper && <p className="text-xs text-slate-400 mt-1 line-clamp-2" title={helper}>{helper}</p>}
            </CardContent>
        </Card>
    );
}
