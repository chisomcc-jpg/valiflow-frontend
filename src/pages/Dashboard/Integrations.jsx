// src/pages/Dashboard/Integrations.jsx
import React, { useEffect, useState } from "react";
import { PuzzlePieceIcon } from "@heroicons/react/24/outline";
import { toast } from "sonner";

import { integrationService } from "@/services/integrationService";
import IntegrationCard from "@/components/integrations/IntegrationCard";
import AIIntegrationRecommendation from "@/components/integrations/AIIntegrationRecommendation";
import { MOCK_INTEGRATIONS } from "@/demo/integrationsMock";

export default function Integrations() {
  const [integrations, setIntegrations] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      // Try fetch real data, fallback to mock if empty/error for demo purposes
      try {
        const data = await integrationService.getIntegrations();
        const rec = await integrationService.getRecommendation();

        if (!data || data.length === 0) throw new Error("No data");

        setIntegrations(data);
        setRecommendation(rec);
      } catch (e) {
        console.warn("Using mock data for integrations demo");
        setIntegrations(MOCK_INTEGRATIONS.providers);
        setRecommendation(MOCK_INTEGRATIONS.recommendation);
      }
    } catch (err) {
      toast.error("Failed to load integrations");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (id) => {
    try {
      const { url } = await integrationService.getAuthUrl(id);
      if (url) {
        window.location.href = url;
      } else {
        toast.success(`Connected to ${id} (Mock)`);
        // Optimistic update for demo
        setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: true, status: 'active' } : i));
      }
    } catch {
      toast.error("Could not initiate connection");
    }
  };

  const handleDisconnect = async (id) => {
    if (!confirm("Är du säker? Detta kommer att stoppa synkroniseringen.")) return;
    try {
      await integrationService.disconnect(id);
      toast.success("Frånkopplad");
      // Optimistic update
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: false, status: 'setup_required', sync: null } : i));
    } catch {
      toast.error("Kunde inte koppla från");
    }
  };

  const handleSync = async (id) => {
    setSyncingId(id);
    toast.message("Synkronisering startad...");
    try {
      await integrationService.sync(id);
      toast.success("Synkronisering klar!");
      // Mock refresh of sync data
      setIntegrations(prev => prev.map(i => i.id === id ? {
        ...i,
        sync: { ...i.sync, lastSync: new Date().toISOString(), status: 'OK' }
      } : i));
    } catch {
      toast.error("Synkronisering misslyckades");
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <PuzzlePieceIcon className="w-8 h-8 text-indigo-600" />
            Integrationer
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Anslut era affärssystem och banker för att aktivera Valiflow Trust Layer.
          </p>
        </div>

        {/* AI Recommendation */}
        {!loading && recommendation && (
          <AIIntegrationRecommendation recommendation={recommendation} />
        )}

        {/* Grid */}
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-slate-200 rounded-xl" />
            <div className="h-40 bg-slate-200 rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {integrations.map(integ => (
              <IntegrationCard
                key={integ.id}
                integ={integ}
                onConnect={() => handleConnect(integ.id)}
                onDisconnect={() => handleDisconnect(integ.id)}
                onSync={() => handleSync(integ.id)}
                isSyncing={syncingId === integ.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
