// src/components/TopNavbar.jsx
import {
  BellIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  HomeIcon,
  XCircleIcon,
  CheckCircleIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../context/AuthContext";

export default function TopNavbar() {
  const navigate = useNavigate();
  const { logout, user: authUser } = useAuth(); // Prefer auth context user if available
  const [searchOpen, setSearchOpen] = useState(false);
  const [notisOpen, setNotisOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userOpen, setUserOpen] = useState(false);
  const [localUser, setLocalUser] = useState(null);

  // Combine auth context user with local fetch if needed, or just rely on context
  const user = authUser || localUser;

  const links = [
    { name: "Översikt", to: "/dashboard", icon: HomeIcon },
    { name: "Fakturor", to: "/dashboard/invoices", icon: DocumentTextIcon },
    { name: "Risk & Alerts", to: "/dashboard/fraud", icon: ExclamationTriangleIcon },
    { name: "AI-Assistent", to: "/dashboard/ai", icon: SparklesIcon },
    { name: "Mitt Företag", to: "/dashboard/company", icon: BuildingOfficeIcon },
    { name: "Leverantörer", to: "/dashboard/suppliers", icon: UserGroupIcon },
  ];

  // ... (SSE code remains) ...

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // ==========================================================
  // 🔔 Real-time Notification Stream (SSE)
  // ==========================================================
  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const token = localStorage.getItem("token");
    if (!token) return;

    let retryTimeout = null;
    let source = null;

    const connect = () => {
      const url = new URL(`${API}/api/notifications/stream`);
      url.searchParams.set("token", token);
      source = new EventSource(url.toString());

      source.addEventListener("init", (e) => {
        try {
          const data = JSON.parse(e.data);
          setNotifications(data);
          setLoading(false);
        } catch (err) {
          console.error("❌ Failed to parse init data:", err);
        }
      });

      source.addEventListener("new_notification", (e) => {
        try {
          const notif = JSON.parse(e.data);
          setNotifications((prev) => [notif, ...prev].slice(0, 10));
        } catch (err) {
          console.error("❌ Failed to parse notification:", err);
        }
      });

      source.onerror = (err) => {
        console.warn("⚠️ SSE connection lost, retrying in 10s", err);
        source.close();
        clearTimeout(retryTimeout);
        retryTimeout = setTimeout(connect, 10000);
      };
    };

    connect();

    return () => {
      if (source) source.close();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  /* ==========================================================
     👤 Fetch current user (/auth/me)
     (Optional if already in context, but keeping for now)
     ========================================================== */
  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const token = localStorage.getItem("token");
    if (!token) return;

    // Only fetch if not already in context or if we need fresh data
    if (!authUser) {
      fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => { if (data) setLocalUser(data); })
        .catch(err => console.error("❌ Failed to fetch user", err));
    }
  }, [authUser]);

  const unreadCount = notifications.length;

  const initials = user?.name
    ? user.name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase()
    : "U";

  // handleLogout defined above

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-gradient-to-r from-[#0A1E44] via-[#134E9E] to-[#1E5CB3] shadow-md border-b border-blue-900/20">
      {/* --- Left: Nav links (Logo removed) --- */}
      <div className="flex items-center space-x-6">
        <nav className="hidden md:flex items-center space-x-1">
          {links.map(({ name, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${isActive
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* --- Right: Search, Notifications, User --- */}
      <div className="flex items-center gap-3">
        {/* Search field toggle */}
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
                  placeholder="Sök..."
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
        <div className="relative">
          <button
            onClick={() => setNotisOpen(!notisOpen)}
            className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition"
          >
            <BellIcon className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white/20"></span>
            )}
          </button>

          {/* Dropdown (Keep existing logic, just ensure button style matches) */}
          <AnimatePresence>
            {notisOpen && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50"
              >
                {/* ... Notification Dropdown Content ... */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-800">Notiser</h3>
                  <button
                    onClick={() => navigate("/bureau/notifications")}
                    className="text-xs text-[#1E5CB3] hover:underline"
                  >
                    Visa alla
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-sm text-slate-500">Laddar notiser...</div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-sm text-slate-500">
                      Inga nya notiser just nu.
                    </div>
                  ) : (
                    notifications.map((n, i) => {
                      // ... logic ...
                      const Icon = n.type === "critical" ? XCircleIcon : n.type === "warning" ? ExclamationTriangleIcon : n.type === "success" ? CheckCircleIcon : BellIcon;
                      const color = n.type === "critical" ? "text-red-600" : n.type === "warning" ? "text-amber-600" : n.type === "success" ? "text-emerald-600" : "text-blue-600";
                      const bg = n.type === "critical" ? "bg-red-50" : n.type === "warning" ? "bg-amber-50" : n.type === "success" ? "bg-emerald-50" : "bg-blue-50";

                      return (
                        <div
                          key={n.id || i}
                          onClick={() => navigate("/bureau/notifications")}
                          className="flex items-start gap-2 p-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 cursor-pointer"
                        >
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${bg} ${color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-800 leading-tight">{n.message}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{n.time || "nyligen"}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-px bg-white/20 mx-1"></div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-2 hover:bg-white/10 p-1 pr-2 rounded-full transition border border-transparent hover:border-white/20"
          >
            <div className="h-8 w-8 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-white">{user?.name || "User"}</p>
              <p className="text-[10px] text-indigo-200 leading-none">{user?.companyName || "Företag"}</p>
            </div>
          </button>

          <AnimatePresence>
            {userOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden text-slate-900"
              >
                {/* ... User Menu Content ... */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">{user?.name || "Användare"}</p>
                  {user?.email && <p className="text-xs text-slate-500">{user.email}</p>}
                </div>

                <div className="py-1">
                  <button onClick={() => navigate("/dashboard/profile")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full">
                    <UserIcon className="h-4 w-4 text-slate-500" /> Profil
                  </button>
                  <button onClick={() => navigate("/dashboard/settings")} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 w-full">
                    <Cog6ToothIcon className="h-4 w-4 text-slate-500" /> Inställningar
                  </button>
                </div>

                <div className="border-t border-slate-100 py-1">
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                    <ArrowRightOnRectangleIcon className="h-4 w-4" /> Logga ut
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

