// src/pages/AdminDashboard/Users.jsx
import React, { useState, useMemo, useEffect } from "react";
import { adminService } from "@/services/adminService";
import {
  UserPlusIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  KeyIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Users() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Alla");
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const list = await adminService.getUsers().catch(() => [
        // Fallback if backend not ready
        { id: 1, name: "Chidi Nwosu", email: "chidi@valiflow.com", role: "SUPER_ADMIN", active: true, joined: "2024-12-01" },
        { id: 2, name: "Anna Karlsson", email: "anna@valiflow.com", role: "ADMIN", active: true, joined: "2025-01-10" },
      ]);
      setUsers(list);
    } catch (err) {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchQuery =
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase());
      const matchFilter = filter === "Alla" || u.role === filter;
      return matchQuery && matchFilter;
    });
  }, [query, filter, users]);

  const roleColors = {
    SUPER_ADMIN: "bg-purple-100 text-purple-700",
    ADMIN: "bg-emerald-100 text-emerald-700",
    ANALYST: "bg-blue-100 text-blue-700",
    SUPPORT: "bg-yellow-100 text-yellow-700",
    DEVELOPER: "bg-gray-100 text-gray-700",
  };

  const kpis = [
    { label: "Totala användare", value: users.length, icon: UserGroupIcon },
    { label: "Aktiva konton", value: users.filter((u) => u.active).length, icon: ShieldCheckIcon },
    { label: "Nya senaste månaden", value: 2, icon: KeyIcon },
    { label: "Inaktiva konton", value: users.filter((u) => !u.active).length, icon: Cog6ToothIcon },
  ];

  const handleRoleChange = (id, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  };

  const toggleActive = async (id) => {
    try {
      await adminService.toggleUserStatus(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
      );
    } catch {
      alert("Action failed");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Användarhantering
          </h1>
          <p className="text-slate-500">
            Hantera Valiflows interna användare, roller och åtkomstnivåer.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 flex items-center gap-2"
        >
          <UserPlusIcon className="w-4 h-4" />
          Lägg till användare
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="bg-white border rounded-2xl shadow-sm p-5 flex items-center justify-between hover:shadow-md transition"
          >
            <div>
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <p className="text-2xl font-semibold text-slate-800 mt-1">
                {kpi.value}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <kpi.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 justify-between flex-wrap">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-2 top-2.5" />
          <input
            type="text"
            placeholder="Sök användare..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 pr-3 py-2 border rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option>Alla</option>
          <option>SUPER_ADMIN</option>
          <option>ADMIN</option>
          <option>ANALYST</option>
          <option>SUPPORT</option>
          <option>DEVELOPER</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="text-left py-3 px-4">Namn</th>
              <th className="text-left py-3 px-4">E-post</th>
              <th className="text-left py-3 px-4">Roll</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Registrerad</th>
              <th className="text-right py-3 px-4">Åtgärder</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b last:border-none hover:bg-gray-50 transition">
                <td className="py-3 px-4 font-medium text-slate-800">{u.name}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className={`border rounded-md px-2 py-1 text-xs font-medium ${roleColors[u.role]} focus:ring-emerald-500 focus:border-emerald-500`}
                  >
                    {Object.keys(roleColors).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={u.active}
                      onChange={() => toggleActive(u.id)}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-200 peer-checked:bg-emerald-500 rounded-full relative transition">
                      <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-5"></span>
                    </div>
                  </label>
                </td>
                <td className="py-3 px-4 text-slate-500">{u.joined}</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-red-600 hover:text-red-700 text-sm">
                    Ta bort
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-400 text-sm">
                  Ingen användare matchar sökningen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isOpen && <AddUserModal onClose={() => setIsOpen(false)} />}
    </div>
  );
}

/* ---------------- Add User Modal ---------------- */
function AddUserModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "ADMIN",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Ny användare:", form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Lägg till användare</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-slate-500"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">Namn</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">E-post</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Roll</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option>SUPER_ADMIN</option>
              <option>ADMIN</option>
              <option>ANALYST</option>
              <option>SUPPORT</option>
              <option>DEVELOPER</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-slate-700 text-sm rounded-lg hover:bg-gray-200"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
            >
              Spara
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
