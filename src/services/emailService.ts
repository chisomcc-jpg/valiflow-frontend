// src/services/emailService.ts

export interface EmailItem {
  id: string;
  from: string;
  subject: string;
  date: string;
  status: "processed" | "pending";
}

/**
 * Hämtar alla inkommande e-post från backend.
 * Backend-endpoint: GET /api/email/inbox
 */
export async function fetchEmails(): Promise<EmailItem[]> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/email/inbox`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) {
    console.error("Email fetch failed:", res.status, res.statusText);
    throw new Error("Failed to fetch emails");
  }

  return res.json();
}
