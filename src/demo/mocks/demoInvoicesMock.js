export const demoInvoices = [
    {
        id: "INV-2024-001",
        status: "approved",
        supplierName: "Tele2 Sverige AB",
        riskScore: 12,
        trustScore: 88,
        total: 4500,
        currency: "SEK",
        invoiceDate: "2024-05-15",
        dueDate: "2024-06-15",
        mockRiskType: "Verifierad",
        mockMetaStatus: { label: "OK", color: "bg-emerald-100 text-emerald-700", icon: "check" },
        mockChange: "n/a",
        mockDeviation: "-",

        // Quick View Data
        vatNumber: "556016-0680",
        supplierProfile: {
            location: "Stockholm, Sverige",
            riskLevel: "Låg",
            tags: ["Verifierad", "Telekom"],
            isNew: false
        },
        aiAnalysis: {
            summary: "Fakturan följer etablerat mönster för denna leverantör. Belopp och betalningsmottagare stämmer överens med historik och avtalade villkor. Valiflow bedömer risken som låg.",
            detectedSignals: [
                "Känt bankgiro",
                "Förväntat beloppsintervall",
                "Matchar tidigare fakturor"
            ],
            // Mapping for UI (Legacy support until UI update)
            bullets: [
                { text: "Känt bankgiro", icon: "check" },
                { text: "Förväntat beloppsintervall", icon: "check" },
                { text: "Matchar tidigare fakturor", icon: "check" }
            ]
        },
        historicalContext: {
            avgAmount: 4600,
            invoiceCount: 24,
            usualBankgiro: "123-4567",
            lastPaymentInfoChangeMonths: 48
        },
        trustBreakdown: [
            { reason: "Etablerad leverantör", impact: 10 },
            { reason: "Stabil historik", impact: 10 }
        ],
        riskOutcome: {
            ifIgnored: "Ingen risk identifierad.",
            estimatedImpactSEK: 0
        },
        recommendedAction: {
            primary: "Attestera faktura",
            secondary: "Arkivera digitalt",
            urgency: "Normal"
        },
        metadata: {
            ocr: "5566778899",
            bankType: "Bankgiro",
            bankAccount: "123-4567",
            terms: "30 dagar",
            customerNo: "C-99001",
            reference: "IT-avdelningen"
        },
        flags: []
    },
    {
        id: "INV-2024-002",
        status: "needs_review", // Focus for Demo
        supplierName: "Konsultbolaget AB",
        riskScore: 65,
        trustScore: 35,
        total: 125000,
        currency: "SEK",
        invoiceDate: "2024-05-18",
        dueDate: "2024-06-18",
        mockRiskType: "Avvikelse",
        mockMetaStatus: { label: "Avvikelse", color: "bg-amber-100 text-amber-700", icon: "warn" },
        mockChange: "Nytt PG",
        mockDeviation: "Avvikelse",
        flagged: true,

        // Quick View Data (Rich)
        vatNumber: "559000-1234",
        supplierProfile: {
            location: "Malmö, Sverige",
            riskLevel: "Medel",
            tags: ["IT-Konsult", "Ny leverantör"],
            isNew: true
        },
        aiAnalysis: {
            summary: "Den här fakturan avviker från leverantörens normala mönster. Bankgirot har ändrats och beloppet är ovanligt högt jämfört med historik. Valiflow rekommenderar manuell verifiering innan betalning.",
            detectedSignals: [
                "Nytt bankgiro",
                "Avvikande belopp (+30%)",
                "Saknar referensperson"
            ],
            // Mapping for UI
            bullets: [
                { text: "Nytt bankgiro", icon: "warn" },
                { text: "Avvikande belopp (+30%)", icon: "warn" },
                { text: "Saknar referensperson", icon: "warn" }
            ]
        },
        historicalContext: {
            avgAmount: 96000,
            invoiceCount: 14,
            usualBankgiro: "998-8899",
            lastPaymentInfoChangeMonths: 1
        },
        trustBreakdown: [
            { reason: "Nytt bankgiro", impact: -20 },
            { reason: "Ny leverantör", impact: -10 },
            { reason: "Avvikande belopp", impact: -15 }
        ],
        riskOutcome: {
            ifIgnored: "Risk för felaktig betalning eller potentiellt fakturabedrägeri (VD-bedrägeri).",
            estimatedImpactSEK: 125000
        },
        recommendedAction: {
            primary: "Verifiera kontouppgifter via telefon",
            secondary: "Kontakta leverantörens ekonomiavdelning",
            urgency: "Innan förfallodatum"
        },
        metadata: {
            ocr: "90001122",
            bankType: "Bankgiro",
            bankAccount: "998-1122", // New account
            terms: "14 dagar",
            customerNo: "C-5050",
            reference: "Saknas"
        },
        // Line Items for Realistic PDF
        lineItems: [
            { desc: "Konsultation - Systemarkitektur (J. Smith)", qty: 40, price: 1500, vat: 25, total: 60000 },
            { desc: "Utvecklingstjänster backend, Sprint 4", qty: 35, price: 1200, vat: 25, total: 42000 },
            { desc: "Projektledning Maj 2024", qty: 15, price: 1400, vat: 25, total: 21000 },
            { desc: "Resekostnader", qty: 1, price: 2000, vat: 25, total: 2000 }
        ],
        flags: ["BGIRO_CHANGE", "AMOUNT_ANOMALY"]
    },
    {
        id: "INV-2024-003",
        status: "approved",
        supplierName: "Ellevio AB",
        riskScore: 5,
        trustScore: 95,
        total: 3200,
        currency: "SEK",
        invoiceDate: "2024-05-20",
        dueDate: "2024-06-20",
        mockRiskType: "Verifierad",
        mockMetaStatus: { label: "OK", color: "bg-emerald-100 text-emerald-700", icon: "check" },
        mockChange: "n/a",
        mockDeviation: "-",
        vatNumber: "556037-7326",
        supplierProfile: {
            location: "Jönköping",
            riskLevel: "Låg",
            tags: ["Energi"],
            isNew: false
        },
        aiAnalysis: {
            summary: "Fakturan ligger helt i linje med historiska data för Ellevio AB. Inga avvikelser i varken belopp eller betalningsinformation.",
            detectedSignals: ["Matchar historik", "Aktiv avtalsleverantör"],
            bullets: [{ text: "Matchar historik", icon: "check" }, { text: "Aktiv avtalsleverantör", icon: "check" }]
        },
        historicalContext: {
            avgAmount: 3100,
            invoiceCount: 56,
            usualBankgiro: "5560-3322",
            lastPaymentInfoChangeMonths: 60
        },
        trustBreakdown: [{ reason: "Stabil partner", impact: 10 }],
        riskOutcome: { ifIgnored: "Ingen risk.", estimatedImpactSEK: 0 },
        recommendedAction: { primary: "Godkänn betalning", urgency: "Låg" },
        metadata: { ocr: "112233", bankType: "Plusgiro", bankAccount: "44-55", terms: "30 dagar", customerNo: "C-100", reference: "Fastighet" }
    },
    {
        id: "INV-2024-004",
        status: "rejected",
        supplierName: "Unknown Supplier Ltd",
        riskScore: 92,
        trustScore: 8,
        total: 45000,
        currency: "SEK",
        invoiceDate: "2024-05-21",
        dueDate: "2024-06-21",
        mockRiskType: "Kritisk Risk",
        mockMetaStatus: { label: "Risk", color: "bg-red-100 text-red-700", icon: "alert" },
        mockChange: "Svartlistad",
        mockDeviation: "Risk",
        vatNumber: "Unknown",
        supplierProfile: { location: "Unknown", riskLevel: "Critical", tags: ["Blockerad"], isNew: true },
        aiAnalysis: {
            summary: "Leverantören identifierad på varningslistor för oseriösa aktörer. Bolaget saknar F-skatt och har skulder hos Kronofogden.",
            detectedSignals: ["Svartlistad (Varningslistan)", "Saknar F-skatt", "Skuldsaldo"],
            bullets: [{ text: "Svartlistad (Varningslistan)", icon: "alert" }, { text: "Saknar F-skatt", icon: "alert" }]
        },
        historicalContext: { avgAmount: 0, invoiceCount: 0, usualBankgiro: "-", lastPaymentInfoChangeMonths: 0 },
        trustBreakdown: [{ reason: "Svartlistad", impact: -50 }, { reason: "Saknar F-skatt", impact: -40 }],
        riskOutcome: { ifIgnored: "Hög risk för bedrägeri och skattetillägg.", estimatedImpactSEK: 45000 },
        recommendedAction: { primary: "Avvisa omedelbart", secondary: "Rapportera incident", urgency: "Kritisk" },
        metadata: { ocr: "???", bankType: "Oklart", bankAccount: "???", terms: "0 dagar", customerNo: "-", reference: "-" }
    },
    {
        id: "INV-2024-005",
        status: "new",
        supplierName: "Office Depot",
        riskScore: 20,
        trustScore: 80,
        total: 1540,
        currency: "SEK",
        invoiceDate: "2024-05-22",
        dueDate: "2024-06-22",
        mockRiskType: "Verifierad",
        mockMetaStatus: { label: "OK", color: "bg-emerald-100 text-emerald-700", icon: "check" },
        mockChange: "n/a",
        mockDeviation: "-",
        vatNumber: "556708-3641",
        supplierProfile: { location: "Solna", riskLevel: "Låg", tags: ["Kontor", "Verifierad"], isNew: false },
        aiAnalysis: {
            summary: "Rutininköp av kontorsmaterial. Matchar tidigare inköpsmönster.",
            detectedSignals: ["Verifierad leverantör", "Normalt belopp"],
            bullets: [{ text: "Verifierad leverantör", icon: "check" }, { text: "Normalt belopp", icon: "check" }]
        },
        historicalContext: { avgAmount: 1500, invoiceCount: 120, usualBankgiro: "500-1000", lastPaymentInfoChangeMonths: 36 },
        trustBreakdown: [{ reason: "Korrekt historik", impact: 5 }],
        riskOutcome: { ifIgnored: "Ingen risk.", estimatedImpactSEK: 0 },
        recommendedAction: { primary: "Attestera", urgency: "Normal" },
        metadata: { ocr: "550055", bankType: "Bankgiro", bankAccount: "500-1000", terms: "30 dagar", customerNo: "C-200", reference: "Receptionen" }
    }
];

export const demoInvoiceSummary = {
    totalInvoices: 142,
    flaggedInvoices: 3,
    requiresReview: 5,
    avgTrustScore90d: 89,
    trustStatus: "Stabil"
};
