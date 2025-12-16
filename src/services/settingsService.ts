import api from "./api";

export const settingsService = {
    // Company Settings
    getSettings: async () => {
        const response = await api.get("/settings/company");
        return response.data;
    },

    updateSettings: async (data: any) => {
        const response = await api.put("/settings/company", data);
        return response.data;
    },

    // Automation Rules
    getAutomationRules: async () => {
        const response = await api.get("/settings/automation-rules");
        return response.data;
    },

    updateAutomationRules: async (rules: any[]) => {
        const response = await api.put("/settings/automation-rules", { rules });
        return response.data;
    },

    // Insights & Simulations
    getRiskPreview: async (threshold: number) => {
        const response = await api.get(`/settings/risk-preview?threshold=${threshold}`);
        return response.data;
    },

    getAiInsights: async () => {
        const response = await api.get("/settings/ai-insights");
        return response.data;
    }
};
