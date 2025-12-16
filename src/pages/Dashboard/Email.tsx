import React, { useEffect, useState } from "react";
import {
  EnvelopeOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { fetchEmails, EmailItem } from "../../services/emailService";

/* ==========================================================
   ✅ Valiflow – E-postöversikt (Design System v1)
   ========================================================== */
const VF = {
  navy: "#0A1E44",
  blue: "#1E5CB3",
  teal: "#14B8A6",
  gray: "#F4F7FB",
  green: "#22C55E",
  amber: "#F59E0B",
  text: "#1E293B",
};

export default function Email() {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);

  useEffect(() => {
    async function loadEmails() {
      setLoading(true);
      try {
        const data = await fetchEmails();
        setEmails(data);
      } catch (error) {
        console.error("Fel vid inläsning:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEmails();
  }, []);

  const total = emails.length;
  const processed = emails.filter((e) => e.status === "processed").length;
  const aiDetected = emails.filter((e) => e.aiDetected).length;
  const pending = total - processed;

  return (
    <div className="min-h-screen" style={{ background: VF.gray }}>
      {/* ───────────────────────────────
          TRUST LAYER – Header
      ─────────────────────────────── */}
      <header
        className="px-8 py-5 flex justify-between items-center"
        style={{
          background: `linear-gradient(90deg, ${VF.navy} 0%, ${VF.blue} 100%)`,
          color: "white",
        }}
      >
        <h1 className="text-xl font-semibold">E-postöversikt</h1>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm transition"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Uppdatera
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ───────────────────────────────
            EXECUTIVE LAYER – KPI-kort
        ─────────────────────────────── */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <SummaryCard title="Totalt antal mejl" value={total} color={VF.blue} icon={EnvelopeOpenIcon} />
          <SummaryCard title="Bearbetade" value={processed} color={VF.green} icon={CheckCircleIcon} />
          <SummaryCard title="AI-tolkade mejl" value={aiDetected} color={VF.teal} icon={SparklesIcon} />
          <SummaryCard title="Väntande" value={pending} color={VF.amber} icon={ClockIcon} />
        </div>

        {/* ───────────────────────────────
            ANALYTICAL LAYER – Tabell
        ─────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center items-center h-64 text-slate-500">
            <ArrowPathIcon className="w-6 h-6 mr-2 animate-spin text-blue-600" />
            Laddar e-post...
          </div>
        ) : total === 0 ? (
          <div className="flex justify-center items-center h-64 text-slate-500">
            Inga mejl har mottagits ännu.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(30,92,179,0.05)] overflow-hidden"
          >
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {["Från", "Ämne", "Datum", "Status", "AI", ""].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-slate-600 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {emails.map((email, i) => (
                  <motion.tr
                    key={email.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-6 py-3 font-medium">{email.from}</td>
                    <td className="px-6 py-3">{email.subject}</td>
                    <td className="px-6 py-3 text-slate-500">
                      {new Date(email.date).toLocaleString("sv-SE", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-6 py-3">
                      {email.status === "processed" ? (
                        <StatusBadge text="Bearbetad" color={VF.green} />
                      ) : (
                        <StatusBadge text="Väntar" color={VF.amber} />
                      )}
                    </td>
                    <td className="px-6 py-3">
                      {email.aiDetected ? (
                        <StatusBadge text="AI tolkat" color={VF.teal} />
                      ) : (
                        <span className="text-slate-400 text-xs">–</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => setSelectedEmail(email)}
                        className="text-blue-600 hover:underline"
                      >
                        Visa
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      {/* ───────────────────────────────
          INSIGHT LAYER – AI-panel
      ─────────────────────────────── */}
      <AnimatePresence>
        {selectedEmail && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-end z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-[480px] bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <div className="flex justify-between items-center px-5 py-4 border-b">
                <h2 className="font-semibold text-slate-800">AI-insikt</h2>
                <button onClick={() => setSelectedEmail(null)}>
                  <XMarkIcon className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto">
                <h3 className="font-medium mb-2">{selectedEmail.subject}</h3>
                <p className="text-sm text-slate-500 mb-4">{selectedEmail.from}</p>

                <div className="p-4 bg-teal-50 border-l-4 border-teal-400 rounded-md mb-4">
                  <p className="text-sm text-slate-700">
                    AI har analyserat mejlet och identifierat{" "}
                    <strong>fakturainnehåll</strong> samt{" "}
                    <strong>leverantörsuppgifter</strong>.  
                    <br />Confidence: 92%
                  </p>
                </div>

                <div className="text-sm text-slate-600 leading-relaxed">
                  {selectedEmail.body ||
                    "Inget meddelandeinnehåll tillgängligt. Kan innehålla bifogad faktura eller PDF."}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================================
   Komponenter
========================================================== */
function SummaryCard({ title, value, icon: Icon, color }) {
  return (
    <div
      className="p-5 rounded-2xl text-white flex flex-col justify-between"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
        boxShadow: "0 2px 8px rgba(30,92,179,0.05)",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-90">{title}</p>
        <Icon className="w-5 h-5 opacity-80" />
      </div>
      <h2 className="text-2xl font-semibold mt-2">{value}</h2>
    </div>
  );
}

function StatusBadge({ text, color }) {
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-md text-white"
      style={{ backgroundColor: color }}
    >
      {text}
    </span>
  );
}
