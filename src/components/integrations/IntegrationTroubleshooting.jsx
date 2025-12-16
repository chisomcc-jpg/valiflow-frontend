import React from "react";
import { ExclamationTriangleIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

export default function IntegrationTroubleshooting({ troubleshooting }) {
    if (!troubleshooting) return null;

    return (
        <div className="mt-4 bg-red-50 border border-red-100 rounded-lg p-3 space-y-3">
            <div className="flex items-start gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-semibold text-red-900">Anslutningsfel</h4>
                    <p className="text-xs text-red-700 mt-0.5">{troubleshooting.errorMessage}</p>
                </div>
            </div>

            <div className="bg-white/60 p-2 rounded border border-red-100/50">
                <p className="text-xs text-red-800 flex items-start gap-1.5">
                    <WrenchScrewdriverIcon className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-75" />
                    <span className="font-medium">Förslag:</span> {troubleshooting.suggestion}
                </p>
            </div>

            {troubleshooting.reconnectUrl && (
                <Button
                    size="sm"
                    variant="destructive"
                    className="w-full h-8 text-xs"
                    onClick={() => window.open(troubleshooting.reconnectUrl, '_blank')}
                >
                    Återanslut
                </Button>
            )}
        </div>
    );
}
