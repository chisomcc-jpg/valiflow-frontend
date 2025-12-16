import React from "react";
import { motion } from "framer-motion";
import { ArrowPathIcon, CheckIcon, PuzzlePieceIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

import IntegrationStatusBadge from "./IntegrationStatusBadge";
import IntegrationSyncInfo from "./IntegrationSyncInfo";
import IntegrationPermissions from "./IntegrationPermissions";
import IntegrationTroubleshooting from "./IntegrationTroubleshooting";

export default function IntegrationCard({ integ, onConnect, onDisconnect, onSync, isSyncing }) {
    // Determine state
    const isConnected = integ.connected;
    const hasError = integ.status === 'error';

    // Determine primary color based on brand (simplification: use indigo for generic, brand specific logic could be added)
    const brandColor = isConnected ? 'border-indigo-100' : 'border-slate-200';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className={`
                bg-white rounded-xl border p-5 shadow-sm relative flex flex-col h-full
                ${isConnected && !hasError ? 'border-emerald-100 shadow-emerald-500/5' : ''}
                ${hasError ? 'border-red-200 ring-4 ring-red-50' : ''}
                ${!isConnected && !hasError ? 'border-slate-200 hover:border-slate-300' : ''}
            `}
        >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center p-2 relative overflow-hidden group">
                        {integ.logo ? (
                            <img src={integ.logo} alt={integ.name} className="w-full h-full object-contain" onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }} />
                        ) : null}
                        <PuzzlePieceIcon className={`w-6 h-6 text-slate-300 ${integ.logo ? 'hidden' : ''}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-base">{integ.name}</h3>
                        <div className="text-xs text-slate-500 font-medium bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-1">
                            {integ.category}
                        </div>
                    </div>
                </div>
                <IntegrationStatusBadge status={integ.status} connected={integ.connected} />
            </div>

            {/* DESCRIPTION */}
            <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[40px]">
                {integ.description}
            </p>

            {/* CAPABILITIES (Bullet list) */}
            <div className="mb-6 space-y-1.5 grow">
                {integ.capabilities?.map((cap, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{cap}</span>
                    </div>
                ))}
            </div>

            {/* TROUBLESHOOTING (Only on Error) */}
            {hasError && <IntegrationTroubleshooting troubleshooting={integ.troubleshooting} />}

            {/* SYNC INFO (Active only) */}
            {isConnected && !hasError && <IntegrationSyncInfo sync={integ.sync} />}

            {/* PERMISSIONS (Collapsible) */}
            <IntegrationPermissions permissions={integ.permissions} />

            {/* ACTIONS FOOTER */}
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-3">
                {isConnected ? (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onSync}
                            disabled={isSyncing || hasError}
                            className={`flex-1 ${hasError ? 'opacity-50' : ''}`}
                        >
                            <ArrowPathIcon className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                            {isSyncing ? "Synkar..." : "Synka nu"}
                        </Button>
                        <button
                            onClick={onDisconnect}
                            className="text-xs font-medium text-slate-400 hover:text-red-600 transition-colors px-2"
                        >
                            Koppla från
                        </button>
                    </>
                ) : (
                    <Button
                        size="sm"
                        className="w-full bg-slate-900 text-white hover:bg-slate-800 shadow-md shadow-slate-900/10"
                        onClick={onConnect}
                    >
                        Anslut {integ.name}
                    </Button>
                )}
            </div>

        </motion.div>
    );
}
