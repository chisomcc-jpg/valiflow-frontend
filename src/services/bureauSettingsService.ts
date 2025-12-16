import axios from "axios";

const API_URL = "http://localhost:4000/api/bureau/settings";

const getHeaders = () => {
    const token = localStorage.getItem("token"); // Assuming token storage
    return { Authorization: `Bearer ${token}` };
};

export const bureauSettingsService = {
    // 1. Profile
    async getProfile() {
        const res = await axios.get(`${API_URL}/profile`, { headers: getHeaders() });
        return res.data;
    },
    async updateProfile(data: any) {
        const res = await axios.put(`${API_URL}/profile`, data, { headers: getHeaders() });
        return res.data;
    },

    // 2. Access
    async getAccessList() {
        const res = await axios.get(`${API_URL}/access`, { headers: getHeaders() });
        return res.data;
    },

    // 3. Automations
    async getAutomations() {
        const res = await axios.get(`${API_URL}/automations`, { headers: getHeaders() });
        return res.data;
    },
    async updateAutomations(data: any) {
        const res = await axios.put(`${API_URL}/automations`, data, { headers: getHeaders() });
        return res.data;
    },

    // 4. Notifications
    async getNotifications() {
        const res = await axios.get(`${API_URL}/notifications`, { headers: getHeaders() });
        return res.data;
    },
    async updateNotifications(data: any) {
        const res = await axios.put(`${API_URL}/notifications`, data, { headers: getHeaders() });
        return res.data;
    },

    // 5. Security
    async getSecurity() {
        const res = await axios.get(`${API_URL}/security`, { headers: getHeaders() });
        return res.data;
    },
    async updateSecurity(data: any) {
        const res = await axios.put(`${API_URL}/security`, data, { headers: getHeaders() });
        return res.data;
    },

    // 6. Integrations
    async getIntegrations() {
        const res = await axios.get(`${API_URL}/integrations`, { headers: getHeaders() });
        return res.data;
    },

    async getAI() {
        const res = await axios.get(`${API_URL}/ai`, { headers: getHeaders() });
        return res.data;
    },
    async updateAI(data: any) {
        const res = await axios.put(`${API_URL}/ai`, data, { headers: getHeaders() });
        return res.data;
    },

    // 8. Metrics & History
    async getAutomationStats() {
        const res = await axios.get(`${API_URL}/automations/stats`, { headers: getHeaders() });
        return res.data;
    },
    async getNotificationHistory() {
        const res = await axios.get(`${API_URL}/notifications/history`, { headers: getHeaders() });
        return res.data;
    },
    async getLastUpdated(section: string) {
        const res = await axios.get(`${API_URL}/last-updated?section=${section}`, { headers: getHeaders() });
        return res.data;
    }
};
