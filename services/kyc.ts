import { authFetcher } from "@/lib/authFetcher";

export const getKYC = async () => {
  try {
    const response = await authFetcher("/kyc/accesstoken");

    return response || null;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return null;
  }
};