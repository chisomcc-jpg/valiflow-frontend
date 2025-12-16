
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Building, ShieldCheck, Check, AlertTriangle, ArrowRight } from "lucide-react";
import { api } from "../../services/api";

export default function AcceptInvitePage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [invite, setInvite] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
        loadInvite();
    }, [token]);

    const loadInvite = async () => {
        try {
            const res = await api.get(`/invites/${token}`);
            setInvite(res.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.error || "Kunde inte ladda inbjudan.");
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        setAccepting(true);
        try {
            await api.post(`/invites/${token}/accept`);
            // Redirect to dashboard or onboarding success
            navigate("/dashboard");
        } catch (err) {
            alert("Kunde inte acceptera inbjudan. Du kanske måste logga in först.");
            // In a real flow, we'd redirect to login with returnUrl
            navigate(`/login?returnUrl=/accept-invite/${token}`);
        } finally {
            setAccepting(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-slate-500">Laddar inbjudan...</div>;

    if (error) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow border border-slate-200 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900 mb-2">Inbjudan ogiltig</h2>
                <p className="text-slate-600 mb-6">{error}</p>
                <button onClick={() => navigate("/")} className="text-indigo-600 font-medium hover:underline">Gå till startsidan</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 px-8 py-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Building className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Inbjudan till samarbete</h1>
                    <p className="text-indigo-100">
                        <span className="font-semibold text-white">{invite.inviterAgency || "Redovisningsbyrån"}</span> vill hjälpa er med fakturahantering i Valiflow.
                    </p>
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
                        <h3 className="text-sm font-semibold text-blue-900 flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-4 h-4" /> Tryggt ägarskap
                        </h3>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            Du ({invite.targetCompany}) förblir ägare av kontot. Genom att acceptera ger du byrån tillgång att hantera fakturor och avvikelser enligt nedan. Du kan när som helst återkalla åtkomsten.
                        </p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Begärd åtkomst</h3>
                        <ul className="space-y-3">
                            {(invite.scopes || ["invoice_read"]).map(scope => (
                                <li key={scope} className="flex items-start gap-3">
                                    <div className="mt-0.5 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-slate-700 text-sm font-medium">
                                        {formatScope(scope)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border-t border-slate-100 pt-8 flex flex-col gap-3">
                        <button
                            onClick={handleAccept}
                            disabled={accepting}
                            className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white px-6 py-3.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70"
                        >
                            {accepting ? "Bearbetar..." : "Acceptera & Ge Åtkomst"}
                            {!accepting && <ArrowRight className="w-5 h-5" />}
                        </button>
                        <p className="text-center text-xs text-slate-400 mt-2">
                            Genom att fortsätta godkänner du våra användarvillkor.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function formatScope(scope) {
    const map = {
        invoice_read: "Läsa och granska fakturor",
        invoice_advise: "Lämna råd och kommentarer på avvikelser",
        supplier_read: "Se leverantörsregister och historik"
    };
    return map[scope] || scope;
}
