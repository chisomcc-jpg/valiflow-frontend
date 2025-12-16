
import React, { useState, useEffect } from "react";
import { User, Shield, Bell, Sliders, Key } from "lucide-react";
import { api } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

export function MyProfileSettings() {
    const { updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "",
        agencyName: "",
        customerAccessCount: 0,
        security: { twoFactorEnabled: false },
        notifications: {},
        preferences: {}
    });

    const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await api.get("/user/me");
            setUser(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            const res = await api.put("/user/profile", {
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone
            });
            setUser(prev => ({ ...prev, ...res.data }));

            // Sync global auth state so Navbar updates immediately
            if (updateUser) {
                updateUser({
                    name: `${user.firstName} ${user.lastName}`
                });
            }

            showMessage("Profil sparad!");
        } catch (err) {
            showMessage("Kunde inte spara profil.", "error");
        }
    };

    const handlePreferenceUpdate = async (key, value) => {
        // Optimistic update
        setUser(prev => ({
            ...prev,
            preferences: { ...prev.preferences, [key]: value }
        }));
        try {
            await api.put("/user/preferences", { [key]: value });
        } catch (err) {
            showMessage("Kunde inte spara inställning.", "error");
        }
    };

    const handleNotificationUpdate = async (key, value) => {
        setUser(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: value }
        }));
        await api.put("/user/notifications", { [key]: value });
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            showMessage("Lösenorden matchar inte.", "error");
            return;
        }
        try {
            await api.put("/user/security", {
                currentPassword: passwordData.current,
                newPassword: passwordData.new
            });
            showMessage("Lösenord uppdaterat!");
            setPasswordData({ current: "", new: "", confirm: "" });
        } catch (err) {
            showMessage(err.response?.data?.error || "Fel lösenord.", "error");
        }
    };

    const showMessage = (msg, type = "success") => {
        setMessage({ text: msg, type });
        setTimeout(() => setMessage(null), 3000);
    };

    if (loading) return <div className="p-8">Laddar...</div>;

    return (
        <div className="space-y-8">
            {message && (
                <div className={`fixed top-20 right-8 px-4 py-2 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 ${message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {message.text}
                </div>
            )}

            {/* 1. Grundprofil */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-600" /> Grundprofil
                </h2>
                <p className="text-sm text-slate-500 mb-6">Din personliga identitet och kontaktuppgifter.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Förnamn</label>
                        <input
                            type="text"
                            value={user.firstName}
                            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Efternamn</label>
                        <input
                            type="text"
                            value={user.lastName}
                            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">E-post (Inloggning)</label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full px-3 py-2 border rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Telefonnummer (Frivilligt)</label>
                        <input
                            type="tel"
                            value={user.phone}
                            onChange={(e) => setUser({ ...user, phone: e.target.value })}
                            placeholder="+46..."
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={handleProfileUpdate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium">
                        Spara profil
                    </button>
                </div>
            </section>

            {/* 2. Roll & Åtkomst */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <Key className="w-5 h-5 text-indigo-600" /> Roll & Åtkomst
                </h2>
                <p className="text-sm text-slate-500 mb-6">Översikt över dina behörigheter (Läses endast).</p>

                <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-semibold">Din Roll</div>
                        <div className="text-base font-medium text-slate-900">{user.role}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-semibold">Tillhör Byrå</div>
                        <div className="text-base font-medium text-slate-900">{user.agencyName}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-semibold">Aktiva Kunder</div>
                        <div className="text-base font-medium text-slate-900">{user.customerAccessCount} stycken</div>
                    </div>
                </div>
            </section>

            {/* 3. Säkerhet */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-600" /> Säkerhet & Inloggning
                </h2>
                <div className="mt-6 space-y-6">
                    {/* Password Change */}
                    <form onSubmit={handlePasswordChange} className="border-b border-slate-100 pb-6">
                        <h3 className="text-sm font-medium text-slate-900 mb-4">Byt lösenord</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="password"
                                placeholder="Nuvarande lösenord"
                                value={passwordData.current}
                                onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                                className="px-3 py-2 border rounded-lg text-sm"
                            />
                            <input
                                type="password"
                                placeholder="Nytt lösenord"
                                value={passwordData.new}
                                onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                className="px-3 py-2 border rounded-lg text-sm"
                            />
                            <input
                                type="password"
                                placeholder="Bekräfta nytt"
                                value={passwordData.confirm}
                                onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                className="px-3 py-2 border rounded-lg text-sm"
                            />
                        </div>
                        <button type="submit" className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">Uppdatera lösenord</button>
                    </form>

                    {/* 2FA */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-slate-900">Tvåfaktorsautentisering (2FA)</div>
                            <div className="text-sm text-slate-500">Lägg till ett extra lager av säkerhet med BankID eller Authenticator.</div>
                        </div>
                        <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 text-slate-600">
                            Aktivera 2FA
                        </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="text-sm text-red-600 cursor-pointer font-medium hover:underline">
                            Logga ut från alla andra enheter
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Notifieringar */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-indigo-600" /> Personliga Notifieringar
                </h2>
                <p className="text-sm text-slate-500 mb-6">Välj vad du vill bli varnad om.</p>

                <div className="space-y-4 max-w-lg">
                    {/* Types */}
                    {['deviation', 'payment_issue', 'system_update'].map(key => (
                        <div key={key} className="flex items-center justify-between">
                            <span className="text-sm text-slate-700 capitalize">{key.replace('_', ' ')}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={user.notifications?.types?.[key] || false}
                                    onChange={(e) => handleNotificationUpdate('types', { ...user.notifications.types, [key]: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Preferenser */}
            <section className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-600" /> Personliga Preferenser
                </h2>
                <p className="text-sm text-slate-500 mb-6">Anpassa din upplevelse i Valiflow.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Datumformat</label>
                        <select
                            value={user.preferences?.dateFormat}
                            onChange={(e) => handlePreferenceUpdate('dateFormat', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-white"
                        >
                            <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY (Svensk)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Standardvy</label>
                        <select
                            value={user.preferences?.defaultView}
                            onChange={(e) => handlePreferenceUpdate('defaultView', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg bg-white"
                        >
                            <option value="deviations_only">Visa endast avvikelser (Rekommenderas)</option>
                            <option value="all_invoices">Visa alla fakturor</option>
                        </select>
                    </div>
                </div>
            </section>
        </div>
    );
}
