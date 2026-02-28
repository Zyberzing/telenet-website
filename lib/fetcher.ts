import { handleBlockedUserResponse } from "./blockedUser";
import { clearSession } from "./session";
import { hasSession } from "./session";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  cache?: RequestCache;
};

export async function fetcher<T = unknown>(
  url: string,
  { method = "GET", body, headers = {}, auth = false }: FetchOptions = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE!;
  const isFormData = body instanceof FormData;

  let accessToken: string | undefined;
  let refreshToken: string | undefined;

  if (auth) {
    const session = await hasSession();

    if (!session?.accessToken) throw new Error("User not authenticated");
    accessToken = session.accessToken;
    refreshToken = session.refreshToken;
  }

  const res = await fetch(`${baseUrl}${url}`, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(refreshToken ? { "x-refresh-token": refreshToken } : {}),
      ...headers,
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  const isBlocked = await handleBlockedUserResponse(res.status, data, clearSession);
  if (isBlocked) {
    return data as T;
  }

  if (!res.ok) throw new Error(data?.message || "Request failed");

  return data;
}
