// src/components/ProtectedRoute.jsx
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { ROLES, getEffectiveCompanyRole } from "../constants/roles";

// ... (existing imports)

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, user, loading } = useAuth();
  const location = useLocation();

  // ... (logging and loading checks remain same - implicit in this replacement by only replacing logic block if possible, but strict replace is safer)

  // 🧩 Debug (optional – comment out later)
  // console.count("ProtectedRoute render");
  // console.log("ProtectedRoute state:", { ... });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-600 dark:text-slate-300">
        Checking session...
      </div>
    );
  }

  if (!token) {
    if (location.pathname === "/login") {
      return children || null;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 🛡️ Role-based restriction
  if (allowedRoles && user) {
    const effectiveRole = getEffectiveCompanyRole(user);
    const hasPermission =
      allowedRoles.includes(user.role) ||
      allowedRoles.includes(effectiveRole);

    if (!hasPermission) {
      // avoid redirect loop if already on /unauthorized
      if (location.pathname === "/unauthorized") {
        return children || null;
      }
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
