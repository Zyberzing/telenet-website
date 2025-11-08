"use server";

import { cookies } from "next/headers";
import { decrypt, encrypt } from "./crypto";
import { UserSession } from "./types";

const COOKIE_NAME =
  process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME || "APP_SESSION";

export async function saveSession(user: UserSession) {
  const encrypted = encrypt(JSON.stringify(user));
  (await cookies()).set({
    name: COOKIE_NAME,
    value: encrypted,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // ✅ fix: secure only in prod
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<UserSession | null> {
  const raw = (await cookies()).get(COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    const decrypted = decrypt(raw);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch {
    return null;
  }
}

export async function clearSession() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function hasSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;

  if (!cookie) return null;

  try {
    const decrypted = decrypt(cookie);
    // ✅ ensure we always return an object, not a string
    const parsed =
      typeof decrypted === "string" ? JSON.parse(decrypted) : decrypted;
    return parsed;
  } catch (err) {
    console.error("❌ [hasSession] Failed to decrypt session:", err);
    return null;
  }
}
