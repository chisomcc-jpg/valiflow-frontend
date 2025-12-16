
// src/hooks/useCompanyKpiSSE.ts
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const SSE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function useCompanyKpiSSE(companyId: number | undefined) {
    const [summary, setSummary] = useState<any>(null);
    const { token } = useAuth();

    useEffect(() => {
        if (!companyId || !token) return;

        const token = localStorage.getItem("token");

        const url = token
            ? `${SSE_URL}/api/company/${companyId}/stream?token=${encodeURIComponent(token)}`
            : `${SSE_URL}/api/company/${companyId}/stream`;

        const eventSource = new EventSource(url);

        eventSource.addEventListener("company_summary_updated", (e) => {
            const data = JSON.parse(e.data);
            setSummary(data);
        });

        return () => eventSource.close();
    }, [companyId, token]);

    return { summary };
}
