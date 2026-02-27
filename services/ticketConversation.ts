import { authFetcher } from "@/lib/authFetcher";
import {
  TicketConversationListResponse,
  TicketConversationSendResponse,
} from "@/lib/types";

export const getTicketConversationList = async (ticketId: string) => {
  const response = await authFetcher<TicketConversationListResponse>(
    `/ticket-conversation/list?ticketId=${ticketId}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to load conversation.");
  }

  if (Array.isArray(response?.data)) return response.data;
  return response?.data?.result || [];
};

export const sendTicketConversationMessage = async (
  ticketId: string,
  message: string,
) => {
  const response = await authFetcher<TicketConversationSendResponse>(
    "/ticket-conversation/send",
    {
      method: "POST",
      body: { ticketId, message },
    },
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to send message.");
  }

  return response;
};

export const deleteTicketConversationMessage = async (messageId: string) => {
  const response = await authFetcher<{ status: string; message?: string }>(
    `/ticket-conversation/message/${messageId}`,
    {
      method: "DELETE",
    },
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to delete message.");
  }

  return response;
};
