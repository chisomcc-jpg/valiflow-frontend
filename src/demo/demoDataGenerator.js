// src/demo/demoDataGenerator.js
import { addDays, subDays, format, subHours, subMinutes } from "date-fns";

// --- CONSTANTS ---

const DEMO_SUPPLIERS = [
    { name: "Nordic Clean Energy AB", category: "Energi", trustScore: 94, risk: "low", iban: "SE12 8000 0012 3456 7890" },
    { name: "Bygg & Betong i Väst AB", category: "Entreprenad", trustScore: 88, risk: "low", iban: "SE88 6000 0098 7654 3210" },
    { name: "Consulting Group Sthlm", category: "Konsult", trustScore: 91, risk: "low", iban: "SE24 5000 1111 2222 3333" },
    { name: "Office Supplies Direct", category: "Kontorsmaterial", trustScore: 85, risk: "low", iban: "SE99 1234 5678 9012 3456" },
    { name: "TechSolutions Nordic", category: "IT", trustScore: 96, risk: "low", iban: "SE11 3333 4444 5555 6666" },
    { name: "Lennarts Åkeri & Gräv", category: "Transport", trustScore: 72, risk: "medium", iban: "SE55 9876 5432 1098 7654" },
    { name: "Global Import Export LTD", category: "Partihandel", trustScore: 45, risk: "high", iban: "SE66 6666 7777 8888 9999" },
    { name: "Fastighetsunderhåll 24/7", category: "Fastighet", trustScore: 68, risk: "medium", iban: "SE44 2222 1111 0000 9999" },
    { name: "Marketing Wizards", category: "Marknadsföring", trustScore: 89, risk: "low", iban: "SE33 5555 6666 7777 8888" },
    { name: "Legal Advisors KB", category: "Juridik", trustScore: 98, risk: "low", iban: "SE77 8888 9999 0000 1111" },
    { name: "Bemanningsexperterna", category: "HR", trustScore: 82, risk: "low", iban: "SE22 1111 2222 3333 4444" },
    { name: "Svensk Säkerhetstjänst", category: "Säkerhet", trustScore: 93, risk: "low", iban: "SE00 9999 8888 7777 6666" },
];

const CURRENCIES = ["SEK", "SEK", "SEK", "EUR", "USD"];
const COST_CENTERS = ["CC-100 (Management)", "CC-201 (IT)", "CC-305 (Marketing)", "CC-400 (Logistics)", "CC-502 (R&D)"];

// --- HELPERS ---

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomBoolean = (chance = 0.5) => Math.random() < chance;

const generateId = () => `VF-${randomInt(1000, 9999)}`;

export function generateDemoSuppliers() {
    return DEMO_SUPPLIERS.map((s, i) => ({
        id: i + 1,
        name: s.name,
        orgNr: `556${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
        category: s.category,
        trustScore: s.trustScore,
        networkInfluence: s.risk === "high" ? 0.1 : randomInt(50, 90) / 100,
        supplierIntegrity: s.trustScore / 100,
        riskProfile: s.risk,
        logo: null,
    }));
}

function generateAuditTrail(invoiceDate, status) {
    const events = [];
    const date = new Date(invoiceDate);

    // 1. Received
    events.push({
        timestamp: format(subMinutes(date, 5), "yyyy-MM-dd HH:mm:02"),
        event: "Invoice Received via API (Fortnox)",
        user: "System",
        icon: "inbox"
    });

    // 2. OCR
    events.push({
        timestamp: format(date, "yyyy-MM-dd HH:mm:15"),
        event: "OCR Parsing & Data Extraction",
        user: "Valiflow OCR",
        icon: "scan"
    });

    // 3. AI Validation
    events.push({
        timestamp: format(addDays(date, 0), "yyyy-MM-dd HH:mm:45"),
        event: "AI Trust Layer Validation Check",
        user: "TrustEngine v5.2",
        icon: "shield"
    });

    if (status === "flagged") {
        events.push({
            timestamp: format(addDays(date, 0), "yyyy-MM-dd HH:01:20"),
            event: "Risk Alert Triggered: High deviation detected",
            user: "Risk Engine",
            icon: "alert"
        });
    } else {
        events.push({
            timestamp: format(addDays(date, 0), "yyyy-MM-dd HH:01:20"),
            event: "Validation Passed: Within thresholds",
            user: "Risk Engine",
            icon: "check"
        });
    }

    return events;
}

export function generateRandomInvoice(suppliers) {
    const supplier = randomItem(suppliers);
    const demoSupplier = DEMO_SUPPLIERS.find(s => s.name === supplier.name) || DEMO_SUPPLIERS[0];
    const isHighRisk = supplier.riskProfile === "high";

    const trustScore = isHighRisk
        ? randomInt(30, 60)
        : randomInt(75, 99);

    const riskScore = 100 - trustScore;

    const invoiceDate = subDays(new Date(), randomInt(1, 90));
    const dueDate = addDays(invoiceDate, 30);
    const total = randomInt(1200, 150000);

    let status = "approved";
    if (riskScore > 50) status = "flagged";
    else if (riskScore > 20) status = "needs_review";

    const id = generateId();

    return {
        id: id,
        invoiceId: id,
        supplierName: supplier.name,
        supplierFull: supplier.name,
        vatNumber: supplier.orgNr,
        orgNumber: supplier.orgNr,
        iban: demoSupplier.iban,

        total,
        currency: randomItem(CURRENCIES),

        invoiceDate: invoiceDate.toISOString(),
        dueDate: dueDate.toISOString(),
        createdAt: invoiceDate.toISOString(),

        status,
        flagged: status === "flagged",

        trustScore,
        riskScore,
        aiConfidence: randomInt(85, 99) / 100,

        aiSummary: isHighRisk
            ? "Låg trust-score baserat på leverantörens historik."
            : "Inga avvikelser upptäckta.",

        aiRecommendedAction: status === "flagged" ? "reject" : "approve",

        // Audit Fields
        costCenter: randomItem(COST_CENTERS),
        ocrStatus: randomInt(1, 10) > 1 ? "Matched" : "Review",
        documentQuality: randomInt(80, 100) / 100,
        supplierIntegrity: supplier.supplierIntegrity,
        networkInfluence: supplier.networkInfluence,

        auditTrail: generateAuditTrail(invoiceDate, status)
    };
}

export function generateFlaggedInvoices(suppliers) {
    const scenarios = [
        {
            reason: "Ändrade betalningsuppgifter",
            summary: "Bankgironummer avviker från tidigare 12 fakturor.",
            risk: 85,
        },
        {
            reason: "Avvikande belopp",
            summary: "Beloppet (450 000 SEK) är 300% högre än snittet för denna leverantör.",
            risk: 78,
        },
        {
            reason: "Ny leverantör låg integritet",
            summary: "Leverantör registrerad för 2 veckor sedan. Saknar F-skatt.",
            risk: 92,
        },
        {
            reason: "OCR Mismatch",
            summary: "OCR-numret matchar inte checksumma-validering.",
            risk: 65,
        },
        {
            reason: "Suspekt tidpunkt",
            summary: "Faktura skapad söndag natt (03:15). Avviker från mönster.",
            risk: 70,
        },
        {
            reason: "Villkorsavvikelse",
            summary: "Betalningsvillkor 7 dagar (normalt 30 dagar).",
            risk: 60,
        }
    ];

    return scenarios.map(scenario => {
        const base = generateRandomInvoice(suppliers);
        const auditEvents = generateAuditTrail(base.invoiceDate, "flagged");

        return {
            ...base,
            id: generateId(),
            status: "flagged",
            flagged: true,
            trustScore: 100 - scenario.risk,
            riskScore: scenario.risk,
            aiSummary: scenario.summary,
            aiReasons: [scenario.reason],
            aiRecommendedAction: "investigate",
            flagReason: scenario.reason,
            auditTrail: auditEvents
        };
    });
}
