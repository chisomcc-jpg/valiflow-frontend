export const STORY_SCRIPT = {
    // CHAPTER 1: ARRIVAL
    // Triggered when landing on Overview
    arrival: {
        id: "arrival",
        title: "Välkommen till Valiflow",
        text: "Detta är en interaktiv demonstration. All data du ser är simulerad för att visa hur systemet skyddar mot finansiella risker.",
        actionText: "Starta genomgång",
        skipText: "Hoppa över",
        position: "top-center", // Overlay card
        nextPath: "/demo/company/invoices" // Auto-navigate
    },

    // CHAPTER 2: THE ANOMALY
    // Triggered on Invoices page, pointing to the specific risky invoice
    anomaly: {
        id: "anomaly",
        title: "Avvikelse identifierad",
        text: "Valiflow har flaggat denna faktura. Vid en första anblick ser den korrekt ut, men systemet har upptäckt mönsteravvikelser.",
        targetSelector: "[data-story-target='invoice-row-INV-2024-002']",
        position: "bottom-start", // Tooltip relative to target
        actionText: "Vad har hänt?",
        allowClickThrough: true // Allow user to click the row
    },

    // CHAPTER 3: THE INSIGHT
    // Triggered when Quick View opens
    insight: {
        id: "insight",
        title: "Analys i realtid",
        text: "Valiflow jämför fakturan mot historik och betalningsdata. Här ser du exakt varför den flaggades.",
        targetSelector: "[data-story-target='analysis-section']",
        position: "right-start",
        actionText: "Nästa steg"
    },

    // CHAPTER 4: THE ACTION
    // Triggered after reading insight
    action: {
        id: "action",
        title: "Rekommenderad åtgärd",
        text: "De flesta ekonomichefer väljer här att verifiera uppgifterna eller pausa betalningen. Systemet ger dig beslutsstöd direkt.",
        targetSelector: "[data-story-target='action-section']",
        position: "top-start",
        actionText: "Avsluta rundtur"
    }
};
