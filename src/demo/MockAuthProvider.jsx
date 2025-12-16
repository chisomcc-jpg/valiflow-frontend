import React, { createContext, useContext, useMemo } from "react";
import { ROLES } from "@/constants/roles";

const AuthContext = createContext(null);

/**
 * MockAuthProvider
 * Simulates a logged-in user (OWNER role) for isolated demo routes.
 * Bypasses real authentication and backend calls.
 */
export const MockAuthProvider = ({ children, role = ROLES.OWNER, companyName = "Demo Bolag AB" }) => {

    const user = useMemo(() => ({
        id: 999,
        email: "demo@valiflow.se",
        name: "Demo User",
        role: role,
        companyId: 1,
        companyName: companyName,
        preferences: {
            companyRole: 'OWNER' // Ensure Company Dashboard sees OWNER
        }
    }), [role, companyName]);

    const value = {
        user,
        token: "demo-token",
        isAuthenticated: true,
        isLoading: false,
        login: async () => { },
        logout: async () => { window.location.href = '/'; },
        hasRole: (r) => true, // Demo user has all permissions
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Override the real useAuth if this provider is higher in the tree
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        // Fallback to real hook if not wrapped (should not happen in demo routes)
        throw new Error("useAuth must be used within an AuthProvider (Mock or Real)");
    }
    return context;
};

// Exporting a way to check if we are using the mock provider could be useful
export const isMockAuth = true;
