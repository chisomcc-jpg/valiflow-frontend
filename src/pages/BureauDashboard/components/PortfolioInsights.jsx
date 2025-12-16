import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { motion } from "framer-motion";
import { Brain, AlertTriangle, TrendingUp } from "lucide-react";

const COLORS = ["#06b6d4", "#22c55e", "#f59e0b", "#ef4444"];

export default function PortfolioInsights() {
  // 📊 Mock-data — ersätt med riktiga API-data senare
  const riskByIndustry = [
    { name: "Bygg", risk: 24 },
    { name: "IT", risk: 14 },
    { name: "Handel", risk: 32 },
    { name: "Konsult", risk: 18 },
  ];

  const aiTrend = [
    { name: "V1", accuracy: 86 },
    { name: "V2", accuracy: 88 },
    { name: "V3", accuracy: 91 },
    { name: "V4", accuracy: 93 },
    { name: "V5", accuracy: 95 },
  ];

  const riskDistribution = [
    { name: "Låg", value: 55 },
    { name: "Medel", value: 30 },
    { name: "Hög", value: 15 },
  ];

  const topRiskCustomers = [
    { name: "Ekonomi & Co", score: 32 },
    { name: "BuildSmart AB", score: 29 },
    { name: "NorrTech Oy", score: 24 },
  ];

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-100">Portfolio Insights</h2>
        <p className="text-slate-400 text-sm">
          Överblick över risk, AI och kundprestationer
        </p>
      </div>

      {/* 🧱 Grid med kort */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 📊 Risk per bransch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-slate-100">Risknivå per bransch</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={riskByIndustry}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  color: "#e2e8f0",
                }}
              />
              <Bar dataKey="risk" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 🍩 Risknivåfördelning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-slate-100">Risknivå-fördelning</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={riskDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  color: "#e2e8f0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 🧠 AI Accuracy Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-slate-100">AI Accuracy över tid</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={aiTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  color: "#e2e8f0",
                }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ r: 3, fill: "#06b6d4" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 🏆 Mest riskfyllda kunder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-rose-400" />
            <h3 className="font-semibold text-slate-100">Topp 3 riskkunder</h3>
          </div>
          <ul className="space-y-2">
            {topRiskCustomers.map((c, i) => (
              <li
                key={i}
                className="flex justify-between text-slate-300 bg-slate-800/40 px-3 py-2 rounded-lg"
              >
                <span>{c.name}</span>
                <span className="text-amber-400 font-medium">{c.score}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
