import React from "react";

export default function Fraud() {
  const alerts = [
    { id: "#INV-1003", reason: "Avvikande IBAN", confidence: "92%", reviewed: "Nej" },
    { id: "#INV-1007", reason: "Dublettfaktura", confidence: "88%", reviewed: "Ja" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-slate-800">Fraud & AI Monitor</h1>
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b text-gray-500">
              <th>ID</th>
              <th>Orsak</th>
              <th>AI-säkerhet</th>
              <th>Granskad</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a, i) => (
              <tr key={i} className="border-b last:border-none">
                <td className="py-2">{a.id}</td>
                <td>{a.reason}</td>
                <td>{a.confidence}</td>
                <td>{a.reviewed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
