"use server";
import { FaqItem } from "@/components/home/FAQ";
import { fetcher } from "@/lib/fetcher";

export const getFaq = async (): Promise<FaqItem[]> => {
  try {
    const response = await fetcher<{ data: FaqItem }>(
      "/cms-content/faq/get-list"
    );
    const data = response?.data?.list || response?.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
};
