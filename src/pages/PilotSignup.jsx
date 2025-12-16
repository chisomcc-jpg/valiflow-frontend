// src/pages/PilotSignup.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PilotSignup() {
    const [formData, setFormData] = useState({
        agencyName: '',
        contactName: '',
        email: '', // 📧
        role: '',
        clientCount: '',
        erpSystem: '',
        notes: ''
    });
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const validateEmail = (email) => {
        if (!email) {
            setEmailError('E-postadress krävs');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError('Ange en giltig e-postadress');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmail(formData.email)) {
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
            const res = await fetch(`${API_URL}/api/pilot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to submit application');
            }
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Något gick fel. Försök igen eller kontakta support.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050C22] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/valiflow-logo.png" className="h-8" alt="Valiflow" />
                    <span className="font-semibold tracking-tight text-lg">Valiflow</span>
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg relative z-10"
            >
                <AnimatePresence mode="wait">
                    {!submitted ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl"
                        >
                            <div className="flex justify-center mb-6">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-center mb-4">Valiflow är tillgängligt via pilotprogram</h1>

                            <div className="space-y-4 text-white/70 text-sm leading-relaxed mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
                                <p>
                                    Valiflow är för närvarande inte öppet för allmän registrering.
                                </p>
                                <p>
                                    Vi samarbetar just nu med ett begränsat antal redovisnings- och revisionsbyråer för att forma nästa generations Trust Layer för fakturagranskning, internkontroll och ViDA-förberedelse.
                                </p>
                                <p className="font-medium text-white/90">
                                    Pilotprogrammet är avsett för byråer som vill ligga i framkant och aktivt påverka hur plattformen utvecklas.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-white/50 mb-1 ml-1">Byrånamn</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                                            value={formData.agencyName}
                                            onChange={e => setFormData({ ...formData, agencyName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-white/50 mb-1 ml-1">Kontaktperson</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition"
                                            value={formData.contactName}
                                            onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-white/50 mb-1 ml-1">E-post</label>
                                    <input
                                        type="email"
                                        className={`w-full bg-black/20 border ${emailError ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition`}
                                        value={formData.email}
                                        onChange={e => {
                                            setFormData({ ...formData, email: e.target.value });
                                            if (emailError) setEmailError('');
                                        }}
                                        onBlur={() => validateEmail(formData.email)}
                                    />
                                    {emailError && <p className="text-red-400 text-xs mt-1 ml-1">{emailError}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-white/50 mb-1 ml-1">Roll</label>
                                        <select
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-white/90"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="">Välj roll...</option>
                                            <option value="Byråägare">Byråägare</option>
                                            <option value="Partner">Partner</option>
                                            <option value="Ansvarig konsult">Ansvarig konsult</option>
                                            <option value="Annat">Annat</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-white/50 mb-1 ml-1">Antal klientbolag</label>
                                        <select
                                            required
                                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-white/90"
                                            value={formData.clientCount}
                                            onChange={e => setFormData({ ...formData, clientCount: e.target.value })}
                                        >
                                            <option value="">Välj intervall...</option>
                                            <option value="1-50">1-50</option>
                                            <option value="51-200">51-200</option>
                                            <option value="200+">200+</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-white/50 mb-1 ml-1">ERP-system (primärt)</label>
                                    <select
                                        required
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition text-white/90"
                                        value={formData.erpSystem}
                                        onChange={e => setFormData({ ...formData, erpSystem: e.target.value })}
                                    >
                                        <option value="">Välj system...</option>
                                        <option value="Fortnox">Fortnox</option>
                                        <option value="Visma">Visma</option>
                                        <option value="Business Central">Business Central</option>
                                        <option value="Blandat">Blandad miljö</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-white/50 mb-1 ml-1">Vad vill ni utvärdera?</label>
                                    <textarea
                                        rows={2}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition placeholder:text-white/20"
                                        placeholder="T.ex. ViDA-compliance, effektivisering..."
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>

                                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:brightness-110 text-white font-semibold py-3.5 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Skickar...' : (
                                        <>Ansök om byråpilot <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </button>

                                <div className="text-center mt-4">
                                    <p className="text-xs text-white/40 hover:text-white/60 cursor-pointer transition">
                                        Vad innebär pilotprogrammet?
                                    </p>
                                </div>
                            </form>

                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl text-center"
                        >
                            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-6">
                                <CheckCircle className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-3">Tack för din ansökan</h2>
                            <p className="text-white/70 mb-8 leading-relaxed max-w-md mx-auto">
                                Vi har mottagit din ansökan för <strong>{formData.agencyName}</strong>. <br /><br />
                                Vårt partnerteam går igenom ansökningar löpande för att säkerställa att vi kan leverera rätt värde till er. Vi återkommer inom kort.
                            </p>
                            <Link
                                to="/"
                                className="inline-flex px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg font-semibold text-sm transition"
                            >
                                Tillbaka till startsidan
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div >

            <p className="absolute bottom-6 text-white/20 text-xs text-center">
                © 2025 Valiflow AB. All of the rights reserved.
            </p>

        </div >
    );
}
