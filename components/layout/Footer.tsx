"use client";

import { DynamicPageListItem } from "@/lib/types";
import { ROUTES } from "@/routes";
import {
  buildDynamicPageSlug,
  getDynamicPageList,
} from "@/services/dynamicPage";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations("Footer");
  const [dynamicPages, setDynamicPages] = useState<DynamicPageListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const PAGE_LIMIT = 5;

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const response = await getDynamicPageList({ page: 1, limit: PAGE_LIMIT });
      if (!isMounted) return;

      const activePages = response.result.filter(
        (page) => page.status === "active",
      );
      setDynamicPages(activePages);
      setCurrentPage(response.pagination?.currentPage || 1);
      setTotalPages(response.pagination?.totalPages || 1);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadMorePages = async () => {
    if (loadingMore || currentPage >= totalPages) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getDynamicPageList({
        page: nextPage,
        limit: PAGE_LIMIT,
      });
      const activePages = response.result.filter(
        (page) => page.status === "active",
      );

      setDynamicPages((prev) => {
        const existingIds = new Set(prev.map((item) => item._id));
        const uniqueNewItems = activePages.filter(
          (item) => !existingIds.has(item._id),
        );
        return [...prev, ...uniqueNewItems];
      });
      setCurrentPage(response.pagination?.currentPage || nextPage);
      setTotalPages(response.pagination?.totalPages || totalPages);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <footer className="bg-black text-gray-300 px-4 sm:px-6 md:px-10 lg:px-[6em]">
      {/* Top Section */}
      <div className="mx-auto max-w-7xl py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {/* Logo & About */}
        <div className="lg:col-span-2 flex flex-col items-start text-left">
          <Image
            src="/transparent-logo.svg"
            alt={t("logoAlt")}
            width={150}
            height={56}
            className="h-[56px] w-[150px]"
          />
          <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed">
            {t("aboutText")}
          </p>

          <div className="flex justify-start mt-5 gap-4 flex-wrap">
            <Image
              src="/app-store.svg"
              alt="App Store"
              width={135}
              height={65}
              className="h-[55px] w-[125px]"
            />
            <Image
              src="/play-store.svg"
              alt="Play Store"
              width={135}
              height={65}
              className="h-[55px] w-[125px]"
            />
          </div>
        </div>

        {/* Purchase */}
        <div className="flex flex-col items-start">
          <h3 className="font-[400] text-[18px] sm:text-[20px] text-primary dark:text-primary">
            {t("purchase")}
          </h3>
          <ul className="mt-4 space-y-2 text-[15px] sm:text-[16px] text-left">
            {["destinations", "regions", "topUp", "downloadApp"].map((key) => (
              <li key={key}>
                <Link
                  className="hover:text-primary dark:hover:text-primary"
                  href={
                    key === "destinations"
                      ? ROUTES.DESTINATION(locale)
                      : key === "regions"
                        ? ROUTES.REGION(locale)
                        : key === "topUp"
                          ? "#"
                          : "#"
                  }
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Destinations */}
        <div className="flex flex-col items-start">
          <h3 className="font-[400] text-[18px] sm:text-[20px] text-primary dark:text-primary">
            {t("topDestinations")}
          </h3>

          <ul className="mt-4 space-y-2 text-[15px] sm:text-[16px] text-left">
            {["AU", "GB", "TH", "US", "CA", "AE"].map((country) => (
              <li key={country}>
                <Link
                  className="hover:text-primary dark:hover:text-primary"
                  href={`/${locale}/plans?filterby=Country&country_code=${encodeURIComponent(
                    country,
                  )}`}
                >
                  {t(`countries.${country}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="flex flex-col items-start">
          <h3 className="font-[400] text-[18px] sm:text-[20px] text-primary dark:text-primary">
            {t("company")}
          </h3>
          <ul className="mt-4 space-y-2 text-[15px] sm:text-[16px] text-left">
            <li>
              <Link
                className="hover:text-primary dark:hover:text-primary"
                href={ROUTES.ABOUT_US(locale)}
              >
                {t("aboutUs")}
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary dark:hover:text-primary"
                href={ROUTES.CONTACT_US(locale)}
              >
                {t("contactUs")}
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-primary dark:hover:text-primary"
                href={ROUTES.PARTNER_WITH_US(locale)}
              >
                {t("partner")}
              </Link>
            </li>
          </ul>
          {dynamicPages.length > 0 && (
            <div className="mt-2 w-full max-w-xs">
              <ScrollArea className="mt-2 h-[150px] w-full max-w-xs pr-2">
                <ul className="flex flex-col gap-1 text-[14px] sm:text-[15px]">
                  {dynamicPages.map((page) => (
                    <li key={page._id}>
                      <Link
                        className="hover:text-primary dark:hover:text-primary"
                        href={ROUTES.DYNAMIC_PAGE_DETAIL(
                          locale,
                          buildDynamicPageSlug(page.pageName, page._id),
                        )}
                      >
                        {page.pageName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </ScrollArea>

              {currentPage < totalPages && (
                <button
                  type="button"
                  onClick={handleLoadMorePages}
                  disabled={loadingMore}
                  className="mt-2 text-sm font-medium text-primary transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingMore ? "Loading..." : "More"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="flex flex-col items-start">
          <h3 className="font-[400] text-[18px] sm:text-[20px] text-primary dark:text-primary">
            {t("resources")}
          </h3>
          <ul className="mt-4 space-y-2 text-[15px] sm:text-[16px] text-left">
            {["blog", "helpCenter", "events"].map((key) => (
              <li key={key}>
                <Link
                  className="hover:text-primary dark:hover:text-primary"
                  href={key === "blog" ? ROUTES.BLOG(locale) : "#"}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-6 py-6 flex flex-col md:flex-wrap lg:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* Left: Copyright */}
        <p className="text-sm sm:text-[15px]">
          {t("copyright")}
          <span className="text-primary dark:text-primary font-medium mx-2">
            {t("footerlink")}
          </span>
          {t("reserved")}
        </p>

        {/* Middle: Social Media */}
        <div className="flex justify-center md:justify-start gap-4 flex-wrap">
          {[
            "instagram-footer",
            "facebook-footer",
            "youtube-footer",
            "linkedin-footer",
            "x-footer",
          ].map((icon) => (
            <Image
              key={icon}
              src={`/social-media/${icon}.svg`}
              alt={icon}
              width={28}
              height={28}
              className="h-[26px] w-[26px] hover:opacity-80 transition"
            />
          ))}
        </div>

        {/* Right: Links */}
        <div className="flex flex-wrap justify-center md:justify-end gap-2 sm:gap-4 text-sm sm:text-[15px]">
          {["cookie", "terms", "privacy"].map((key, idx) => (
            <React.Fragment key={key}>
              <Link
                className="hover:text-primary dark:hover:text-primary"
                href="#"
              >
                {t(key)}
              </Link>
              {idx < 2 && <span className="hidden sm:inline">|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
}
