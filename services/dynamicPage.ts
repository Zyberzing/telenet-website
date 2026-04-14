import { fetcher } from "@/lib/fetcher";
import {
  DynamicPageDetails,
  DynamicPageDetailsResponse,
  DynamicPageListItem,
  DynamicPageListResponse,
  Pagination,
} from "@/lib/types";

export type DynamicPageListParams = {
  page?: number;
  limit?: number;
};

export type DynamicPageListData = {
  result: DynamicPageListItem[];
  pagination: Pagination | null;
};

export const slugifyDynamicPageName = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const buildDynamicPageSlug = (pageName: string, pageId: string) =>
  `${slugifyDynamicPageName(pageName)}--${pageId}`;

export const getDynamicPageIdFromSlug = (slug: string) => {
  if (!slug) return "";
  if (!slug.includes("--")) return slug;
  return slug.split("--").pop() || slug;
};

export const getDynamicPageList = async (
  params: DynamicPageListParams = {},
): Promise<DynamicPageListData> => {
  try {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const response = await fetcher<DynamicPageListResponse>(
      `/dynamic-page/list?limit=${limit}&page=${page}`,
    );
    return {
      result: response?.data?.result || [],
      pagination: response?.data?.pagination || null,
    };
  } catch (error) {
    console.error("Error fetching dynamic pages list:", error);
    return {
      result: [],
      pagination: null,
    };
  }
};

export const getDynamicPageDetails = async (
  pageId: string,
): Promise<DynamicPageDetails | null> => {
  try {
    if (!pageId) return null;
    const response = await fetcher<DynamicPageDetailsResponse>(
      `/dynamic-page/details/${pageId}`,
    );
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching dynamic page details:", error);
    return null;
  }
};
