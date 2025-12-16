
// src/pages/AdminDashboard/Support.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    InboxIcon,
    CheckCircleIcon,
    ClockIcon,
    ChatBubbleLeftRightIcon,
    UserCircleIcon,
    TagIcon
} from "@heroicons/react/24/outline";
import StatusBadge from "@/components/ui/StatusBadge";
import { supportService } from "@/services/supportService";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function AdminSupport() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("open");

    useEffect(() => {
        async function fetchTickets() {
            setLoading(true);
            try {
                // Using generic "items" response structure from backend
                const res = await axios.get(`${API_URL}/api/support/tickets`, { withCredentials: true });
                setTickets(res.data.items || []);
            } catch (err) {
                console.error("Failed to load tickets", err);
            } finally {
                setLoading(false);
            }
        }
        fetchTickets();
    }, []);

    const filtered = tickets.filter(t => filter === 'all' || t.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Support Tickets</h1>
                    <p className="text-slate-500">Manage user issues and requests.</p>
                </div>
            </div>

            <div className="flex gap-4 border-b border-slate-200">
                <button
                    onClick={() => setFilter('open')}
                    className={`pb-2 px-1 text-sm font-medium border-b-2 ${filter === 'open' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
                >
                    Open
                </button>
                <button
                    onClick={() => setFilter('closed')}
                    className={`pb-2 px-1 text-sm font-medium border-b-2 ${filter === 'closed' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
                >
                    Closed
                </button>
                <button
                    onClick={() => setFilter('all')}
                    className={`pb-2 px-1 text-sm font-medium border-b-2 ${filter === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
                >
                    All
                </button>
            </div>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Subject</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Priority</th>
                            <th className="px-6 py-3">Created</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.map(t => (
                            <tr key={t.id} className="hover:bg-slate-50 group">
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {t.subject}
                                </td>
                                <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                                    <UserCircleIcon className="w-4 h-4 text-slate-400" />
                                    {t.user?.name || t.user?.email || "Unknown"} <span className="text-slate-400">({t.user?.company?.name || "No Company"})</span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">
                                        <TagIcon className="w-3 h-3" /> {t.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${t.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {t.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400">
                                    {new Date(t.createdAt || t.created).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={t.status === 'open' ? 'pending' : 'approved'} />
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">
                                    No tickets found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
