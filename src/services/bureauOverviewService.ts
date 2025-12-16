import { api } from "./api";

export const bureauOverviewService = {
    getKPIs: async () => {
        const res = await api.get("/bureau/overview/kpis");
        return res.data;
    },
    getPriorityAlerts: async () => {
        const res = await api.get("/bureau/overview/priority");
        return res.data;
    },
    getPortfolioHealth: async () => {
        const res = await api.get("/bureau/overview/health");
        return res.data;
    },
    getTopCustomers: async () => {
        const res = await api.get("/bureau/overview/top-customers");
        return res.data;
    },
    getTopSuppliers: async () => {
        const res = await api.get("/bureau/overview/top-suppliers");
        return res.data;
    },
    getActivity: async () => {
        const res = await api.get("/bureau/overview/activity");
        return res.data;
    },
    getAiSummary: async () => {
        const res = await api.get("/bureau/overview/ai-summary");
        return res.data;
    },
    getGlobalFeed: async () => {
        const res = await api.get("/bureau/global-feed");
        return res.data;
    },
    getActionItems: async () => {
        const res = await api.get("/bureau/action-items");
        return res.data;
    }
};
