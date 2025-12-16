import React, { useState, useEffect } from "react";
import {
  ChartBarIcon,
  ShieldExclamationIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ==========================================================
   ✅ Valiflow – Analys & Insikter (Analytics.jsx)
   ========================================================== */
const VF = {
  navy: "#0A1E44",
  blue: "#1E5CB3",
  blueLight: "#EAF3FE",
  text: "#1E293B",
  sub: "#64748B",
  bg: "#F4F7FB",
  border: "#E2E8F0",
};

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [aiMessage, setAiMessage] = useState("");

  useEffect(() => {
    const insights = [
      "AI har identifierat en ökning i leverantörsrisker under senaste kvartalet.",
      "Totala inköpskostnader ökade med 12 % jämfört med föregående månad.",
      "Två leverantörer visar stigande fakturafrekvens – rekommenderad granskning.",
      "AI har upptäckt potentiella duplicerade fakturor i IT-segmentet.",
    ];
    setAiMessage(insights[Math.floor(Math.random() * insights.length)]);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: VF.bg }}>
      {/* HEADER */}
      <header
        className="px-8 py-5 shadow text-white"
        style={{
          background: `linear-gradient(90deg, ${VF.navy} 0%, ${VF.blue} 100%)`,
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Analys & Insikter</h1>
            <p className="text-sm opacity-80">
              AI analyserar fakturaflöden, risker och avvikelser för att ge smartare beslutsunderlag.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm transition">
            <ArrowPathIcon className="w-4 h-4" /> Uppdatera
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* AI INSIGHT BOX */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#EAF3FE] border border-[#1E5CB3]/10 p-5 rounded-xl flex items-start gap-3"
        >
          <SparklesIcon className="w-6 h-6 text-[#1E5CB3] mt-0.5" />
          <p className="text-sm text-slate-700">{aiMessage}</p>
        </motion.div>

        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap gap-3">
          {[
            { id: "overview", label: "Översikt", icon: ChartBarIcon },
            { id: "risk", label: "Riskanalys", icon: ShieldExclamationIcon },
            { id: "trend", label: "Trender", icon: ArrowTrendingUpIcon },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition ${
                activeTab === id
                  ? "bg-[#1E5CB3] text-white border-[#1E5CB3]"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* TABS CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ChartCard title="Totalt inköp per månad">
                  <BarChartExample />
                </ChartCard>

                <ChartCard title="Leverantörsrisk över tid">
                  <LineChartExample />
                </ChartCard>

                <ChartCard title="Fakturastatus – Fördelning">
                  <PieChartExample />
                </ChartCard>
              </div>
            </motion.div>
          )}

          {activeTab === "risk" && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <ChartCard title="AI Risknivå (leverantörer)">
                <LineChartExample />
              </ChartCard>
            </motion.div>
          )}

          {activeTab === "trend" && (
            <motion.div
              key="trend"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <ChartCard title="Kostnad & Risktrend (månad)">
                <DualLineChartExample />
              </ChartCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI SUMMARY */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#EAF3FE] border border-[#1E5CB3]/10 p-5 rounded-xl text-sm text-slate-700 flex items-start gap-2"
        >
          <SparklesIcon className="w-5 h-5 text-[#1E5CB3] mt-0.5" />
          <p>
            <strong className="text-[#1E5CB3]">AI-sammanfattning:</strong>  
            Valiflows analysmotor identifierar riskmönster och kostnadsavvikelser i realtid. 
            Nuvarande risknivå ligger under 30 %, vilket indikerar stabil leverantörsportfölj.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* ==========================================================
   📊 Diagramkomponenter
========================================================== */
const monthlyData = [
  { month: "Jan", value: 220000 },
  { month: "Feb", value: 250000 },
  { month: "Mar", value: 310000 },
  { month: "Apr", value: 295000 },
  { month: "Maj", value: 330000 },
  { month: "Jun", value: 370000 },
];

const riskData = [
  { month: "Jan", risk: 18 },
  { month: "Feb", risk: 22 },
  { month: "Mar", risk: 33 },
  { month: "Apr", risk: 41 },
  { month: "Maj", risk: 35 },
  { month: "Jun", risk: 29 },
];

const statusData = [
  { name: "Betalda", value: 72 },
  { name: "Försenade", value: 18 },
  { name: "Under granskning", value: 10 },
];

function ChartCard({ title, children }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-slate-200 rounded-xl shadow-sm p-5"
    >
      <h3 className="font-semibold text-slate-700 mb-3">{title}</h3>
      {children}
    </motion.div>
  );
}

function BarChartExample() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#1E5CB3" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function LineChartExample() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={riskData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="risk" stroke="#1E5CB3" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function DualLineChartExample() {
  const combined = monthlyData.map((m, i) => ({
    month: m.month,
    cost: m.value,
    risk: riskData[i]?.risk ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={combined}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="cost" stroke="#1E5CB3" strokeWidth={2.5} dot={false} />
        <Line type="monotone" dataKey="risk" stroke="#93C5FD" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function PieChartExample() {
  const COLORS = ["#1E5CB3", "#60A5FA", "#BFDBFE"];
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={statusData}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={95}
          label
        >
          {statusData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
