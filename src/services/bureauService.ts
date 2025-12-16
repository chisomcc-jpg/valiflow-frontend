
// src/services/bureauService.ts
import { api } from "./api";

export const bureauService = {
    /**
     * Fetch aggregated overview for the bureau
     * GET /api/bureau/overview
     */
    async getOverview() {
        const response = await api.get("/bureau/overview");
        return response.data;
    },

    /**
     * List all client companies managed by the bureau
     * GET /api/bureau/companies
     */
    async getClients() {
        const response = await api.get("/bureau/companies");
        return response.data;
    },

    /**
     * Get specific client details (scoped for bureau)
     */
    async getClientDetails(companyId: number) {
        const response = await api.get(`/bureau/companies/${companyId}`);
        return response.data;
    },

    /**
     * Get bureau-wide insights/trends
     */
    async getInsights() {
        const response = await api.get("/bureau/insights");
        return response.data;
    },

    /**
     * List bureau team members
     */
    async getTeamMembers() {
        const response = await api.get("/bureau/team");
        return response.data;
    },

    /**
     * Invite a team member to the bureau
     */
    async inviteTeamMember(email: string, role: string) {
        // Invite routes usually under /invites, but logically here for the service consumer
        const response = await api.post("/invites", { email, role, type: "agency" });
        return response.data;
    },
    /* Team & Roles */
    getTeam: async () => {
        const res = await api.get("/bureau/team");
        return res.data;
    },
    createTeamMember: async (data: any) => {
        const res = await api.post("/bureau/team", data);
        return res.data;
    },
    updateTeamMember: async (id: string, data: any) => {
        const res = await api.put(`/bureau/team/${id}`, data);
        return res.data;
    },
    deleteTeamMember: async (id: string) => {
        const res = await api.delete(`/bureau/team/${id}`);
        return res.data;
    },

    getRoles: async () => {
        const res = await api.get("/bureau/roles");
        return res.data;
    },
    createRole: async (data: any) => {
        const res = await api.post("/bureau/roles", data);
        return res.data;
    },
    updateRole: async (id: string, data: any) => {
        const res = await api.put(`/bureau/roles/${id}`, data);
        return res.data;
    },

    getAccessMap: async () => {
        const res = await api.get("/bureau/access");
        return res.data;
    },
    grantAccess: async (userId: string, customerId: number) => {
        const res = await api.post("/bureau/access", { userId, customerId });
        return res.data;
    },
    revokeAccess: async (userId: string, customerId: number) => {
        const res = await api.delete("/bureau/access", { data: { userId, customerId } });
        return res.data;
    },

    getAuditLog: async () => {
        const res = await api.get("/bureau/auditlog");
        return res.data;
    },

    /* ------------------------------------------------------------------
       NEW: CUSTOMER OVERVIEW & IMPERSONATION
    ------------------------------------------------------------------ */
    getAgencyCustomers: async (params?: any) => {
        const res = await api.get("/bureau/customers", { params });
        return res.data;
    },
    getAgencyCustomerQuickview: async (customerId: string) => {
        const res = await api.get(`/bureau/customers/${customerId}/quickview`);
        return res.data;
    },
    getAgencyCustomerSummary: async (customerId: string) => {
        const res = await api.get(`/bureau/customers/${customerId}/summary`);
        return res.data;
    },
    impersonateAgencyCustomer: async (customerId: string) => {
        const res = await api.post(`/bureau/customers/${customerId}/impersonate`);
        return res.data;
    }
};
