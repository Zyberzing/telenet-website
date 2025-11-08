import { Plan } from "@/app/[locale]/(main)/my-plans/MyPlansClient";
import { Order } from "@/app/[locale]/(main)/order-billing/OrderBilling";
import { orderDetails } from "@/app/[locale]/(main)/plans/Plans";
import { authFetcher } from "@/lib/authFetcher";

export const createOrder = async (body: orderDetails): Promise<any> => {
  const response = await authFetcher<{ status: string; message: string }>(
    "/order/create-order",
    {
      method: "POST",
      body,
    }
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to create order");
  }

  return response;
};

export const getOrderList = async (): Promise<Order | null> => {
  try {
    const response = await authFetcher<{ data: Order }>("/order/list");
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching order list:", error);
    return null;
  }
};

export const getMyPlans = async ({
  page,
  limit,
}: {
  page: string;
  limit: string;
}): Promise<Plan | null> => {
  try {
    const response = await authFetcher<{ data: Plan }>(
      `/order/my-plans?page=${page}&limit=${limit}`
    );
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching my plans:", error);
    return null;
  }
};
