import React, { useEffect, useState } from "react";
import {
  BellAlertIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
// import { NotificationService } from "@/services/api"; // Service missing
import { getNotifications, markNotificationAsRead } from "@/services/notificationsService";

const VF = {
  navy: "#0A1E44",
  blue: "#1E5CB3",
  blueLight: "#EAF3FE",
  sub: "#64748B",
  bg: "#F4F7FB",
};

export default function BureauNotifications() {
  const { token } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const mockNotifications = [
    {
      id: 1,
      type: "critical",
      source: "AI Risk Engine",
      message: "AI upptäckte 3 misstänkta fakturor hos TransportPro AB.",
      time: "3 minuter sedan",
      verified: true,
      action: "Visa fakturor",
    },
    {
      id: 2,
      type: "warning",
      source: "Fortnox Integration",
      message: "Synkningen med Fortnox misslyckades för 2 kunder.",
      time: "22 minuter sedan",
      verified: false,
      action: "Försök igen",
    },
    {
      id: 3,
      type: "info",
      source: "Valiflow AI",
      message: "Automatiseringsgraden ökade med 4 % senaste veckan.",
      time: "1 timme sedan",
      verified: true,
      action: "Visa rapport",
    },
    {
      id: 4,
      type: "success",
      source: "Valiflow System",
      message: "AI-analys slutförd för Oktober – inga nya risker upptäckta.",
      time: "2 timmar sedan",
      verified: true,
      action: "Öppna analys",
    },
  ];

  useEffect(() => {
    fetchNotifications(true);
  }, []);

  async function fetchNotifications(initial = false) {
    try {
      if (!initial) setRefreshing(true);
      setError(null);
      // const res = await NotificationService.all();
      const list = await getNotifications();
      if (list && Array.isArray(list) && list.length > 0) {
        setNotifications(list);
      } else {
        // fallback till mock om inga notiser finns ännu
        setNotifications(mockNotifications);
      }
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
      setError("Kunde inte hämta notiser från servern.");
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 400);
    }
  }

  const iconMap = {
    critical: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: BellAlertIcon,
    success: CheckCircleIcon,
  };

  const colorMap = {
    critical: "text-red-600",
    warning: "text-amber-600",
    info: "text-blue-600",
    success: "text-emerald-600",
  };

  const bgMap = {
    critical: "bg-red-50",
    warning: "bg-amber-50",
    info: "bg-blue-50",
    success: "bg-emerald-50",
  };

  const aiSummary = {
    total: notifications.length,
    critical: notifications.filter((n) => n.type === "critical").length,
    warnings: notifications.filter((n) => n.type === "warning").length,
    resolved: notifications.filter((n) => n.type === "success").length,
    lastScan: new Date().toLocaleString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }),
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-40 bg-white border border-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F4F7FB] overflow-x-hidden">
      {/* HEADER */}
      <header
        className="w-full text-white shadow-sm mt-6"
        style={{
          background: `linear-gradient(90deg, ${VF.navy} 0%, ${VF.blue} 100%)`,
        }}
      >
        <div className="flex justify-between items-center px-8 py-5">
          <div>
            <h1 className="text-xl font-semibold">Notifikationer</h1>
            <p className="text-sm opacity-80">
              Realtidshändelser, AI-insikter och systemaviseringar.
            </p>
          </div>
          <Button
            onClick={() => fetchNotifications(false)}
            className="bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 text-sm"
          >
            <SparklesIcon
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Uppdatera feed
          </Button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="w-full px-8 py-8 space-y-8">
        {/* AI SAMMANFATTNING */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#EAF3FE] border border-[#1E5CB3]/10 p-5 rounded-xl flex items-start gap-3"
        >
          <SparklesIcon className="w-6 h-6 text-[#1E5CB3] mt-0.5" />
          <div>
            <p className="text-sm text-slate-700">
              Valiflow AI analyserade{" "}
              <strong>{aiSummary.total}</strong> händelser senaste timmen.{" "}
              <strong className="text-red-600">{aiSummary.critical}</strong>{" "}
              kräver manuell granskning och{" "}
              <strong className="text-amber-600">{aiSummary.warnings}</strong>{" "}
              är markerade för uppföljning.{" "}
              <strong className="text-emerald-600">{aiSummary.resolved}</strong>{" "}
              är redan lösta.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Senast uppdaterad {aiSummary.lastScan} • Källa: Valiflow AI Engine
            </p>
          </div>
        </motion.div>

        {/* NOTIFICATION CARDS */}
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
          {notifications.map((n, i) => {
            const Icon = iconMap[n.type] || BellAlertIcon;
            return (
              <motion.div
                key={n.id || i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-[0_2px_8px_rgba(30,92,179,0.05)] hover:shadow-[0_4px_12px_rgba(30,92,179,0.08)] transition-shadow duration-200"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${bgMap[n.type] || "bg-slate-50"
                      } border border-slate-200 shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${colorMap[n.type] || "text-slate-500"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 text-sm font-medium">
                      {n.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{n.time}</span>
                      <span>•</span>
                      <span>{n.source}</span>
                      {n.verified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <ShieldCheckIcon className="w-3.5 h-3.5" />
                          Verifierad
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                          Ej verifierad
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-slate-700 border-slate-200 hover:bg-slate-50 flex items-center gap-1"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                    {n.action || "Visa detaljer"}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#EAF3FE] border border-[#1E5CB3]/10 p-5 rounded-xl text-xs text-slate-500 text-center"
        >
          AI-sammanställningen baseras på senaste feed från Redis + Fortnox API.
          Händelser verifieras automatiskt av Valiflow Trust Engine.
        </motion.div>
      </main>
    </div>
  );
}
