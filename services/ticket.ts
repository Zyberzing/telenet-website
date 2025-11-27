import { authFetcher } from "@/lib/authFetcher";
import { CreateTicketInput, Ticket, UpdateTicketInput } from "@/lib/types";

export interface TicketFilters {
  page?: number;
  limit?: number;
  search?: string;
  date: string;
  priority: "low" | "medium" | "high";
  status: "open" | "pending" | "closed";
}

export const crateTicket = async (body: CreateTicketInput): Promise<any> => {
  const response = await authFetcher<{ status: string; message: string }>(
    "/ticket/create",
    {
      method: "POST",
      body,
    }
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to create ticket.");
  }

  return response;
};

export const getTickets = async (params: TicketFilters) => {
  const searchParams = new URLSearchParams(params as any);

  const response = await authFetcher<{
    status: string;
    data: { result: Ticket[]; pagination: any };
  }>(`/ticket/list?${searchParams.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (response?.status !== "success") {
    throw new Error("Failed to load tickets");
  }

  // ⬅ RETURN ONLY THE ARRAY
  return response.data.result;
};

export const getTicketById = async (id: string) => {
  const response = await authFetcher<{ status: string; data: Ticket }>(
    `/ticket/ticket-details/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (response?.status !== "success") {
    throw new Error("Failed to load ticket");
  }

  return response.data;
};

export const updateTicket = async (body: UpdateTicketInput) => {
  const response = await authFetcher<{ status: string; message: string }>(
    `/ticket/update ticket`,
    {
      method: "PUT",
      body,
    }
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to update ticket.");
  }

  return response;
};
