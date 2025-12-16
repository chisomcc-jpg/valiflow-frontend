
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  UserGroupIcon,
  UsersIcon,
  ShieldExclamationIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentCheckIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

export default function BureauTopNavbar() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Quick bureau links
  const links = [
    { name: "Översikt", to: "/bureau", icon: BuildingOfficeIcon },
    { name: "Riskcenter", to: "/bureau/risk", icon: ShieldExclamationIcon },
    { name: "Leverantörer", to: "/bureau/suppliers", icon: BuildingStorefrontIcon },
    // { name: "Compliance", to: "/bureau/compliance", icon: ClipboardDocumentCheckIcon }, // REMOVED
    { name: "Automation", to: "/bureau/automations", icon: BoltIcon },
    { name: "Kunder", to: "/bureau/customers", icon: UserGroupIcon },
    { name: "Team", to: "/bureau/team", icon: UsersIcon },
    // { name: "Insikter", to: "/bureau/insights", icon: ChartBarIcon }, // REMOVED
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };



  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-gradient-to-r from-[#0A1E44] via-[#134E9E] to-[#1E5CB3] border-b border-blue-900/20 shadow-sm">
      {/* LEFT: Search / Quick Links */}
      <div className="flex items-center gap-6">
        <div className="text-xs font-bold text-indigo-200 tracking-[0.2em] uppercase">
          Trust Layer for Finance
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {links.map(({ name, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Icon className="h-4 w-4" />
              {name}
            </Link>
          ))}
        </nav>
      </div>

      {/* RIGHT: Search, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* SSE Health Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-full border border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
          <span className="text-[10px] font-medium text-emerald-100">Live</span>
        </div>

        {/* Search Toggle */}
        <div className="relative flex items-center">
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="search-input"
                initial={{ width: 40, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 40, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center bg-white rounded-md px-2 py-1 overflow-hidden"
              >
                <MagnifyingGlassIcon className="h-4 w-4 text-slate-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Sök kunder..."
                  className="bg-transparent border-none focus:outline-none text-sm ml-2 w-40 text-slate-700 placeholder:text-slate-400"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
              </motion.div>
            ) : (
              <motion.button
                key="search-btn"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchOpen(true)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition relative">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white/20"></span>
        </button>

        <div className="h-6 w-px bg-white/20 mx-1"></div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-2 hover:bg-white/10 p-1 pr-2 rounded-full transition border border-transparent hover:border-white/20"
          >
            <div className="h-8 w-8 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
              {user?.name
                ? user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
                : "U"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-white">
                {user?.name ? user.name.split(" ")[0] : "Användare"}
              </p>
            </div>
          </button>

          <AnimatePresence>
            {userOpen && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 text-slate-900"
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">{user?.name || "Användare"}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>

                <div className="py-1">
                  <Link to="/bureau/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    <Cog6ToothIcon className="h-4 w-4" />
                    Inställningar
                  </Link>
                </div>

                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Logga ut
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
