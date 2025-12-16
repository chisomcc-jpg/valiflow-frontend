import React from "react";
import { useAuth } from "../../context/AuthContext";

/**
 * 🔒 RestrictedAction
 * Wraps buttons or actions that require specific permissions.
 * Displays a disabled state with a tooltip if the user lacks the required scope.
 * 
 * ⚠️ Backend is Source of Truth.
 * We do not infer permissions here. We only check `user.adminScopes`.
 * 
 * @param {string} scope - The required granular scope (e.g., 'admin:trust:write')
 * @param {string} requiredRole - The minimal role name to display in the tooltip (e.g., 'FOUNDER')
 * @param {React.ReactNode} children - The action element (usually a button)
 */
export default function RestrictedAction({ scope, requiredRole, children }) {
    const { user } = useAuth();

    // Safe guard if user is not loaded
    if (!user) return null;

    // 🛡️ Strict Backend Check
    const userScopes = user.adminScopes || [];
    const hasPermission = userScopes.includes("*") || userScopes.includes(scope);

    if (hasPermission) {
        return <>{children}</>;
    }

    return (
        <div className="group relative inline-block cursor-not-allowed opacity-50">
            {/* 🚫 Block interactions */}
            <div className="pointer-events-none">
                {children}
            </div>

            {/* 💬 Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
                Kräver behörighet: {requiredRole}
            </div>
        </div>
    );
}
