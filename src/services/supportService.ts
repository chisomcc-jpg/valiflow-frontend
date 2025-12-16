// src/services/supportService.ts
import api from "./api";

/**
 * Types
 */
export type SupportTicketStatus =
  | "open"
  | "pending"
  | "resolved"
  | "closed"
  | string;

export interface CreateTicketPayload {
  subject?: string;
  message: string;
  category?: string;
  priority?: string;
}

export interface AiMessageContext {
  [key: string]: unknown;
}

/**
 * API calls
 */
export const getTickets = async () => {
  const response = await api.get("/support/tickets");
  return response.data;
};

export const createTicket = async (data: CreateTicketPayload) => {
  const response = await api.post("/support/tickets", data);
  return response.data;
};

export const getTicketById = async (id: string | number) => {
  const response = await api.get(`/support/tickets/${id}`);
  return response.data;
};

export const addMessage = async (
  id: string | number,
  message: string
) => {
  const response = await api.post(
    `/support/tickets/${id}/messages`,
    { message }
  );
  return response.data;
};

export const updateTicketStatus = async (
  id: string | number,
  status: SupportTicketStatus
) => {
  const response = await api.patch(
    `/support/tickets/${id}`,
    { status }
  );
  return response.data;
};

export const sendAiMessage = async (
  message: string,
  context: AiMessageContext = {}
) => {
  const response = await api.post("/support/ai", {
    message,
    context,
  });
  return response.data;
};
