import { Plan } from "@/app/[locale]/(main)/my-plans/MyPlansClient";
import { authFetcher } from "@/lib/authFetcher";
import {
  DashboardSummaryResponse,
  GetOrderListApiResponse,
  orderDetails,
  OrderListFilters,
  RenewalListFilters,
  RenewPlanPayload,
} from "@/lib/types";

export const createOrder = async (body: orderDetails): Promise<any> => {
  const response = await authFetcher<{ status: string; message: string }>(
    "/order/create-order",
    {
      method: "POST",
      body,
    },
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to create order");
  }

  return response;
};

export const getOrderList = async (
  page = 1,
  limit = 5,
  filters: OrderListFilters = {},
): Promise<GetOrderListApiResponse["data"] | null> => {
  try {
    const searchParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      searchParams.set(key, String(value));
    });

    const response = await authFetcher<GetOrderListApiResponse>(
      `/order/list?${searchParams.toString()}`,
    );

    return response?.data || null;
  } catch (error) {
    console.error("Error fetching order list:", error);
    return null;
  }
};

export const getMyPlans = async ({
  page,
  limit,
  status
}: {
  page: string;
  limit: string;
  status?: string;
}): Promise<Plan | null> => {
  try {
    const response = await authFetcher<{ data: Plan }>(
      `/order/my-plans?page=${page}&limit=${limit}&status=${status || ""}`,
    );
    return response?.data || null;
  } catch (error) {
    return null;
  }
};

export const getOrderDashboardSummary = async () => {
  try {
    const response = await authFetcher<DashboardSummaryResponse>(
      "/order-dashboard/summary",
    );
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return null;
  }
};

export const getRenewalList = async (
  page = 1,
  limit = 9,
  filters: RenewalListFilters = {},
): Promise<GetOrderListApiResponse["data"] | null> => {
  try {
    const searchParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      searchParams.set(key, String(value));
    });

    const response = await authFetcher<GetOrderListApiResponse>(
      `/order/renewal-list?${searchParams.toString()}`,
    );

    return response?.data || null;
  } catch (error) {
    console.error("Error fetching renewal list:", error);
    return null;
  }
};

export const createRenewPlan = async (
  body: RenewPlanPayload,
): Promise<any> => {
  const response = await authFetcher<{ status: string; message: string }>(
    "/order/renew-plan",
    {
      method: "POST",
      body,
    },
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to renew plan");
  }

  return response;
};
