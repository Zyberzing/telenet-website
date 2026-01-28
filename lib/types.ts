import { User } from "@/app/[locale]/(main)/profile-setting/ProfileSetting";

export type ErrorInstance = { response: { data: { message: string } } };
export type ErrorInstanceCombine = { message?: string } & ErrorInstance;

export type UserSession = {
  accessToken: string;
  access: string;
  refresh: string;
  token: string;
  refreshToken: string;
  user: User | string | null;
  kycStatus?: string;
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

export interface Refund {
  orderId: string;
  reason: string;
}

// services/order.ts
export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface Order {
  _id: string;
  package_name: string;
  package_data: string;
  network: string;
  providerName: string;
  paymentIntentId: string;
  status: string;
  createdAt: string;
}

export interface GetOrderListApiResponse {
  status: string;
  message: string;
  data: {
    result: Order[];
    pagination: Pagination;
  };
  statusCode: number;
}

export interface Currency {
  _id: string;
  country: string;
  currency: string;
  rate?: number;
}
