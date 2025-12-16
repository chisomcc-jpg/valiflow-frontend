
// src/services/adminService.ts
import { api } from "./api";

export const adminService = {
    /**
     * Get system health status (workers, redis, db)
     */
    async getSystemHealth() {
        const response = await api.get("/admin/health");
        return response.data;
    },

    /**
     * Get job queue statistics (BullMQ)
     */
    async getJobQueues() {
        const response = await api.get("/admin/jobs/queues");
        return response.data;
    },

    /**
     * List users/companies for admin magement
     */
    async getUsers() {
        const response = await api.get("/admin/users");
        return response.data;
    },

    /**
     * Enable/Disable a user or company
     */
    async toggleUserStatus(userId: string, active: boolean) {
        return await api.patch(`/admin/users/${userId}/status`, { active });
    },

    /**
     * Fetch system logs
     */
    async getLogs(params: any) {
        const response = await api.get("/admin/logs", { params });
        return response.data;
    },

    /**
     * Get system learning statistics (Valiflow Learns)
     */
    async getLearningStats() {
        const response = await api.get("/admin/learning");
        return response.data;
    },

    // --- FOUNDER CONTROL ROOM (NEW) ---

    async getSnapshot() {
        // Cached holistic view
        const response = await api.get("/admin/snapshot");
        return response.data;
    },

    async getRecommendations() {
        const response = await api.get("/admin/overview/recommendations");
        return response.data;
    },

    async handleRecommendation(id: string, action: string) {
        const response = await api.post("/admin/overview/recommendations/action", { id, action });
        return response.data;
    },

    async getAiCopilot(focus?: string, mode: string = 'tactical') {
        const response = await api.post("/admin/ai/copilot", { focus, mode });
        return response.data;
    },

    async getGroupedIncidents(query = '') {
        const response = await api.get(`/admin/incidents/grouped${query}`);
        return response.data;
    },

    async getTrustMetrics() {
        const response = await api.get("/admin/trust/metrics");
        return response.data;
    },

    async getUsageCost() {
        const response = await api.get("/admin/usage-cost");
        return response.data;
    },

    async getCustomerRevenue() {
        const response = await api.get("/admin/customers-revenue");
        return response.data;
    },

    async getActionQueue() {
        const response = await api.get("/admin/revenue/action-queue");
        return response.data;
    },

    async getClientDetails(id: string | number) {
        const response = await api.get(`/admin/clients/${id}/details`);
        return response.data;
    },

    async getClients(page = 1, limit = 20, q = "") {
        const response = await api.get("/admin/clients", {
            params: { page, limit, q }
        });
        return response.data;
    },

    async bulkClientAction(ids: number[], action: string, impactToken?: string) {
        return await api.post("/admin/clients/bulk", { ids, action }, {
            headers: { "x-impact-token": impactToken }
        });
    },

    // 🚑 Support Primitives
    async getTimeline(id: number | string, limit = 20) {
        const response = await api.get(`/admin/clients/${id}/timeline?limit=${limit}`);
        return response.data;
    },

    async resetPassword(userId: number, impactToken?: string) {
        return await api.post(`/admin/users/${userId}/reset-password`, {}, {
            headers: impactToken ? { "x-impact-token": impactToken } : {}
        });
    },

    async reset2FA(userId: number, impactToken: string) {
        return await api.post(`/admin/users/${userId}/reset-2fa`, {}, {
            headers: { "x-impact-token": impactToken }
        });
    },

    async forceLogout(userId: number) {
        // LOW_SUPPORT: No token needed normally
        return await api.post(`/admin/users/${userId}/force-logout`);
    },

    async retryInvoice(invoiceId: number) {
        // LOW_SUPPORT: No token needed
        return await api.post(`/admin/support/invoices/${invoiceId}/retry`);
    },

    async impersonate(userId: number) {
        return await api.post(`/admin/impersonate/${userId}`);
    },

    // 🛠 Maintenance
    async toggleMaintenance(active: boolean, message?: string) {
        return await api.post("/admin/system/maintenance", { active, message });
    }
};
