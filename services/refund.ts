import { authFetcher } from "@/lib/authFetcher";
import { Refund, RefundResponseData } from "@/lib/types";

export const createRefund = async (body: Refund): Promise<any> => {
  const response = await authFetcher<{
    status: string;
    message: string;
    data?: RefundResponseData;
  }>(
    "/refund/request-refund",
    {
      method: "POST",
      body,
    }
  );
  if (response?.status !== "success") {
    console.error("Refund error:", response?.message);
    throw new Error(response?.message || "Failed to create refund.");
  }

  return response;
};
