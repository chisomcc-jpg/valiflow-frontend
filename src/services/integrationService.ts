// src/services/integrationService.ts
import api from "./api"; // assuming standard axios instance

export const integrationService = {
  getIntegrations: async (companyId?: string) => {
    // If companyId is not provided, backend should infer from user context
    const response = await api.get(`/integrations${companyId ? `?companyId=${companyId}` : ''}`);
    return response.data;
  },

  getRecommendation: async (companyId?: string) => {
    const response = await api.get(`/integrations/recommendation${companyId ? `?companyId=${companyId}` : ''}`);
    return response.data;
  },

  connect: async (id: string) => {
    // This might return a redirect URL handled in the component
    const response = await api.post(`/integrations/${id}/connect`);
    return response.data;
  },

  getAuthUrl: async (id: string) => {
    const response = await api.post(`/integrations/${id}/auth-url`);
    return response.data;
  },

  disconnect: async (id: string) => {
    const response = await api.delete(`/integrations/${id}`);
    return response.data;
  },

  sync: async (id: string) => {
    const response = await api.post(`/integrations/${id}/sync`);
    return response.data;
  },

  // Specific getters if we need to lazy load details (though Integrations.jsx loads all at once usually)
  getStatus: async (id: string) => {
    const response = await api.get(`/integrations/${id}/status`);
    return response.data;
  }
};
