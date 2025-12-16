
import React, { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "@/services/notificationsService";
import { BellIcon, CheckCircleIcon, InformationCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

export default function NotificationFeed() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial fetch
        getNotifications(5).then(setNotifications).catch(console.error).finally(() => setLoading(false));

        // In a real scenario, we would also subscribe to SSE notifications here if available in the service
        // For now, we rely on the initial fetch as per instructions, but leave room for SSE integration
    }, []);

    const handleRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (e) {
            console.error("Failed to mark as read", e);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                    <BellIcon className="w-5 h-5 text-slate-400" />
                    Aviseringar
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-0 text-sm">
                {loading ? (
                    <div className="animate-pulse space-y-3">
                        <div className="h-10 bg-slate-50 rounded" />
                        <div className="h-10 bg-slate-50 rounded" />
                        <div className="h-10 bg-slate-50 rounded" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">Inga nya aviseringar</div>
                ) : (
                    <ul className="divide-y divide-slate-50">
                        {notifications.map((n) => (
                            <li key={n.id} className={`py-3 flex gap-3 ${n.read ? 'opacity-50' : 'opacity-100'}`}>
                                <div className="mt-0.5">
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-slate-800">{n.message}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString("sv-SE", { hour: '2-digit', minute: '2-digit' }) : 'Idag'}
                                    </p>
                                </div>
                                {!n.read && (
                                    <button
                                        onClick={() => handleRead(n.id)}
                                        className="text-xs text-[#1E5CB3] hover:underline self-start mt-1"
                                    >
                                        Markera läst
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function getIcon(type) {
    if (type === "critical" || type === "error") return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
    if (type === "warning") return <ExclamationCircleIcon className="w-5 h-5 text-amber-500" />;
    if (type === "success") return <CheckCircleIcon className="w-5 h-5 text-emerald-500" />;
    return <InformationCircleIcon className="w-5 h-5 text-blue-500" />;
}
