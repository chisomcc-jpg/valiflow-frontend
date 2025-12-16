import React from "react";
import { useLocation } from "react-router-dom";

export default function Loader() {
  const location = useLocation();

  // 🧠 Bestäm vilken sektion som laddas baserat på URL
  const section =
    location.pathname.startsWith("/admin")
      ? "Adminpanel"
      : location.pathname.startsWith("/dashboard")
      ? "Företagsdashboard"
      : location.pathname.startsWith("/bureau")
      ? "Byråpanel"
      : "Valiflow";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <div className="flex flex-col items-center">
          <p className="text-slate-700 font-medium text-sm">
            Laddar {section}...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Var god vänta ett ögonblick
          </p>
        </div>
      </div>
    </div>
  );
}
