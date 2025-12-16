
// src/hooks/useBureauSSE.ts
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const SSE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function useBureauSSE(agencyId: number | undefined) {
    const [bureauEvents, setBureauEvents] = useState<any>(null);
    const { token } = useAuth();

    useEffect(() => {
        if (!agencyId || !token) return;

        // Bureau Channel
        const eventSource = new EventSource(`${SSE_URL}/sse/agency/${agencyId}?token=${token}`);

        eventSource.addEventListener("agency_summary_updated", (e) => {
            setBureauEvents({ type: "summary", data: JSON.parse(e.data) });
        });

        eventSource.addEventListener("risk_alert", (e) => {
            setBureauEvents({ type: "risk", data: JSON.parse(e.data) });
        });

        /* Team Events */
        eventSource.addEventListener("user_updated", (e) => setBureauEvents({ type: "team_update", data: JSON.parse(e.data) }));
        eventSource.addEventListener("role_updated", (e) => setBureauEvents({ type: "role_update", data: JSON.parse(e.data) }));
        eventSource.addEventListener("access_changed", (e) => setBureauEvents({ type: "access_update", data: JSON.parse(e.data) }));
        eventSource.addEventListener("auditlog_new", (e) => setBureauEvents({ type: "audit_new", data: JSON.parse(e.data) }));

        return () => eventSource.close();
    }, [agencyId, token]);

    return { bureauEvents };
}
