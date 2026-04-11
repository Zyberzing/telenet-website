import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { cache } from "react";

type SeoEntry = {
  _id?: string;
  language?: string;
  pageName?: string;
  slug?: string;
  defaultSeoTitle?: string;
  titleSeparator?: string;
  defaultMetaDescription?: string;
  publisherBrandName?: string;
  status?: string;
  isDeleted?: boolean;
};

type SeoListResponse = {
  status?: string;
  message?: string;
  data?: {
    result?: SeoEntry[];
  };
};

const fetchSeoEntriesBySlug = cache(async (slug: string): Promise<SeoEntry[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE;

  if (!baseUrl) {
    return [];
  }

  try {
    const response = await fetch(
      `${baseUrl}/seo/get-list?slug=${encodeURIComponent(slug)}`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    const payload =
      (await response.json().catch(() => null)) as SeoListResponse | null;

    if (!response.ok || payload?.status !== "success") {
      throw new Error(payload?.message || "Failed to fetch SEO metadata");
    }

    return (
      payload?.data?.result?.filter(
        (item) =>
          item.status?.toLowerCase() === "active" && item.isDeleted !== true,
      ) || []
    );
  } catch (error) {
    console.error(`[seo] Failed to fetch metadata for slug "${slug}":`, error);
    return [];
  }
});

const resolveSeoTitle = (entry: SeoEntry) => {
  const defaultTitle = entry.defaultSeoTitle?.trim();

  if (defaultTitle) {
    return defaultTitle;
  }

  const pageName = entry.pageName?.trim();
  const publisherBrandName = entry.publisherBrandName?.trim();

  if (!pageName && !publisherBrandName) {
    return undefined;
  }

  const separator = entry.titleSeparator?.trim() || "|";
  return [pageName, publisherBrandName].filter(Boolean).join(` ${separator} `);
};

export async function getPageMetadata(
  locale: string,
  slug: string,
  fallback: Metadata = {},
): Promise<Metadata> {
  const normalizedLocale =
    locale?.trim().toLowerCase() || routing.defaultLocale;
  const entries = await fetchSeoEntriesBySlug(slug);

  const seoEntry =
    entries.find(
      (item) => item.language?.trim().toLowerCase() === normalizedLocale,
    ) ||
    entries.find(
      (item) =>
        item.language?.trim().toLowerCase() === routing.defaultLocale,
    ) ||
    entries[0];

  if (!seoEntry) {
    return fallback;
  }

  const title = resolveSeoTitle(seoEntry);
  const description = seoEntry.defaultMetaDescription?.trim();
  const publisher = seoEntry.publisherBrandName?.trim();

  return {
    ...fallback,
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(publisher ? { publisher } : {}),
    openGraph: {
      type: "website",
      ...fallback.openGraph,
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(publisher ? { siteName: publisher } : {}),
    },
  };
}
