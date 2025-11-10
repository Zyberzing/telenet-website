"use server";
import { countryItems, regionItems } from "@/app/[locale]/(main)/plans/page";
import {
  AdminMarkup,
  Plan,
  PlansProps,
} from "@/app/[locale]/(main)/plans/Plans";
import { enhancedFetcher } from "@/lib/enhancedAuthFetcher";

export const getCountries = async (): Promise<countryItems[]> => {
  try {
    const response = await enhancedFetcher<{ data: countryItems }>(
      "/plan/countries"
    );
    const data = response?.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
};

export const getRegions = async (): Promise<regionItems[]> => {
  try {
    const response = await enhancedFetcher<{ data: regionItems }>(
      "/plan/regions"
    );
    const data = response?.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching regions:", error);
    return [];
  }
};

export type GetPlansResponse = {
  plans: Plan[];
  adminMarkup: AdminMarkup | null;
};

export const getPlans = async ({
  country_code,
  region_name,
  filterby = "Region",
  data_size,
}: {
  country_code: string;
  region_name: string;
  filterby?: string;
  data_size?: number;
}): Promise<GetPlansResponse> => {
  try {
    const params = new URLSearchParams({ country_code, region_name, filterby });
    if (data_size) {
      params.set("data_size", data_size.toString()); // ✅ add data size to query
    }
    const response = await enhancedFetcher<{ data: PlansProps }>(
      `/plan/package-list?${params.toString()}`
    );
    const data = response?.data || {};

    return {
      plans: data.plans || [],
      adminMarkup: data.adminMarkup || null,
    };
  } catch (error) {
    console.error("Error fetching plans:", error);
    return { plans: [], adminMarkup: null };
  }
};
