/**
 * src/constants/roles.ts
 * Strict role definitions for the Bureau Dashboard.
 * 
 * @see role_architecture_audit.md for full access matrix.
 */

// The 4 strict roles
export const ROLES = {
    OWNER: 'OWNER',
    MANAGER: 'MANAGER',
    CONSULTANT: 'CONSULTANT',
    JUNIOR: 'JUNIOR',
};

// Permission Groups (Used for Route Guards)
export const PERMISSIONS = {
    // Sensitive Bureau Settings & Configurations
    CAN_MANAGE_AGENCY: [ROLES.OWNER, ROLES.MANAGER],

    // Billing & Subscription (Money)
    CAN_MANAGE_BILLING: [ROLES.OWNER],

    // Team Management & HR
    CAN_MANAGE_TEAM: [ROLES.OWNER, ROLES.MANAGER],

    // Advanced Global Insights
    CAN_VIEW_INSIGHTS: [ROLES.OWNER, ROLES.MANAGER],
};

/**
 * Access Helper
 * @param {string} userRole - The current user's role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {boolean}
 */
export const hasRole = (userRole, allowedRoles) => {
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
};

/**
 * 🔒 Single Source of Truth for Company Roles
 * Resolves the UI role (OWNER | OPERATOR | VIEWER) from Backend data.
 * 
 * Rules:
 * - COMPANY_ADMIN -> OWNER
 * - USER -> OPERATOR (Default)
 * - USER + prefs.companyRole="VIEWER" -> VIEWER
 */
export const getEffectiveCompanyRole = (user) => {
    if (!user) return 'VIEWER'; // Safe default for unauth/loading
    if (user.role === 'COMPANY_ADMIN') return 'OWNER';
    if (user.role === 'USER') {
        // Explicit override for Viewer
        if (user.preferences?.companyRole === 'VIEWER') return 'VIEWER';
        // Default for all other Users (including legacy) is OPERATOR
        return 'OPERATOR';
    }
    return 'VIEWER'; // Fallback
};
