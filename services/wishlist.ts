"use server";

import { Pagination, Plan } from "@/lib/types";
import { authFetcher } from "@/lib/authFetcher";

type WishlistAction = "ADD" | "REMOVE";

type WishlistUpsertResponse = {
  status: string;
  message?: string;
};

type WishlistListResponse = {
  status: string;
  message?: string;
  data?: {
    result?: unknown[];
    pagination?: Pagination;
  };
};

type WishlistListResult = {
  plans: Plan[];
  pagination: Pagination | null;
};

const normalizeWishlistPlan = (item: unknown): Plan | null => {
  if (!item || typeof item !== "object") return null;

  const row = item as Record<string, unknown>;
  const planValue = row.plan;
  const plan =
    planValue && typeof planValue === "object"
      ? (planValue as Record<string, unknown>)
      : row;

  const id = String(plan._id ?? plan.planId ?? row.planId ?? "");
  const packageId = String(plan.package_id ?? plan.packageId ?? "");
  const packageName = String(plan.package_name ?? plan.packageName ?? "");

  if (!id || !packageId || !packageName) return null;

  const dataValue = plan.data ?? plan.package_data ?? "";
  const countryValue = String(
    plan.countryIso2 ??
      plan.country_code ??
      plan.countryCode ??
      plan.country ??
      row.countryIso2 ??
      row.country_code ??
      row.countryCode ??
      row.country ??
      "",
  );
  const validityValue = Number(plan.validity ?? plan.perioddays ?? 0);
  const coverageValue = String(plan.coverage ?? "");
  const priceValue = Number(plan.price ?? plan.finalPrice ?? 0);
  const finalPriceValue = Number(plan.finalPrice ?? plan.price ?? 0);
  const callValue = Number(plan.call ?? plan.package_call ?? 0);
  const smsValue = Number(plan.sms ?? plan.package_sms ?? 0);
  const networkValue = String(plan.network ?? "");
  const countriesValue = Array.isArray(plan.countries)
    ? (plan.countries as { countryname: string; countryiso2: string }[])
    : [];
  const resolvedCountryIso2 =
    countryValue || countriesValue[0]?.countryiso2 || "";

  return {
    _id: id,
    package_id: packageId,
    package_name: packageName,
    country: countryValue,
    country_code: countryValue,
    countryIso2: resolvedCountryIso2,
    data: String(dataValue),
    validity: Number.isFinite(validityValue) ? validityValue : 0,
    coverage: coverageValue,
    price: Number.isFinite(priceValue) ? priceValue : 0,
    basePrice: Number(plan.basePrice ?? 0),
    taxAmount: Number(plan.taxAmount ?? 0),
    stripe: Number(plan.stripe ?? 0),
    tax: Number(plan.tax ?? 0),
    call: Number.isFinite(callValue) ? callValue : 0,
    sms: Number.isFinite(smsValue) ? smsValue : 0,
    finalPrice: Number.isFinite(finalPriceValue) ? finalPriceValue : 0,
    network: networkValue,
    fup_policy:
      typeof plan.fup_policy === "string" || plan.fup_policy === null
        ? (plan.fup_policy as string | null)
        : null,
    countries: countriesValue,
    actionType:
      plan.actionType === "decrease" || plan.actionType === "increase"
        ? (plan.actionType as "increase" | "decrease")
        : "increase",
    markupType:
      plan.markupType === "fixed" || plan.markupType === "percentage"
        ? (plan.markupType as "percentage" | "fixed")
        : "percentage",
    markupValue: Number(plan.markupValue ?? 0),
    markupAmount: Number(plan.markupAmount ?? 0),
    percentage: Number(plan.percentage ?? 0),
    wishlisted: true,
  };
};

export const upsertWishlist = async ({
  planId,
  action,
}: {
  planId: string;
  action: WishlistAction;
}) => {
  const response = await authFetcher<WishlistUpsertResponse>(
    "/wishlist/upsert-wishlist",
    {
      method: "POST",
      body: { planId, action },
    },
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to update wishlist.");
  }

  return response;
};

export const getWishlist = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
} = {}): Promise<WishlistListResult> => {
  const response = await authFetcher<WishlistListResponse>(
    `/wishlist/list?limit=${limit}&page=${page}`,
  );

  if (response?.status !== "success") {
    throw new Error(response?.message || "Failed to fetch wishlist.");
  }

  const rows = response?.data?.result ?? [];
  if (!Array.isArray(rows)) {
    return { plans: [], pagination: response?.data?.pagination || null };
  }

  return {
    plans: rows
    .map((item) => normalizeWishlistPlan(item))
    .filter((item): item is Plan => Boolean(item)),
    pagination: response?.data?.pagination || null,
  };
};
