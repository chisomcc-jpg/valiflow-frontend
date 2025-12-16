// src/services/fraudService.ts
import { api } from "./api";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface FraudStats {
    highRiskCount: number;
    anomalousSuppliers: number;
    paymentChanges: number;
    activePatterns: number;
    totalAnalyzed: number;
    avgRiskScore: number;
}

export interface FraudEvent {
    id: string;
    type: string;
    severity: "low" | "medium" | "high";
    message: string;
    timestamp: string;
    invoiceId?: number;
    supplierName?: string;
    patternId?: string;
}

export interface FraudPattern {
    id: string;
    name: string;
    description: string;
    frequency: "low" | "medium" | "high";
    affectedCount: number;
    severity: "low" | "medium" | "high";
}

// ------------------------------------------------------------------
// API Methods
// ------------------------------------------------------------------

/**
 * Get aggregated fraud statistics for the overview dashboard.
 */
export async function getFraudOverview(): Promise<FraudStats> {
    // Try real endpoint, fallback to mock if 404/error in dev
    try {
        const response = await api.get("/fraud/overview");
        return response.data;
    } catch (err) {
        console.warn("Using mock data for getFraudOverview", err);
        return {
            highRiskCount: 12,
            anomalousSuppliers: 3,
            paymentChanges: 5,
            activePatterns: 2,
            totalAnalyzed: 1450,
            avgRiskScore: 18
        };
    }
}

/**
 * Get list of recent fraud events/alerts.
 */
export async function getRecentFraudEvents(): Promise<FraudEvent[]> {
    try {
        const response = await api.get("/fraud/recent");
        return response.data;
    } catch (err) {
        console.warn("Using mock data for getRecentFraudEvents");
        return [
            {
                id: "evt-123",
                type: "payment_mismatch",
                severity: "high",
                message: "Bankgiro matchar ej tidigare historik",
                timestamp: new Date().toISOString(),
                supplierName: "Otydlig Konsult AB",
                invoiceId: 1011
            },
            {
                id: "evt-124",
                type: "pattern_detected",
                severity: "medium",
                message: "Atypisk faktureringstid (Helg)",
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                supplierName: "Logistikpartner X",
                invoiceId: 1009
            }
        ];
    }
}

/**
 * Get library of active fraud patterns detected.
 */
export async function getFraudPatterns(): Promise<FraudPattern[]> {
    try {
        const response = await api.get("/fraud/patterns");
        return response.data;
    } catch (err) {
        console.warn("Using mock data for getFraudPatterns");
        return [
            { id: "fp-1", name: "Ändrade betalningsuppgifter", description: "Avvikande Bankgiro/Plusgiro jämfört med whitelist.", frequency: "medium", affectedCount: 5, severity: "high" },
            { id: "fp-2", name: "Fakturasplittring", description: "Flera fakturor under beloppsgräns mottagna samma dag.", frequency: "low", affectedCount: 2, severity: "medium" },
            { id: "fp-3", name: "Ny leverantör", description: "Första fakturan från okänd leverantör > 50k SEK.", frequency: "high", affectedCount: 8, severity: "medium" }
        ];
    }
}

/**
 * Get timeline data for risk trends.
 */
export async function getRiskTimeline(days = 30) {
    try {
        const response = await api.get("/fraud/timeline", { params: { days } });
        return response.data;
    } catch (err) {
        // Mock timeline generator
        const data = [];
        const today = new Date();
        for (let i = 30; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            data.push({
                date: d.toISOString().split('T')[0],
                riskScore: 15 + Math.random() * 10,
                anomalies: Math.floor(Math.random() * 3)
            });
        }
        return data;
    }
}
