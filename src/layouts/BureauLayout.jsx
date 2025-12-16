// ✅ src/layouts/BureauLayout.jsx – FINAL FIXED VERSION v5.0
import React, { useEffect, useState } from "react";
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldExclamationIcon,
  BuildingStorefrontIcon,
  ClipboardDocumentCheckIcon,
  BoltIcon
} from "@heroicons/react/24/outline";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BureauTopNavbar from "@/components/BureauTopNavbar";
import { ROLES, hasRole } from "../constants/roles";
import { useAuth } from "../context/AuthContext";

import DemoWalkthrough from "@/components/demo/DemoWalkthrough";

export default function BureauLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const applyByWidth = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
    };
    applyByWidth();
    window.addEventListener("resize", applyByWidth);
    return () => window.removeEventListener("resize", applyByWidth);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  /* ----------------------------------------------------
     🔐 ROLE-BASED NAVIGATION
  ----------------------------------------------------- */


  // Inside Component:
  const { user } = useAuth();
  // Role Normalization for UI: Map Backend Roles to UI Roles
  let userRole = user?.role;
  if (userRole === "AGENCY_ADMIN" || userRole === "SUPER_ADMIN" || userRole === "COMPANY_ADMIN") {
    userRole = ROLES.OWNER;
  }

  // 1. Define ALL possible links
  const allLinks = [
    {
      name: "Översikt",
      to: "/bureau",
      icon: HomeIcon,
      allowed: [ROLES.OWNER, ROLES.MANAGER]
    },
    {
      name: "Kundöversikt", // Default name
      to: "/bureau/customers",
      icon: UsersIcon,
      allowed: [ROLES.OWNER, ROLES.MANAGER, ROLES.CONSULTANT, ROLES.JUNIOR],
      // Dynamic override for Junior/Consultant?
      labelOverride: (role) => {
        if (role === ROLES.JUNIOR) return "Assigned Companies";
        if (role === ROLES.CONSULTANT) return "My Portfolio";
        return "Kundöversikt";
      }
    },
    {
      name: "Analys & Insikter",
      to: "/bureau/insights",
      icon: ChartBarIcon,
      allowed: [ROLES.OWNER, ROLES.MANAGER]
    },
    {
      name: "Riskcenter",
      to: "/bureau/risk",
      icon: ShieldExclamationIcon,
      allowed: [ROLES.OWNER, ROLES.MANAGER, ROLES.CONSULTANT] // Consultant sees limited view
    },
    {
      name: "Leverantörer",
      to: "/bureau/suppliers",
      icon: BuildingStorefrontIcon,
      allowed: [ROLES.OWNER, ROLES.MANAGER]
    },
    {
      name: "Compliance",
      to: "/bureau/compliance",
      icon: ClipboardDocumentCheckIcon,
      allowed: [ROLES.OWNER, ROLES.MANAGER]
    },
    {
      name: "Automation",
      to: "/bureau/automations",
      icon: BoltIcon,
      allowed: [ROLES.OWNER, ROLES.MANAGER]
    },
    {
      name: "Team & Roller",
      to: "/bureau/team",
      icon: UserGroupIcon,
      allowed: [ROLES.OWNER, ROLES.MANAGER]
    },
    {
      name: "Notifikationer",
      to: "/bureau/notifications",
      icon: BellIcon,
      allowed: [ROLES.OWNER, ROLES.MANAGER, ROLES.CONSULTANT, ROLES.JUNIOR]
    },
    {
      name: "Rapporter",
      to: "/bureau/reports",
      icon: DocumentArrowDownIcon,
      allowed: [ROLES.OWNER, ROLES.MANAGER]
    },
  ];

  // 2. Filter links based on role
  const visibleLinks = allLinks.filter(link =>
    !link.allowed || link.allowed.includes(userRole)
  );

  return (
    <div className="flex h-screen bg-[#F4F7FB] overflow-hidden text-slate-900">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"
          } bg-gradient-to-b from-[#0A1E44] via-[#134E9E] to-[#1E5CB3] text-white shadow-xl transition-all duration-300 flex flex-col z-40`}
      >
        <div className="relative flex items-center p-4 border-b border-white/10 h-16">
          <div className="flex items-center pl-2">
            {collapsed ? (
              <img src="/valiflow-logo.png" alt="Valiflow" className="w-9 h-9" />
            ) : (
              <img src="/valiflow-logo.svg" alt="Valiflow" className="h-8 w-auto brightness-0 invert opacity-90" />
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

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <span>
                  {link.labelOverride ? link.labelOverride(userRole) : link.name}
                </span>
              )}
            </NavLink>
          ))}

          {/* Settings - Restricted to OWNER/MANAGER */}
          {hasRole(userRole, [ROLES.OWNER, ROLES.MANAGER]) && (
            <NavLink
              to="/bureau/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Cog6ToothIcon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>Inställningar</span>}
            </NavLink>
          )}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <BureauTopNavbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F4F7FB]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Guided Demo Walkthrough Overlay */}
      <DemoWalkthrough />
    </div>
  );
}
