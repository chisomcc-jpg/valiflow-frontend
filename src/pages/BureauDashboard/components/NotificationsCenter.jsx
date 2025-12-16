import React, { useState } from "react";
import {
  BellIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CpuChipIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsCenter() {
  const [open, setOpen] = useState(false);

  const alerts = [
    {
      id: 1,
      type: "risk",
      title: "Ökad risknivå hos 3 kunder",
      message: "ByggPartner AB, Ekonomi & Co och NorrTech har ökad risk denna vecka.",
      icon: ExclamationTriangleIcon,
      color: "text-amber-400",
    },
    {
      id: 2,
      type: "ai",
      title: "AI Accuracy förbättrad",
      message: "Modellen presterar nu i snitt 94.8% accuracy (upp +3% från föregående månad).",
      icon: CpuChipIcon,
      color: "text-cyan-400",
    },
    {
      id: 3,
      type: "connection",
      title: "Fortnox-anslutning timeout",
      message: "2 kunder påverkas: Redo AB & Konsultia. Kontrollera integrationen.",
      icon: LinkIcon,
      color: "text-rose-400",
    },
  ];

  return (
    <div className="relative">
      {/* 🔔 Ikon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-300 hover:text-cyan-400 transition"
      >
        <BellIcon className="w-6 h-6" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
      </button>

      {/* 🔔 Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex justify-between items-center px-4 py-3 border-b border-slate-800">
              <h3 className="text-slate-100 font-medium">Notiser</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-cyan-400"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-slate-800/60 transition"
                >
                  <a.icon className={`w-5 h-5 mt-0.5 ${a.color}`} />
                  <div>
                    <p className="text-slate-100 font-medium">{a.title}</p>
                    <p className="text-slate-400 text-sm">{a.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-slate-800 text-center">
              <button
                onClick={() => alert("Fler notiser snart tillgängliga")}
                className="text-sm text-cyan-400 hover:underline"
              >
                Visa alla notiser
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
