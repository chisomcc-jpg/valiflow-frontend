
/**
 * MOCK DATA GENERATOR for QuickView
 * Ensures the UI never looks empty even if backend is missing data.
 */

export const getSmartMockContext = (invoice) => {
    // Generate deterministic but realistic "smart" data based on invoice ID
    const hash = (invoice?.id || 0) * 123;
    const isHighRisk = (invoice?.riskScore || 0) > 40;

    return {
        // 1. Context text for the summary area
        contextText: isHighRisk
            ? "Denna faktura avviker från det normala mönstret för leverantören."
            : `Baserat på 12 tidigare fakturor från denna leverantör och stabil betalningshistorik bedöms fakturan följa ett normalt mönster.`,

        // 2. Micro-trends
        trends: {
            trust: {
                direction: isHighRisk ? 'down' : 'up',
                label: isHighRisk ? 'Sjunkande trend' : 'Stadigt ökande',
                intent: isHighRisk ? 'bad' : 'good'
            },
            amount: {
                direction: 'neutral',
                label: 'Normal (±5%)',
                intent: 'neutral'
            }, // Or 'Avvikande' if needed
            supplier: {
                direction: 'neutral',
                label: 'Stabil aktivitet',
                intent: 'good'
            }
        },

        // 3. Historical Supplier Stats
        supplierStats: {
            totalInvoices: 12 + (hash % 50),
            deviations90d: isHighRisk ? 2 : 0,
            lastSeen: new Date().toLocaleDateString()
        },

        // 4. Recommendations
        recommendations: isHighRisk
            ? [
                { type: 'warning', text: "Verifiera att betalningsmottagarens bankgiro matchar tidigare fakturor.", subText: "Bankgirot har ändrats sedan förra fakturan." },
                { type: 'info', text: "Kontrollera referensperson.", subText: "Referensen matchar inte tidigare mönster." }
            ]
            : [
                { type: 'positive', text: "Inga åtgärder krävs.", subText: "Fakturan matchar historik och avtal." }
            ]
    };
};
