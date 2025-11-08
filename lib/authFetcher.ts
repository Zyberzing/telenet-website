"use server";

import { hasSession } from "./session";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  cache?: RequestCache;
  revalidate?: number;
  headers?: Record<string, string>;
};

export async function authFetcher<T = unknown>(
  url: string,
  {
    method = "GET",
    body,
    cache = "no-store",
    revalidate,
    headers = {},
  }: FetchOptions = {}
): Promise<T> {
  try {
    const session = await hasSession();

    const accessToken = session?.accessToken || session?.token;
    const refreshToken = session?.refreshToken;

    if (!accessToken || !refreshToken) {
      throw new Error("Token missing");
    }

    const isFormData = body instanceof FormData;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}${url}`;

    const res = await fetch(apiUrl, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${accessToken}`,
        "x-refresh-token": `Bearer ${refreshToken}`,
        ...headers,
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      cache,
      next: revalidate ? { revalidate } : undefined,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw {
        message: data?.message || "Request failed",
        status: res.status,
        body: data,
      };
    }

    return data as T;
  } catch (err) {
    console.error("🔴 [authFetcher] Error caught:", err);
    throw err;
  }
}
