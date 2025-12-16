import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, ShieldCheck } from "lucide-react";

export function TeamAndRolesSettings() {
    const navigate = useNavigate();

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Team & Roller</h3>
                    <p className="text-sm text-slate-500">Hantera vilka personer som arbetar på byrån och vilka roller de har.</p>
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="outline" onClick={() => navigate("/bureau/team")}>
                    Hantera användare
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => navigate("/bureau/team")}>
                    Hantera team & roller
                </Button>
            </div>
        </div>
    );
}
