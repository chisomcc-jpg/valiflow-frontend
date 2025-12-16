// src/components/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { user, token, loading } = useAuth();

  // ⏳ Vänta tills AuthContext laddat klart
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500">
        <span className="animate-pulse">Verifierar behörighet...</span>
      </div>
    );
  }

  // 🚫 Ingen inloggning alls
  if (!token || !user) {
    console.warn("⛔ Ingen giltig session — redirect till /login");
    return <Navigate to="/login" replace />;
  }

  // 🧠 Rollbaserad kontroll
  if (user.role !== "SUPER_ADMIN") {
    console.warn(`🚫 Åtkomst nekad — roll: ${user.role}`);
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Allt okej → visa admininnehåll
  return children;
}
