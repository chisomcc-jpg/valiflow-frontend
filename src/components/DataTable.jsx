// src/components/DataTable.jsx
export default function DataTable({ data }) {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-900">{row.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{row.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{row.email}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    row.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : row.status === "Inactive"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
