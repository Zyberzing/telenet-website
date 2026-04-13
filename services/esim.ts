import { EsimDetailsResponse, EsimListResponse } from "@/lib/types";
import { authFetcher } from "@/lib/authFetcher";

export const getMyEsimList = async (
  page = 1,
  limit = 10,
): Promise<EsimListResponse["data"] | null> => {
  try {
    const response = await authFetcher<EsimListResponse>(
      `/esim-information/my-list?page=${page}&limit=${limit}`,
    );
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching my eSIM list:", error);
    return null;
  }
};

export const getEsimDetails = async (
  orderId: string,
): Promise<EsimDetailsResponse["data"] | null> => {
  try {
    const response = await authFetcher<EsimDetailsResponse>(
      `/esim-information/details/${orderId}`,
    );
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching eSIM details:", error);
    return null;
  }
};
