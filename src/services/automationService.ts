import { api } from "./api";

/**
 * Service for managing Bureau Automations (Rules, Groups, History)
 */
export const automationService = {

    // RULES
    getRules: async () => {
        const res = await api.get("/bureau/rules");
        return res.data;
    },
    createRule: async (data: any) => {
        const res = await api.post("/bureau/rules", data);
        return res.data;
    },
    updateRule: async (id: string, data: any) => {
        const res = await api.put(`/bureau/rules/${id}`, data);
        return res.data;
    },
    deleteRule: async (id: string) => {
        const res = await api.delete(`/bureau/rules/${id}`);
        return res.data;
    },

    // GROUPS
    getRuleGroups: async () => {
        const res = await api.get("/bureau/rule-groups");
        return res.data;
    },
    createRuleGroup: async (data: any) => {
        const res = await api.post("/bureau/rule-groups", data);
        return res.data;
    },
    updateRuleGroup: async (id: string, data: any) => {
        const res = await api.put(`/bureau/rule-groups/${id}`, data);
        return res.data;
    },
    deleteRuleGroup: async (id: string) => {
        const res = await api.delete(`/bureau/rule-groups/${id}`);
        return res.data;
    },

    // HISTORY
    getHistory: async (filters: any = {}) => {
        const params = new URLSearchParams(filters).toString();
        const res = await api.get(`/bureau/automation-history?${params}`);
        return res.data;
    }
};
