import React from "react";
import { XMarkIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CustomerProfilePanel({ customer, onClose }) {
  const navigate = useNavigate();
  if (!customer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-slate-900/95 backdrop-blur-md border-l border-slate-800 p-6 z-50 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-100">{customer.name}</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-cyan-400 transition"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <p className="text-slate-400">ERP-system</p>
            <p className="text-slate-100 font-medium">{customer.erp}</p>
          </div>

          <div>
            <p className="text-slate-400">Status</p>
            <p
              className={`font-medium ${
                customer.status === "Avvikelser"
                  ? "text-amber-400"
                  : "text-green-400"
              }`}
            >
              {customer.status}
            </p>
          </div>

          <div className="flex justify-between mt-4">
            <div>
              <p className="text-slate-400">Risk Score</p>
              <p className="text-xl font-semibold text-amber-400">{customer.risk}</p>
            </div>
            <div>
              <p className="text-slate-400">AI Accuracy</p>
              <p className="text-xl font-semibold text-cyan-400">{customer.accuracy}</p>
            </div>
          </div>

          <div>
            <p className="text-slate-400 mt-4">Flaggade fakturor</p>
            <p className="text-slate-100">{customer.flagged} st</p>
          </div>

          <div className="pt-6 border-t border-slate-800 mt-6">
            <button
              onClick={() => navigate(`/dashboard?customerId=${customer.id}`)}
              className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded-lg transition"
            >
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
              Öppna kundens dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
