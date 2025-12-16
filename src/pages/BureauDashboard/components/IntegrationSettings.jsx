import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { bureauSettingsService } from "@/services/bureauSettingsService";
import { useBureauSSE } from "@/hooks/useBureauSSE";

export function IntegrationSettings() {
    const [integrations, setIntegrations] = useState({
        fortnox: { connected: false, status: "inactive" },
        visma: { connected: false, status: "inactive" }
    });

    const { bureauEvents } = useBureauSSE(1);
    useEffect(() => {
        if (bureauEvents?.type === "integration_update") loadData();
    }, [bureauEvents]);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const data = await bureauSettingsService.getIntegrations();
            setIntegrations(data);
        } catch (e) { }
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Integrationer</h3>
                <p className="text-sm text-slate-500">Hantera integrationer som används av byrån och kunderna.</p>
            </div>

            <div className="space-y-4">
                {/* Fortnox */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${integrations.fortnox.connected ? 'bg-green-500' : 'bg-slate-300'}`} />
                        <div>
                            <p className="font-medium text-slate-900">Fortnox</p>
                            <p className="text-xs text-slate-500">{integrations.fortnox.connected ? "Ansluten" : "Ej ansluten"}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {integrations.fortnox.connected ? (
                            <>
                                <Button variant="outline" size="sm">Synka nu</Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Koppla från</Button>
                            </>
                        ) : (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Anslut</Button>
                        )}
                    </div>
                </div>

                {/* Visma */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${integrations.visma.connected ? 'bg-green-500' : 'bg-slate-300'}`} />
                        <div>
                            <p className="font-medium text-slate-900">Visma</p>
                            <p className="text-xs text-slate-500">{integrations.visma.connected ? "Ansluten" : "Ej ansluten"}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {integrations.visma.connected ? (
                            <>
                                <Button variant="outline" size="sm">Synka nu</Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">Koppla från</Button>
                            </>
                        ) : (
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">Anslut</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
