import { User } from "@/app/[locale]/(main)/profile-setting/ProfileSetting";

export type ErrorInstance = { response: { data: { message: string } } };
export type ErrorInstanceCombine = { message?: string } & ErrorInstance;

export type UserSession = {
  accessToken: string;
  access: string;
  refresh: string;
  token: string;
  refreshToken: string;
  user: string | null;
};

export type AuthResponse<T = unknown> = {
  status: "success" | "error";
  message?: string;
  data: T;
};

export interface ProfileResponse {
  status: "success" | "error";
  message?: string;
  data: User;
}
