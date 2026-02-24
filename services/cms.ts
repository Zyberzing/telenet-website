import { fetcher } from "@/lib/fetcher";
import { CmsBanner, CmsBannerListResponse } from "@/lib/types";

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
