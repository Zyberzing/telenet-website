import { orderDetails } from "@/app/[locale]/(main)/plans/Plans";
import { authFetcher } from "@/lib/authFetcher";

export const crateCheckout = async (body: orderDetails): Promise<any> => {
  const response = await authFetcher<{ status: string; message: string }>(
    "/payment/create-checkout-session",
    {
      method: "POST",
      body,
    }
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to checkout session.");
  }

  return response;
};
