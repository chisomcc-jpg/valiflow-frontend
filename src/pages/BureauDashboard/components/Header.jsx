import React from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import NotificationsCenter from "./NotificationsCenter"; // ✅ Lägg till denna rad

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-slate-900/60 backdrop-blur">
      <div className="flex items-center gap-3">
        <img src="/valiflow-logo.png" alt="Valiflow" className="w-8 h-8" />
        <h1 className="text-xl font-semibold">Byrå: Redo AB</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-2 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Sök kund eller orgnr..."
            className="bg-slate-800 pl-8 pr-3 py-2 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1">
          <PlusIcon className="w-4 h-4" /> Lägg till kund
        </button>

        {/* 🔔 Notifications Center */}
        <NotificationsCenter /> {/* ✅ Lägg till här */}

        <button className="p-2 text-slate-300 hover:text-cyan-400">
          <Cog6ToothIcon className="w-6 h-6" />
        </button>

        <button className="p-2 text-slate-300 hover:text-cyan-400">
          <UserCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
