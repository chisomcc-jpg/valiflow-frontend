// --------------------------------------------------------------
// Valiflow Frontend Notifications Service v1.0
// TopNavbar + Global/Bureau notifications
// --------------------------------------------------------------

import { api } from "./api";

/* ============================================================================
   Typer baserat på backend structure
============================================================================ */

export interface NotificationItem {
  id: number;
  type: "critical" | "warning" | "success" | "info" | string;
  message: string;
  time?: string;       // finns i mock
  createdAt?: string;  // finns i DB-versionen
  read: boolean;
}

/* ============================================================================
   GET /api/notifications   (hämtar senaste notiserna)
============================================================================ */

export async function getNotifications(
  limit: number = 10
): Promise<NotificationItem[]> {
  const res = await api.get("/notifications", {
    params: { limit },
  });
  return res.data;
}

/* ============================================================================
   PATCH /api/notifications/:id/read
============================================================================ */

export async function markNotificationAsRead(
  id: number
): Promise<NotificationItem> {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
}

/* ============================================================================
   Hjälpfunktion: Markera alla som lästa (frontend-loop)
============================================================================ */

export async function markAllAsRead(
  items: NotificationItem[]
): Promise<void> {
  const unread = items.filter((n) => !n.read);
  await Promise.all(unread.map((n) => markNotificationAsRead(n.id)));
}
