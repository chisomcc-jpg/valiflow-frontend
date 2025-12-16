// src/demo/invoiceDetailsMock.js

export const invoiceDetailsMock = {
    // Basic Invoice Data (Fallback)
    invoice: {
        id: "inv-12345",
        invoiceNumber: "INV-2023-001",
        supplierName: "Office Supplies AB",
        supplierId: "sup-987",
        total: 12500,
        currency: "SEK",
        invoiceDate: "2023-10-15",
        dueDate: "2023-11-14",
        status: "approved",
        trustScore: 92,
        riskScore: 8,
        vatNumber: "SE556012345601",
        paymentMethod: "BG 123-4567",
        ocr: "1234567890"
    },

    // 1. AI Summary
    summary: {
        riskLevel: "low",
        text: "Fakturan bedöms som låg risk.",
        subText: "Den matchar 27 tidigare fakturor från samma leverantör och följer normala mönster för belopp, datumstruktur och betalningshistorik.",
        confidence: 0.934
    },

    // 2. Context Card Data
    context: {
        historicalMatchCount: 27,
        amountDeviation: "Inom ±5% av genomsnittsnivå",
        supplierStability: "Leverantören har 0 avvikelser senaste 90 dagarna",
        aiConfidence: "93.4% säkerhet"
    },

    // 3. Signals & Matrix
    signals: {
        documentQuality: 0.96,
        supplierIntegrity: 0.92,
        financialRisk: 0.12, // Low is good here usually, but prompt says 0.21 financial risk
        networkInfluence: 0.65,
        anomalyScore: 0.03
    },

    // 4. Timeline / Event Log
    events: [
        { id: 1, type: "upload", text: "Faktura uppladdad", time: "2023-10-16T08:30:00Z", user: "System" },
        { id: 2, type: "analysis", text: "AI-analys slutförd (Trust Score: 92)", time: "2023-10-16T08:30:05Z", user: "TrustLayer AI" },
        { id: 3, type: "metadata", text: "Metadata validerad mot Bolagsverket", time: "2023-10-16T08:30:10Z", user: "System" },
        { id: 4, type: "bankgiro", text: "Bankgiro verifierat (Match)", time: "2023-10-16T08:30:12Z", user: "BankCheck API" },
        { id: 5, type: "approval", text: "Godkänd av CFO", time: "2023-10-17T14:20:00Z", user: "Johan CFO" }
    ],

    // 5. Supplier Profile
    supplierProfile: {
        id: "sup-987",
        name: "Office Supplies AB",
        totalInvoices: 142,
        customerCount: 15,
        riskTrend: "stable", // stable, up, down
        lastDeviation: null, // or date string
        bankgiroStatus: "stable", // stable, changed
        trendChart: [
            { date: '2023-05', score: 90 },
            { date: '2023-06', score: 92 },
            { date: '2023-07', score: 88 },
            { date: '2023-08', score: 93 },
            { date: '2023-09', score: 95 },
            { date: '2023-10', score: 94 },
        ]
    },

    // 6. Recommendations
    recommendations: [
        {
            id: 'rec-1',
            type: 'positive', // positive, warning, critical
            text: "Godkänn fakturan — inga risker identifierade.",
            subText: "Leverantören verifierad och beloppet är normalt."
        },
        {
            id: 'rec-2',
            type: 'info',
            text: "Leverantören uppvisar stabil historik senaste 6 månaderna.",
            subText: "Inga anmärkningar i externa register."
        }
    ],

    // 7. Micro Trends
    trends: {
        amount: { direction: 'stable', label: 'Inom snitt' },
        trust: { direction: 'up', label: 'Ökande förtroende (+2%)' },
        supplier: { direction: 'stable', label: 'Stabil partner' }
    }
};
