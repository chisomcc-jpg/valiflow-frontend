
// src/hooks/useAIJobsSSE.ts
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const SSE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/**
 * Hook for Superadmins to watch AI Job Queues in realtime
 */
export function useAIJobsSSE() {
    const [queueStats, setQueueStats] = useState<any>(null);
    const { token } = useAuth();

    useEffect(() => {
        if (!token) return;

        // Admin channel
        const eventSource = new EventSource(`${SSE_URL}/sse/admin/jobs?token=${token}`);

        eventSource.addEventListener("queue_update", (e) => {
            setQueueStats(JSON.parse(e.data));
        });

        return () => eventSource.close();
    }, [token]);

    return { queueStats };
}
