import { authFetcher } from "@/lib/authFetcher";
import {
  PromotionItem,
  PromotionListResponse,
  VerifyPromotionResponse,
} from "@/lib/types";

export const getPromotionList = async (): Promise<PromotionItem[]> => {
  try {
    const response =
      await authFetcher<PromotionListResponse>("/promotion/list");
    const result = response?.data?.result;
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

export const verifyPromotion = async (
  promoCode: string,
): Promise<PromotionItem> => {
  const response = await authFetcher<VerifyPromotionResponse>(
    "/promotion/verify",
    {
      method: "POST",
      body: { promoCode },
    },
  );

  if (response?.status !== "success" || !response?.data) {
    throw new Error(response?.message || "Failed to verify promotion.");
  }

  return response.data;
};
