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

export interface Ticket {
  _id?: string;
  id: string;
  ticketId: string;
  priority: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  description?: string;
  name?: string;
  email?: string;
  countryCode?: string;
  phoneNumber?: string;
  document?: string | null;
}

export type CreateTicketInput = Omit<
  Ticket,
  "id" | "ticketId" | "createdAt" | "updatedAt" | "status"
>;

export type UpdateTicketInput = Omit<
  Ticket,
  | "id"
  | "priority"
  | "subject"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "name"
  | "email"
  | "countryCode"
  | "phoneNumber"
>;

export type ProfilePictureUpdate = {
  profilePicture: string;
};
