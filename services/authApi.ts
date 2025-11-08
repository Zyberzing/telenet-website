"use server";
import {
  ChangePassword,
  User,
} from "@/app/[locale]/(main)/profile-setting/ProfileSetting";
import { LoginFormSchemaType } from "@/components/LoginForm";
import { RegistrationFormSchemaType } from "@/components/RegisterForm";
import { enhancedAuthFetcher, enhancedFetcher } from "@/lib/enhancedAuthFetcher";
import { saveSession } from "@/lib/session";
import { UserSession } from "@/lib/types";

export const createUser = async (
  body: RegistrationFormSchemaType
): Promise<any> => {
  const result = await enhancedFetcher("/auth/signup", {
    method: "POST",
    body,
  });
  return result;
};

export async function loginUser(formData: LoginFormSchemaType) {
  const res = await enhancedFetcher<{
    status: string;
    message: string;
    data: UserSession;
  }>("/auth/signin", {
    method: "POST",
    body: formData,
  });

  if (res.status !== "success") {
    throw new Error(res.message || "Login failed");
  }

  const { accessToken: access, refreshToken: refresh, user } = res.data;

  await saveSession({
    token: access,
    refreshToken: refresh,
    user,
    accessToken: access,
    access: access,
    refresh: refresh,
  });

  return res.data;
}

export const getProfile = async (): Promise<User | null> => {
  try {
    const response = await enhancedAuthFetcher<{ status: "success"; data: User }>(
      "/auth/profile"
    );
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

export const changePassword = async (body: ChangePassword): Promise<any> => {
  const response = await enhancedAuthFetcher<{ status: "success"; message: string }>(
    "/auth/change-password",
    {
      method: "POST",
      body,
    }
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to change password");
  }

  return response;
};
