import { Plan } from "@/app/[locale]/(main)/my-plans/MyPlansClient";
import { authFetcher } from "@/lib/authFetcher";
import { GetOrderListApiResponse, orderDetails } from "@/lib/types";

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
): Promise<GetOrderListApiResponse["data"] | null> => {
  try {
    const response = await authFetcher<GetOrderListApiResponse>(
      `/order/list?page=${page}&limit=${limit}`,
    );
    console.log("API PAGE:", page, response.data.pagination); // 👈 ADD THIS

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
      `/order/my-plans?page=${page}&limit=${limit}`,
    );
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching my plans:", error);
    return null;
  }
};
