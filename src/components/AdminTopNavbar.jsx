
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
    BellIcon,
    MagnifyingGlassIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon,
    ServerStackIcon,
    LifebuoyIcon,
    CpuChipIcon
} from "@heroicons/react/24/outline";

export default function AdminTopNavbar() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const [userOpen, setUserOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [notisOpen, setNotisOpen] = useState(false);

    // Quick admin links
    const links = [
        { name: "System", to: "/admin/overview", icon: ServerStackIcon },
        { name: "Support", to: "/admin/support", icon: LifebuoyIcon },
        { name: "AI Loggar", to: "/admin/ai-insights", icon: CpuChipIcon },
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const initials = user?.name
        ? user.name.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase()
        : "SA";

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200 shadow-sm">

            {/* LEFT: Search / Quick Links */}
            <div className="flex items-center gap-6">
                <div className="text-sm font-bold text-slate-800 tracking-tight">
                    VALIFLOW <span className="text-emerald-600">ADMIN</span>
                </div>

                <nav className="hidden md:flex items-center space-x-1">
                    {links.map(({ name, to, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <Icon className="h-4 w-4" />
                            {name}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* RIGHT: Search, Notifications, User */}
            <div className="flex items-center gap-3">

                {/* Search Toggle */}
                <div className="relative">
                    {searchOpen ? (
                        <div className="flex items-center bg-slate-100 rounded-md px-2 py-1">
                            <MagnifyingGlassIcon className="h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Cmd+K to search..."
                                className="bg-transparent border-none focus:outline-none text-sm ml-2 w-40 text-slate-700"
                                autoFocus
                                onBlur={() => setSearchOpen(false)}
                            />
                        </div>
                    ) : (
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition"
                        >
                            <MagnifyingGlassIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Notifications */}
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition relative">
                    <BellIcon className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-6 w-px bg-slate-200 mx-1"></div>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setUserOpen(!userOpen)}
                        className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-2 rounded-full transition border border-transparent hover:border-slate-200"
                    >
                        <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                            {initials}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-xs font-semibold text-slate-700">{user?.name || "Super Admin"}</p>
                            <p className="text-[10px] text-slate-500 leading-none">System Root</p>
                        </div>
                    </button>

                    <AnimatePresence>
                        {userOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50"
                            >
                                <div className="px-4 py-3 border-b border-slate-100">
                                    <p className="text-sm font-semibold text-slate-800">{user?.name || "Super Admin"}</p>
                                    <p className="text-xs text-slate-500">{user?.email || "admin@valiflow.se"}</p>
                                </div>

                                <div className="py-1">
                                    <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
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
