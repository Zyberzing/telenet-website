import { authFetcher } from "@/lib/authFetcher";

export const uploadMedia = async (body: FormData): Promise<any> => {
  const response = await authFetcher<{ status: string; message: string }>(
    "/upload/media",
    {
      method: "POST",
      body,
    }
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to upload media.");
  }

  return response;
};
