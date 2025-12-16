export const insightsMockData = {
    summary: {
        text: "Portföljen visar 3 kunder med stigande risk.",
        subText: "Leverantören NordicSteel har ökat sin riskpoäng kraftigt efter ändrat bankgiro.",
        recommendation: "Rekommenderad åtgärd: Granska fakturor från ByggLedger AB.",
        updatedAt: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
    },
    riskHeatmap: [
        { customerId: 1, name: "Scandia Energi AB", risk: "high", score: 84, trend: "up", trendValue: "22%" },
        { customerId: 2, name: "ByggLedger AB", risk: "medium", score: 68, trend: "up", trendValue: "13%" },
        { customerId: 3, name: "Fastighet & Co", risk: "low", score: 24, trend: "stable", trendValue: "0%" },
        { customerId: 4, name: "TechSolutions", risk: "low", score: 12, trend: "down", trendValue: "5%" },
        { customerId: 5, name: "Logistikgruppen", risk: "medium", score: 45, trend: "up", trendValue: "8%" },
        { customerId: 6, name: "Norrland Skog", risk: "low", score: 18, trend: "stable", trendValue: "1%" },
        { customerId: 7, name: "Västkust Bygg", risk: "high", score: 76, trend: "up", trendValue: "15%" },
        { customerId: 8, name: "Stockholm Media", risk: "low", score: 9, trend: "stable", trendValue: "0%" },
        { customerId: 9, name: "Retail AB", risk: "medium", score: 55, trend: "down", trendValue: "2%" },
        { customerId: 10, name: "Konsultbolaget", risk: "low", score: 15, trend: "stable", trendValue: "0%" },
        { customerId: 11, name: "IndustriPartner", risk: "medium", score: 62, trend: "up", trendValue: "10%" },
        { customerId: 12, name: "Bokföring X", risk: "low", score: 20, trend: "stable", trendValue: "0%" },
    ],
    riskDistribution: [
        { name: "Låg risk", value: 65, color: "#10B981" },
        { name: "Medel risk", value: 25, color: "#F59E0B" },
        { name: "Hög risk", value: 10, color: "#EF4444" },
    ],
    supplierCross: [
        { id: 1, name: "NordicSteel", customerCount: 4, risk: "high", riskScore: 88, deviation: "Ändrat bankgiro" },
        { id: 2, name: "Kontorsgiganten", customerCount: 8, risk: "low", riskScore: 12, deviation: "-" },
        { id: 3, name: "Bemanning Direkt", customerCount: 3, risk: "medium", riskScore: 56, deviation: "Ovanlig volym" },
        { id: 4, name: "IT-Support AB", customerCount: 5, risk: "low", riskScore: 8, deviation: "-" },
        { id: 5, name: "Städservice", customerCount: 2, risk: "medium", riskScore: 48, deviation: "Ny leverantör" },
    ],
    supplierActivity: [
        { day: "Mån", changes: 2, label: "Bankgiro" },
        { day: "Tis", changes: 5, label: "Adress" },
        { day: "Ons", changes: 1, label: "F-skatt" },
        { day: "Tor", changes: 8, label: "Volym" },
        { day: "Fre", changes: 4, label: "Ny reg." },
    ],
    supplierRiskTrend: [
        { date: "V1", score: 45 },
        { date: "V2", score: 48 },
        { date: "V3", score: 52 },
        { date: "V4", score: 68 }, // Spyke
    ],
    portfolioRiskTrend: [
        { date: "Jan", score: 20 },
        { date: "Feb", score: 22 },
        { date: "Mar", score: 35 },
        { date: "Apr", score: 28 },
        { date: "Maj", score: 32 },
        { date: "Jun", score: 30 },
    ],
    invoiceVolume: [
        { date: "01", count: 120 },
        { date: "05", count: 145 },
        { date: "10", count: 132 },
        { date: "15", count: 160 },
        { date: "20", count: 180 },
        { date: "25", count: 155 },
        { date: "30", count: 170 },
    ],
    metadataIssues: [
        { type: "Saknar ref", count: 45 },
        { type: "Otydligt datum", count: 23 },
        { type: "Ej matchad PO", count: 67 },
    ],
    recommendations: [
        {
            id: 1,
            priority: "high",
            text: "Scandia Energi AB har fått 4 högriskfakturor senaste 24h.",
            action: "Granska fakturor",
            link: "/dashboard/c/1/invoices"
        },
        {
            id: 2,
            priority: "high",
            text: "NordicSteel har ändrat bankgiro två gånger.",
            action: "Visa leverantör",
            link: "/dashboard/suppliers/NordicSteel"
        },
        {
            id: 3,
            priority: "medium",
            text: "Metadata-brister hos ByggLedger AB har ökat 30% denna månad.",
            action: "Se statistik",
            link: "/dashboard/c/2/analytics"
        },
        {
            id: 4,
            priority: "info",
            text: "Portföljens risknivå är stabil senaste 30 dagarna.",
            action: "Läs rapport",
            link: "/dashboard/reports"
        },
    ]
};
