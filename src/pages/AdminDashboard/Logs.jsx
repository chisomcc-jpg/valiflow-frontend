import React from "react";

export default function Logs() {
  const logs = [
    { time: "10:30", user: "Anna Karlsson", action: "Redigerade regel 'Dubblettfaktura'" },
    { time: "09:42", user: "Jonas Berg", action: "Godkände faktura #INV-1003" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-slate-800">Audit Logg</h1>
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b text-gray-500">
              <th>Tid</th>
              <th>Användare</th>
              <th>Händelse</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, i) => (
              <tr key={i} className="border-b last:border-none">
                <td className="py-2">{l.time}</td>
                <td>{l.user}</td>
                <td>{l.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
