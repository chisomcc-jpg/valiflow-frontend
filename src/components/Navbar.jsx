// src/components/Navbar.jsx
import React, { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Building2,
  LineChart,
  Landmark,
  PlayIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DemoSelectionModal from "./DemoSelectionModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showSolutions, setShowSolutions] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const location = useLocation();

  // 🌍 Top-level nav links
  const navItems = [
    { name: "Produkt", path: "/product" },
    { name: "Trust Engine", path: "/trust-engine" },
    { name: "Priser", path: "/pricing" },
    { name: "Hur det funkar", path: "/how-it-works" },
    { name: "Säkerhet", path: "/security" },
    { name: "Compliance", path: "/compliance" },
    { name: "Om Valiflow", path: "/about" },
  ];

  // 💼 Solutions dropdown
  const solutions = [
    {
      title: "Ekonomiavdelningar",
      link: "/solutions#ekonomi",
      icon: Building2,
      description: "Risk & kontroll per bolag",
    },
    {
      title: "Redovisningsbyråer",
      link: "/solutions#byraer",
      icon: LineChart,
      description: "Skalbar kvalitetskontroll för alla klienter",
    },
    {
      title: "Enterprise & koncern",
      link: "/solutions#enterprise",
      icon: Landmark,
      description: "Koncernvy på risk, policy och leverantörer",
    },
  ];

  const isOnMarketing =
    location.pathname === "/" ||
    location.pathname === "/product" ||
    location.pathname === "/pricing" ||
    location.pathname === "/solutions" ||
    location.pathname === "/security" ||
    location.pathname === "/compliance" ||
    location.pathname === "/trust-engine" ||
    location.pathname === "/legal" ||
    location.pathname === "/faq" ||
    location.pathname === "/about" ||
    location.pathname === "/how-it-works";

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[9999]">
        {/* Subtil top-border glow */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

        <div className="border-b border-white/10 bg-[#050C22]/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex flex-col items-center group select-none">
              <img
                src="/valiflow-logo.svg"
                alt="Valiflow"
                className="
                h-8 sm:h-10 md:h-[48px] 
                xl:h-[52px]
                w-auto 
                transition-transform 
                duration-200 
                group-hover:scale-[1.04]"
              />
              <span
                className="
                mt-0.5 
                text-[10px] sm:text-[11px] 
                tracking-[0.22em] 
                text-white
                opacity-80
                group-hover:opacity-100
                transition
                text-center
              "
              >
                Trust Layer for Finance
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* 🔽 Lösningar Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowSolutions(true)}
                onMouseLeave={() => setShowSolutions(false)}
              >
                <button className="flex items-center gap-1 text-[13px] font-medium text-slate-200/85 hover:text-white transition whitespace-nowrap">
                  Lösningar
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${showSolutions ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {showSolutions && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 mt-3 w-[320px] rounded-2xl border border-white/10 bg-[#071330]/95 shadow-2xl p-4"
                    >
                      <div className="mb-2 pb-2 border-b border-white/10">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          Lösningar per typ av kund
                        </p>
                      </div>
                      {solutions.map((s) => {
                        const Icon = s.icon;
                        return (
                          <Link
                            key={s.link}
                            to={s.link}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition"
                          >
                            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-700/40 border border-white/10">
                              <Icon className="h-4 w-4 text-slate-100" />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-sm font-medium text-slate-100">
                                {s.title}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {s.description}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 🌍 Top Nav Links – i en glassmorphism-pill */}
              <div className="inline-flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 backdrop-blur-lg">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      [
                        "px-3 py-1 text-[13px] font-medium rounded-full transition-colors whitespace-nowrap",
                        isActive
                          ? "bg-white text-[#050C22] font-semibold shadow-sm"
                          : "text-slate-300/85 hover:text-white hover:bg-white/10",
                      ].join(" ")
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Right side buttons */}
            <div className="flex items-center gap-3">

              {isOnMarketing && (
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-300 text-slate-950 font-semibold px-5 py-1.5 text-sm shadow-lg hover:brightness-110 whitespace-nowrap transition-all"
                >
                  <PlayIcon className="h-3.5 w-3.5 fill-slate-900" /> Demo
                </button>
              )}

              {/* Mobile menu */}
              <button
                className="lg:hidden p-2 text-slate-100"
                onClick={() => setOpen(!open)}
              >
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="lg:hidden border-b border-white/10 bg-[#050C22]/95 px-4 pb-6 pt-3 space-y-4 shadow-lg"
            >
              {/* Solutions */}
              <details className="group">
                <summary className="text-slate-100 font-semibold cursor-pointer flex justify-between items-center text-[15px]">
                  Lösningar
                  <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                </summary>
                <div className="mt-2 pl-1 space-y-2">
                  {solutions.map((s) => (
                    <Link
                      key={s.link}
                      to={s.link}
                      className="block text-sm text-slate-300 hover:text-white"
                      onClick={() => setOpen(false)}
                    >
                      {s.title}
                    </Link>
                  ))}
                </div>
              </details>

              {/* Top nav items */}
              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      [
                        "block text-[15px] px-1 py-1 rounded-md",
                        isActive
                          ? "text-white font-semibold bg:white/5"
                          : "text-slate-300 hover:text-white hover:bg-white/5",
                      ].join(" ")
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>

              {/* CTA */}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-3">

                <button
                  onClick={() => { setShowDemoModal(true); setOpen(false); }}
                  className="text-center rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-emerald-300 text-slate-900 font-semibold px-5 py-2 text-sm flex items-center justify-center gap-2"
                >
                  <PlayIcon className="h-4 w-4 fill-slate-900" /> Demo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Demo Modal */}
      <DemoSelectionModal isOpen={showDemoModal} onClose={() => setShowDemoModal(false)} />
    </>
  );
}
