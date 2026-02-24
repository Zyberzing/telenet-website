import { authFetcher } from "@/lib/authFetcher";
import { fetcher } from "@/lib/fetcher";
import { KycOtpTokens, ManualKycSubmitPayload } from "@/lib/types";

const toBearer = (token?: string) => {
  if (!token) return "";
  return /^Bearer\s+/i.test(token) ? token : `Bearer ${token}`;
};

export const getKYC = async (tokens?: KycOtpTokens) => {
  try {
    if (tokens?.accessToken) {
      const response = await fetcher("/kyc/accesstoken", {
        method: "GET",
        headers: {
          Authorization: toBearer(tokens.accessToken),
          ...(tokens.refreshToken
            ? { "x-refresh-token": toBearer(tokens.refreshToken) }
            : {}),
        },
      });
      return response || null;
    }

    const response = await authFetcher("/kyc/accesstoken");

    return response || null;
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const submitManualKyc = async (body: ManualKycSubmitPayload) => {
  try {
    const response = await authFetcher<{ status: string; message: string }>(
      "/kyc/manual-submit",
      {
        method: "POST",
        body,
      },
    );
    console.log("Manual KYC submission response:", response);
    if (response?.status !== "success") {
      throw new Error(response?.message || "Failed to submit manual KYC.");
    }
    console.log("Manual KYC submission response:", response);
    return response;
  } catch (error: any) {
    console.error("Error submitting manual KYC:", error);
    throw new Error(error?.message || "Failed to submit manual KYC.");
  }
};

export const submitManualKycWithToken = async (
  body: ManualKycSubmitPayload,
  tokens: KycOtpTokens,
) => {
  try {
    const response = await fetcher<{ status: string; message: string }>(
      "/kyc/manual-submit",
      {
        method: "POST",
        body,
        headers: {
          Authorization: toBearer(tokens.accessToken),
          ...(tokens.refreshToken
            ? { "x-refresh-token": toBearer(tokens.refreshToken) }
            : {}),
        },
      },
    );

    if (response?.status !== "success") {
      throw new Error(response?.message || "Failed to submit manual KYC.");
    }

    return response;
  } catch (error: any) {
    console.error("Error submitting manual KYC:", error);
    throw new Error(error?.message || "Failed to submit manual KYC.");
  }
};