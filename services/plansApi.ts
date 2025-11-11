"use server";
import { countryItems, regionItems } from "@/app/[locale]/(main)/plans/page";
import {
  AdminMarkup,
  Plan,
  PlansProps,
} from "@/app/[locale]/(main)/plans/Plans";
import { fetcher } from "@/lib/fetcher";

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
  adminMarkup: AdminMarkup | null;
};

export const getPlans = async ({
  country_code,
  region_name,
  filterby,
  data_size,
}: {
  country_code?: string;
  region_name?: string;
  filterby?: "Country" | "Region";
  data_size?: number;
}): Promise<GetPlansResponse> => {
  try {
    const params = new URLSearchParams();

    if (filterby) params.set("filterby", filterby);

    if (filterby === "Country" && country_code) {
      params.set("country_code", country_code);
    } else if (filterby === "Region" && region_name) {
      params.set("region_name", region_name);
    }

    if (data_size) {
      params.set("data_size", data_size.toString());
    }
    const apiUrl = `/plan/package-list?${params.toString()}`;

    const response = await fetcher<{ data: PlansProps }>(apiUrl);
    const data = response?.data || {};

    return {
      plans: data.plans || [],
      adminMarkup: data.adminMarkup || null,
    };
  } catch (error) {
    console.error("❌ Error fetching plans:", error);
    return { plans: [], adminMarkup: null };
  }
};
