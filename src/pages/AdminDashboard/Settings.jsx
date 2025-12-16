import React from "react";

export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-slate-800">Systeminställningar</h1>

      <div className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <h2 className="font-semibold text-slate-700 mb-1">AI-konfiguration</h2>
          <p className="text-sm text-slate-500 mb-2">
            Ställ in gränser för AI:s riskbedömning och träningsfrekvens.
          </p>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
            Ändra inställningar
          </button>
        </div>

        <hr />

        <div>
          <h2 className="font-semibold text-slate-700 mb-1">Notifieringar</h2>
          <p className="text-sm text-slate-500 mb-2">
            Hantera systemnotifieringar för AI, regler och integrationer.
          </p>
          <button className="px-4 py-2 bg-gray-200 text-slate-700 rounded-lg hover:bg-gray-300 text-sm">
            Hantera notifieringar
          </button>
        </div>
      </div>
    </div>
  );
}
