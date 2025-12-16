import { api } from "./api";

/**
 * Service for Bureau Suppliers Module
 */
export const supplierService = {
  getOverview: async () => {
    const res = await api.get("/bureau/suppliers/overview");
    return res.data;
  },
  getRiskOverview: async () => {
    const res = await api.get("/bureau/suppliers/risk-overview");
    return res.data;
  },
  getBankAccountChanges: async () => {
    const res = await api.get("/bureau/suppliers/bank-account-changes");
    return res.data;
  },
  getAnomalies: async () => {
    const res = await api.get("/bureau/suppliers/anomalies");
    return res.data;
  },
  getCrossCustomer: async () => {
    const res = await api.get("/bureau/suppliers/cross-customer");
    return res.data;
  },
  getSupplierDetails: async (companyId, supplierId) => {
    // companyId is used in the backend session, supplierId is the param
    // the function signature in request was (companyId, supplierName) but for agency view we might not need companyId param if it's agency-level
    // We will just pass the supplier identifier to the endpoint
    const cleanId = encodeURIComponent(supplierId);
    const res = await api.get(`/bureau/suppliers/${cleanId}`);
    return res.data;
  },
  listSuppliers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/bureau/suppliers?${query}`);
    return res.data;
  },

  // New Global Supplier Endpoints (Enterprise Trust Layer)
  fetchProfile: async (id) => {
    const res = await api.get(`/suppliers/${id}/profile`);
    return res.data;
  },
  fetchStats: async (id) => {
    const res = await api.get(`/suppliers/${id}/stats`);
    return res.data;
  },
  fetchTrends: async (id) => {
    const res = await api.get(`/suppliers/${id}/trends`);
    return res.data;
  }
};
