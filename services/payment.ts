import { authFetcher } from "@/lib/authFetcher";
import { orderDetails } from "@/lib/types";

export const createCheckout = async (body: orderDetails): Promise<any> => {
  const response = await authFetcher<{ status: string; message: string }>(
    "/payment/create-checkout-session",
    {
      method: "POST",
      body,
    },
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to checkout session.");
  }

  return response;
};
