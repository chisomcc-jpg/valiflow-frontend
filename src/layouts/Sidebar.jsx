import { NavLink } from "react-router-dom";
import {
  Squares2X2Icon,
  UserIcon,
  DocumentIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  InboxIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  PuzzlePieceIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const role = localStorage.getItem("role");

  const navItems = [
    // 🌐 Huvudmeny
    { name: "Översikt", path: "/dashboard", icon: Squares2X2Icon },
    { name: "Fakturor", path: "/dashboard/invoices", icon: DocumentIcon },
    { name: "Leverantörer", path: "/dashboard/suppliers", icon: UserIcon },
    { name: "Fakturainkorg", path: "/dashboard/email-inbox", icon: InboxIcon },
    { name: "Avvikelser", path: "/dashboard/fraud", icon: ExclamationTriangleIcon },
    { name: "Integrationer", path: "/dashboard/integrations", icon: PuzzlePieceIcon },
    { name: "Inställningar", path: "/dashboard/settings", icon: Cog6ToothIcon },
    { name: "Företagsprofil", path: "/dashboard/company", icon: BuildingOfficeIcon },
  ];

  // 👑 Admin-only section
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    navItems.push({
      name: "Adminpanel",
      path: "/admin",
      icon: ShieldCheckIcon,
    });
  }

  /* -------------------------------------------------------
     PREFETCHING STRATEGY
  ------------------------------------------------------- */
  const prefetchRoute = (path) => {
    // Vite dynamic import prefetch
    if (path.includes("invoices")) import("../pages/Dashboard/invoices/Invoices");
    if (path.includes("suppliers")) import("../pages/Dashboard/Suppliers");
    if (path.includes("inbox") || path.includes("mail")) import("../pages/Dashboard/EmailInbox");
    if (path.includes("risk") || path.includes("fraud")) import("../pages/Dashboard/FraudOverview");
    if (path.includes("settings")) import("../pages/Dashboard/Settings");
    if (path.includes("support")) import("../pages/Dashboard/Support");
    if (path.includes("ai")) import("../pages/Dashboard/AIAssistant");
  };

  return (
    <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col h-full shrink-0 transition-all duration-300">
      {/* HEADER */}
      <div className="h-16 flex items-center px-6 border-b border-white/5 bg-[#0B1120]">
        <div className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-4 h-4 text-white"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Valiflow
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          // ... logic for active state ...
          // The original code used `isActive` from NavLink's render prop,
          // but the instruction snippet implies a different `isActive` logic.
          // To maintain functionality and apply the instruction's styling,
          // we'll use NavLink's `isActive` render prop as intended.

          return (
            <NavLink
              key={item.name}
              to={item.path}
              onMouseEnter={() => prefetchRoute(item.path)}
              end // Keep 'end' prop for exact matching if needed, based on original code
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 mb-0.5 ${isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <item.icon
                className={`w-5 h-5 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-white"
                  }`}
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Version info */}
      <div className="border-t border-gray-100 dark:border-gray-800 p-4 text-xs text-gray-500 dark:text-gray-400 text-center">
        © {new Date().getFullYear()} Valiflow
      </div>
    </aside>
  );
}
