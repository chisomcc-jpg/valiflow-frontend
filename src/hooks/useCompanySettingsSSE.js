import { useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function useCompanySettingsSSE(companyId, onUpdate) {
    const eventSourceRef = useRef(null);

    useEffect(() => {
        if (!companyId) return;

        const token = localStorage.getItem("token");
        const url = `${API_URL}/api/company/${companyId}/stream?token=${token}`;

        console.log(`📡 Connecting to Company SSE: ${url}`);
        const es = new EventSource(url, { withCredentials: true });
        eventSourceRef.current = es;

        es.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // "heartbeat" or actual data
                if (data.type === 'heartbeat') return;

                if (onUpdate) onUpdate(data);
            } catch (err) {
                console.error("Company SSE parse error", err);
            }
        };

        es.onerror = (err) => {
            console.error("Company SSE error", err);
            es.close();
        };

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, [companyId, onUpdate]);
}
