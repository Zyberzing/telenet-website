import { authFetcher } from "@/lib/authFetcher";
import { PromotionItem, PromotionListResponse } from "@/lib/types";

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
