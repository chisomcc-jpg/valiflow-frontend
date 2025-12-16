// src/demo/marketingMockData.js

export const marketingMockData = {
    // --- KPIs ---
    kpi: {
        totalCustomers: 18,
        highRiskCustomers: 4,
        flaggedInvoices: 92,
        supplierIssues: 7,
        totalVolume: 4250000, // 4.25 MSEK
        activeAlerts: 12
    },

    // --- Customers List ---
    customers: [
        { id: 101, name: "NordVent AB", orgnr: "556122-9081", risk: 32, invoices: 115, volume: 1250000, lastActivity: "Idag 10:22", status: "ok" },
        { id: 102, name: "ByggLedger AB", orgnr: "559201-3344", risk: 68, invoices: 42, volume: 450000, lastActivity: "Igår 14:05", status: "warning" },
        { id: 103, name: "Aurelius Konsult AB", orgnr: "556881-9911", risk: 12, invoices: 23, volume: 180000, lastActivity: "Idag 09:11", status: "ok" },
        { id: 104, name: "Scandia Energi AB", orgnr: "559990-5531", risk: 84, invoices: 207, volume: 2100000, lastActivity: "Idag 08:45", status: "critical" },
        { id: 105, name: "Mälardalen Logistik", orgnr: "556000-1234", risk: 45, invoices: 88, volume: 890000, lastActivity: "Idag 11:30", status: "warning" },
        { id: 106, name: "TechNova Solutions", orgnr: "556999-8877", risk: 8, invoices: 15, volume: 120000, lastActivity: "2025-12-10", status: "ok" },
        { id: 107, name: "Svensk Infrastruktur", orgnr: "556333-2211", risk: 92, invoices: 310, volume: 4500000, lastActivity: "Idag 07:15", status: "critical" },
        { id: 108, name: "EcoGreen Nordic", orgnr: "556444-5566", risk: 25, invoices: 45, volume: 320000, lastActivity: "Igår 16:20", status: "ok" },
        { id: 109, name: "Västkustens Bygg", orgnr: "556777-8899", risk: 61, invoices: 67, volume: 560000, lastActivity: "Igår 13:45", status: "warning" },
        { id: 110, name: "Northern Lights IT", orgnr: "556222-3344", risk: 5, invoices: 12, volume: 95000, lastActivity: "2025-12-09", status: "ok" },
        { id: 111, name: "Stockholm Media Group", orgnr: "556111-2233", risk: 18, invoices: 34, volume: 280000, lastActivity: "Idag 12:05", status: "ok" },
        { id: 112, name: "Baltic Shipping Co", orgnr: "556888-7766", risk: 76, invoices: 156, volume: 1800000, lastActivity: "Idag 06:30", status: "critical" },
        { id: 113, name: "Kiruna Mining Services", orgnr: "556555-4433", risk: 22, invoices: 98, volume: 920000, lastActivity: "Igår 09:15", status: "ok" },
        { id: 114, name: "Uppsala Biotech", orgnr: "556666-9988", risk: 15, invoices: 28, volume: 410000, lastActivity: "Igår 11:00", status: "ok" },
        { id: 115, name: "Gotland Turism AB", orgnr: "556999-1122", risk: 42, invoices: 110, volume: 760000, lastActivity: "Idag 10:45", status: "warning" }
    ],

    // --- Priority Alerts ---
    alerts: [
        { type: "critical", title: "Hög risk", message: "Scandia Energi AB uppvisar avvikande betalningsmönster.", time: "10 min sedan" },
        { type: "warning", title: "Nytt bankgiro", message: "NordicSteel Import (Lev) har ändrat bankgiro.", time: "42 min sedan" },
        { type: "info", title: "Systemuppdatering", message: "AI-modellen uppdaterad med nya bedrägerimönster.", time: "2h sedan" }
    ],

    // --- AI Insights ---
    aiSummary: {
        headline: "Daglig Riskanalys",
        text: "Tre kunder visar ökad risktrend de senaste 14 dagarna. Leverantören NordicSteel Import bör granskas då riskpoängen har stigit efter ändrat bankgiro.",
        recommendations: [
            "Granska kunder med risk över 70%.",
            "Verifiera bankgiro för NordicSteel Import.",
            "Kontakta ByggLedger AB angående ökande metadata-bortfall."
        ]
    },

    // --- Suppliers ---
    suppliers: [
        { name: "NordicSteel Import AB", risk: 91, customers: 3, issue: "Ändrat bankgiro" },
        { name: "Lindström Industriservice", risk: 72, customers: 4, issue: "Ovanlig fakturafrekvens" },
        { name: "Falck Elektronik AB", risk: 15, customers: 2, issue: null },
        { name: "Global Logistics Ltd", risk: 65, customers: 5, issue: "Utländsk betalning" },
        { name: "Kontorsgiganten", risk: 5, customers: 12, issue: null }
    ],

    // --- Chart Data (Portfolio Health) ---
    portfolioHealth: [
        { name: "Jan", low: 85, medium: 10, high: 5 },
        { name: "Feb", low: 82, medium: 12, high: 6 },
        { name: "Mar", low: 84, medium: 11, high: 5 },
        { name: "Apr", low: 80, medium: 15, high: 5 },
        { name: "Maj", low: 78, medium: 15, high: 7 },
        { name: "Jun", low: 75, medium: 18, high: 7 },
        { name: "Jul", low: 79, medium: 16, high: 5 },
        { name: "Aug", low: 82, medium: 14, high: 4 },
        { name: "Sep", low: 80, medium: 15, high: 5 },
        { name: "Okt", low: 76, medium: 18, high: 6 },
        { name: "Nov", low: 74, medium: 16, high: 10 },
        { name: "Dec", low: 72, medium: 18, high: 10 },
    ],

    // --- Pipeline Activity (Events for Timeline) ---
    pipelineActivity: [
        { type: "risk", text: "Kritisk risk upptäckt", subtext: "Scandia Energi AB - Avvikande mönster", time: new Date(new Date().setHours(14, 30)).toISOString() },
        { type: "invoice", text: "Ny faktura inkommen", subtext: "Factoring Finans AB (125 000 kr)", time: new Date(new Date().setHours(13, 15)).toISOString() },
        { type: "invoice", text: "Ny faktura inkommen", subtext: "TechNova Solutions (45 000 kr)", time: new Date(new Date().setHours(11, 45)).toISOString() },
        { type: "supplier", text: "Leverantörsuppdatering", subtext: "NordicSteel Import - Ändrat bankgiro", time: new Date(new Date().setHours(10, 20)).toISOString() },
        { type: "warning", text: "Varning: Metadata saknas", subtext: "ByggLedger AB - Faktura #9921", time: new Date(new Date().setHours(9, 10)).toISOString() },
        { type: "invoice", text: "Ny faktura inkommen", subtext: "Mälardalen Logistik (89 000 kr)", time: new Date(new Date().setHours(8, 55)).toISOString() },
        { type: "info", text: "Systemanalys slutförd", subtext: "Daglig batchkörning klar", time: new Date(new Date().setHours(7, 30)).toISOString() }
    ]
};
