// src/demo/demoEngine.js
import { generateDemoSuppliers, generateRandomInvoice } from "./demoDataGenerator";

/**
 * Enhanced Demo Engine for "Interactive Trust Engine" Demo
 * Simulates:
 * 1. File Upload
 * 2. Parsing (Staggered field extraction)
 * 3. Analyzing (Risk checks)
 * 4. Completion (Trust Score)
 */

class DemoEngine {
    constructor() {
        this.listeners = new Set();
        this.state = this.getInitialState();
        this.timers = []; // Track timers to clear on reset
    }

    getInitialState() {
        const suppliers = generateDemoSuppliers();
        // Generate pre-existing invoices
        const existingInvoices = Array.from({ length: 15 }, () => generateRandomInvoice(suppliers));
        const allInvoices = existingInvoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return {
            suppliers,
            invoices: allInvoices,
            stats: this.calculateStats(allInvoices),
            riskEvents: this.generateRiskEvents(allInvoices.filter(i => i.flagged)),
            uploadModalOpen: false,
            uploadingFiles: [], // Files selected for upload
            isAnalyzing: false, // Global flag
            analysisProgress: 0,
            simulatedInvoices: [], // Invoices currently being processed
        };
    }

    calculateStats(invoices) {
        return {
            totalCount: invoices.length,
            flaggedCount: invoices.filter(i => i.flagged).length,
            approvedCount: invoices.filter(i => i.status === "approved").length,
            reviewCount: invoices.filter(i => i.status === "needs_review").length,
            avgTrust: Math.round(invoices.reduce((acc, i) => acc + i.trustScore, 0) / (invoices.length || 1)),
            riskDistribution: {
                low: invoices.filter(i => i.riskScore < 20).length,
                medium: invoices.filter(i => i.riskScore >= 20 && i.riskScore < 70).length,
                high: invoices.filter(i => i.riskScore >= 70).length,
            },
            financialExposure: invoices
                .filter(i => i.status === 'flagged' || i.riskScore > 70)
                .reduce((sum, i) => sum + i.total, 0)
        };
    }

    generateRiskEvents(flaggedInvoices) {
        return flaggedInvoices.slice(0, 5).map(inv => ({
            id: inv.id,
            type: "alert",
            message: inv.aiSummary,
            date: inv.createdAt,
            severity: inv.riskScore > 80 ? "critical" : "warning",
        }));
    }



    // --- CORE ACTIONS ---

    // 1. Open Upload Modal
    openUpload() {
        this.updateState({ uploadModalOpen: true });
    }

    closeUpload() {
        this.updateState({ uploadModalOpen: false });
    }

    // 2. Select Files (Trigger Pipeline)
    startUploadSimulation(exampleData = false) {
        // Create 3-5 mock invoices but treat them as "files" initially
        const count = exampleData ? 4 : 1;
        const newMockInvoices = Array.from({ length: count }, () => {
            const inv = generateRandomInvoice(this.state.suppliers);
            inv.id = `demo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            inv.status = 'uploading'; // Custom demo status
            inv.pipelineStage = 'queued'; // queued | parsing | analyzing | complete
            inv.parsedFields = {}; // Fields appear one by one
            return inv;
        });

        this.updateState({
            uploadingFiles: newMockInvoices,
            isAnalyzing: true
        });

        // Auto-start immediately (100ms) for snappy feel
        this.addTimer(() => {
            this.processBatch(newMockInvoices);
        }, 100);
    }

    // 3. Process Batch (The Pipeline)
    processBatch(invoices) {
        // Move from Upload Modal to Main Table immediately
        // BUT they are in "Mottagen" / "Parsing" state

        const processingInvoices = invoices.map(inv => ({
            ...inv,
            status: 'processing',
            pipelineStage: 'parsing',
            progress: 0
        }));

        this.updateState({
            uploadModalOpen: false, // Close modal, show table
            uploadingFiles: [],
            // Prepend to main list
            invoices: [...processingInvoices, ...this.state.invoices]
        });

        // Start processing each invoice with staggered start times
        processingInvoices.forEach((inv, idx) => {
            this.addTimer(() => {
                this.simulateInvoiceLifecycle(inv.id);
            }, idx * 1200); // 1.2s delay between each start
        });
    }

    // 4. Simulate Single Invoice Lifecycle
    simulateInvoiceLifecycle(invoiceId) {
        // A. PARSING STAGE (2-3s)
        // Fields pop in: Supplier -> Date -> Amount -> OCR
        const fields = ['supplierName', 'invoiceDate', 'total', 'ocr'];
        let step = 0;

        const parseInterval = setInterval(() => {
            step++;
            const currentField = fields[step - 1];

            this.updateInvoice(invoiceId, (inv) => ({
                pipelineStage: 'parsing',
                // Reveal the real value for this field
                [currentField]: inv[currentField] // In reality we'd un-hide it, but here we assume UI hides if stage < parsing? 
                // Actually easier: We use a 'parsedFields' set in the invoice object
                // parsedFields: { ...inv.parsedFields, [currentField]: true }
            }));

            if (step >= fields.length) {
                clearInterval(parseInterval);
                // Move to Analyzing
                this.updateInvoice(invoiceId, { pipelineStage: 'analyzing' });
                this.addTimer(() => this.finishAnalysis(invoiceId), 4000); // 4s Analysis
            }
        }, 500);
        this.timers.push({ clear: () => clearInterval(parseInterval) });
    }

    // B. FINISH ANALYSIS
    finishAnalysis(invoiceId) {
        this.updateInvoice(invoiceId, (inv) => {
            // Determine result based on random chance or pre-set data
            const isFlagged = Math.random() > 0.8;
            return {
                status: isFlagged ? 'flagged' : 'approved',
                pipelineStage: 'complete',
                flagged: isFlagged,
                trustScore: isFlagged ? 45 : 95
            };
        });
    }

    // --- HELPERS ---

    updateInvoice(id, updates) {
        const newInvoices = this.state.invoices.map(inv => {
            if (inv.id === id) {
                const newValues = typeof updates === 'function' ? updates(inv) : updates;
                return { ...inv, ...newValues };
            }
            return inv;
        });
        this.updateState({ invoices: newInvoices });
    }

    updateState(partial) {
        this.state = { ...this.state, ...partial };
        this.notify();
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify() {
        this.listeners.forEach(l => l(this.state));
    }

    addTimer(fn, delay) {
        const t = setTimeout(fn, delay);
        this.timers.push({ clear: () => clearTimeout(t) });
    }

    reset() {
        this.timers.forEach(t => t.clear());
        this.timers = [];
        this.state = this.getInitialState();
        this.notify();
    }
}

export const demoEngine = new DemoEngine();

