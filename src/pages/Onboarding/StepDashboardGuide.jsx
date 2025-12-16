import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardGuideSteps } from "./DashboardGuideSteps.js";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import confetti from "canvas-confetti";

export default function StepDashboardGuide({ userType }) {
  const steps = dashboardGuideSteps[userType] || [];
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [finished, setFinished] = useState(false);

  // 🔄 Ladda progress
  useEffect(() => {
    const savedStep = localStorage.getItem("onboardingStep");
    const savedCompleted = localStorage.getItem("onboardingCompleted");
    if (savedStep) setCurrent(Number(savedStep));
    if (savedCompleted) setCompleted(JSON.parse(savedCompleted));
  }, []);

  // 💾 Spara progress
  useEffect(() => {
    localStorage.setItem("onboardingStep", current);
    localStorage.setItem("onboardingCompleted", JSON.stringify(completed));
  }, [current, completed]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 180,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleNext = () => {
    setCompleted([...completed, steps[current].id]);
    if (current < steps.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      finishGuide();
    }
  };

  const skipGuide = () => finishGuide(true);

  const finishGuide = (skipped = false) => {
    localStorage.setItem("onboardingComplete", "true");
    localStorage.removeItem("onboardingStep");
    localStorage.removeItem("onboardingCompleted");
    if (!skipped) {
      setFinished(true);
      triggerConfetti();
    } else {
      window.location.reload();
    }
  };

  const progress = Math.round(((current + 1) / steps.length) * 100);

  // 🌟 Slutskärm
  if (finished) {
    return (
      <motion.div
        className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.h1
          className="text-3xl font-bold text-slate-800 mb-2"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          🎉 Klart!
        </motion.h1>
        <motion.p
          className="text-slate-500 mb-6"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Du är redo att börja använda Valiflow fullt ut.
        </motion.p>
        <motion.button
          onClick={() => window.location.reload()}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          Gå till dashboard →
        </motion.button>
      </motion.div>
    );
  }

  // 🧭 Guide-läge
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={steps[current].id}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-[400px] text-center relative"
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Steg {current + 1} av {steps.length}
          </h2>

          <div className="h-2 bg-slate-200 rounded-full mb-4 overflow-hidden">
            <motion.div
              className="h-2 bg-green-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <motion.h3
            className="text-lg font-medium text-slate-800 mb-2"
            key={steps[current].title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {steps[current].title}
          </motion.h3>
          <motion.p
            className="text-slate-500 mb-6"
            key={steps[current].desc}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {steps[current].desc}
          </motion.p>

          <button
            onClick={handleNext}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 w-full transition"
          >
            {current === steps.length - 1 ? "Avsluta guide" : steps[current].cta}
          </button>

          <button
            onClick={skipGuide}
            className="mt-4 text-slate-400 underline text-sm hover:text-slate-500"
          >
            Hoppa över guiden
          </button>

          {completed.includes(steps[current].id) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute top-4 right-4 text-green-600 flex items-center gap-1 text-sm"
            >
              <CheckCircleIcon className="w-5 h-5" />
              <span>Klart!</span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
