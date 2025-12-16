// src/services/bureauInsightsService.ts
import { api } from "./api";
import { insightsMockData } from "@/demo/insightsMockData";

export const bureauInsightsService = {
    getAiSummary: async () => {
        try {
            const res = await api.get("/agency/insights/ai-summary");
            return res.data;
        } catch (e) {
            console.warn("Using mock for AI Summary");
            return insightsMockData.summary;
        }
    },

    getCustomerRisk: async () => { // Used for Heatmap
        try {
            const res = await api.get("/agency/insights/customer-risk");
            return res.data;
        } catch (e) {
            console.warn("Using mock for Customer Risk");
            return insightsMockData.riskHeatmap;
        }
    },

    getRiskDistribution: async () => {
        try {
            const res = await api.get("/agency/insights/risk-distribution");
            return res.data;
        } catch (e) {
            console.warn("Using mock for Risk Distribution");
            return insightsMockData.riskDistribution;
        }
    },

    getSupplierHighlights: async () => { // Legacy/Simple
        try {
            const res = await api.get("/agency/insights/supplier-highlights");
            return res.data;
        } catch (e) {
            console.warn("Using mock for Supplier Highlights");
            // Transform mock Cross info to similar shape if needed, or just return subset
            return insightsMockData.supplierCross.slice(0, 3);
        }
    },

    getSupplierCross: async () => {
        try {
            const res = await api.get("/agency/insights/supplier-cross");
            return res.data;
        } catch (e) {
            console.warn("Using mock for Supplier Cross");
            return insightsMockData.supplierCross;
        }
    },

    getSupplierActivity: async () => {
        try {
            const res = await api.get("/agency/insights/supplier-activity");
            return res.data;
        } catch (e) {
            console.warn("Using mock for Supplier Activity");
            return insightsMockData.supplierActivity;
        }
    },

    getTrends: async () => {
        try {
            const res = await api.get("/agency/insights/trends");
            return res.data;
        } catch (e) {
            console.warn("Using mock for Trends");
            return {
                invoiceVolume: insightsMockData.invoiceVolume,
                metadataIssues: insightsMockData.metadataIssues,
                supplierActivity: insightsMockData.supplierActivity,
                supplierRiskTrend: insightsMockData.supplierRiskTrend
            };
        }
    },

    getPortfolioRiskTrend: async () => {
        try {
            const res = await api.get("/agency/insights/portfolio-risk-trend");
            return res.data;
        } catch (e) {
            console.warn("Using mock for Portfolio Risk Trend");
            return insightsMockData.portfolioRiskTrend;
        }
    },

    getRecommendations: async () => {
        try {
            const res = await api.get("/agency/insights/recommendations");
            return res.data;
        } catch (e) {
            console.warn("Using mock for Recommendations");
            return insightsMockData.recommendations;
        }
    }
};
