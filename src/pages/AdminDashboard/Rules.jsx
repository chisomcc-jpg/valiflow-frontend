import React from "react";

export default function Rules() {
  const rules = [
    { name: "Dubblettfaktura", type: "Systemregel", triggers: 43, active: true },
    { name: "IBAN mismatch", type: "AI + Regel", triggers: 27, active: true },
    { name: "Ovanligt belopp", type: "AI", triggers: 12, active: false },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-slate-800">Rule Engine</h1>
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b text-gray-500">
              <th>Namn</th>
              <th>Typ</th>
              <th>Triggers</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => (
              <tr key={i} className="border-b last:border-none">
                <td className="py-2">{r.name}</td>
                <td>{r.type}</td>
                <td>{r.triggers}</td>
                <td>{r.active ? "Aktiv" : "Inaktiv"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
