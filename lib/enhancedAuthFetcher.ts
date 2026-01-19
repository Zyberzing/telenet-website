"use server";

import { jwtDecode } from "jwt-decode";
import { clearSession, getSession, saveSession } from "./session";
import { UserSession } from "./types";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  cache?: RequestCache;
  revalidate?: number;
  headers?: Record<string, string>;
  retryOnTokenExpiry?: boolean;
};

type TokenPayload = {
  authId: string;
  role: string;
  exp: number;
  iat: number;
};

type RefreshTokenResponse = {
  status: "success" | "error";
  message?: string;
  data: {
    access: string;
    refreshToken: string;
    user: string;
  };
};

class TokenExpiredError extends Error {
  constructor(message: string = "Token expired") {
    super(message);
    this.name = "TokenExpiredError";
  }
}

class AuthenticationError extends Error {
  constructor(message: string = "Authentication failed") {
    super(message);
    this.name = "AuthenticationError";
  }
}

/**
 * Check if a JWT token is expired or will expire soon (within 5 minutes)
 */
function isTokenExpired(token: string, bufferMinutes: number = 5): boolean {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = bufferMinutes * 60; // Convert minutes to seconds
    
    return decoded.exp <= (currentTime + bufferTime);
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Treat invalid tokens as expired
  }
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(refreshToken: string): Promise<UserSession | null> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}/auth/refresh-token`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-refresh-token": `Bearer ${refreshToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data: RefreshTokenResponse = await response.json();
    
    if (data.status !== "success") {
      throw new Error(data.message || "Token refresh failed");
    }

    const newSession: UserSession = {
      accessToken: data.data.access,
      token: data.data.access,
      refreshToken: data.data.refreshToken,
      access: data.data.access,
      refresh: data.data.refreshToken,
      user: data.data.user,
    };

    // Save the new session
    await saveSession(newSession);
    
    return newSession;
  } catch (error) {
    console.error("🔴 [refreshAccessToken] Error:", error);
    return null;
  }
}

/**
 * Enhanced authenticated fetcher with automatic token refresh and expiration handling
 */
export async function enhancedAuthFetcher<T = unknown>(
  url: string,
  {
    method = "GET",
    body,
    cache = "no-store",
    revalidate,
    headers = {},
    retryOnTokenExpiry = true,
  }: FetchOptions = {}
): Promise<T> {
  let session = await getSession();

  if (!session?.accessToken || !session?.refreshToken) {
    throw new AuthenticationError("No valid session found");
  }

  // Check if access token is expired or will expire soon
  if (isTokenExpired(session.accessToken)) {
    console.log("🔄 Access token expired, attempting refresh...");
    
    if (retryOnTokenExpiry) {
      // Try to refresh the token
      const refreshedSession = await refreshAccessToken(session.refreshToken);
      
      if (refreshedSession) {
        session = refreshedSession;
        console.log("✅ Token refreshed successfully");
      } else {
        // Refresh failed, clear session and throw error
        await clearSession();
        throw new AuthenticationError("Token refresh failed, please login again");
      }
    } else {
      throw new TokenExpiredError("Access token expired");
    }
  }

  try {
    const isFormData = body instanceof FormData;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}${url}`;

    const response = await fetch(apiUrl, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${session.accessToken}`,
        "x-refresh-token": `Bearer ${session.refreshToken}`,
        ...headers,
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      cache,
      next: revalidate ? { revalidate } : undefined,
    });

    const data = await response.json().catch(() => null);

    // Handle 401 Unauthorized - token might be expired
    if (response.status === 401 && retryOnTokenExpiry) {
      console.log("🔄 Received 401, attempting token refresh...");
      
      const refreshedSession = await refreshAccessToken(session.refreshToken);
      
      if (refreshedSession) {
        // Retry the original request with the new token
        return enhancedAuthFetcher<T>(url, {
          method,
          body,
          cache,
          revalidate,
          headers,
          retryOnTokenExpiry: false, // Prevent infinite retry loop
        });
      } else {
        await clearSession();
        throw new AuthenticationError("Session expired, please login again");
      }
    }

    if (!response.ok) {
      throw {
        message: data?.message || `Request failed with status ${response.status}`,
        status: response.status,
        body: data,
      };
    }

    return data as T;
  } catch (error) {
    console.error("🔴 [enhancedAuthFetcher] Error:", error);
    throw error;
  }
}

/**
 * Enhanced fetcher for non-authenticated requests with better error handling
 */
export async function enhancedFetcher<T = unknown>(
  url: string,
  {
    method = "GET",
    body,
    cache = "no-store",
    revalidate,
    headers = {},
  }: Omit<FetchOptions, "retryOnTokenExpiry"> = {}
): Promise<T> {
  try {
    const isFormData = body instanceof FormData;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE}${url}`;

    const response = await fetch(apiUrl, {
      method,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      cache,
      next: revalidate ? { revalidate } : undefined,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw {
        message: data?.message || `Request failed with status ${response.status}`,
        status: response.status,
        body: data,
      };
    }

    return data as T;
  } catch (error) {
    console.error("🔴 [enhancedFetcher] Error:", error);
    throw error;
  }
}

// Export error classes for use in other modules
export { TokenExpiredError, AuthenticationError };
