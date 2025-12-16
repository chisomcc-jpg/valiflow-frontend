export const demoBureauMock = {
    overview: {
        kpis: {
            totalCustomers: 24,
            activeCustomers: 22,
            totalRevenue: 4850000,
            revenueGrowth: 12,
            pendingActions: 5,
            riskScoreAvg: 12,
            efficiency: 94
        },
        priority: {
            exceptionCount: 5,
            urgentCount: 1,
            // Top 3 urgent items
            items: [
                { id: 1, type: "fraud_risk", client: "Bygg & Anläggning AB", message: "Ny leverantör med varningslistat bankgiro.", time: "10:42" },
                { id: 2, type: "approval_needed", client: "Konsultgruppen Syd", message: "Faktura över beloppsgräns väntar attest.", time: "09:15" },
                { id: 3, type: "missing_info", client: "E-handel Nu AB", message: "3 nya leverantörer saknar F-skatt.", time: "Igår, 15:30" }
            ]
        },
        health: {
            safe: 18,
            review: 4,
            risk: 2
        },
        aiSummary: {
            title: "Veckoanalys",
            summary: "Byrån har överlag en stabil riskbild. Aktiviteten har ökat hos e-handelskunderna, vilket genererat fler nya leverantörer att granska. Några kundbolag kräver uppföljning gällande attestregler.",
            items: []
        },
        feed: [
            { id: 1, user: "Anna Ek", action: "Godkände faktura", target: "Faktura #9923", client: "Tech Startup AB", time: "10 min sedan" },
            { id: 2, user: "Johan Alm", action: "Verifierade leverantör", target: "Städservice AB", client: "Fastighetsbolaget", time: "32 min sedan" },
            { id: 3, user: "System", action: "Riskvarning", target: "Ovanligt belopp", client: "Bygg & Anläggning AB", time: "1 timme sedan" },
            { id: 4, user: "Sara Lind", action: "Bokförde", target: "Bunten #2024-10", client: "Bageriet AB", time: "2 timmar sedan" }
        ],
        activity: [
            { day: "Mån", value: 45 }, { day: "Tis", value: 52 }, { day: "Ons", value: 49 },
            { day: "Tor", value: 62 }, { day: "Fre", value: 55 }, { day: "Lör", value: 12 }, { day: "Sön", value: 5 }
        ]
    },
    customers: [
        { id: 101, name: "Bygg & Anläggning AB", orgNumber: "556012-3456", status: "active", riskLevel: "Hög", invoiceCount30d: 45, hasOrgNumber: true },
        { id: 102, name: "Tech Startup AB", orgNumber: "556123-4567", status: "active", riskLevel: "Låg", invoiceCount30d: 12, hasOrgNumber: true },
        { id: 103, name: "Konsultgruppen Syd", orgNumber: "556234-5678", status: "active", riskLevel: "Medel", invoiceCount30d: 28, hasOrgNumber: true },
        { id: 104, name: "E-handel Nu AB", orgNumber: "556345-6789", status: "active", riskLevel: "Medel", invoiceCount30d: 156, hasOrgNumber: true },
        { id: 105, name: "Bageriet AB", orgNumber: "556456-7890", status: "active", riskLevel: "Låg", invoiceCount30d: 8, hasOrgNumber: true },
        { id: 106, name: "Fastighetsbolaget", orgNumber: "556567-8901", status: "active", riskLevel: "Låg", invoiceCount30d: 62, hasOrgNumber: true },
        { id: 107, name: "Transport & Logistik", orgNumber: "556678-9012", status: "pilot", riskLevel: "Hög", invoiceCount30d: 34, hasOrgNumber: true },
        { id: 108, name: "Mediahuset", orgNumber: "556789-0123", status: "active", riskLevel: "Låg", invoiceCount30d: 19, hasOrgNumber: true },
        { id: 109, name: "Advokatbyrån", orgNumber: "556890-1234", status: "active", riskLevel: "Låg", invoiceCount30d: 5, hasOrgNumber: true },
        { id: 110, name: "Restaurangkedjan", orgNumber: "556901-2345", status: "active", riskLevel: "Medel", invoiceCount30d: 89, hasOrgNumber: true },
        { id: 111, name: "IT-Konsulterna", orgNumber: "556012-3457", status: "active", riskLevel: "Låg", invoiceCount30d: 11, hasOrgNumber: true },
        { id: 112, name: "Målerifirman", orgNumber: "556123-4568", status: "inactive", riskLevel: "Låg", invoiceCount30d: 0, hasOrgNumber: true },
    ],
    riskCenter: {
        // Mock data for Risk Center will be simpler to satisfy the layout
        risks: [
            { id: 1, type: "bankgiro", client: "Bygg & Anläggning AB", supplier: "Nya Verktyg AB", desc: "Bankgiro ändrat 2 dagar efter fakturadatum.", severity: "high", date: "Idag, 08:30" },
            { id: 2, type: "amount", client: "Transport & Logistik", supplier: "Drivmedel City", desc: "Faktura på 45 000 kr avviker från snitt (12 000 kr).", severity: "medium", date: "Igår, 14:15" },
            { id: 3, type: "new_supplier", client: "E-handel Nu AB", supplier: "Global Shipping Ltd", desc: "Ny utländsk leverantör utan historik.", severity: "medium", date: "2023-12-12" },
            { id: 4, type: "vat_mismatch", client: "Konsultgruppen Syd", supplier: "Kontorsmaterial AB", desc: "Moms saknas på fakturan.", severity: "low", date: "2023-12-10" }
        ],
        stats: {
            totalRisks: 4,
            high: 1,
            medium: 2,
            low: 1
        }
    },
    team: {
        members: [
            { id: 1, name: "Anna Ek", email: "anna.ek@byran.se", roleId: 1, status: "ACTIVE", lastActive: new Date().toISOString(), avatar: "AE" },
            { id: 2, name: "Johan Alm", email: "johan@byran.se", roleId: 2, status: "ACTIVE", lastActive: new Date(Date.now() - 1000 * 60 * 30).toISOString(), avatar: "JA" },
            { id: 3, name: "Sara Lind", email: "sara@byran.se", roleId: 2, status: "ACTIVE", lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), avatar: "SL" },
            { id: 4, name: "Erik Berg", email: "erik@byran.se", roleId: 3, status: "INVITED", lastActive: null, avatar: "EB" }
        ],
        activityLog: [
            { id: 1, userId: "Anna Ek", event: "Granskade bokslut (Tech Startup AB)", result: "SUCCESS", entity: "Faktura #9923", createdAt: new Date().toISOString() },
            { id: 2, userId: "Johan Alm", event: "Attesterade 12 fakturor", result: "SUCCESS", entity: "Batch #44", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
            { id: 3, userId: "Sara Lind", event: "Kommenterade avvikelse", result: "SUCCESS", entity: "Avvikelse #12", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
            { id: 4, userId: "Erik Berg", event: "Misslyckad inloggning", result: "FAILURE", entity: "Login", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }
        ]
    }
};
