// src/layouts/DashboardLayout.jsx
import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation, useParams } from "react-router-dom";
import { getEffectiveCompanyRole, ROLES } from "@/constants/roles";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  Cog6ToothIcon,
  ShieldExclamationIcon,
  InboxIcon,
  ChartBarIcon,
  PuzzlePieceIcon,
  BuildingOfficeIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  LifebuoyIcon
} from "@heroicons/react/24/outline";

import TopNavbar from "@/components/TopNavbar";
import { CommandPalette } from "@/components/CommandPalette";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { companyId } = useParams(); // 🔥 Bureau Context

  // Base path varies whether we are in "impersonation mode" or standard dashboard
  const basePath = companyId ? `/dashboard/c/${companyId}` : "/dashboard";

  // Matcha fakturadetalj (kan behållas om vi vill markera 'Fakturor' aktiv när man är inne på en faktura)
  // const isInvoiceDetail = /^\/dashboard\/invoices\/[^/]+$/.test(pathname); // Inte strikt nödvändigt om router matchar prefix

  /* -------------------------------------------------------
     NAVIGATION CONFIG
  ------------------------------------------------------- */

  const navItems = [
    {
      to: `${basePath}`,
      label: "Översikt",
      icon: HomeIcon,
      exact: true,
      allowedRoles: ['OWNER', 'OPERATOR', 'VIEWER', 'AGENCY_ADMIN', 'COMPANY_ADMIN']
    },
    {
      to: `${basePath}/invoices`,
      label: "Fakturor",
      icon: DocumentTextIcon,
      allowedRoles: ['OWNER', 'OPERATOR', 'AGENCY_ADMIN']
    },
    {
      to: `${basePath}/suppliers`,
      label: "Leverantörer",
      icon: UserGroupIcon,
      allowedRoles: ['OWNER', 'OPERATOR', 'AGENCY_ADMIN']
    },
    {
      to: `${basePath}/email-inbox`,
      label: "Fakturainkorg",
      icon: InboxIcon,
      allowedRoles: ['OWNER', 'OPERATOR', 'AGENCY_ADMIN']
    },
    {
      to: `${basePath}/fraud`,
      label: "Avvikelser",
      icon: ShieldExclamationIcon,
      allowedRoles: ['OWNER', 'OPERATOR', 'AGENCY_ADMIN']
    },
    {
      to: `${basePath}/analytics`,
      label: "Analys",
      icon: ChartBarIcon,
      allowedRoles: ['OWNER', 'OPERATOR', 'VIEWER', 'AGENCY_ADMIN']
    },
    {
      to: `${basePath}/audit-log`,
      label: "Granskningslogg",
      icon: ClipboardDocumentCheckIcon,
      allowedRoles: ['OWNER', 'OPERATOR', 'VIEWER', 'AGENCY_ADMIN']
    },
    {
      to: `${basePath}/integrations`,
      label: "Integrationer",
      icon: PuzzlePieceIcon,
      allowedRoles: ['OWNER', 'AGENCY_ADMIN']
    },
    {
      to: `${basePath}/company`,
      label: "Mitt Företag",
      icon: BuildingOfficeIcon,
      allowedRoles: ['OWNER', 'AGENCY_ADMIN']
    },
    {
      to: `${basePath}/settings`,
      label: "Inställningar",
      icon: Cog6ToothIcon,
      allowedRoles: ['OWNER', 'AGENCY_ADMIN']
    },
    {
      to: `${basePath}/support`,
      label: "Support",
      icon: LifebuoyIcon,
      allowedRoles: ['OWNER', 'OPERATOR', 'VIEWER', 'AGENCY_ADMIN']
    },
  ];

  const { logout, user } = useAuth();

  // 🛡️ Filter Logic
  // We allow access if EITHER:
  // 1. The effective company role is allowed (e.g. OWNER, OPERATOR)
  // 2. The raw user role is allowed (e.g. AGENCY_ADMIN, for impersonation)
  const effectiveRole = getEffectiveCompanyRole(user);
  const rawRole = user?.role;

  const nav = navItems.filter(item => {
    if (!item.allowedRoles) return true; // Default allow if unrelated
    return item.allowedRoles.includes(effectiveRole) || item.allowedRoles.includes(rawRole);
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const [collapsed, setCollapsed] = useState(false);
  const [viewingCompany, setViewingCompany] = useState(null);

  // Fetch company name for banner if in impersonation mode
  useEffect(() => {
    if (companyId) {
      fetch(`/api/bureau/companies/${companyId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => res.json())
        .then(data => setViewingCompany(data))
        .catch(e => console.error("Failed to load company for banner", e));
    } else {
      setViewingCompany(null);
    }
  }, [companyId]);

  // ... (Rest of render uses 'nav' which is now filtered)

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-slate-900">

      {/* SIDEBAR */}
      <aside className={`${collapsed ? "w-20" : "w-64"} hidden md:flex fixed top-0 left-0 h-screen flex-col text-white shadow-xl z-40 overflow-y-auto transition-all duration-300 ${companyId ? 'bg-slate-900' : 'bg-[#0A1E44]'}`}>

        {/* LOGO + BUREAU SCOPE */}
        <div className="relative flex items-center p-4 border-b border-white/10 h-16">
          <div className="flex items-center gap-2 pl-2">
            {collapsed ? (
              <img src="/valiflow-logo.png" alt="Valiflow" className="w-10 h-10" />
            ) : (
              <img src="/valiflow-logo.svg" alt="Valiflow" className="h-9 w-auto brightness-0 invert opacity-90" />
            )}
            {!collapsed && companyId && (
              <span className="text-[9px] bg-indigo-500/30 border border-indigo-400/50 px-1.5 py-0.5 rounded-full text-indigo-100 uppercase tracking-wider ml-1">
                Bureau
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute right-3 text-white/50 hover:text-white transition-colors"
          >
            {collapsed ? (
              <ChevronRightIcon className="w-4 h-4" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 py-5 space-y-1 overflow-x-hidden">
          {nav.map((item, i) => {
            if (item.type === "collapsible") {
              const active = item.match();

              return (
                <div key={i} className="mx-3">
                  <button
                    onClick={item.toggle}
                    className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${active ? "bg-[#1E5CB3] text-white" : "text-white/80 hover:bg-white/10"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && item.label}
                    </div>

                    {!collapsed && (item.open ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    ))}
                  </button>

                  {!collapsed && item.open && (
                    <div className="ml-7 mt-1 space-y-1">
                      {item.children.map((child, j) => {
                        const childActive = child.match();
                        return (
                          <div key={j}>
                            {child.clickable ? (
                              <NavLink
                                to={child.to}
                                className={({ isActive }) =>
                                  `flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all
                                  ${childActive
                                    ? "bg-white/20 text-white font-semibold"
                                    : "text-white/70 hover:bg-white/10"
                                  }`
                                }
                              >
                                • {child.label}
                              </NavLink>
                            ) : (
                              childActive && (
                                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs bg-white/20 text-white font-semibold cursor-default">
                                  • {child.label}
                                </div>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={i}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 mx-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  ${isActive
                    ? "bg-[#1E5CB3] text-white"
                    : "text-white/80 hover:bg-white/10"
                  }`
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-6 py-4 text-xs text-white/70 border-t border-white/10 font-semibold">
          {!collapsed && "TRUST LAYER FOR FINANCE"}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-20" : "ml-60 lg:ml-64"}`}>

        {/* IMPERSONATION BANNER */}
        {companyId && (
          <div className="bg-indigo-900 text-indigo-50 px-4 py-2 text-sm flex justify-between items-center shadow-md">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/bureau/customers")}
                className="flex items-center gap-1 hover:text-white transition-colors font-medium border-b border-white/20 hover:border-white"
              >
                <ChevronLeftIcon className="w-4 h-4" />
                Tillbaka till Kundöversikt
              </button>
            </div>
            <div className="font-medium tracking-wide">
              Du granskar: <span className="text-white font-bold ml-1">{viewingCompany?.name || "Laddar..."}</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-200">
              <ShieldCheckIcon className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Byråläge</span>
            </div>
          </div>
        )}

        {/* CommandPalette removed as requested */}
        <TopNavbar />
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-4 md:p-6">
          <div className="max-w-[1600px] mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
