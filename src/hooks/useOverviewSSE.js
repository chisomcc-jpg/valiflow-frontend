import { useEffect } from 'react';

export function useOverviewSSE(companyId, onUpdate) {
    useEffect(() => {
        if (!companyId) return;

        // Listen to global SSE events dispatched by sseClient or similar system
        const handleSSE = (e) => {
            const { event, channel } = e.detail;

            // Events that should trigger a dashboard refresh
            const relevantEvents = [
                "invoice_ingested",
                "invoice_analyzed",
                "supplier_updated",
                "fraud_detected",
                "summary_updated"
            ];

            // Check if event is relevant and for this company/user context
            if (relevantEvents.includes(event)) {
                // Basic filtering: Check if channel matches or if it's a broadcast
                // Assuming channel format "company:{id}" or "invoice:{id}" or "user:{id}"
                // We'll rely on the fact that if we receive it, it's likely for us via the established connection.
                console.log("⚡ Overview: Realtime update received", event);
                if (onUpdate) onUpdate(event);
            }
        };

        window.addEventListener("valiflow:sse:event", handleSSE);
        return () => {
            window.removeEventListener("valiflow:sse:event", handleSSE);
        };
    }, [companyId, onUpdate]);
}
