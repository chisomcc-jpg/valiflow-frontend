// src/demo/components/DemoSidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    HomeIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    ClipboardDocumentCheckIcon,
    UserGroupIcon
} from "@heroicons/react/24/outline";

export default function DemoSidebar() {
    const location = useLocation();
    const isBureau = location.pathname.includes("/demo/bureau");

    const companyNav = [
        { name: "Översikt", path: "/demo/company/overview", icon: HomeIcon },
        { name: "Fakturor", path: "/demo/company/invoices", icon: DocumentTextIcon },
        { name: "Risk & Alerts", path: "/demo/company/risk", icon: ShieldCheckIcon },
        { name: "Granskningslogg", path: "/demo/company/audit-log", icon: ClipboardDocumentCheckIcon },
    ];

    const bureauNav = [
        { name: "Översikt", path: "/demo/bureau/overview", icon: HomeIcon },
        { name: "Kunder", path: "/demo/bureau/customers", icon: UserGroupIcon },
        { name: "Risk & Avvikelser", path: "/demo/bureau/risk", icon: ShieldCheckIcon },
        { name: "Team & Aktivitet", path: "/demo/bureau/team", icon: UserGroupIcon }, // Reuse UserGroup for Team
    ];

    const navItems = isBureau ? bureauNav : companyNav;

    return (
        <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800 z-50">
            {/* HEADER */}
            <div className="relative flex items-center p-4 border-b border-white/10 h-16">
                <div className="flex items-center gap-2 pl-2">
                    <img src="/valiflow-logo.svg" alt="Valiflow" className="h-9 w-auto brightness-0 invert opacity-90" />
                    <span className="text-[9px] bg-indigo-500/30 border border-indigo-400/50 px-1.5 py-0.5 rounded-full text-indigo-100 uppercase tracking-wider ml-1">
                        DEMO {isBureau ? "(BYRÅ)" : ""}
                    </span>
                </div>
            </div>

            {/* NAV */}
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                                : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            {/* FOOTER */}
            <div className="p-4 border-t border-white/5 bg-[#03081a]">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        {isBureau ? "AE" : "JD"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{isBureau ? "Anna Ek" : "John Doe"}</p>
                        <p className="text-xs text-slate-500 truncate">{isBureau ? "anna.ek@byran.se" : "john.doe@demo.com"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
