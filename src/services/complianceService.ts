import { api } from "./api";

/**
 * Service for Bureau Compliance Module
 */
export const complianceService = {
    getOverview: async () => {
        const res = await api.get("/bureau/compliance/overview");
        return res.data;
    },
    getByCustomer: async () => {
        const res = await api.get("/bureau/compliance/by-customer");
        return res.data;
    },
    getCustomerDetails: async (customerId) => {
        const res = await api.get(`/bureau/compliance/customer/${customerId}`);
        return res.data;
    },
    getFieldMatrix: async () => {
        const res = await api.get("/bureau/compliance/field-matrix");
        return res.data;
    },
    getFieldDetails: async (fieldKey) => {
        const res = await api.get(`/bureau/compliance/field/${fieldKey}`);
        return res.data;
    },
    getHistory: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const res = await api.get(`/bureau/compliance/history?${params}`);
        return res.data;
    }
};
