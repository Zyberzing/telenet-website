"use server";
import { countryItems, regionItems } from "@/app/[locale]/(main)/plans/page";
import { fetcher } from "@/lib/fetcher";
import { hasSession } from "@/lib/session";
import { Pagination, Plan } from "@/lib/types";

export const getCountries = async (): Promise<countryItems[]> => {
  try {
    const response = await fetcher<{ data: countryItems }>("/plan/countries");
    const data = response?.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

export const getRegions = async (): Promise<regionItems[]> => {
  try {
    const response = await fetcher<{ data: regionItems }>("/plan/regions");
    const data = response?.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};

export type GetPlansResponse = {
  plans: Plan[];
  pagination: Pagination | null;
};

export const getPlans = async ({
  country_code,
  region_name,
  filterby,
  page,
  limit,
  data_size,
  min_validity,
  max_validity,
  plan_name,
}: {
  country_code?: string;
  region_name?: string;
  filterby?: "Country" | "Region";
  page?: number;
  limit?: number;
  data_size?: number;
  min_validity?: number;
  max_validity?: number;
  plan_name?: 0 | 1;
}): Promise<GetPlansResponse> => {
  try {
    const session = await hasSession();
    const shouldSendAuth = Boolean(session?.accessToken);
    const params = new URLSearchParams();

    if (filterby) params.set("filterby", filterby);

    if (filterby === "Country" && country_code) {
      params.set("country_code", country_code);
    } else if (filterby === "Region" && region_name) {
      params.set("region_name", region_name);
    }

    if (typeof page === "number" && Number.isFinite(page)) {
      params.set("page", page.toString());
    }
    if (
      typeof limit === "number" &&
      Number.isFinite(limit) &&
      limit > 0
    ) {
      params.set("limit", limit.toString());
    }
    if (typeof data_size === "number" && Number.isFinite(data_size)) {
      params.set("data_size", data_size.toString());
    }
    if (
      typeof min_validity === "number" &&
      Number.isFinite(min_validity) &&
      min_validity > 0
    ) {
      params.set("min_validity", min_validity.toString());
    }
    if (
      typeof max_validity === "number" &&
      Number.isFinite(max_validity) &&
      max_validity > 0
    ) {
      params.set("max_validity", max_validity.toString());
    }
    if (
      typeof plan_name === "number" &&
      Number.isFinite(plan_name) &&
      (plan_name === 0 || plan_name === 1)
    ) {
      params.set("plan_name", plan_name.toString());
    }

    const apiUrl = `/plan/package-list?${params.toString()}`;

    const response = await fetcher<{
      data: { result?: Plan[]; pagination?: Pagination };
    }>(apiUrl, {
      auth: shouldSendAuth,
    });
    const data = response?.data || {};

    return {
      plans: data.result || [],
      pagination: data.pagination || null,
    };
  } catch (error) {
    console.error("Error fetching plans:", error);
    return { plans: [], pagination: null };
  }
};
