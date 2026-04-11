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
  orderId?: string;
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

export type TicketConversationMessage = {
  _id: string;
  id?: string;
  message?: string;
  text?: string;
  content?: string;
  role?: string;
  senderType?: string;
  senderRole?: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type TicketConversationListResponse = {
  status: string;
  message?: string;
  data?:
    | {
        result?: TicketConversationMessage[];
      }
    | TicketConversationMessage[];
};

export type TicketConversationSendResponse = {
  status: string;
  message?: string;
  data?: TicketConversationMessage;
};

export type CreateTicketInput = Omit<
  Ticket,
  "id" | "ticketId" | "createdAt" | "updatedAt" | "status"
>;

export type RefundTicketInput = {
  subject: string;
  description: string;
  document?: string | null;
  category: string;
  refundId?: string;
};

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
  reason?: string;
}

export interface RefundResponseData {
  subject?: string;
  description?: string;
  document?: string | null;
  category?: string;
  refundId?: string;
}

// services/order.ts
export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface Order {
  _id: string;
  packageId?: string;
  package_name: string;
  package_data: string;
  network: string;
  providerName: string;
  paymentMethodType: string;
  finalPrice: number;
  status: string;
  isRefundRequested?: boolean;
  refundStatus?: string | null;
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
  rate: number;
  symbol?: string;
}

export type CurrencyListResponse = {
  status?: string;
  message?: string;
  data?:
    | Currency[]
    | {
        result?: Currency[];
      };
};

export type Plan = {
  _id: string;
  package_id: string;
  wishlisted?: boolean;
  country?: string;
  country_code?: string;
  provider?: string;
  package_name: string;
  data: string;
  validity: number;
  coverage: string;
  price: number;
  basePrice?: number;
  taxAmount?: number;
  stripe?: number;
  tax?: number;
  call: number;
  sms: number;
  finalPrice: number;
  network: string;
  fup_policy: string | null;
  // providerName: string;
  countryIso2: string;
  countries: { countryname: string; countryiso2: string }[];
  actionType: "increase" | "decrease";
  markupType: "percentage" | "fixed";
  markupValue: number;
  markupAmount: number;
  percentage: number;
};

export interface PlansProps {
  countries: { iso2: string; code: string; name: string }[];
  regions: { name: string }[];
  result: Plan[];
  pagination?: Pagination | null;
  selectedCountry: string;
  selectedRegion: string;
  filterby: "Country" | "Region";
  planType: 0 | 1 | null;
  userProfile: User | null;
}

export type orderDetails = {
  packageId: string;
  country: string;
  _id?: string;
  couponId?: string;
  providerId?: string;
  customerDOB?: string;
  customerPassportDOB?: string;
  travelStartDate?: string;
  travelEndDate?: string;
};

export type KycMethod = "sumsub" | "manual";
export type ManualDocumentType =
  | "passport"
  | "national_id"
  | "driving_license"
  | "other";

export type ManualKycForm = {
  fullName: string;
  address: string;
  country: string;
  countryCode: string;
  documentType: ManualDocumentType;
  otherDocumentName: string;
};

export type RegistrationState = {
  email?: string;
  name?: string;
  phone?: string;
  country?: string;
  countryCode?: string;
  countryIso?: string;
  otpAccessToken?: string;
  otpRefreshToken?: string;
  kycStatus?: string;
  kycReason?: string | null;
};

export type ManualFilePreview = {
  name: string;
  type: string;
  previewUrl: string;
};

export const defaultManualForm: ManualKycForm = {
  fullName: "",
  address: "",
  country: "",
  countryCode: "",
  documentType: "passport",
  otherDocumentName: "",
};

export interface PromotionSelectionModalProps {
  open: boolean;
  selectedPlan: Plan | null;
  onBack: () => void;
  onClose: () => void;
  onBuy: (
    promotionId?: string,
    travelStartDate?: string,
    travelEndDate?: string,
  ) => void;
  orderLoading: boolean;
}

export type ManualKycSubmitPayload = {
  fullName: string;
  address: string;
  country: string;
  documentUrls: {
    documentType: string;
    documentUrl: string;
  }[];
};

export type KycOtpTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type UsedFor = "companyName" | "model";

export type DeviceCompatibilityApiResponse = {
  data?: {
    result?: unknown[];
  };
  result?: unknown[];
};

export type CmsBanner = {
  _id: string;
  title: string;
  banner: string;
  redirectUrl?: string;
  status?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lang?: string;
};

export type CmsBannerListResponse = {
  status: string;
  message: string;
  data: CmsBanner[];
  statusCode: number;
};

export type CmsBlog = {
  _id: string;
  title: string;
  description: string;
  lang?: string;
  category?: string;
  image?: string;
  status?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CmsBlogListResponse = {
  status: string;
  message: string;
  data: CmsBlog[];
  statusCode: number;
};

export type UploadOtpTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type PromotionItem = {
  _id: string;
  promotionName: string;
  promoCode: string;
  discountValue?: string | number;
  discountType?: "percentage" | "fixed";
  status?: string;
};

export type PromotionListResponse = {
  status: string;
  message: string;
  data?: {
    result?: PromotionItem[];
  };
};

export type VerifyPromotionResponse = {
  status: "success" | "error";
  message?: string;
  data?: PromotionItem;
  statusCode?: number;
};

export type OTPVerificationProps = {
  prefilledEmail?: string;
};

export type DashboardSummaryResponse = {
  status?: string;
  message?: string;
  data?: {
    activePlans?: number;
    walletBalance?: number;
    lastTransaction?: {
      amount?: number;
      date?: string;
      validity?: number;
      data?: string;
    } | null;
  };
};
