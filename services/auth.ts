
import {
  ChangePassword,
  User,
} from "@/app/[locale]/(main)/profile-setting/ProfileSetting";
import { LoginFormSchemaType } from "@/components/LoginForm";
import { RegistrationFormSchemaType } from "@/components/RegisterForm";
import { authFetcher } from "@/lib/authFetcher";
import {
  enhancedAuthFetcher,
  enhancedFetcher,
} from "@/lib/enhancedAuthFetcher";
import { fetcher } from "@/lib/fetcher";
import { clearSession, hasSession, saveSession } from "@/lib/session";
import { UserSession } from "@/lib/types";
import { setCredentials } from "@/store/slices/authSlice";
import { store } from "@/store/Store";

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
  const res = await fetcher<{
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

  store.dispatch(
    setCredentials({
      token: access,
      refreshToken: refresh,
      user,
      accessToken: access,
      access: access,
      refresh: refresh,
    })
  );

  return res.data;
}

export const verifyOtp = async (body: { email: string; otp: string }) => {
  try {
    const res = await enhancedFetcher<{
      status: string;
      message: string;
    }>("/auth/verify-email", {
      method: "POST",
      body,
    });

    if (res.status !== "success") {
      throw new Error(res.message || "OTP verification failed");
    }

    return res;
  } catch (err: any) {
    console.error("OTP verification error:", err);
    throw new Error(err.message || "Failed to verify OTP");
  }
};

export const forgotPassword = async (body: { email: string }) => {
  try {
    const res = await enhancedFetcher<{
      status: string;
      message: string;
    }>("/auth/forgot-password", {
      method: "POST",
      body,
    });

    if (res.status !== "success") {
      throw new Error(res.message || "Email verification failed");
    }

    return res;
  } catch (err: any) {
    console.error("Forgot password error:", err);
    throw new Error(err.message || "Failed to forgot password");
  }
};

export const resetPassword = async (body: {
  email: string;
  newPassword: string;
  otp: string;
}) => {
  try {
    const res = await enhancedFetcher<{
      status: string;
      message: string;
    }>("/auth/reset-password", {
      method: "POST",
      body,
    });

    if (res.status !== "success") {
      throw new Error(res.message || "Reset password failed");
    }

    return res;
  } catch (err: any) {
    console.error("Reset password error:", err);
    throw new Error(err.message || "Failed to reset password");
  }
};

export const getProfile = async (): Promise<User | null> => {
  try {
    const session = await hasSession();

    if (!session?.accessToken || !session?.refreshToken) {
      console.warn("Skipping profile fetch — no token found.");
      return null;
    }

    const response = await authFetcher<{
      status: "success";
      data: User;
    }>("/auth/profile");

    return response?.data || null;
  } catch (error: any) {
    console.error("Error fetching profile:", error);

    if (error?.status === 401 || error?.message?.includes("expired")) {
      console.log("Auto-logout due to expired token.");
      await clearSession();
    }

    return null;
  }
};

export const updateProfile = async (body: User): Promise<any> => {
  const response = await enhancedAuthFetcher<{
    status: "success";
    message: string;
  }>("/auth/update-profile", {
    method: "PUT",
    body,
  });

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to update profile");
  }

  return response;
};

export const updateProfilePicture = async (url: string) => {
  try {
    return await authFetcher("/auth/upload-profile-picture", {
      method: "PATCH",
      body: { profilePicture: url },
    });
  } catch (error: any) {
    console.error("Error updating profile picture:", error);
    throw new Error(error?.message || "Failed to update profile picture");
  }
};

export const changePassword = async (body: ChangePassword): Promise<any> => {
  const response = await enhancedAuthFetcher<{
    status: "success";
    message: string;
  }>("/auth/change-password", {
    method: "POST",
    body,
  });

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to change password");
  }

  return response;
};

export const deleteAccount = async (): Promise<any> => {
  const response = await enhancedAuthFetcher<{
    status: "success";
    message: string;
  }>("/auth/delete-account", {
    method: "DELETE",
  });

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to delete account");
  }

  return response;
};
