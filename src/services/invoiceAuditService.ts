import api from "./api";

export const getAuditTimeline = async (invoiceId) => {
    const response = await api.get(`/invoices/${invoiceId}/audit/timeline`);
    return response.data;
};

export const getHashChain = async (invoiceId) => {
    const response = await api.get(`/invoices/${invoiceId}/audit/hashchain`);
    return response.data;
};

export const getDiffs = async (invoiceId) => {
    const response = await api.get(`/invoices/${invoiceId}/audit/diffs`);
    return response.data;
};

export const getSignals = async (invoiceId) => {
    const response = await api.get(`/invoices/${invoiceId}/audit/signals`);
    return response.data;
};
