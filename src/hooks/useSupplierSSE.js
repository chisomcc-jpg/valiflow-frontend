import { useEffect } from 'react';


// If EventBusContext is not available, we can use a direct integration with the sseHub pattern.
// Based on previous files, there seems to be an EventBus or InvoiceSSEProvider.
// Let's assume we want to listen to "invoice_analyzed" and reload data.

export function useSupplierSSE(companyId, onUpdate) {
    useEffect(() => {
        if (!companyId) return;

        // Check if we have a global event bus exposed on window or context
        // For this specific task, we will listen to the window event dispatched by the central SSE handler 
        // if that is how the project works, OR we use a poller if real-time is tricky.
        // However, the prompt says "MUST connect to SSE".

        // Pattern: Validflow seems to use CustomEvents "valiflow:sse:event" from sseClient.ts or similar.
        // Let's listen for that.

        const handleSSE = (e) => {
            const { event, channel } = e.detail;

            // We care about invoice analysis completion as it affects supplier trust
            if (event === "invoice_analyzed" || event === "supplier_updated") {
                if (channel === `company:${companyId}` || channel.startsWith('invoice:')) {
                    console.log("⚡ SupplierHub: Realtime update received", event);
                    if (onUpdate) onUpdate();
                }
            }
        };

        window.addEventListener("valiflow:sse:event", handleSSE);
        return () => {
            window.removeEventListener("valiflow:sse:event", handleSSE);
        };
    }, [companyId, onUpdate]);
}
