export const demoAuditLogs = [
    // TYPE B: Human Decision (Rejection)
    {
        id: "LOG-001",
        date: "2024-05-22 14:35",
        type: "BESLUT (MÄNSKLIGT)",
        invoiceId: "INV-2024-004",
        supplier: "Unknown Supplier Ltd",
        user: "Sara Lindberg (CFO)",
        role: "CFO",
        description: "Avvisad efter manuell granskning.",
        comment: "Bankuppgifter kunde inte verifieras med leverantören. Utredning krävs.",
        action: "rejected", // Red dot
        category: "human_decision"
    },
    // TYPE A: System Signal (Preceding the rejection)
    {
        id: "LOG-002",
        date: "2024-05-22 14:10",
        type: "SYSTEMINDIKATION",
        invoiceId: "INV-2024-004",
        supplier: "Unknown Supplier Ltd",
        user: "System (Valiflow)",
        role: "System",
        description: "Systemet identifierade avvikande betalningsinformation (nytt bankgiro).",
        action: "flagged", // Yellow dot
        category: "system_signal"
    },
    // TYPE C: Routine Approval
    {
        id: "LOG-003",
        date: "2024-05-22 11:45",
        type: "GODKÄNNANDE",
        invoiceId: "INV-2024-005",
        supplier: "Office Depot",
        user: "Johan Ek",
        role: "Ekonomiassistent",
        description: "Faktura attesterad för betalning. Matchar avtalade villkor.",
        action: "approved", // Green dot
        category: "routine"
    },
    // TYPE B: Human Decision (Override/Approval after review)
    {
        id: "LOG-004",
        date: "2024-05-21 16:20",
        type: "BESLUT (MÄNSKLIGT)",
        invoiceId: "INV-2024-002",
        supplier: "Konsultbolaget AB",
        user: "Sara Lindberg (CFO)",
        role: "CFO",
        description: "Godkänd trots systemindikation.",
        comment: "Bankgirot verifierat manuellt via telefonkontakt med leverantör.",
        action: "approved_with_comment", // Green dot with icon
        category: "human_decision"
    },
    // TYPE A: System Signal
    {
        id: "LOG-005",
        date: "2024-05-21 09:00",
        type: "SYSTEMINDIKATION",
        invoiceId: "INV-2024-002",
        supplier: "Konsultbolaget AB",
        user: "System (Valiflow)",
        role: "System",
        description: "Avvikande betalningsmottagare detekterad.",
        action: "flagged",
        category: "system_signal"
    },
    // TYPE C: Routine
    {
        id: "LOG-006",
        date: "2024-05-20 13:00",
        type: "GODKÄNNANDE",
        invoiceId: "INV-2024-001",
        supplier: "Tele2 Sverige AB",
        user: "Johan Ek",
        role: "Ekonomiassistent",
        description: "Faktura attesterad. Inga avvikelser.",
        action: "approved",
        category: "routine"
    },
    // TYPE A: System Signal (Pending)
    {
        id: "LOG-007",
        date: "2024-05-20 08:30",
        type: "SYSTEMINDIKATION",
        invoiceId: "INV-2024-003",
        supplier: "New Corp Inc",
        user: "System (Valiflow)",
        role: "System",
        description: "Faktura kräver granskning (första faktura från leverantör).",
        action: "flagged",
        category: "system_signal"
    }
];
