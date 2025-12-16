
import React from "react";
import { Button } from "@/components/ui/button";
import {
    CheckCircleIcon,
    ShieldCheckIcon,
    ExclamationTriangleIcon,
    ChevronRightIcon,
    PlusIcon
} from "@heroicons/react/24/outline";

export function MyWorkdaySnapshot({ user, exceptionCount = 0, onAddCustomer }) {
    // Static V1 Logic / Signals
    const firstName = user?.name ? user.name.split(" ")[0] : (user?.email?.split("@")[0] || "Konsult");

    // Derived state for Greeting
    const hour = new Date().getHours();
    const greeting = hour < 10 ? "God morgon" : hour < 14 ? "Hej" : "God eftermiddag";

    return (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-8 relative overflow-hidden">
            {/* Background decoration - subtle and abstract */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-full blur-3xl -mr-32 -mt-32 z-0 pointer-events-none opacity-50"></div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* 1. Greeting & Context */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {greeting}, {firstName}
                        </h2>
                        <p className="text-lg text-slate-600 mt-2 leading-relaxed">
                            Valiflow har hanterat det mesta åt dig idag.
                        </p>
                    </div>

                    <div className="space-y-3 pt-1">
                        {/* Signal: Silence */}
                        <div className="flex items-center gap-3 text-slate-600">
                            <CheckCircleIcon className="w-5 h-5 text-emerald-600/70" />
                            <span className="text-sm">
                                <span className="font-medium text-slate-800">38 fakturor</span> hanterades tyst via byråminne
                            </span>
                        </div>

                        {/* Signal: Deviations */}
                        <div className="flex items-center gap-3 text-slate-600">
                            {exceptionCount > 0 ? (
                                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600/80" />
                            ) : (
                                <CheckCircleIcon className="w-5 h-5 text-slate-400" />
                            )}
                            <span className="text-sm">
                                <span className={`font-medium ${exceptionCount > 0 ? 'text-amber-700/90' : 'text-slate-800'}`}>
                                    {exceptionCount} filtrerade avvikelser
                                </span> utvalda för manuell bedömning
                            </span>
                        </div>

                        {/* Signal: Risk */}
                        <div className="flex items-center gap-3 text-slate-600">
                            <ShieldCheckIcon className="w-5 h-5 text-slate-500/70" />
                            <span className="text-sm">
                                <span className="font-medium text-slate-800">Inga kritiska risker</span> just nu
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Primary Actions - Right Aligned or Stacked */}
                <div className="flex flex-col sm:flex-row md:justify-end gap-3 mt-4 md:mt-0">
                    <Button
                        onClick={() => window.location.href = "/bureau/radar"}
                        className="bg-slate-900 hover:bg-slate-800 text-white shadow-md font-medium px-6 h-11 text-base"
                    >
                        Hantera avvikelser
                    </Button>
                    <Button
                        onClick={onAddCustomer}
                        variant="outline"
                        className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-medium px-6 h-11 text-base"
                    >
                        <PlusIcon className="w-4 h-4 mr-2 text-slate-500" />
                        Lägg till kund
                    </Button>
                </div>

            </div>
        </section>
    );
}
