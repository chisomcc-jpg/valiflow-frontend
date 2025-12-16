export const companyOverviewMock = {
    overviewTitle: "Exekutiv Översikt",
    overviewDescription: "Samlad status över finansiella flöden och avvikelser.",

    summary: {
        title: "Lägesbild",
        text: "Det operativa riskläget är stabilt.",
        subText: "Endast 3 fakturor avviker från normalt mönster och bör ses över.",
        alertText: "Inga kritiska hot har identifierats under senaste dygnet.",
        alertColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
        alertIcon: "✓",
        updatedAt: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
    },
    kpis: {
        totalInvoicesMonth: 142,
        totalInvoicesYTD: 1850,
        requiresAttention: 3, // PRIMARY - Responsibility
        autoApproved: 128,    // Context
        riskFindings: 2,      // Context
    },
    riskDistribution: {
        safe: 137,
        review: 3,
        risk: 2
    },
    topInvoices: [
        { id: 1, supplier: "NordicSteel AB", amount: 450000, trustScore: 42, status: "flagged", reason: "Bankgiro ändrat" },
        { id: 2, supplier: "Konsultbolaget AB", amount: 125000, trustScore: 35, status: "flagged", reason: "Avvikande belopp" },
        { id: 3, supplier: "Unknown Supplier Ltd", amount: 45000, trustScore: 8, status: "rejected", reason: "Svartlistad" },
        { id: 4, supplier: "Tele2 Sverige AB", amount: 4500, trustScore: 88, status: "ok", reason: "-" },
        { id: 5, supplier: "Ellevio AB", amount: 3200, trustScore: 95, status: "ok", reason: "-" },
    ],
    // Only used if SupplierRiskTable uses it
    suppliers: [
        { id: 1, name: "NordicSteel AB", riskScore: 88, change: "Bankgiro", invoiceCount: 12, comment: "Verifiering krävs" },
        { id: 2, name: "Konsultbolaget AB", riskScore: 65, change: "Belopp", invoiceCount: 14, comment: "Avvikelse mot historik" },
    ],
    trends: {
        volume: [
            { date: "01", value: 12 }, { date: "05", value: 15 }, { date: "10", value: 8 },
            { date: "15", value: 22 }, { date: "20", value: 18 }, { date: "25", value: 25 }, { date: "30", value: 10 }
        ],
        metadata: [
            { date: "V1", value: 2 }, { date: "V2", value: 5 }, { date: "V3", value: 1 }, { date: "V4", value: 3 }
        ],
        risk: [
            { date: "Jan", value: 5 }, { date: "Feb", value: 8 }, { date: "Mar", value: 6 },
            { date: "Apr", value: 4 }, { date: "Maj", value: 5 }, { date: "Jun", value: 3 }
        ]
    },
    recommendations: [
        { id: 1, priority: "high", text: "Bedömningen är att NordicSteel bör kontaktas för verifiering av nytt bankgiro.", type: "risk" },
        { id: 2, priority: "medium", text: "Konsultbolaget AB uppvisar ett avvikande faktureringsmönster denna månad.", type: "info" },
        { id: 3, priority: "info", text: "Övriga leverantörer följer förväntade intervall.", type: "success" },
    ],
    events: [
        { id: 1, type: "invoice_created", title: "Ny avvikelse", desc: "NordicSteel AB - Bankgiro ändrat", date: new Date().toISOString() },
        { id: 2, type: "invoice_created", title: "Ny avvikelse", desc: "Konsultbolaget AB - Beloppsavvikelse", date: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, type: "invoice_approved", title: "Godkänd", desc: "Tele2 Sverige - Rutinköp", date: new Date(Date.now() - 7200000).toISOString() },
        { id: 4, type: "invoice_approved", title: "Godkänd", desc: "Ellevio AB - Rutinköp", date: new Date(Date.now() - 10800000).toISOString() },
    ]
};
