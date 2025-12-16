import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { BuildingOfficeIcon, BoltIcon, TruckIcon, HomeModernIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function InitialScanSetupModal({ companyId, isOpen, onComplete }) {
  // Pilot Configuration
  const [industry, setIndustry] = useState("");
  const [volume, setVolume] = useState("500");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const industries = [
    { id: "CONSTRUCTION", label: "Bygg & Anläggning", icon: BuildingOfficeIcon, desc: "Hög tolerans för materialvariation." },
    { id: "TRANSPORT", label: "Transport & Logistik", icon: TruckIcon, desc: "Fokus på dubbletter och bränsle." },
    { id: "REAL_ESTATE", label: "Fastighet", icon: HomeModernIcon, desc: "Strikt kontroll av servicefakturor." },
    { id: "ENERGY", label: "Energi", icon: BoltIcon, desc: "Hög tolerans för säsongsvariation." },
  ];

  const handleSetup = async () => {
    if (!industry) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`/api/company/${companyId}/onboarding-setup`, {
        industryProfile: industry,
        industryCode: mapSni(industry), // Helper to map mock SNI
        initialVolume: Number(volume)
      });
      
      if (response.data.success) {
         onComplete();
      }
    } catch (err) {
      console.error("Onboarding setup failed", err);
      setError("Kunde inte starta scanningen. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  const mapSni = (profile) => {
    switch (profile) {
      case "CONSTRUCTION": return "41200";
      case "TRANSPORT": return "49410";
      case "REAL_ESTATE": return "68201";
      case "ENERGY": return "35110";
      default: return "";
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-900/5">
          <Dialog.Title className="text-2xl font-bold text-slate-900 mb-2">
            Valiflow Pilot Setup
          </Dialog.Title>
          <Dialog.Description className="text-slate-500 mb-6">
            Innan vi hämtar dina fakturor behöver vi kalibrera Trust Engine för din bransch.
          </Dialog.Description>

          {/* Industry Selection */}
          <div className="space-y-4 mb-8">
            <label className="block text-sm font-semibold text-slate-900">
              Vilken bransch tillhör bolaget? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {industries.map((ind) => (
                <button
                  key={ind.id}
                  onClick={() => setIndustry(ind.id)}
                  className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                    industry === ind.id
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-slate-100 bg-white hover:border-emerald-200 text-slate-600"
                  }`}
                >
                  <ind.icon className={`w-8 h-8 mb-2 ${industry === ind.id ? "text-emerald-600" : "text-slate-400"}`} />
                  <span className="font-medium text-sm">{ind.label}</span>
                </button>
              ))}
            </div>
            {industry && (
                <p className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded">
                    ℹ️ {industries.find(i => i.id === industry)?.desc}
                </p>
            )}
          </div>

          {/* Volume Selection */}
          <div className="space-y-3 mb-8">
             <label className="block text-sm font-semibold text-slate-900">
              Hur mycket historik ska analyseras?
            </label>
            <div className="flex gap-4">
                {["100", "250", "500"].map((vol) => (
                    <label key={vol} className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="radio" 
                            name="volume" 
                            value={vol} 
                            checked={volume === vol}
                            onChange={(e) => setVolume(e.target.value)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-slate-700">{vol} fakturor</span>
                    </label>
                ))}
            </div>
            <p className="text-xs text-slate-400">Rekommenderat: 500 för att bygga Byråminne.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleSetup}
            disabled={!industry || loading}
            className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all ${
                !industry || loading 
                ? "bg-slate-300 cursor-not-allowed" 
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? "Kalibrerar..." : "Starta Analys"}
          </button>
          
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
