import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheckIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function InviteAcceptPage() {
  const router = useRouter();
  const { token } = router.query;

  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`/api/invites/${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Ogiltig länk");
        setInvite(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  async function handleAccept(e: any) {
    e.preventDefault();
    if (!password) return alert("Vänligen ange ett lösenord.");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/invites/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ett fel uppstod.");
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-rose-50 to-white">
        <ShieldCheckIcon className="w-16 h-16 text-rose-500 mb-4" />
        <h1 className="text-2xl font-semibold text-rose-700 mb-2">Ogiltig eller utgången länk</h1>
        <p className="text-slate-600">{error}</p>
      </div>
    );

  if (success)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-emerald-50 to-white">
        <ShieldCheckIcon className="w-16 h-16 text-emerald-600 mb-4" />
        <h1 className="text-2xl font-semibold text-emerald-700 mb-2">Konto aktiverat!</h1>
        <p className="text-slate-600">Omdirigerar till dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl shadow-inner">
            <UserCircleIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Aktivera ditt konto</h2>
            <p className="text-sm opacity-80">Bjuden till {invite?.company?.name}</p>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleAccept} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">Namn</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ditt namn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">E-postadress</label>
            <input
              type="email"
              value={invite?.email}
              readOnly
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Välj lösenord</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Minst 8 tecken"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={submitting}
            type="submit"
            className="relative w-full py-3 font-medium text-white rounded-lg overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg"></span>
            <span className="relative z-10">{submitting ? "Aktiverar..." : "Aktivera konto"}</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
