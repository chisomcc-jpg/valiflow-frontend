import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ArrowLeftIcon,
  ClockIcon,
  ServerIcon,
  DocumentCheckIcon,
  CpuChipIcon,
  ArrowPathIcon,
  HashtagIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { toast } from 'sonner';

import {
  getAuditTimeline,
  getHashChain,
  getDiffs,
  getSignals
} from '@/services/invoiceAuditService';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function InvoiceAuditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);
  const [hashChain, setHashChain] = useState(null);
  const [diffs, setDiffs] = useState([]);
  const [signals, setSignals] = useState(null);

  // Load Data
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const [tData, hData, dData, sData] = await Promise.all([
          getAuditTimeline(id),
          getHashChain(id),
          getDiffs(id),
          getSignals(id)
        ]);

        setTimeline(tData.items || []);
        setHashChain(hData);
        setDiffs(dData.items || []);
        setSignals(sData);
      } catch (err) {
        console.error(err);
        toast.error("Kunde inte ladda revisionsdata");
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">
      <div className="flex flex-col items-center gap-2">
        <ArrowPathIcon className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium">Laddar revision...</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">

      {/* 1. HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/dashboard/invoices/${id}`)}>
              <ArrowLeftIcon className="w-5 h-5 text-slate-500" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Revision: Faktura #{id}</h1>
                {hashChain?.isValid ? (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
                    <ShieldCheckIcon className="w-3 h-3" /> Verifierad
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <ShieldExclamationIcon className="w-3 h-3" /> Kedja bruten
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-500 font-mono mt-0.5">
                {signals?.supplier?.name || "Okänd leverantör"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Integritetspoäng</div>
              <div className="text-lg font-bold text-slate-900">{hashChain?.isValid ? "100%" : "Varning"}</div>
            </div>
            <Button variant="outline" className="gap-2">
              <DocumentCheckIcon className="w-4 h-4" /> Exportera PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 2. TIMELINE (Left Col) */}
        <div className="lg:col-span-2 space-y-8">

          {/* HASH CHAIN VISUALIZER */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HashtagIcon className="w-4 h-4 text-slate-400" />
                <CardTitle className="text-sm uppercase tracking-wider text-slate-600 font-semibold">Kryptografisk Kedja</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <div className="flex items-center p-6 gap-2 min-w-max">
                {hashChain?.chain?.slice(-5).map((node, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`
                                             flex flex-col items-center justify-center p-3 rounded-lg border w-32 relative
                                             ${node.status === 'valid' ? 'bg-white border-emerald-200' : 'bg-red-50 border-red-200'}
                                         `}>
                      <div className="text-[10px] uppercase text-slate-400 mb-1">{node.actionType}</div>
                      <div className="font-mono text-[10px] text-slate-600 truncate w-full text-center">
                        {node.hash?.substring(0, 8)}...
                      </div>
                      {node.status === 'valid' && (
                        <div className="absolute -bottom-2 bg-emerald-100 text-emerald-700 text-[8px] px-1.5 py-0.5 rounded-full font-bold">OK</div>
                      )}
                    </div>
                    {i < 4 && (
                      <div className="h-px w-8 bg-slate-300 mx-1" />
                    )}
                  </div>
                ))}
                <div className="ml-4 text-xs text-slate-400 italic">
                  + {Math.max(0, (hashChain?.chain?.length || 0) - 5)} tidigare händelser
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EVENT TIMELINE */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-slate-400" /> Händelselogg
            </h3>
            <div className="relative border-l border-slate-200 ml-3 space-y-8 pl-8 py-2">
              {timeline.map((event, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot */}
                  <div className={`
                                        absolute -left-[39px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white
                                        ${event.severity === 'warning' ? 'border-amber-400 text-amber-500' :
                      event.severity === 'critical' ? 'border-red-400 text-red-500' :
                        'border-slate-300 text-slate-400'}
                                    `}>
                    <div className={`w-1.5 h-1.5 rounded-full ${event.severity ? 'bg-current' : 'bg-slate-300'}`} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {format(new Date(event.timestamp), 'HH:mm:ss')}
                        </Badge>
                        <span className="font-semibold text-slate-900">{event.action}</span>
                      </div>
                      <p className="text-sm text-slate-600">{event.summary}</p>

                      {/* Metadata Preview */}
                      {event.metadata && Object.keys(event.metadata).length > 0 && (
                        <div className="mt-2 text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 max-w-md overflow-hidden text-ellipsis whitespace-nowrap">
                          {JSON.stringify(event.metadata)}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium text-slate-900">{event.actor}</div>
                      <div className="text-xs text-slate-400">
                        {format(new Date(event.timestamp), 'd MMM yyyy', { locale: sv })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 3. SIDEBAR (Right Col) */}
        <div className="space-y-6">

          {/* RISK CARD */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ScaleIcon className="w-4 h-4 text-slate-400" />
                <CardTitle className="text-sm uppercase tracking-wider text-slate-600 font-semibold">Riskbedömning</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Trust Score</span>
                <Badge variant="secondary" className="font-bold text-lg">{signals?.trustScore || "0"}/100</Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-400 uppercase">Signaler</span>
                <div className="flex flex-wrap gap-2">
                  {signals?.riskSignals ? (
                    typeof signals.riskSignals === 'object' ?
                      Object.keys(signals.riskSignals).map(k => (
                        <Badge key={k} variant="outline" className="text-xs">{k}</Badge>
                      )) : <span className="text-xs text-slate-400">Inga signaler</span>
                  ) : (
                    <span className="text-xs text-slate-400">Inga signaler</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI FOOTPRINT */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CpuChipIcon className="w-4 h-4 text-slate-400" />
                <CardTitle className="text-sm uppercase tracking-wider text-slate-600 font-semibold">AI Beslut</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {signals?.aiAnalysis ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-500">Modell</div>
                    <div className="font-mono text-right">GPT-4o</div>

                    <div className="text-slate-500">Pipeline</div>
                    <div className="font-mono text-right">v5.2.1</div>

                    <div className="text-slate-500">Förtroende</div>
                    <div className="font-mono text-right text-emerald-600">
                      {signals.aiAnalysis?.confidence ? `${signals.aiAnalysis.confidence * 100}%` : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <div className="text-[10px] text-slate-400 font-mono mb-1">PROMPT HASH</div>
                    <div className="text-[10px] text-emerald-400 font-mono break-all">
                      {hashChain?.chain?.[0]?.hash || "a1b2c3d4e5f6..."}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">Ingen AI-analys hittades.</div>
              )}
            </CardContent>
          </Card>

          {/* RECENT DIFFS */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ArrowPathIcon className="w-4 h-4 text-slate-400" />
                <CardTitle className="text-sm uppercase tracking-wider text-slate-600 font-semibold">Ändringar</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {diffs.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {diffs.slice(0, 5).map(diff => (
                    <div key={diff.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-slate-700">{diff.actionType}</span>
                        <span className="text-[10px] text-slate-400">{format(new Date(diff.timestamp), 'dd/MM HH:mm')}</span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {diff.userName}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-slate-400 italic">Inga registrerade ändringar.</div>
              )}
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}
