import React, { useState } from "react";
import {
  HomeIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ShieldExclamationIcon,
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  UsersIcon,
  MagnifyingGlassCircleIcon,
  Squares2X2Icon,
  ServerStackIcon,
  CpuChipIcon,
  LifebuoyIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  BeakerIcon
} from "@heroicons/react/24/outline";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import AdminTopNavbar from "../components/AdminTopNavbar";
import GlobalSearch from "../components/admin/GlobalSearch";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Översikt", to: "/admin", icon: HomeIcon },
    { name: "Growth Analytics", to: "/admin/growth", icon: AdjustmentsHorizontalIcon }, // 🆕
    { name: "Pilotansökningar", to: "/admin/pilot", icon: SparklesIcon }, // 🚀 NEW
    { name: "Systemstatus", to: "/admin/health", icon: ServerStackIcon },
    { name: "Användning & Kostnad", to: "/admin/usage-cost", icon: CurrencyDollarIcon },
    { name: "Kunder & Intäkter", to: "/admin/customers-revenue", icon: UsersIcon },
    { name: "Trust Engine", to: "/admin/trust", icon: ShieldExclamationIcon },
    { name: "Byråer", to: "/admin/clients", icon: BuildingOfficeIcon },
    { name: "Support & Incidenter", to: "/admin/incidents", icon: LifebuoyIcon },
    { name: "Funktioner", to: "/admin/features", icon: BeakerIcon },
  ];

  // 🧭 Sidtitlar för topbaren
  const pageTitles = {
    "/admin": "Systemöversikt",
    "/admin/firms": "Byråer",
    "/admin/clients": "Företag & Kunder",
    "/admin/invoices": "Fakturor",
    "/admin/fraud": "Fraud & AI",
    "/admin/learning": "Valiflow Learns", // 🧠
    "/admin/rules": "Rule Engine",
    "/admin/users": "Användare",
    "/admin/logs": "Audit Logg",
    "/admin/settings": "Inställningar",
  };

  const currentPath = location.pathname;
  const pageTitle = pageTitles[currentPath] || "Adminpanel";

  // 🧩 Breadcrumbs
  const crumbs = currentPath.split("/").filter(Boolean);

  return (
    <div className="flex min-h-screen bg-gray-50 text-slate-700">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"
          } bg-white border-r shadow-sm transition-all duration-300 flex flex-col`}
      >
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-4 border-b h-16`}>
          {!collapsed && <h1 className="font-bold text-lg text-slate-800 whitespace-nowrap">Valiflow Admin</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "hover:bg-gray-100 text-slate-600"
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {!collapsed && link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t text-xs text-gray-400">
          v1.0.0 • Valiflow
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <AdminTopNavbar />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      <GlobalSearch />
    </div>
  );
}
