
import React, { useState } from "react";
import { X, Mail, Building, User } from "lucide-react";
import { api } from "../../../services/api";

export function InviteCustomerModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        targetOrgNumber: "",
        targetCompanyName: "",
        contactName: "",
        contactEmail: ""
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null); // { success: boolean, link?: string }

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Updated endpoint to match routes
            const res = await api.post("/bureau/invites", formData);
            setResult({ success: true, link: res.data.link });
        } catch (err) {
            console.error(err);
            setResult({ success: false, error: "Kunde inte skicka inbjudan." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-semibold text-slate-800">Bjud in ny kund</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {result?.success ? (
                        <div className="text-center py-6 animate-in fade-in zoom-in-95">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Inbjudan skickad!</h4>
                            <p className="text-slate-600 mb-6">Instruktioner har skickats till {formData.contactEmail}.</p>

                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-left mb-6">
                                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Dev Link (Mock Email)</p>
                                <code className="block text-xs bg-white p-2 rounded border border-slate-300 break-all select-all">
                                    {result.link}
                                </code>
                            </div>

                            <button onClick={onClose} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700">
                                Klar
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Obs:</strong> Kunden äger sitt konto. De måste godkänna inbjudan för att ni ska få åtkomst.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Org.nummer</label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="556XXX-XXXX"
                                            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            value={formData.targetOrgNumber}
                                            onChange={e => setFormData({ ...formData, targetOrgNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Företagsnamn</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="AB Exempel..."
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        value={formData.targetCompanyName}
                                        onChange={e => setFormData({ ...formData, targetCompanyName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kontaktperson</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Namn Efternamn"
                                        className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        value={formData.contactName}
                                        onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">E-postadress</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="email"
                                        placeholder="kontakt@foretag.se"
                                        className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                        value={formData.contactEmail}
                                        onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                                    />
                                </div>
                            </div>

                            {result?.error && <p className="text-red-600 text-sm">{result.error}</p>}

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg">Avbryt</button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {loading ? "Skickar..." : "Skicka inbjudan"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
