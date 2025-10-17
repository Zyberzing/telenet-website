"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations("Footer");

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
          <h3 className="font-semibold text-[18px] sm:text-[20px] text-primary">
            {t("purchase")}
          </h3>
          <ul className="mt-4 space-y-2 text-[15px] sm:text-[16px] text-left">
            {["destinations", "regions", "topUp", "downloadApp"].map((key) => (
              <li key={key}>
                <Link href="#">{t(key)}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Destinations */}
        <div className="flex flex-col items-start">
          <h3 className="font-semibold text-[18px] sm:text-[20px] text-primary">
            {t("topDestinations")}
          </h3>
          <ul className="mt-4 space-y-2 text-[15px] sm:text-[16px] text-left">
            {[
              "Australia",
              "United Kingdom",
              "Thailand",
              "USA",
              "Canada",
              "UAE",
            ].map((country) => (
              <li key={country}>
                <Link href="#">{t(`countries.${country}`)}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="flex flex-col items-start">
          <h3 className="font-semibold text-[18px] sm:text-[20px] text-primary">
            {t("company")}
          </h3>
          <ul className="mt-4 space-y-2 text-[15px] sm:text-[16px] text-left">
            <li>
              <Link href={`/${locale}/about-us`}>{t("aboutUs")}</Link>
            </li>
            <li>
              <Link href="#">{t("careers")}</Link>
            </li>
            <li>
              <Link href={`/${locale}/contact-us`}>{t("contactUs")}</Link>
            </li>
            <li>
              <Link href="#">{t("partner")}</Link>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div className="flex flex-col items-start">
          <h3 className="font-semibold text-[18px] sm:text-[20px] text-primary">
            {t("resources")}
          </h3>
          <ul className="mt-4 space-y-2 text-[15px] sm:text-[16px] text-left">
            {["blog", "helpCenter", "events"].map((key) => (
              <li key={key}>
                <Link href="#">{t(key)}</Link>
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
          <span className="text-primary font-medium mx-2">
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
              <Link href="#">{t(key)}</Link>
              {idx < 2 && <span className="hidden sm:inline">|</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </footer>
  );
}
