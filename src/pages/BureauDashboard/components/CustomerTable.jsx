import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import CustomerProfilePanel from "./CustomerProfilePanel";

const customers = [
  { id: 1, name: "ByggPartner AB", erp: "Visma.net", status: "Aktiv", risk: 14, flagged: 8, accuracy: "94%", synced: "Idag" },
  { id: 2, name: "Ekonomi & Co", erp: "Fortnox", status: "Avvikelser", risk: 32, flagged: 16, accuracy: "88%", synced: "Igår" },
  { id: 3, name: "Creative Minds Oy", erp: "BC", status: "Aktiv", risk: 11, flagged: 2, accuracy: "97%", synced: "Idag" },
];

export default function CustomerTable() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <div className="relative bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-slate-100">Kundöversikt</h2>
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-2 top-2 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrera..."
            className="bg-slate-800 pl-8 pr-3 py-1.5 rounded-md text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      <table className="w-full text-sm text-slate-300">
        <thead>
          <tr className="border-b border-slate-700 text-slate-400">
            <th className="text-left py-2">Kund</th>
            <th>ERP-system</th>
            <th>Status</th>
            <th>Risk</th>
            <th>Flaggade</th>
            <th>AI Accuracy</th>
            <th>Senast synkad</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr
              key={c.id}
              onClick={() => setSelectedCustomer(c)}
              className="border-b border-slate-800 hover:bg-slate-800/50 transition cursor-pointer"
            >
              <td className="py-2">{c.name}</td>
              <td className="text-center">{c.erp}</td>
              <td className="text-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    c.status === "Avvikelser"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="text-center">{c.risk}</td>
              <td className="text-center">{c.flagged}</td>
              <td className="text-center">{c.accuracy}</td>
              <td className="text-center">{c.synced}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sidopanel */}
      <CustomerProfilePanel
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}
