
// src/services/scanningService.ts
import { api } from "./api";

/**
 * Service to handle the "Scan Theatre" experience.
 * Handles file uploads and polls for initial status if SSE isn't immediate.
 */
export const scanningService = {
    /**
     * Upload multiple invoice files
     */
    async uploadInvoices(files: File[], companyId: number) {
        // Backend handles single file at /api/invoices/scan
        const results = await Promise.all(files.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file); // key must be 'file'
            // companyId is inferred from token context usually, but can be ignored if backend doesn't use it from body

            const response = await api.post("/invoices/scan", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        }));
        return { uploaded: results };
    },

    /**
     * Poll status for a batch of invoices (fallback if SSE not used)
     */
    async checkBatchStatus(batchId: string) {
        const response = await api.get(`/invoices/batch/${batchId}/status`);
        return response.data;
    }
};
