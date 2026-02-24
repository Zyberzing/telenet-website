import { authFetcher } from "@/lib/authFetcher";
import { fetcher } from "@/lib/fetcher";
import { UploadOtpTokens } from "@/lib/types";

const toBearer = (token?: string) => {
  if (!token) return "";
  return /^Bearer\s+/i.test(token) ? token : `Bearer ${token}`;
};

export const uploadMedia = async (body: FormData): Promise<any> => {
  const response = await authFetcher<{ status: string; message: string }>(
    "/upload/media",
    {
      method: "POST",
      body,
    },
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to upload media.");
  }

  return response;
};

export const uploadPublicMedia = async (
  body: FormData,
  tokens?: UploadOtpTokens,
): Promise<any> => {
  const response = tokens?.accessToken
    ? await fetcher<{ status: string; message: string }>(
        "/upload/public-media",
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
      )
    : await authFetcher<{ status: string; message: string }>(
        "/upload/public-media",
        {
          method: "POST",
          body,
        },
      );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to upload media.");
  }

  return response;
};
