// frontend/src/services/overviewService.ts
import { api } from "./api";
import { companyOverviewMock } from "@/demo/companyOverviewMock";

export const overviewService = {
    getOverview: async (companyId) => {
        try {
            const res = await api.get(`/company/${companyId}/overview`);
            return res.data;
        } catch (e) {
            console.warn("Using mock for Company Overview (Backend unreachable or error)", e);
            // Fallback to mock if API fails
            return {
                summary: companyOverviewMock.summary,
                kpis: companyOverviewMock.kpis,
                riskDistribution: companyOverviewMock.riskDistribution,
                topInvoices: companyOverviewMock.topInvoices,
                suppliers: companyOverviewMock.supplierRisks,
                trends: companyOverviewMock.trends,
                recommendations: companyOverviewMock.recommendations,
                events: companyOverviewMock.events
            };
        }
    },

    getSummary: async (companyId) => {
        return companyOverviewMock.summary;
        // try {
        //     const res = await api.get(`/company/${companyId}/overview/summary`);
        //     return res.data;
        // } catch (e) {
        //     return companyOverviewMock.summary;
        // }
    },

    getRiskDistribution: async (companyId) => {
        return companyOverviewMock.riskDistribution;
        // try {
        //     const res = await api.get(`/company/${companyId}/overview/risk-distribution`);
        //     return res.data;
        // } catch (e) {
        //     return companyOverviewMock.riskDistribution;
        // }
    },

    getTopInvoices: async (companyId) => {
        return companyOverviewMock.topInvoices;
        // try {
        //     const res = await api.get(`/company/${companyId}/overview/top-invoices`);
        //     return res.data;
        // } catch (e) {
        //     return companyOverviewMock.topInvoices;
        // }
    },

    getSuppliers: async (companyId) => {
        return companyOverviewMock.supplierRisks;
        // try {
        //     const res = await api.get(`/company/${companyId}/overview/suppliers`);
        //     return res.data;
        // } catch (e) {
        //     return companyOverviewMock.supplierRisks;
        // }
    },

    getTrends: async (companyId) => {
        return companyOverviewMock.trends;
        // try {
        //     const res = await api.get(`/company/${companyId}/overview/trends`);
        //     return res.data;
        // } catch (e) {
        //     return companyOverviewMock.trends;
        // }
    },

    getRecommendations: async (companyId) => {
        return companyOverviewMock.recommendations;
        // try {
        //     const res = await api.get(`/company/${companyId}/overview/recommendations`);
        //     return res.data;
        // } catch (e) {
        //     return companyOverviewMock.recommendations;
        // }
    },

    getEvents: async (companyId) => {
        return companyOverviewMock.events;
    }
};

// Enterprise Trust Layer compatible
// Enhanced for rapid dashboard loading and fallback security
export default overviewService;
