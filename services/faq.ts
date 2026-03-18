"use server";
import { FaqItem } from "@/components/home/FAQ";
import { fetcher } from "@/lib/fetcher";

export type FaqParams = {
  lang?: string;
};

export const getFaq = async (params: FaqParams = {}): Promise<FaqItem[]> => {
  try {
    const searchParams = new URLSearchParams();
    if (params.lang) searchParams.set("lang", params.lang);
    const query = searchParams.toString();
    const response = await fetcher<{ data: FaqItem }>(
      query ? `/cms-content/faq/get-list?${query}` : "/cms-content/faq/get-list",
    );
    const data = response?.data?.list || response?.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
};
