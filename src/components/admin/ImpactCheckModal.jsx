import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * 💥 ImpactCheckModal
 * Mandatory confirmation modal that shows the blast radius of a destructive action.
 * 
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {function} onConfirm
 * @param {string} actionType - 'feature_toggle', 'suspend_account', etc
 * @param {string} targetId - ID of entity being affected
 * @param {object} params - Extra context
 */
export default function ImpactCheckModal({
    isOpen,
    onClose,
    onConfirm,
    actionType,
    targetId,
    params
}) {
    const [loading, setLoading] = useState(true);
    const [impact, setImpact] = useState(null);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setError(null);
            // Fetch impact
            axios.post(`${API_URL}/api/admin/impact-check`, {
                action: actionType,
                targetId,
                params,
                token: undefined // Auth header handled by interceptor usually, but if not we might need context. 
                // Assuming global axios or passed auth. 
                // NOTE: If global auth isn't set, this might fail. 
                // We will assume the parent passes a configured axios or interceptor is used.
                // For safety, let's rely on localStorage token if we have to, 
                // but better to assume the environment is set up like features.jsx.
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}` // Fallback, normally useAuth
                }
            })
                .then(res => {
                    setImpact(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError("Failed to calculate impact.");
                    setLoading(false);
                });
        }
    }, [isOpen, actionType, targetId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-red-100">

                {/* Header */}
                <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Konsekvensanalys</h3>
                        <p className="text-xs text-red-600 font-medium">Denna åtgärd påverkar produktionen</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="py-8 text-center text-gray-500">
                            <p className="animate-pulse">Beräknar blast radius...</p>
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-4">{error}</div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">{impact?.customerCount}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500">Kunder</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-2xl font-bold text-gray-900">{impact?.pendingJobCount}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500">Jobb</div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-xl font-bold text-gray-900">{(impact?.estimatedVolumeSEK || 0).toLocaleString()}</div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500">SEK Volym</div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-100">
                                Är du säker på att du vill fortsätta? Detta kan inte ångras omedelbart.
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium transition"
                    >
                        Avbryt
                    </button>
                    <button
                        onClick={() => onConfirm(impact?.impactCheckId)}
                        disabled={loading || !!error}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? "Vänta..." : "Ja, utför ändring"}
                    </button>
                </div>
            </div>
        </div>
    );
}
