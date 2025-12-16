import React from "react";
import {
  UsersIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

const cards = [
  {
    title: "Antal kunder",
    value: "42",
    icon: UsersIcon,
    color: "from-cyan-500/10 to-cyan-500/5 text-cyan-600",
  },
  {
    title: "Fakturor analyserade",
    value: "8 921",
    icon: DocumentTextIcon,
    color: "from-blue-500/10 to-blue-500/5 text-blue-600",
  },
  {
    title: "Flaggade fakturor",
    value: "112",
    icon: ExclamationTriangleIcon,
    color: "from-amber-500/10 to-amber-500/5 text-amber-600",
  },
  {
    title: "Totalt besparat belopp",
    value: "457 000 kr",
    icon: BanknotesIcon,
    color: "from-emerald-500/10 to-emerald-500/5 text-emerald-600",
  },
  {
    title: "AI Accuracy (snitt)",
    value: "94%",
    icon: CpuChipIcon,
    color: "from-indigo-500/10 to-indigo-500/5 text-indigo-600",
  },
];

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
      {cards.map((c, i) => (
        <div
          key={i}
          className="card-premium p-6 hover-lift fade-in"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-sm`}
            >
              <c.icon className={`w-5 h-5 ${c.color.split(" ")[2]}`} />
            </div>
          </div>
          <p className="text-sm text-slate-500 mb-1">{c.title}</p>
          <p className="text-3xl font-semibold text-slate-800">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
