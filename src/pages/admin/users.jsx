import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get(`${API_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [token]);

  async function changeRole(id, newRole) {
    try {
      await axios.put(
        `${API_URL}/api/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
      toast.success(`Updated role to ${newRole}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update role");
    }
  }

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">👥 Manage Users</h1>

      <table className="min-w-full bg-white border rounded-xl shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Created</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{u.email}</td>
              <td className="p-3 font-semibold">{u.role}</td>
              <td className="p-3 text-sm text-gray-500">
                {new Date(u.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => changeRole(u.id, "USER")}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                >
                  USER
                </button>
                <button
                  onClick={() => changeRole(u.id, "ADMIN")}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg"
                >
                  ADMIN
                </button>
                <button
                  onClick={() => changeRole(u.id, "SUPER_ADMIN")}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg"
                >
                  SUPER ADMIN
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
