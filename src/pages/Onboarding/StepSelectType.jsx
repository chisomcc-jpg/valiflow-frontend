import React from "react";
import { BuildingOfficeIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

export default function StepSelectType({ onSelect }) {
  const options = [
    { id: "bureau", label: "Redovisningsbyrå", icon: BuildingOfficeIcon },
    { id: "company", label: "Företag", icon: BriefcaseIcon },
  ];

  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-slate-800 mb-2">
        Välj din användartyp
      </h1>
      <p className="text-slate-500 mb-6">Detta hjälper oss anpassa din miljö.</p>

      <div className="flex gap-6 justify-center">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md w-48 transition"
          >
            <opt.icon className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <span className="font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
