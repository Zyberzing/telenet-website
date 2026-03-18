import { fetcher } from "@/lib/fetcher";
import {
  CmsBanner,
  CmsBannerListResponse,
  CmsBlog,
  CmsBlogListResponse,
} from "@/lib/types";

export const getCmsBanners = async (): Promise<CmsBanner[]> => {
  try {
    const res = await fetcher<CmsBannerListResponse>(
      "/cms-content/banner/get-list",
    );
    return res?.data || [];
  } catch (error) {
    console.error("Error fetching CMS banners:", error);
    return [];
  }
};

export type CmsBlogListParams = {
  blogId?: string;
  lang?: string;
};

export const getCmsBlogList = async (
  params: CmsBlogListParams = {},
): Promise<CmsBlog[]> => {
  try {
    const searchParams = new URLSearchParams();
    if (params.blogId) searchParams.set("blogId", params.blogId);
    if (params.lang) searchParams.set("lang", params.lang);
    const query = searchParams.toString();
    const res = await fetcher<CmsBlogListResponse>(
      query
        ? `/cms-content/blog/get-list?${query}`
        : "/cms-content/blog/get-list",
    );
    return res?.data || [];
  } catch (error) {
    console.error("Error fetching CMS blogs:", error);
    return [];
  }
};
