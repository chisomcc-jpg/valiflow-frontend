// src/demo/integrationsMock.js

export const MOCK_INTEGRATIONS = {
    recommendation: {
        text: "Rekommenderad integration: Fortnox — bäst för företag av denna storlek.",
        providerId: "fortnox",
        confidence: 0.95
    },
    providers: [
        {
            id: 'fortnox',
            name: 'Fortnox',
            description: 'Marknadsledande bokföringssystem för svenska företag.',
            category: 'ERP',
            logo: '/logos/fortnox.png', // Ensure this exists or use placeholder
            connected: true,
            status: 'active', // active, error, setup_required
            capabilities: [
                "Realtidsimport av leverantörsfakturor",
                "Synk av leverantörsregister",
                "Automatiserad metadata-verifiering",
                "Automatisk bokföring av verifikat"
            ],
            sync: {
                lastSync: new Date(new Date().setHours(new Date().getHours() - 1)).toISOString(),
                invoicesToday: 12,
                flaggedInvoices: 1,
                supplierChanges: 0,
                status: "OK"
            },
            permissions: {
                canReadInvoices: true,
                canWriteInvoices: false,
                canAccessSuppliers: true,
                notes: ["Valiflow ändrar aldrig bokföring", "Läser endast leverantörsdata"]
            },
            troubleshooting: null // No error
        },
        {
            id: 'visma',
            name: 'Visma eAccounting',
            description: 'Smart bokföring online för små och medelstora företag.',
            category: 'ERP',
            logo: '/logos/visma.png',
            connected: false,
            status: 'setup_required',
            capabilities: [
                "Automatisk fakturauppfångning",
                "Synk av leverantörsregister",
                "Stöd för Visma Utlägg"
            ],
            sync: null,
            permissions: null,
            troubleshooting: null
        },
        {
            id: 'microsoft',
            name: 'Microsoft Business Central',
            description: 'Heltäckande affärssystem för växande företag.',
            category: 'ERP',
            logo: '/logos/microsoft.png',
            connected: true,
            status: 'error',
            capabilities: [
                "Full ERP-koppling",
                "Kontoplan och konteringsunderlag",
                "Realtidsinläsning"
            ],
            sync: {
                lastSync: new Date(new Date().setHours(new Date().getHours() - 24)).toISOString(),
                invoicesToday: 0,
                flaggedInvoices: 0,
                supplierChanges: 0,
                status: "Error"
            },
            permissions: {
                canReadInvoices: true,
                canWriteInvoices: true,
                canAccessSuppliers: true,
                notes: ["Kräver 'Financials.ReadWrite.All' scope", "Valiflow loggar alla ändringar"]
            },
            troubleshooting: {
                errorMessage: "Token har löpt ut. Vänligen logga in igen.",
                suggestion: "Din session med Microsoft har gått ut. Du behöver återansluta för att fortsätta synka.",
                reconnectUrl: "/api/integrations/microsoft/auth"
            }
        },
        {
            id: 'gmail',
            name: 'Gmail',
            description: 'Anslut er inbox (ekonomi@) för automatisk scanning.',
            category: 'Email',
            logo: '/logos/gmail.png',
            connected: true,
            status: 'active',
            capabilities: [
                "Inbox scanning",
                "Automatisk fakturauppfångning",
                "AI-baserad PDF-tolkning"
            ],
            sync: {
                lastSync: new Date().toISOString(),
                invoicesToday: 45,
                flaggedInvoices: 3,
                supplierChanges: 0,
                status: "OK"
            },
            permissions: {
                canReadInvoices: true,
                canWriteInvoices: false,
                canAccessSuppliers: false,
                notes: ["Läser endast mail med bifogade PDF:er", "Sparar inga andra mail"]
            },
            troubleshooting: null
        }
    ]
};
